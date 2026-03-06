import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { HEEL_KNOWLEDGE } from '@/lib/heelKnowledge';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

function getLangInstruction(locale: string): string {
  if (locale === 'ar') return 'IMPORTANT: You must respond in Arabic (العربية) only.';
  if (locale === 'en') return 'IMPORTANT: You must respond in English only.';
  return 'IMPORTANT: You must respond in Japanese (日本語) only.';
}

function buildHeelSystemPrompt(quizAnswers?: Record<string, unknown>, locale = 'ja'): string {
  const q = quizAnswers;
  const langInstruction = getLangInstruction(locale);

  return `${langInstruction}

${HEEL_KNOWLEDGE}

You are a heel and foot care specialist counselor. You are having a conversation with a patient about heel callus and dryness.

[Patient Profile from Interview]
- Callus severity: ${q?.heelSeverity ?? 'unknown'}
- Moisturizing frequency: ${q?.heelMoisture ?? 'unknown'}
- Footwear type: ${q?.heelFootwear ?? 'unknown'}
- Standing work hours per day: ${q?.heelStanding ?? 'unknown'}

[Your character]
- Warm, empathetic, not clinical — speak like a trusted practitioner
- React naturally to what the user shares
- Expert but approachable, avoid medical jargon
- 2-4 sentences per turn, conversational

[Conversation flow]
1. [Opening] Based on the interview, open with a specific, empathetic observation.
   Good: "Looking at your photo, the heel area looks quite dry. Does it ever crack or feel tight when walking?"
   Good: "You mentioned standing a lot at work — that's a big factor for heel buildup. Do you notice it getting worse on busy days?"
   Bad: Only asking "Do you have any questions?"

2. [Deep dive (2-4 turns)]
   - Acknowledge what they say, then ask exactly one follow-up
   - Topics: when symptoms are worst / footwear habits / bathing/moisturizing routine / seasonal changes / pain or discomfort while walking

3. [Closing phase]
   - After 3-5 turns, or when user says they're ready, close naturally
   - The closing message MUST include [DIAGNOSIS_COMPLETE]
   - Example: "Thank you for sharing all of that! I have a good picture now. Tap below whenever you're ready to see your heel care results. [DIAGNOSIS_COMPLETE]"

[IMPORTANT: End every opening message with this line]
After your opening observation/question, always add: "他に気になることがなければ、すぐ下の診断ボタンを押してください！"

[Never do]
- Only respond with vague generic questions
- Use excessive bullet lists
- Assert medical diagnoses
- Write more than 5 sentences in one turn

[Completion flag]
The closing response MUST contain the token [DIAGNOSIS_COMPLETE].`;
}

