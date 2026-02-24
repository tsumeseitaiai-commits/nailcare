'use client';

import { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface DiagnosisResult {
  health_score: number;
  detected_issues: string[];
  recommendations: string[];
  analysis: string;
}

export default function AIDiagnosisPage() {
  const [step, setStep] = useState<'upload' | 'chat' | 'result'>('upload');
  const [image, setImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // メッセージ追加時に自動スクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 画像アップロード処理
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('ファイルサイズは5MB以下にしてください');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      const base64Data = base64.split(',')[1];

      setImage(base64Data);
      setImagePreview(base64);
      setStep('chat');
      setMessages([
        {
          role: 'assistant',
          content:
            '爪の写真を受け取りました。より正確な診断のために、いくつか質問させてください。最近の睡眠時間はどのくらいですか？',
          timestamp: new Date().toISOString(),
        },
      ]);
    };
    reader.readAsDataURL(file);
  };

  // メッセージ送信
  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading) return;

    const newUserMessage: Message = {
      role: 'user',
      content: userInput,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat-diagnosis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          image,
          sessionId: 'session-' + Date.now(),
        }),
      });

      const data = await response.json();

      const aiMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);

      // 診断完了チェック
      if (data.isComplete) {
        const diagnosisResponse = await fetch('/api/final-diagnosis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: finalMessages,
            image,
          }),
        });

        const diagnosisData = await diagnosisResponse.json();
        setDiagnosisResult(diagnosisData);
        setStep('result');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('エラーが発生しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStep('upload');
    setImage(null);
    setImagePreview(null);
    setMessages([]);
    setDiagnosisResult(null);
    setUserInput('');
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted">
      <Header />

      <main className="flex-1 py-12">
        <div className="mx-auto max-w-3xl px-4">
          {/* ページタイトル */}
          <div className="mb-8 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
              AI Diagnosis
            </p>
            <h1 className="text-3xl font-bold text-foreground">AI爪診断</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              爪の写真をアップロードして、AIと対話形式で健康状態を確認しましょう
            </p>
          </div>

          {/* ステップインジケーター */}
          <div className="mb-8 flex items-center justify-center gap-2 text-sm">
            {(['upload', 'chat', 'result'] as const).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                    step === s
                      ? 'bg-primary text-white'
                      : ['upload', 'chat', 'result'].indexOf(step) > i
                      ? 'bg-success text-white'
                      : 'bg-border text-muted-foreground'
                  }`}
                >
                  {['upload', 'chat', 'result'].indexOf(step) > i ? '✓' : i + 1}
                </div>
                <span
                  className={`hidden sm:inline ${
                    step === s ? 'font-semibold text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {s === 'upload' ? '写真アップロード' : s === 'chat' ? '問診' : '診断結果'}
                </span>
                {i < 2 && <div className="h-px w-8 bg-border" />}
              </div>
            ))}
          </div>

          {/* ===== Step 1: アップロード ===== */}
          {step === 'upload' && (
            <div className="rounded-xl border border-border bg-white p-8 shadow-sm">
              <h2 className="mb-2 text-xl font-bold text-foreground">
                爪の写真をアップロード
              </h2>
              <p className="mb-6 text-sm text-muted-foreground">
                診断したい爪の写真を選択してください。明るい場所で撮影した鮮明な画像が最適です。
              </p>

              <label
                htmlFor="image-upload"
                className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-12 transition-colors hover:border-primary/40 hover:bg-primary/3"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <span className="text-base font-semibold text-foreground">
                  クリックして画像を選択
                </span>
                <span className="mt-1 text-sm text-muted-foreground">
                  JPEG, PNG, WebP（最大5MB）
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
              </label>

              <div className="mt-6 flex items-start gap-3 rounded-lg bg-primary/5 p-4">
                <svg
                  className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-xs text-muted-foreground">
                  本サービスは医療診断ではありません。気になる症状がある場合は医療機関を受診してください。
                </p>
              </div>
            </div>
          )}

          {/* ===== Step 2: チャット ===== */}
          {step === 'chat' && (
            <div className="rounded-xl border border-border bg-white shadow-sm">
              {/* チャットヘッダー */}
              <div className="flex items-center gap-3 border-b border-border px-6 py-4">
                {imagePreview && (
                  <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-border">
                    <Image
                      src={imagePreview}
                      alt="Uploaded nail"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-foreground">AI問診中</p>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    <p className="text-xs text-muted-foreground">爪整体AIアシスタント</p>
                  </div>
                </div>
              </div>

              {/* メッセージエリア */}
              <div className="h-[420px] overflow-y-auto px-6 py-4">
                <div className="space-y-4">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">
                          AI
                        </div>
                      )}
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                          msg.role === 'user'
                            ? 'rounded-tr-sm bg-primary text-white'
                            : 'rounded-tl-sm bg-muted text-foreground'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">
                        AI
                      </div>
                      <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-3">
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" />
                          <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.15s]" />
                          <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.3s]" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* 入力エリア */}
              <div className="border-t border-border px-4 py-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    placeholder="メッセージを入力..."
                    disabled={isLoading}
                    className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !userInput.trim()}
                    className="flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===== Step 3: 診断結果 ===== */}
          {step === 'result' && diagnosisResult && (
            <div className="space-y-6">
              {/* 健康スコアカード */}
              <div className="rounded-xl border border-border bg-white p-8 shadow-sm text-center">
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary">
                  診断結果
                </p>
                <div className="relative mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-primary/8">
                  {/* スコアに応じた外周リング */}
                  <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="44" fill="none" stroke="#E2E8F0" strokeWidth="6" />
                    <circle
                      cx="50"
                      cy="50"
                      r="44"
                      fill="none"
                      stroke={
                        diagnosisResult.health_score >= 70
                          ? '#10B981'
                          : diagnosisResult.health_score >= 40
                          ? '#F59E0B'
                          : '#EF4444'
                      }
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${(diagnosisResult.health_score / 100) * 276.46} 276.46`}
                    />
                  </svg>
                  <div>
                    <span className="text-4xl font-bold text-foreground">
                      {diagnosisResult.health_score}
                    </span>
                    <span className="text-sm text-muted-foreground">/100</span>
                  </div>
                </div>
                <p className="text-base font-semibold text-foreground">健康スコア</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {diagnosisResult.health_score >= 70
                    ? '良好な状態です'
                    : diagnosisResult.health_score >= 40
                    ? '改善の余地があります'
                    : '要注意：生活習慣の見直しをお勧めします'}
                </p>
              </div>

              {/* 検出された問題 */}
              <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-foreground">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-warning/10 text-warning">
                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  検出された問題点
                </h3>
                <ul className="space-y-2">
                  {diagnosisResult.detected_issues.map((issue, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                      <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 改善アドバイス */}
              <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-foreground">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-success/10 text-success">
                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  改善アドバイス
                </h3>
                <ul className="space-y-2">
                  {diagnosisResult.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                      <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 詳細分析 */}
              <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
                <h3 className="mb-3 text-base font-bold text-foreground">詳細分析</h3>
                <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                  {diagnosisResult.analysis}
                </p>
              </div>

              {/* アクションボタン */}
              <div className="flex justify-center gap-4 pb-4">
                <button
                  onClick={handleReset}
                  className="rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                >
                  もう一度診断する
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
