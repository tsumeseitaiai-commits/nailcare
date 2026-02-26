import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

function buildSystemPrompt(quizAnswers?: Record<string, unknown>): string {
  const q = quizAnswers;
  const athleteContext = q
    ? `【アスリート情報】
- 競技：${q.sport} / ポジション：${q.position || '不明'}
- 年齢：${q.age}歳 / 性別：${q.gender} / 利き足：${q.dominantFoot}
- 競技歴：${q.sportsHistory}年 / 練習：${q.practiceFrequency}
- 足指感覚：${q.toeGrip}/10 / グリップ：${q.gripConfidence}/10 / バランス：${q.balance}/10
- 左挫歴：${q.ankleSprain} / 膨痛：${q.kneeInjury} / 腺痛：${q.backPain}
- 巻き爪：${q.curvedNail} / 外反母足：${q.halluxValgus} / 深爪：${q.ingrownNail}
- 現在の痛み：${Array.isArray(q.currentPainAreas) ? (q.currentPainAreas as string[]).join('・') || 'なし' : 'なし'}

`
    : '';

  return `あなたは爪整体の専門家AIアシスタントです。スポーツアスリートの足・爪の健康をサポートする専門家として対応してください。

${athleteContext}【あなたの役割】
問診が完了したアスリートに対して、フリーチャット形式で悩みや気になることを聞き出してください。

【会話のガイドライン】
- 最初のメッセージは「他に気になることはありますか？爪や足、パフォーマンスについて何でもお話しください。」と声をかける
- 競技特性を踏まえた専門的なアドバイスをする
- 1回に1〜2の短い文で返答する
- 優しく、専門家らしい口調で
- 医学的診断・治療行為は行わない
- 爪・足指・足首・パフォーマンスに関連する話題を中心に展開する
- ユーザーが「特にありません」「以上です」「終わります」「診断して」などと言ったら診断完了と判断する

【診断完了の判断】
会話が十分に行われた場合や、ユーザーが「特にありません」「以上」「終わり」「診断して」などと言った場合は、
「了解しました！下の『診断結果を見る』ボタンから診断を開始できます。たっぷりと教えていただきありがとうございました！」と返答してください。`;
}

export async function POST(req: NextRequest) {
  try {
    const { messages, image, quizAnswers, isInitial } = await req.json();

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
    });

    const systemPrompt = buildSystemPrompt(quizAnswers);

    // 会話履歴を構築
    const priorMessages = messages.slice(0, -1) as { role: string; content: string }[];
    const firstUserIdx = priorMessages.findIndex((m) => m.role === 'user');

    let chatHistory: { role: string; parts: { text: string }[] }[];

    if (firstUserIdx >= 0) {
      chatHistory = priorMessages.slice(firstUserIdx).map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }));
    } else if (priorMessages.length > 0) {
      chatHistory = [
        { role: 'user', parts: [{ text: 'フリーチャットを開始してください' }] },
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

    const lastMessage = messages[messages.length - 1] as { role: string; content: string };
    const parts: ({ text: string } | { inlineData: { mimeType: string; data: string } })[] = [
      { text: systemPrompt + '\n\n' + lastMessage.content },
    ];

    // 最初のメッセージ時に画像を添付
    const userMessageCount = (messages as { role: string }[]).filter((m) => m.role === 'user').length;
    if (image && (isInitial || userMessageCount === 1)) {
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: image,
        },
      });
    }

    const result = await chat.sendMessage(parts);

    if (!result || !result.response) {
      throw new Error('AIからの応答がありません');
    }

    const response = result.response.text();

    if (!response || response.trim().length === 0) {
      throw new Error('AIからの応答が空です');
    }

    // 診断完了チェック
    const isComplete =
      response.includes('診断結果を見る') ||
      response.includes('総合診断を行います') ||
      response.includes('診断を開始します');

    return NextResponse.json({ response, isComplete });
  } catch (error: unknown) {
    const err = error as { name?: string; message?: string; stack?: string };
    console.error('=== Chat Diagnosis Error ===');
    console.error('Error message:', err?.message);
    return NextResponse.json(
      { error: 'AI診断中にエラーが発生しました', details: err?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