function buildSystemPrompt(quizAnswers?: Record<string, unknown>, locale = 'ja'): string {
  const q = quizAnswers;
  const langInstruction = getLangInstruction(locale);

  // Extract concerns from quiz data
  const concerns: string[] = [];
  if (q) {
    const toeGrip = Number(q.toeGrip);
    const grip = Number(q.gripConfidence);
    const balance = Number(q.balance);
    if (toeGrip <= 4) concerns.push(`toe grip weak (${toeGrip}/10)`);
    if (grip <= 4) concerns.push(`grip confidence low (${grip}/10)`);
    if (balance <= 4) concerns.push(`balance unstable (${balance}/10)`);
    if (q.curvedNail === 'strong') concerns.push('severe curved nail');
    if (q.curvedNail === 'mild') concerns.push('mild curved nail tendency');
    if (q.halluxValgus && q.halluxValgus !== 'none') concerns.push(`hallux valgus: ${q.halluxValgus}`);
    if (q.ankleSprain === '2-3' || q.ankleSprain === '4plus') concerns.push(`ankle sprain history: ${q.ankleSprain}`);
    const painAreas = Array.isArray(q.currentPainAreas) ? q.currentPainAreas as string[] : [];
    if (painAreas.length > 0 && !painAreas.includes('none')) concerns.push(`current pain: ${painAreas.join(', ')}`);
  }

  const concernText = concerns.length > 0
    ? `\n[Key concerns from interview (must address in conversation)]\n${concerns.map(c => `- ${c}`).join('\n')}\n`
    : `\n[No major issues in interview. Naturally explore athletic performance and nail care habits.]\n`;

  const athleteContext = q
    ? `[Athlete Profile]
- Sport: ${q.sport}
- Age: ${q.age} / Gender: ${q.gender}
- Toe grip: ${q.toeGrip}/10 / Grip confidence: ${q.gripConfidence}/10 / Balance: ${q.balance}/10
- Curved nail: ${q.curvedNail} / Hallux valgus: ${q.halluxValgus}
- Ankle sprain history: ${q.ankleSprain}
- Current pain: ${Array.isArray(q.currentPainAreas) ? (q.currentPainAreas as string[]).join(', ') || 'none' : 'none'}
${concernText}`
    : '';

  return `${langInstruction}

You are a nail health specialist counselor. You are having a 1-on-1 conversation with an athlete who plays ${q?.sport || 'sports'}.

${athleteContext}
[Your character]
- Warm, good listener, not pushy — naturally draw out conversation
- React to what the user says ("That sounds tough", "I see, that makes sense for ${q?.sport || 'that sport'}", etc.)
- Expert knowledge but avoid jargon
- 2-4 sentences per turn — short and conversational

[Conversation flow]
1. [Opening] Look at the interview data and concerns, then proactively bring up something specific.
   Good: "From your interview, your balance score caught my attention. Do you feel your body shifting during games?"
   Good: "You have a curved nail tendency. Do your toes hurt after taking off your shoes?"
   Bad (forbidden): Starting with only "Is there anything you'd like to talk about?"

2. [Deep dive (2-4 turns)]
   - First acknowledge what they say
   - Then ask exactly one related follow-up question
   - Topics: when symptoms occur / changes after training / shoe fit / recent body changes / nail care habits

3. [Closing phase]
   - After 3-5 turns, or when user says "nothing else" / "that's all" / "I'm done" / "diagnose me", close naturally
   - The closing message MUST include the token [DIAGNOSIS_COMPLETE]
   - Example: "Thank you, I've learned a lot! Whenever you're ready, tap the button below to see your diagnosis results. [DIAGNOSIS_COMPLETE]"

[IMPORTANT: End every opening message with this line]
After your opening observation/question, always add one short sentence: "他に気になることがなければ、すぐ下の診断ボタンを押してください！" (in the response language)

[Never do]
- Reply with only "Do you have any questions?" or "Anything else?" without raising a specific topic
- Use bullet lists or numbered lists excessively
- Assert medical diagnoses or treatments
- Write more than 5 sentences in one turn

[Completion flag]
The closing response MUST contain the token [DIAGNOSIS_COMPLETE].`;
}

export async function POST(req: NextRequest) {
  try {
    const { messages, image, quizAnswers, isInitial, locale = 'ja', bodyPart = 'nail' } = await req.json();

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
    });

    const systemPrompt = bodyPart === 'sole'
      ? buildHeelSystemPrompt(quizAnswers, locale)
      : buildSystemPrompt(quizAnswers, locale);

    // Build conversation history
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
        { role: 'user', parts: [{ text: 'start' }] },
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

    // Attach image on initial message
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
      throw new Error('No response from AI');
    }

    const response = result.response.text();

    if (!response || response.trim().length === 0) {
      throw new Error('Empty response from AI');
    }

    // Completion check — locale-neutral marker
    const isComplete = response.includes('[DIAGNOSIS_COMPLETE]');

    return NextResponse.json({ response, isComplete });
  } catch (error: unknown) {
    const err = error as { name?: string; message?: string; stack?: string };
    console.error('=== Chat Diagnosis Error ===');
    console.error('Error message:', err?.message);
    return NextResponse.json(
      { error: 'AI diagnosis error', details: err?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
