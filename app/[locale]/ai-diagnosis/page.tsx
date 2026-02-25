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

type RiskLevel = 'excellent' | 'good' | 'fair' | 'poor';

function getRiskLevel(score: number): RiskLevel {
  if (score >= 80) return 'excellent';
  if (score >= 50) return 'good';
  if (score >= 20) return 'fair';
  return 'poor';
}

function getRiskConfig(level: RiskLevel) {
  const config = {
    excellent: { color: '#10B981', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', label: '健康', desc: '良好な状態です' },
    good:      { color: '#F59E0B', bg: 'bg-amber-50',   border: 'border-amber-200',   text: 'text-amber-800',   label: '注意', desc: '軽微な改善の余地があります' },
    fair:      { color: '#F97316', bg: 'bg-orange-50',  border: 'border-orange-200',  text: 'text-orange-800',  label: '要受診検討', desc: '医療機関への受診を検討してください' },
    poor:      { color: '#EF4444', bg: 'bg-red-50',     border: 'border-red-200',     text: 'text-red-800',     label: '早急に受診', desc: '早急に皮膚科専門医を受診してください' },
  };
  return config[level];
}

export default function AIDiagnosisPage() {
  const [step, setStep] = useState<'upload' | 'chat' | 'result'>('upload');
  const [image, setImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [userConsent, setUserConsent] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const processFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert('ファイルサイズは5MB以下にしてください');
      return;
    }
    if (!file.type.startsWith('image/')) {
      alert('画像ファイルを選択してください');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      const base64Data = base64.split(',')[1];
      setImage(base64Data);
      setImagePreview(base64);
    };
    reader.onerror = () => {
      alert('画像の読み込みに失敗しました');
    };
    reader.readAsDataURL(file);
  };

  const handleStartDiagnosis = () => {
    if (!image || !userConsent) return;
    setStep('chat');
    setMessages([{
      role: 'assistant',
      content: '爪の写真を受け取りました。より正確な診断のために、いくつか質問させてください。最近の睡眠時間はどのくらいですか？（例：6時間、7〜8時間など）',
      timestamp: new Date().toISOString(),
    }]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

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

      if (!response.ok) {
        throw new Error(data.error || 'API error');
      }

      const aiMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);

      if (data.isComplete) {
        setIsLoading(true);
        const diagnosisResponse = await fetch('/api/final-diagnosis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: finalMessages, image }),
        });

        const diagnosisData = await diagnosisResponse.json();
        if (diagnosisResponse.ok) {
          setDiagnosisResult(diagnosisData);
          setStep('result');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '申し訳ございません。エラーが発生しました。もう一度お試しください。',
        timestamp: new Date().toISOString(),
      }]);
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
    setUserConsent(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted">
      <Header />

      <main className="flex-1 py-12">
        <div className="mx-auto max-w-3xl px-4">
          {/* Page Title */}
          <div className="mb-8 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
              AI Diagnosis
            </p>
            <h1 className="text-3xl font-bold text-foreground">AI爪診断</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              爪の写真をアップロードして、AIと対話形式で健康状態を確認しましょう
            </p>
          </div>

          {/* Step Indicator */}
          <div className="mb-8 flex items-center justify-center gap-2 text-sm">
            {(['upload', 'chat', 'result'] as const).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  step === s ? 'bg-primary text-white' :
                  ['upload', 'chat', 'result'].indexOf(step) > i ? 'bg-emerald-500 text-white' :
                  'bg-border text-muted-foreground'
                }`}>
                  {['upload', 'chat', 'result'].indexOf(step) > i ? '✓' : i + 1}
                </div>
                <span className={`hidden sm:inline ${step === s ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                  {s === 'upload' ? '写真アップロード' : s === 'chat' ? '問診' : '診断結果'}
                </span>
                {i < 2 && <div className="h-px w-8 bg-border" />}
              </div>
            ))}
          </div>

          {/* ===== Step 1: Upload ===== */}
          {step === 'upload' && (
            <div className="rounded-xl border border-border bg-white p-8 shadow-sm">
              {/* Hero image */}
              <div className="mb-6 flex justify-center">
                <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-primary/20 shadow-md">
                  <Image
                    src="/images/optimized/nailanaly.jpg"
                    alt="AI爪診断"
                    fill
                    className="object-cover"
                    sizes="112px"
                    priority
                  />
                </div>
              </div>
              <h2 className="mb-2 text-xl font-bold text-foreground">爪の写真をアップロード</h2>
              <p className="mb-6 text-sm text-muted-foreground">
                診断したい爪の写真を選択してください。明るい場所で撮影した鮮明な画像が最適です。
              </p>

              {/* Shooting Guide */}
              <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
                <h3 className="mb-2 text-xs font-semibold text-primary uppercase tracking-wider">撮影ガイドライン</h3>
                <ul className="space-y-1">
                  {[
                    '明るい場所（自然光または蛍光灯下）で撮影',
                    '爪全体が画面に収まるように',
                    'ピントを爪に合わせて鮮明に',
                    '複数の爪が対象の場合は全て写す',
                  ].map((guide, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {guide}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Drag & Drop Area */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-all ${
                  isDragging ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-border hover:border-primary/40 hover:bg-primary/3'
                }`}
              >
                <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl transition-colors ${
                  isDragging ? 'bg-primary text-white' : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white'
                }`}>
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-base font-semibold text-foreground">
                  {isDragging ? 'ここにドロップ' : 'ドラッグ&ドロップ、またはクリックして選択'}
                </span>
                <span className="mt-1 text-sm text-muted-foreground">JPEG, PNG, WebP（最大5MB）</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-6">
                  <p className="mb-2 text-sm text-muted-foreground">アップロード済み:</p>
                  <div className="relative mx-auto h-48 w-48 overflow-hidden rounded-lg border border-border">
                    <Image
                      src={imagePreview}
                      alt="Uploaded nail"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Consent Checkbox — shown after image is uploaded */}
              {imagePreview && (
                <div className="mt-5 rounded-xl border border-border bg-muted/50 p-4">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={userConsent}
                      onChange={(e) => setUserConsent(e.target.checked)}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
                    />
                    <span className="text-xs leading-relaxed text-muted-foreground">
                      診断データを今後のサービス改善に使用することに同意します
                      <span className="ml-1 font-medium">（個人情報は保存されません。画像は診断後24時間で削除されます）</span>
                    </span>
                  </label>
                </div>
              )}

              {/* Start Button — shown after image is uploaded */}
              {imagePreview && (
                <button
                  onClick={handleStartDiagnosis}
                  disabled={!userConsent}
                  className="mt-4 w-full rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
                >
                  診断を開始
                </button>
              )}

              {/* Disclaimer */}
              <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-amber-800">
                  本サービスは医療機器ではなく、確定診断を行うものではありません。気になる症状がある場合は医療機関を受診してください。
                </p>
              </div>
            </div>
          )}

          {/* ===== Step 2: Chat ===== */}
          {step === 'chat' && (
            <div className="rounded-xl border border-border bg-white shadow-sm">
              {/* Chat Header */}
              <div className="flex items-center gap-3 border-b border-border px-6 py-4">
                {imagePreview && (
                  <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-border">
                    <Image src={imagePreview} alt="Uploaded nail" fill className="object-cover" />
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-foreground">AI問診中</p>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <p className="text-xs text-muted-foreground">爪整体AIアシスタント</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="h-[420px] overflow-y-auto px-6 py-4">
                <div className="space-y-4">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {msg.role === 'assistant' && (
                        <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">
                          AI
                        </div>
                      )}
                      <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'rounded-tr-sm bg-primary text-white'
                          : 'rounded-tl-sm bg-muted text-foreground'
                      }`}>
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

              {/* Input Area */}
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
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===== Step 3: Result ===== */}
          {step === 'result' && diagnosisResult && (() => {
            const level = getRiskLevel(diagnosisResult.health_score);
            const risk = getRiskConfig(level);
            const circumference = 2 * Math.PI * 44;
            const dashArray = `${(diagnosisResult.health_score / 100) * circumference} ${circumference}`;

            return (
              <div className="space-y-6">
                {/* Score Card */}
                <div className={`rounded-xl border ${risk.border} ${risk.bg} p-8 text-center shadow-sm`}>
                  <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary">診断結果</p>

                  {/* Circular Progress */}
                  <div className="relative mx-auto mb-4 flex h-36 w-36 items-center justify-center">
                    <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="44" fill="none" stroke="#E2E8F0" strokeWidth="7" />
                      <circle
                        cx="50" cy="50" r="44" fill="none"
                        stroke={risk.color}
                        strokeWidth="7"
                        strokeLinecap="round"
                        strokeDasharray={dashArray}
                        style={{ transition: 'stroke-dasharray 1s ease-in-out' }}
                      />
                    </svg>
                    <div>
                      <span className="text-4xl font-bold text-foreground">{diagnosisResult.health_score}</span>
                      <span className="text-sm text-muted-foreground">/100</span>
                    </div>
                  </div>

                  <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 ${risk.border} mb-2`}>
                    <span className={`text-sm font-bold ${risk.text}`}>{risk.label}</span>
                  </div>
                  <p className={`text-sm font-medium ${risk.text}`}>{risk.desc}</p>

                  {/* Urgent warning for poor/fair */}
                  {(level === 'poor' || level === 'fair') && (
                    <div className="mt-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-left">
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                      <p className="text-xs text-red-700">
                        この結果はスクリーニング目的のものです。早急に皮膚科専門医を受診し、確定診断を受けることを強くお勧めします。
                      </p>
                    </div>
                  )}
                </div>

                {/* Issues */}
                <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
                  <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-foreground">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-100 text-amber-600">
                      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </span>
                    検出された問題点
                  </h3>
                  <ul className="space-y-2">
                    {diagnosisResult.detected_issues.map((issue, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                        <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
                  <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-foreground">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-100 text-emerald-600">
                      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                    改善アドバイス
                  </h3>
                  <ul className="space-y-2">
                    {diagnosisResult.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                        <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Analysis */}
                <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
                  <h3 className="mb-3 text-base font-bold text-foreground">詳細分析</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                    {diagnosisResult.analysis}
                  </p>
                </div>

                {/* Disclaimer */}
                <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs text-amber-800">
                    この結果はスクリーニング目的のものであり、医学的確定診断ではありません。気になる症状がある場合は必ず医療機関を受診してください。
                  </p>
                </div>

                {/* Actions */}
                <div className="flex justify-center gap-4 pb-4">
                  <button
                    onClick={handleReset}
                    className="rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                  >
                    もう一度診断する
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      </main>

      <Footer />
    </div>
  );
}
