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
    saveToSupabase({ image, messages, diagnosis, locale }).catch((err) =>
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
  console.log('[Supabase] saveToSupabase 開始', { locale, health_score: diagnosis.health_score });

  try {
    // 1. 画像をStorageにアップロード
    const buffer = Buffer.from(image, 'base64');
    const timestamp = Date.now();
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const imagePath = `cases/${year}/${month}/${timestamp}-nail.jpg`;

    console.log(`[Supabase] 1. 画像アップロード開始: ${imagePath} (${(buffer.length / 1024).toFixed(1)} KB)`);

    // タイムアウト付きアップロード（8秒）
    const uploadPromise = supabase.storage
      .from('nail-images')
      .upload(imagePath, buffer, { contentType: 'image/jpeg', upsert: false });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Upload timeout after 8 seconds')), 8000)
    );

    const { data: uploadData, error: uploadError } = await Promise.race([
      uploadPromise,
      timeoutPromise,
    ]);

    if (uploadError) {
      console.error('[Supabase] 1. 画像アップロード失敗:');
      console.error('  - message:', uploadError.message);
      console.error('  - statusCode:', (uploadError as unknown as Record<string, unknown>).statusCode);
      console.error('  - error:', (uploadError as unknown as Record<string, unknown>).error);
      console.error('  - full:', JSON.stringify(uploadError, null, 2));
    }

    let imageUrl = '';
    if (!uploadError && uploadData) {
      const { data: urlData } = supabase.storage
        .from('nail-images')
        .getPublicUrl(imagePath);
      imageUrl = urlData.publicUrl;
      console.log(`[Supabase] 1. 画像アップロード成功: ${imageUrl}`);
    } else {
      console.warn('[Supabase] 1. 画像なしで処理続行');
    }

    // 2. 健康データ（一時スキップ）
    console.log('[Supabase] 2. 健康データ抽出スキップ（開発中）');
    const healthData = {
      sleep_hours: 0,
      stress_level: '不明',
      diet_balance: '不明',
      messages_count: messages.length,
    };

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
        image_url: imageUrl || null,
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
      console.error('[Supabase] 3. nail_cases 保存失敗:');
      console.error('  - message:', insertError.message);
      console.error('  - code:', insertError.code);
      console.error('  - details:', insertError.details);
      console.error('  - hint:', insertError.hint);
      return;
    }

    console.log(`[Supabase] 3. nail_cases 保存成功: id=${savedCase.id}`);
    console.log('[Supabase] saveToSupabase 完了');

  } catch (error: unknown) {
    const err = error as { message?: string; stack?: string };
    console.error('[Supabase] saveToSupabase エラー:');
    console.error('  - message:', err?.message);
    console.error('  - stack:', err?.stack);
  }
}
