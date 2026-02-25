export const runtime = 'nodejs'; // Edge回避

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

    // --- Supabase保存（awaitして確実に完了させる）---
    console.log('[API] Supabase保存を開始します...');
    await saveToSupabase({ image, messages, diagnosis, locale });
    console.log('[API] Supabase保存が完了しました');

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
}) {
  console.log('[Supabase] saveToSupabase 開始');

  try {
    const buffer = Buffer.from(image, 'base64');
    const timestamp = Date.now();
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const imagePath = `cases/${year}/${month}/${timestamp}-nail.jpg`;

    console.log(`[Supabase] アップロード開始: ${imagePath} (${(buffer.length / 1024).toFixed(1)} KB)`);
    console.time('[Supabase] upload time');

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('nail-images')
      .upload(imagePath, buffer, { contentType: 'image/jpeg', upsert: false });

    console.timeEnd('[Supabase] upload time');
    console.log('[Supabase] uploadData:', uploadData);
    console.log('[Supabase] uploadError:', uploadError);

    if (uploadError) {
      throw uploadError;
    }

    const { data: urlData } = supabase.storage
      .from('nail-images')
      .getPublicUrl(imagePath);
    const imageUrl = urlData.publicUrl;
    console.log(`[Supabase] 画像アップロード成功: ${imageUrl}`);

    // 健康データ（一時スキップ）
    const healthData = {
      sleep_hours: 0,
      stress_level: '不明',
      diet_balance: '不明',
      messages_count: messages.length,
    };

    // nail_cases テーブルに保存
    console.log('[Supabase] nail_cases 保存開始');

    const insertData = {
      image_url: imageUrl || null,
      image_path: imagePath,
      nail_condition: {},
      health_data: healthData || {},
      ai_diagnosis: diagnosis.analysis,
      health_score: diagnosis.health_score,
      detected_issues: diagnosis.detected_issues,
      recommendations: diagnosis.recommendations,
      model_version: MODEL_VERSION,
      user_consent: true,
      locale,
    };

    console.log('[Supabase] INSERT payload:', JSON.stringify(insertData, null, 2));

    const { data: savedCase, error: insertError } = await supabase
      .from('public.nail_cases')
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

    const { error: logError } = await supabase
      .from('public.conversation_logs')
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
