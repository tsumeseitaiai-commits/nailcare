export const runtime = 'nodejs'; // Edge回避

import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const MODEL_VERSION = 'gemini-2.5-flash';

export async function POST(req: NextRequest) {
  try {
    const { messages, image, quizAnswers, locale = 'ja' } = await req.json();

    const q = quizAnswers as Record<string, unknown> | undefined;
    const quizContext = q ? `
【問診結果】
- 競技：${q.sport}、年齢：${q.age}歳、性別：${q.gender}
- 足指グリップ感覚：${q.toeGrip}/10、踏ん張り：${q.gripConfidence}/10、バランス：${q.balance}/10
- 巻き爪：${q.curvedNail}、外反母趾：${q.halluxValgus}
- 足首捻挫歴：${q.ankleSprain}
- 現在の痛み：${Array.isArray(q.currentPainAreas) ? (q.currentPainAreas as string[]).join('・') || 'なし' : 'なし'}
` : '';

    const DIAGNOSIS_PROMPT = `あなたは爪整体の専門家AIです。添付の爪画像と問診データを使って、以下の手順で診断してください。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【STEP 1】爪画像の視覚的評価（nail_score: 0-100）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
画像だけを見て以下を評価し、nail_scoreを算出すること。

採点基準（画像のみで判断）:
- 爪の形状：スクエア〜ラウンドが理想。巻き爪・反り爪・変形があれば減点
- 爪の厚み：均一で適度な厚みが理想。薄すぎ・厚すぎ・層状剥離は減点
- 爪の色：ピンク〜淡い肌色が理想。黄変・白濁・黒褐色変化・白い線は減点
- 爪の表面：滑らかが理想。縦筋・横筋・凸凹・点状陥凹は減点
- 爪と皮膚の関係：爪床との密着が理想。爪甲剥離・深爪・陥入は減点
- 爪周囲の皮膚：健康な皮膚が理想。発赤・腫脹・胼胝・皮膚の硬化は減点

→ nail_score算出後、nail_findingsに観察した内容を列挙する

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【STEP 2】問診スコア算出（quiz_score: 0-100）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
問診データと会話ログだけを使って機能的・パフォーマンス状態を評価する。

${quizContext}
会話ログ:
${JSON.stringify(messages)}

採点基準:
- グリップ・バランス・足指感覚の高低（各スライダー値）
- 捻挫歴の回数（多いほど減点）
- 現在の痛みの部位数・深刻度
- 会話で出てきた追加の懸念事項

→ quiz_score算出後、quiz_findingsに観察した内容を列挙する

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【STEP 3】統合診断
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
health_score = nail_score × 0.6 + quiz_score × 0.4（小数点以下四捨五入）

detected_issuesには:
・画像で確認できた爪の問題（先頭に「[爪]」を付ける）
・問診と照合して一致・補強できる問題（先頭に「[照合]」を付ける）
・問診のみから読み取れる機能的問題（先頭に「[問診]」を付ける）

recommendationsには:
・爪の状態を踏まえた具体的ケア方法
・問診で判明した機能低下への対策
・競技パフォーマンス改善のヒント

analysisは以下3段構成で記述:
1. 「【爪の状態】」：画像から見えること（2〜3文）
2. 「【問診との照合】」：爪の状態と問診結果を結びつけた考察（2〜3文）
3. 「【パフォーマンスへの影響とアドバイス】」：問診ベースの具体的アドバイス（2〜3文）

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
以下のJSON形式のみで返してください（説明文・コードブロック不要）:
{
  "nail_score": 0-100,
  "quiz_score": 0-100,
  "health_score": 0-100,
  "nail_findings": ["爪の観察結果1", "爪の観察結果2", ...],
  "detected_issues": ["[爪] 問題1", "[照合] 問題2", "[問診] 問題3", ...],
  "recommendations": ["アドバイス1", "アドバイス2", ...],
  "analysis": "【爪の状態】...\n\n【問診との照合】...\n\n【パフォーマンスへの影響とアドバイス】..."
}`;

    const model = genAI.getGenerativeModel({ model: MODEL_VERSION });

    // AI診断を実行
    const result = await model.generateContent([
      { text: DIAGNOSIS_PROMPT },
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: image,
        },
      },
    ]);

    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error('JSON形式の応答を取得できませんでした');
    }

    const diagnosis = JSON.parse(jsonMatch[0]);

    // --- Supabase保存（awaitして確実に完了させる）---
    console.log('[API] Supabase保存を開始します...');
    await saveToSupabase({ image, messages, diagnosis, quizAnswers, locale });
    console.log('[API] Supabase保存が完了しました');

    return NextResponse.json(diagnosis);
  } catch (error) {
    const err = error as { message?: string; stack?: string; name?: string };
    console.error('=== Final Diagnosis Error ===');
    console.error('name:', err?.name);
    console.error('message:', err?.message);
    console.error('stack:', err?.stack);
    return NextResponse.json(
      { error: '診断結果の生成に失敗しました', details: err?.message },
      { status: 500 }
    );
  }
}

