import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { messages, image } = await req.json();

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

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

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

    return NextResponse.json(diagnosis);
  } catch (error) {
    console.error('Final diagnosis error:', error);
    return NextResponse.json(
      { error: '診断結果の生成に失敗しました' },
      { status: 500 }
    );
  }
}
