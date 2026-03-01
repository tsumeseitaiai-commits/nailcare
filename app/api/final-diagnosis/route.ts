export const runtime = 'nodejs'; // Edge回避

import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const MODEL_VERSION = 'gemini-2.5-flash';

export async function POST(req: NextRequest) {
  try {
    const { messages, image, quizAnswers, locale = 'ja', bodyPart = 'nail' } = await req.json();

    const q = quizAnswers as Record<string, unknown> | undefined;

    // かかと診断の場合は専用プロンプトで処理
    if (bodyPart === 'heel') {
      return await handleHeelDiagnosis({ messages, image, quizAnswers: q, locale });
    }

    // Language instruction based on locale
    const langName = locale === 'ar' ? 'Arabic (العربية)' : locale === 'en' ? 'English' : 'Japanese (日本語)';
    const langInstruction = `IMPORTANT: All text in nail_findings, detected_issues, recommendations, and analysis fields MUST be written in ${langName}.`;

    // Analysis section headers vary by locale
    const headers = locale === 'ar'
      ? { nail: '【حالة الأظافر】', cross: '【المقارنة مع الاستبيان】', perf: '【التأثير على الأداء والنصائح】' }
      : locale === 'en'
      ? { nail: '[Nail Condition]', cross: '[Cross-reference with Interview]', perf: '[Performance Impact & Advice]' }
      : { nail: '【爪の状態】', cross: '【問診との照合】', perf: '【パフォーマンスへの影響とアドバイス】' };

    const quizContext = q ? `
[Interview Results]
- Sport: ${q.sport}, Age: ${q.age}, Gender: ${q.gender}
- Toe grip: ${q.toeGrip}/10, Grip confidence: ${q.gripConfidence}/10, Balance: ${q.balance}/10
- Curved nail: ${q.curvedNail}, Hallux valgus: ${q.halluxValgus}
- Ankle sprain history: ${q.ankleSprain}
- Current pain: ${Array.isArray(q.currentPainAreas) ? (q.currentPainAreas as string[]).join(', ') || 'none' : 'none'}
` : '';

    const DIAGNOSIS_PROMPT = `${langInstruction}

You are a nail health specialist AI. Using the attached nail image and interview data, perform a diagnosis following these steps.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[STEP 1] Visual evaluation of nail image (nail_score: 0-100)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Evaluate the following from the image only and calculate nail_score.

Scoring criteria (image only):
- Nail shape: square-to-round is ideal; deduct for curved, convex, or deformed nails
- Nail thickness: uniform moderate thickness is ideal; deduct for too thin/thick or layered peeling
- Nail color: pink to light skin tone is ideal; deduct for yellowing, white clouding, dark discoloration, white lines
- Nail surface: smooth is ideal; deduct for vertical/horizontal ridges, bumps, pitting
- Nail-skin interface: well-attached is ideal; deduct for onycholysis, deep cutting, ingrown nails
- Periungual skin: healthy skin is ideal; deduct for redness, swelling, calluses, hardening

→ After calculating nail_score, list observations in nail_findings

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[STEP 2] Interview score (quiz_score: 0-100)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Evaluate functional and performance status using only interview data and chat log.

${quizContext}
Chat log:
${JSON.stringify(messages)}

Scoring criteria:
- Grip, balance, toe grip levels (slider values)
- Number of ankle sprains (more = deduct)
- Number and severity of current pain areas
- Additional concerns raised in conversation

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[STEP 3] Integrated diagnosis
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
health_score = nail_score × 0.6 + quiz_score × 0.4 (round to nearest integer)

In detected_issues:
- Nail problems confirmed in image (prefix with "[Nail]")
- Problems corroborated by both image and interview (prefix with "[Cross]")
- Functional problems from interview only (prefix with "[Interview]")

In recommendations:
- Specific nail care based on nail condition
- Measures for functional deficits found in interview
- Athletic performance improvement tips

Write analysis in 3 sections:
1. "${headers.nail}": What the image shows (2-3 sentences)
2. "${headers.cross}": Connecting nail condition with interview findings (2-3 sentences)
3. "${headers.perf}": Specific advice based on interview data (2-3 sentences)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Return ONLY the following JSON (no explanation, no code blocks):
{
  "nail_score": 0-100,
  "quiz_score": 0-100,
  "health_score": 0-100,
  "nail_findings": ["observation 1", "observation 2", ...],
  "detected_issues": ["[Nail] issue 1", "[Cross] issue 2", "[Interview] issue 3", ...],
  "recommendations": ["advice 1", "advice 2", ...],
  "analysis": "${headers.nail}...\n\n${headers.cross}...\n\n${headers.perf}..."
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

// ============================================================
// かかと診断ハンドラー
// ============================================================
async function handleHeelDiagnosis({
  messages,
  image,
  quizAnswers,
  locale,
}: {
  messages: { role: string; content: string }[];
  image: string;
  quizAnswers?: Record<string, unknown>;
  locale: string;
}) {
  const q = quizAnswers;
  const langName = locale === 'ar' ? 'Arabic (العربية)' : locale === 'en' ? 'English' : 'Japanese (日本語)';
  const langInstruction = `IMPORTANT: All output text MUST be written in ${langName}.`;

  const HEEL_PROMPT = `${langInstruction}

You are a heel care specialist AI. Analyze the heel photo and interview data, then provide a structured diagnosis.

[Interview Data]
- Callus severity (self-reported): ${q?.heelSeverity ?? 'unknown'}
- Moisturizing frequency: ${q?.heelMoisture ?? 'unknown'}
- Primary footwear: ${q?.heelFootwear ?? 'unknown'}
- Standing work hours/day: ${q?.heelStanding ?? 'unknown'}

[Chat log]
${JSON.stringify(messages)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[STEP 1] Visual assessment of heel image (heel_score: 0-100)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Evaluate from the image:
- Callus thickness: thin = ideal, thick/cracked = deduct
- Skin texture: smooth = ideal, rough/flaky = deduct
- Cracks: none = ideal, deep cracks = severe deduct
- Color: natural = ideal, yellowing/discoloration = deduct
- Moisture: moist = ideal, dry/peeling = deduct

→ List findings in heel_findings

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[STEP 2] Context score (context_score: 0-100)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Score based on risk factors:
- Long standing hours + heel-type shoes + no moisturizing = low score
- Good routine + appropriate footwear = high score

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[STEP 3] Output
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
health_score = heel_score × 0.7 + context_score × 0.3 (integer)

self_care_steps: Provide 4-6 clear step-by-step home care instructions in ${langName}.
Practitioner_points: Explain 2-3 points where professional treatment would be most effective.

Return ONLY this JSON (no code blocks, no explanation):
{
  "heel_score": 0-100,
  "context_score": 0-100,
  "health_score": 0-100,
  "severity": "mild" | "moderate" | "severe",
  "heel_findings": ["finding 1", "finding 2"],
  "detected_issues": ["issue 1", "issue 2"],
  "self_care_steps": ["Step 1: ...", "Step 2: ...", "Step 3: ..."],
  "practitioner_points": ["point 1", "point 2"],
  "recommendations": ["rec 1", "rec 2"],
  "analysis": "Overall analysis paragraph..."
}`;

  const model = genAI.getGenerativeModel({ model: MODEL_VERSION });

  const result = await model.generateContent([
    { text: HEEL_PROMPT },
    { inlineData: { mimeType: 'image/jpeg', data: image } },
  ]);

  const responseText = result.response.text();
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Invalid JSON from Gemini (heel)');

  const diagnosis = JSON.parse(jsonMatch[0]);

  // Supabase保存
  try {
    const supabase = getSupabaseAdmin();
    const timestamp = Date.now();
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const imagePath = `cases/${year}/${month}/${timestamp}-heel.jpg`;

    const buffer = Buffer.from(image, 'base64');
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('nail-images')
      .upload(imagePath, buffer, { contentType: 'image/jpeg', upsert: false });

    if (uploadError) {
      console.error('[Supabase][Heel] 画像アップロード失敗:', uploadError);
    } else {
      const { data: urlData } = supabase.storage.from('nail-images').getPublicUrl(imagePath);
      const imageUrl = urlData.publicUrl;

      const { data: savedCase, error: insertError } = await supabase
        .from('nail_cases')
        .insert({
          image_url: imageUrl,
          image_path: imagePath,
          body_part: 'heel',
          health_score: diagnosis.health_score,
          detected_issues: diagnosis.detected_issues,
          recommendations: diagnosis.recommendations,
          ai_diagnosis: diagnosis.analysis,
          nail_findings: diagnosis.heel_findings ?? [],
          nail_condition: {},
          health_data: {
            heelSeverity: q?.heelSeverity,
            heelMoisture: q?.heelMoisture,
            heelFootwear: q?.heelFootwear,
            heelStanding: q?.heelStanding,
          },
          model_version: MODEL_VERSION,
          user_consent: true,
          locale,
          messages_count: messages.length,
        })
        .select()
        .single();

      if (insertError) {
        console.error('[Supabase][Heel] nail_cases 保存失敗:', insertError);
      } else if (savedCase) {
        await supabase.from('conversation_logs').insert({
          session_id: `session-${timestamp}`,
          nail_case_id: savedCase.id,
          messages,
          extracted_health_data: {
            heelSeverity: q?.heelSeverity,
            heelMoisture: q?.heelMoisture,
          },
        });
      }
    }
  } catch (e) {
    console.error('[Supabase][Heel] 保存エラー:', e);
  }

  // body_part フラグを付けて返す
  return NextResponse.json({ ...diagnosis, body_part: 'heel' });
}
