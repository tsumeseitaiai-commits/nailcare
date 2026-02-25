import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const MODEL_VERSION = 'gemini-2.5-flash';

export async function POST(req: NextRequest) {
  try {
    const { messages, image, locale = 'ja' } = await req.json();

    const DIAGNOSIS_PROMPT = `以下の会話ログと爪の画像から総合的な診断を行い、
JSON形式で結果を返してください。

会話ログ:
${JSON.stringify(messages)}

以下のJSON形式で返してください（JSONのみ、説明文なし）:
{
  "health_score": 0-100の数値,
  "detected_issues": ["問題点1", "問題点2", ...],
  "recommendations": ["アドバイス1", "アドバイス2", ...],
  "analysis": "詳細な分析テキスト"
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

    // --- Supabase保存（非同期・失敗してもレスポンスはブロックしない）---
    saveToSupabase({ image, messages, diagnosis, locale, model }).catch((err) =>
      console.error('Supabase save error:', err)
    );

    return NextResponse.json(diagnosis);
  } catch (error) {
    console.error('Final diagnosis error:', error);
    return NextResponse.json(
      { error: '診断結果の生成に失敗しました' },
      { status: 500 }
    );
  }
}

async function saveToSupabase({
  image,
  messages,
  diagnosis,
  locale,
  model,
}: {
  image: string;
  messages: { role: string; content: string }[];
  diagnosis: {
    health_score: number;
    detected_issues: string[];
    recommendations: string[];
    analysis: string;
  };
  locale: string;
  model: ReturnType<GoogleGenerativeAI['getGenerativeModel']>;
}) {
  console.log('[Supabase] saveToSupabase 開始', { locale, health_score: diagnosis.health_score });

  // 1. 画像をStorageにアップロード
  const buffer = Buffer.from(image, 'base64');
  const timestamp = Date.now();
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const imagePath = `cases/${year}/${month}/${timestamp}-nail.jpg`;

  console.log(`[Supabase] 1. 画像アップロード開始: ${imagePath} (${(buffer.length / 1024).toFixed(1)} KB)`);

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('nail-images')
    .upload(imagePath, buffer, { contentType: 'image/jpeg', upsert: false });

  if (uploadError) {
    console.error('[Supabase] 1. 画像アップロード失敗:');
    console.error('  - message:', uploadError.message);
    console.error('  - name:', uploadError.name);
    console.error('  - stack:', uploadError.stack);
    console.error('  - full error:', JSON.stringify(uploadError, null, 2));
  }

  let imageUrl = '';
  if (!uploadError) {
    const { data: urlData } = supabase.storage
      .from('nail-images')
      .getPublicUrl(imagePath);
    imageUrl = urlData.publicUrl;
    console.log(`[Supabase] 1. 画像アップロード成功: ${imageUrl}`);
    console.log(`[Supabase] 1. uploadData:`, uploadData);
  } else {
    console.warn('[Supabase] 1. 画像なしで処理続行');
  }

  // 2. 会話から健康データを抽出
  console.log(`[Supabase] 2. 健康データ抽出開始 (会話メッセージ数: ${messages.length})`);

  const EXTRACTION_PROMPT = `以下の会話から健康データをJSON形式で抽出してください（JSONのみ、説明文なし）:
${JSON.stringify(messages)}

フォーマット:
{
  "sleep_hours": number,
  "sleep_quality": "良好" | "やや不足" | "不足",
  "stress_level": "低" | "中" | "高",
  "diet_balance": "良好" | "やや偏り" | "偏り",
  "exercise_frequency": string,
  "hydration": "十分" | "やや不足" | "不足",
  "body_complaints": string[]
}`;

  let healthData: Record<string, unknown> = {};
  try {
    const extractionResult = await model.generateContent(EXTRACTION_PROMPT);
    const extractedText = extractionResult.response.text();
    const healthJsonMatch = extractedText.match(/\{[\s\S]*\}/);
    if (healthJsonMatch) {
      healthData = JSON.parse(healthJsonMatch[0]);
      console.log('[Supabase] 2. 健康データ抽出成功:', healthData);
    } else {
      console.warn('[Supabase] 2. 健康データ: JSONが見つかりませんでした。raw:', extractedText.slice(0, 200));
    }
  } catch (err) {
    console.warn('[Supabase] 2. 健康データ抽出失敗:', err);
  }

  // 3. nail_cases テーブルに保存
  console.log('[Supabase] 3. nail_cases 保存開始', {
    health_score: diagnosis.health_score,
    detected_issues_count: diagnosis.detected_issues.length,
    model_version: MODEL_VERSION,
    image_url: imageUrl || '(なし)',
  });

  const { data: savedCase, error: insertError } = await supabase
    .from('nail_cases')
    .insert({
      image_url: imageUrl,
      image_path: imagePath,
      nail_condition: {},
      health_data: healthData,
      ai_diagnosis: diagnosis.analysis,
      health_score: diagnosis.health_score,
      detected_issues: diagnosis.detected_issues,
      recommendations: diagnosis.recommendations,
      model_version: MODEL_VERSION,
      user_consent: true,
      locale,
    })
    .select()
    .single();

  if (insertError) {
    console.warn('[Supabase] 3. nail_cases 保存失敗:', insertError.message, insertError);
    return;
  }

  console.log(`[Supabase] 3. nail_cases 保存成功: id=${savedCase.id}`);

  // 4. conversation_logs テーブルに保存
  console.log(`[Supabase] 4. conversation_logs 保存開始: session-${timestamp}`);

  const { error: logError } = await supabase
    .from('conversation_logs')
    .insert({
      session_id: `session-${timestamp}`,
      nail_case_id: savedCase.id,
      messages,
      extracted_health_data: healthData,
    });

  if (logError) {
    console.warn('[Supabase] 4. conversation_logs 保存失敗:', logError.message, logError);
  } else {
    console.log('[Supabase] 4. conversation_logs 保存成功');
  }

  console.log('[Supabase] saveToSupabase 完了');
}
