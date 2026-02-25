import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `あなたは爪整体の専門家AIアシスタントです。

【役割】
ユーザーの爪の写真を分析し、会話を通じて体の状態と生活習慣を問診します。

【会話の流れ（全5問）】
1. 写真確認の挨拶（1〜2文で簡潔に）
2. 体の不調・関節の状態を質問
   - 「肩こり、腰痛、膝・股関節の痛み、冷え性、むくみなど、気になる箇所はありますか？（複数回答可、特になしでもOK）」
3. 睡眠と疲労感を質問
   - 「最近の睡眠時間と、日中の疲労感はいかがですか？」
4. 食事バランスと水分補給を質問
   - 「食事の偏りや、1日の水分補給量はどのくらいですか？」
5. 運動習慣と仕事環境を質問
   - 「週にどのくらい体を動かしますか？また、デスクワークなどで長時間同じ姿勢をとることはありますか？」
6. 総合診断を提示

【重要ルール】
- 1回に1つだけ質問する
- 親しみやすく優しい口調
- 挨拶は簡潔に（長々と説明しない）
- 医学的診断は行わない
- 深刻な症状は医療機関受診を推奨
- 日本語で応答
- 体の不調と爪の状態を関連付けて分析する

【不調と爪の関連性】
- 肩こり・首こり → 血行不良、爪の成長遅延
- 腰痛・関節痛 → 足の指の使い方、歩行姿勢と巻き爪の関連
- 冷え性・むくみ → 末端血流不足、爪の変色・乾燥
- 疲労感 → 栄養不足、爪の脆弱化

【問診完了の判断】
上記5問すべて聞き終えたら「診断を開始します」と言ってください。`;

export async function POST(req: NextRequest) {
  try {
    const { messages, image, sessionId } = await req.json();

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
    });

    // 会話履歴を構築
    // Gemini は history が 'user' ロール始まりであることを要求する。
    // fetchInitialMessage の AI応答だけが messages に入っている場合（history が model 始まり）、
    // 合成 user ターンを先頭に補完することでコンテキストを維持する。
    const priorMessages = messages.slice(0, -1) as { role: string; content: string }[];
    const firstUserIdx = priorMessages.findIndex((m) => m.role === 'user');

    let chatHistory: { role: string; parts: { text: string }[] }[];

    if (firstUserIdx >= 0) {
      // 通常ケース: history に user が含まれる
      chatHistory = priorMessages.slice(firstUserIdx).map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }));
    } else if (priorMessages.length > 0) {
      // 初回ユーザー返答ケース: history が model(AI挨拶) 始まりになっている
      // → 合成 user ターンを先頭に補完して Gemini に渡す
      chatHistory = [
        { role: 'user', parts: [{ text: '診断を開始してください' }] },
        ...priorMessages.map((msg) => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        })),
      ];
    } else {
      chatHistory = [];
    }

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
      response.includes('診断を開始します') ||
      response.includes('診断を開始させていただきます') ||
      response.includes('これから診断') ||
      response.includes('総合的に見て') ||
      response.includes('診断結果');

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
