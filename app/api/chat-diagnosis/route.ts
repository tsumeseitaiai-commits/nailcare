import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `あなたは爪整体の専門家AIアシスタントです。

【会話の流れ】
1. 体の不調な箇所を質問（肩こり、腰痛、冷え性など）
2. 睡眠状態を質問（時間と質）
3. 食事バランスを質問
4. 仕事環境を質問（デスクワーク、立ち仕事など）
5. 全項目完了後「これで全ての質問が完了しました。診断を開始しますね。」と言う

【重要ルール】
- 1回に1つだけ質問する
- 簡潔に質問する（長文禁止、1-2文で）
- 優しい口調で
- 医学的診断は行わない

【問診完了の判断】
上記4項目すべて聞き終えたら「これで全ての質問が完了しました。診断を開始しますね。」と必ず言ってください。`;

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
        maxOutputTokens: 2000,
        temperature: 0.7,
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

    console.log('Sending message to Gemini...');
    const result = await chat.sendMessage(parts);

    // 応答チェック
    if (!result || !result.response) {
      console.error('[Chat] Empty response from Gemini');
      throw new Error('AIからの応答がありません');
    }

    const response = result.response.text();

    // 空の応答チェック
    if (!response || response.trim().length === 0) {
      console.error('[Chat] Empty text in response');
      throw new Error('AIからの応答が空です');
    }

    console.log('[Chat] Response length:', response.length);
    console.log('[Chat] Response preview:', response.substring(0, 100));

    // 診断完了チェック
    const isComplete =
      response.includes('診断を開始します') ||
      response.includes('診断を開始しますね') ||
      response.includes('全ての質問が完了しました');

    console.log('[Chat] isComplete:', isComplete);

    return NextResponse.json({
      response,
      isComplete,
    });
  } catch (error: unknown) {
    const err = error as { name?: string; message?: string; stack?: string };
    console.error('=== Chat Diagnosis Error ===');
    console.error('Error name:', err?.name);
    console.error('Error message:', err?.message);
    console.error('Error stack:', err?.stack);

    return NextResponse.json(
      {
        error: 'AI診断中にエラーが発生しました',
        details: err?.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}
