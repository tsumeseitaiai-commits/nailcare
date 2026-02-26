import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

function buildSystemPrompt(quizAnswers?: Record<string, unknown>): string {
  const q = quizAnswers;

  // 問診データから「気になる点」を自動抽出
  const concerns: string[] = [];
  if (q) {
    const toeGrip = Number(q.toeGrip);
    const grip = Number(q.gripConfidence);
    const balance = Number(q.balance);
    if (toeGrip <= 4) concerns.push(`足指で地面を掴む感覚が弱い（${toeGrip}/10）`);
    if (grip <= 4) concerns.push(`踏ん張り・グリップ力に不安がある（${grip}/10）`);
    if (balance <= 4) concerns.push(`バランス感覚が不安定（${balance}/10）`);
    if (q.curvedNail === '強い') concerns.push('巻き爪が強い');
    if (q.curvedNail === '少しある') concerns.push('巻き爪の傾向がある');
    if (q.halluxValgus && q.halluxValgus !== 'なし') concerns.push(`外反母趾あり（${q.halluxValgus}）`);
    if (q.ankleSprain === '2〜3回' || q.ankleSprain === '4回以上') concerns.push(`足首捻挫歴が複数回（${q.ankleSprain}）`);
    const painAreas = Array.isArray(q.currentPainAreas) ? q.currentPainAreas as string[] : [];
    if (painAreas.length > 0 && !painAreas.includes('なし')) concerns.push(`現在も痛みあり（${painAreas.join('・')}）`);
  }

  const concernText = concerns.length > 0
    ? `\n【問診から読み取れる気になるポイント（必ず会話で触れること）】\n${concerns.map(c => `- ${c}`).join('\n')}\n`
    : `\n【問診では特に問題なし。競技パフォーマンスや爪ケアの習慣について自然に聞き出すこと】\n`;

  const athleteContext = q
    ? `【アスリート情報】
- 競技：${q.sport}${q.position ? ' / ' + q.position : ''}
- 年齢：${q.age}歳 / 性別：${q.gender}
- 足指感覚：${q.toeGrip}/10 / グリップ：${q.gripConfidence}/10 / バランス：${q.balance}/10
- 巻き爪：${q.curvedNail} / 外反母趾：${q.halluxValgus}
- 捻挫歴：${q.ankleSprain}
- 現在の痛み：${Array.isArray(q.currentPainAreas) ? (q.currentPainAreas as string[]).join('・') || 'なし' : 'なし'}
${concernText}`
    : '';

  return `あなたは爪整体の専門家カウンセラーです。${q?.sport || 'スポーツ'}をしているアスリートと1対1で話しています。

${athleteContext}
【あなたのキャラクター】
- 温かく、聞き上手な専門家。押しつけがましくなく、自然に話を引き出す
- 相手の言葉にちゃんと反応する（「それは辛そうですね」「なるほど、${q?.sport || 'その競技'}ならではですね」など）
- 専門知識はあるが、難しい用語は使わない
- 1ターンは2〜4文程度。短くテンポよく

【会話の進め方】
1. 【最初のメッセージ】問診データと気になるポイントを見て、自分から具体的に触れる。
   良い例：「問診を見ると、バランス感覚が少し気になりました。試合中に体が流れる感覚はありますか？」
   良い例：「巻き爪の傾向があるんですね。シューズを脱いだあと、足の指が痛くなることはありますか？」
   悪い例（禁止）：「他に気になることはありますか？」だけで始める

2. 【深掘りフェーズ（2〜4ターン）】
   - ユーザーの返答にまずうなずく
     例：「ああ、なるほど」「それは${q?.sport || 'その競技'}だと特に影響しそうですね」「それは気になりますね」
   - その話題に関連した質問を1つだけ投げる
   - 扱うテーマ例：いつ症状が出るか／練習後の変化／シューズの具合／最近の体の変化／爪のケア習慣

3. 【締めのフェーズ】
   - 3〜5ターン話したら、または「特にない」「以上」「終わり」「大丈夫」「診断して」などが出たら自然に締める
   - 締め文に必ず「診断結果を見る」というフレーズを含めること
   - 例：「ありがとうございます、かなり詳しく聞けました！準備ができたら下の『診断結果を見る』ボタンを押してみてください。」

【絶対にやらないこと】
- 「何かご質問はありますか？」「他に気になることは？」だけの返答（必ず自分から具体的な話題を出す）
- 箇条書きや番号リストの多用
- 医学的診断・治療の断言
- 5文以上の長い説明

【診断完了フラグ】
締めの返答には必ず「診断結果を見る」という文字列を含めること。`;
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
