import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `あなたは爪整体の専門家AIアシスタントです。

【役割】
ユーザーの爪の写真を分析し、会話を通じて生活習慣と体の状態を問診します。

【会話の流れ】
1. 写真確認の挨拶
2. 体の不調な箇所を質問（最重要）
   - 例: 「現在、体に不調を感じている箇所はありますか？（肩こり、腰痛、頭痛、冷え性、疲労感など）」
   - 複数回答可
   - 「特になし」も受け入れる
3. 睡眠状態（時間・質）を質問
4. ストレスレベルを質問
5. 食事バランスを質問
6. 運動習慣を質問
7. 水分補給を質問
8. 仕事環境を質問
9. 総合診断を提示

【重要ルール】
- 1回に1つだけ質問する
- 親しみやすく優しい口調
- 医学的診断は行わない
- 深刻な症状は医療機関受診を推奨
- 日本語で応答
- 体の不調と爪の状態を関連付けて分析する

【不調と爪の関連性】
- 肩こり・首こり → 血行不良、爪の成長遅延
- 腰痛 → 足の指の使い方、歩行姿勢と巻き爪の関連
- 冷え性 → 末端血流不足、爪の変色・乾燥
- 頭痛 → ストレス、自律神経の乱れ
- 疲労感 → 栄養不足、爪の脆弱化
- むくみ → 水分代謝、爪周囲の腫れ

【問診完了の判断】
上記8項目すべて聞き終えたら「診断を開始します」と言ってください。`;

export async function POST(req: NextRequest) {
  try {
    const { messages, image, sessionId } = await req.json();

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
    });

    // 会話履歴を構築（Gemini は history が 'user' ロール始まりであることを要求するため、
    // クライアント側で追加した初期アシスタント挨拶を除外し最初のユーザー発言から開始する）
    const priorMessages = messages.slice(0, -1) as { role: string; content: string }[];
    const firstUserIdx = priorMessages.findIndex((m) => m.role === 'user');
    const chatHistory = (firstUserIdx >= 0 ? priorMessages.slice(firstUserIdx) : []).map(
      (msg) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      })
    );

    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    // 最新メッセージを送信
    const lastMessage = messages[messages.length - 1] as { role: string; content: string };
    const parts: ({ text: string } | { inlineData: { mimeType: string; data: string } })[] = [
      { text: SYSTEM_PROMPT + '\n\n' + lastMessage.content },
    ];

    // ユーザーの最初のメッセージ送信時に画像を添付
    const userMessageCount = (messages as { role: string }[]).filter((m) => m.role === 'user').length;
    if (image && userMessageCount === 1) {
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: image,
        },
      });
    }

    const result = await chat.sendMessage(parts);
    const response = result.response.text();

    // 診断完了チェック
    const isComplete =
      response.includes('診断を開始します') || response.includes('診断結果');

    return NextResponse.json({
      response,
      isComplete,
    });
  } catch (error) {
    console.error('Chat diagnosis error:', error);
    return NextResponse.json(
      { error: 'AI診断中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