async function saveToSupabase({
  image,
  messages,
  diagnosis,
  quizAnswers,
  locale,
}: {
  image: string;
  messages: { role: string; content: string }[];
  diagnosis: {
    health_score: number;
    nail_score?: number;
    quiz_score?: number;
    nail_findings?: string[];
    detected_issues: string[];
    recommendations: string[];
    analysis: string;
  };
  quizAnswers?: Record<string, unknown>;
  locale: string;
}) {
  const q = quizAnswers;
  console.log('[Supabase] saveToSupabase 開始');

  try {
    const buffer = Buffer.from(image, 'base64');
    const timestamp = Date.now();
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const imagePath = `cases/${year}/${month}/${timestamp}-nail.jpg`;

    console.log(`[Supabase] アップロード開始: ${imagePath} (${(buffer.length / 1024).toFixed(1)} KB)`);
    console.time('[Supabase] upload time');

    const { data: uploadData, error: uploadError } = await getSupabaseAdmin().storage
      .from('nail-images')
      .upload(imagePath, buffer, { contentType: 'image/jpeg', upsert: false });

    console.timeEnd('[Supabase] upload time');
    console.log('[Supabase] uploadData:', uploadData);
    console.log('[Supabase] uploadError:', uploadError);

    if (uploadError) {
      throw uploadError;
    }

    const { data: urlData } = getSupabaseAdmin().storage
      .from('nail-images')
      .getPublicUrl(imagePath);
    const imageUrl = urlData.publicUrl;
    console.log(`[Supabase] 画像アップロード成功: ${imageUrl}`);

    // 問診データを保存（全項目）
    const healthData = {
      sport: q?.sport ?? '不明',
      position: q?.position ?? null,
      age: q?.age ?? null,
      gender: q?.gender ?? null,
      height: q?.height ?? null,
      weight: q?.weight ?? null,
      dominant_foot: q?.dominantFoot ?? null,
      sports_history: q?.sportsHistory ?? null,
      practice_frequency: q?.practiceFrequency ?? null,
      toe_grip: q?.toeGrip ?? null,
      grip_confidence: q?.gripConfidence ?? null,
      stability: q?.stability ?? null,
      balance: q?.balance ?? null,
      late_game_fatigue: q?.lateGameFatigue ?? null,
      ingrown_nail: q?.ingrownNail ?? null,
      curved_nail: q?.curvedNail ?? null,
      hallux_valgus: q?.halluxValgus ?? null,
      foot_callus: q?.footCallus ?? null,
      ankle_sprain: q?.ankleSprain ?? null,
      knee_injury: q?.kneeInjury ?? null,
      back_pain: q?.backPain ?? null,
      current_pain_areas: q?.currentPainAreas ?? [],
      messages_count: messages.length,
    };

    // nail_cases テーブルに保存
    console.log('[Supabase] nail_cases 保存開始');

    const insertData = {
      image_url: imageUrl || null,
      image_path: imagePath,
      // ── フラット化された問診カラム ──
      sport:               q?.sport ?? null,
      age:                 q?.age ? Number(q.age) : null,
      gender:              q?.gender ?? null,
      height:              q?.height ? Number(q.height) : null,
      weight:              q?.weight ? Number(q.weight) : null,
      dominant_foot:       q?.dominantFoot ?? null,
      arch_type:           q?.archType ?? null,
      callus_locations:    q?.callusLocations ?? [],
      sports_history:      q?.sportsHistory ? Number(q.sportsHistory) : null,
      practice_frequency:  q?.practiceFrequency ?? null,
      nail_care_style:     q?.nailCareStyle ?? null,
      nail_care_frequency: q?.nailCareFrequency ?? null,
      uses_insole:         q?.usesInsole ?? false,
      // 爪の自覚症状
      nail_color_change:   q?.nailColorChange ?? false,
      nail_brittle:        q?.nailBrittle ?? false,
      nail_pain:           q?.nailPain ?? false,
      nail_growth_change:  q?.nailGrowthChange ?? false,
      // 既存問診
      curved_nail:         q?.curvedNail ?? null,
      hallux_valgus:       q?.halluxValgus ?? null,
      toe_grip:            q?.toeGrip ? Number(q.toeGrip) : null,
      grip_confidence:     q?.gripConfidence ? Number(q.gripConfidence) : null,
      balance:             q?.balance ? Number(q.balance) : null,
      ankle_sprain:        q?.ankleSprain ?? null,
      current_pain_areas:  q?.currentPainAreas ?? [],
      // スコア内訳
      nail_score:          diagnosis.nail_score ?? null,
      quiz_score:          diagnosis.quiz_score ?? null,
      nail_findings:       diagnosis.nail_findings ?? [],
      // 旧JSONB（バックアップ用として残す）
      nail_condition:      {},
      health_data:         healthData || {},
      // AI診断結果
      ai_diagnosis:        diagnosis.analysis,
      health_score:        diagnosis.health_score,
      detected_issues:     diagnosis.detected_issues,
      recommendations:     diagnosis.recommendations,
      model_version:       MODEL_VERSION,
      user_consent:        true,
      locale,
    };

    console.log('[Supabase] INSERT payload:', JSON.stringify(insertData, null, 2));

    const { data: savedCase, error: insertError } = await getSupabaseAdmin()
      .from('nail_cases')
      .insert(insertData)
      .select()
      .single();

    if (insertError) {
      console.error('[Supabase] nail_cases 保存失敗:');
      console.error('  - message:', insertError.message);
      console.error('  - code:', insertError.code);
      console.error('  - details:', insertError.details);
      console.error('  - hint:', insertError.hint);
      throw insertError;
    }

    console.log(`[Supabase] nail_cases 保存成功: id=${savedCase.id}`);

    const { error: logError } = await getSupabaseAdmin()
      .from('conversation_logs')
      .insert({
        session_id: `session-${timestamp}`,
        nail_case_id: savedCase.id,
        messages,
        extracted_health_data: healthData || {},
      });

    if (logError) {
      console.error('[Supabase] conversation_logs 保存失敗:', logError);
    } else {
      console.log('[Supabase] conversation_logs 保存成功');
    }

    console.log('[Supabase] saveToSupabase 完了');

  } catch (error: unknown) {
    const err = error as { message?: string; stack?: string };
    console.error('[Supabase] エラー発生:', err?.message);
    console.error('[Supabase] stack:', err?.stack);
    throw error; // 外側の catch に伝播
  }
}
