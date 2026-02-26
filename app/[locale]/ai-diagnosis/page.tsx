'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';

// ============================================================
// 型定義
// ============================================================
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

interface QuizAnswers {
  sport: string;
  age: number | '';
  gender: string;
  curvedNail: string;
  halluxValgus: string;
  toeGrip: number;
  gripConfidence: number;
  balance: number;
  ankleSprain: string;
  currentPainAreas: string[];
}

type RiskLevel = 'excellent' | 'good' | 'fair' | 'poor';

// ============================================================
// 定数
// ============================================================
const SPORTS_LIST = [
  'サッカー', 'フットサル', 'バスケットボール', 'バレーボール',
  'テニス', 'バドミントン', '卓球', '野球', 'ソフトボール',
  'ラグビー', 'アメリカンフットボール', 'ハンドボール', 'ホッケー',
  '陸上競技（短距離）', '陸上競技（長距離）', '水泳', 'トライアスロン',
  '体操', '柔道', '剣道', '空手', 'ボクシング', '相撲',
  'スキー', 'スノーボード', 'サーフィン', 'ゴルフ',
  'サイクリング（ロード）', 'マウンテンバイク', 'その他',
];

const PAIN_AREAS = ['足指', '足首', '膝', '股関節', '腰', '背中', '肩', '肘', '首', 'なし'];

const INITIAL_ANSWERS: QuizAnswers = {
  sport: '', age: '', gender: '',
  curvedNail: '', halluxValgus: '',
  toeGrip: 5, gripConfidence: 5, balance: 5,
  ankleSprain: '',
  currentPainAreas: [],
};

const TOTAL_STEPS = 7;

// ============================================================
// ユーティリティ
// ============================================================
function getRiskLevel(score: number): RiskLevel {
  if (score >= 80) return 'excellent';
  if (score >= 50) return 'good';
  if (score >= 20) return 'fair';
  return 'poor';
}

function getRiskStyle(level: RiskLevel) {
  return {
    excellent: { color: '#10B981', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', label: '非常に良好', desc: '足指・足首の機能は優れています' },
    good:      { color: '#F59E0B', bg: 'bg-amber-50',   border: 'border-amber-200',   text: 'text-amber-800',   label: '良好',     desc: '多少の改善余地がありますが良好です' },
    fair:      { color: '#F97316', bg: 'bg-orange-50',  border: 'border-orange-200',  text: 'text-orange-800',  label: '要注意',   desc: 'いくつかの問題が見られます' },
    poor:      { color: '#EF4444', bg: 'bg-red-50',     border: 'border-red-200',     text: 'text-red-800',     label: '要改善',   desc: '早めのケアをおすすめします' },
  }[level];
}

function calcPrelimScore(a: QuizAnswers): number {
  let score = 50;
  score += (a.toeGrip - 5) * 3;
  score += (a.gripConfidence - 5) * 2;
  score += (a.balance - 5) * 2;
  if (a.ankleSprain === 'なし') score += 5;
  else if (a.ankleSprain === '1回') score += 0;
  else if (a.ankleSprain === '2〜3回') score -= 5;
  else score -= 10;
  if (a.curvedNail === '強い') score -= 8;
  else if (a.curvedNail === '少しある') score -= 3;
  if (a.halluxValgus !== 'なし' && a.halluxValgus !== '') score -= 5;
  return Math.max(0, Math.min(100, Math.round(score)));
}

// スライダーコンポーネント
function SliderInput({ value, onChange, leftLabel, rightLabel }: {
  value: number; onChange: (v: number) => void; leftLabel: string; rightLabel: string;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{leftLabel}</span>
        <span className="text-3xl font-bold text-primary">{value}</span>
        <span>{rightLabel}</span>
      </div>
      <input type="range" min={1} max={10} value={value}
        onChange={e => onChange(Number(e.target.value))} className="w-full accent-primary" />
      <div className="flex justify-between text-xs text-muted-foreground">
        {Array.from({ length: 10 }, (_, i) => <span key={i}>{i + 1}</span>)}
      </div>
    </div>
  );
}

// 選択ボタンコンポーネント
function ChoiceButtons({ options, value, onChange, cols = 1 }: {
  options: string[]; value: string; onChange: (v: string) => void; cols?: number;
}) {
  return (
    <div className={`grid gap-2 ${cols === 2 ? 'grid-cols-2' : cols === 3 ? 'grid-cols-3' : 'grid-cols-1'}`}>
      {options.map(opt => (
        <button key={opt} onClick={() => onChange(opt)}
          className={`rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all ${
            value === opt ? 'border-primary bg-primary/5 text-primary' : 'border-border text-foreground hover:border-primary/40'
          }`}>
          {opt}
        </button>
      ))}
    </div>
  );
}

// ============================================================
// メインコンポーネント
// ============================================================
export default function AIDiagnosisPage() {
  const t = useTranslations('aiDiagnosis');
  const guideItems = t.raw('upload.guide') as string[];
  const riskLevels = t.raw('result.riskLevels') as Record<RiskLevel, { label: string; desc: string }>;

  const [step, setStep] = useState<'upload' | 'quiz' | 'freeChat' | 'result'>('upload');
  const [quizStep, setQuizStep] = useState(1); // 1〜7
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers>(INITIAL_ANSWERS);
  const [prelimScore, setPrelimScore] = useState<number | null>(null);
  const [showPrelim, setShowPrelim] = useState(false);

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
  const isFinalDiagnosisCalled = useRef(false);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const set = <K extends keyof QuizAnswers>(key: K, value: QuizAnswers[K]) =>
    setQuizAnswers(prev => ({ ...prev, [key]: value }));

  const togglePainArea = (area: string) => {
    if (area === 'なし') { set('currentPainAreas', ['なし']); return; }
    const current = quizAnswers.currentPainAreas.filter(a => a !== 'なし');
    const next = current.includes(area) ? current.filter(a => a !== area) : [...current, area];
    set('currentPainAreas', next);
  };

  // ============================================================
  // バリデーション
  // ============================================================
  const canProceed = (): boolean => {
    if (quizStep === 1) return quizAnswers.sport !== '';
    if (quizStep === 2) return quizAnswers.age !== '' && Number(quizAnswers.age) >= 5 && quizAnswers.gender !== '';
    if (quizStep === 3) return quizAnswers.curvedNail !== '' && quizAnswers.halluxValgus !== '';
    if (quizStep === 6) return quizAnswers.ankleSprain !== '';
    return true;
  };

  const handleNext = () => {
    if (!canProceed()) return;
    if (quizStep < TOTAL_STEPS) {
      setQuizStep(quizStep + 1);
    } else {
      setPrelimScore(calcPrelimScore(quizAnswers));
      setShowPrelim(true);
    }
  };

  const handleBack = () => { if (quizStep > 1) setQuizStep(quizStep - 1); };

  // ============================================================
  // 画像アップロード
  // ============================================================
  const processFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) { alert(t('upload.fileTypes')); return; }
    if (!file.type.startsWith('image/')) { alert(t('upload.fileTypes')); return; }
    const reader = new FileReader();
    reader.onload = e => { const b64 = e.target?.result as string; setImage(b64.split(',')[1]); setImagePreview(b64); };
    reader.onerror = () => alert(t('chat.error'));
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const f = e.dataTransfer.files[0]; if (f) processFile(f);
  };

  // ============================================================
  // フリーチャット
  // ============================================================
  const handleStartFreeChat = () => {
    setShowPrelim(false); setStep('freeChat'); setMessages([]);
    isFinalDiagnosisCalled.current = false;
    fetchInitialFreeMessage();
  };

  const fetchInitialFreeMessage = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/chat-diagnosis', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: 'フリーチャットを開始してください' }], image, quizAnswers, isInitial: true }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessages([{ role: 'assistant', content: data.response, timestamp: new Date().toISOString() }]);
    } catch {
      setMessages([{ role: 'assistant', content: t('chat.error'), timestamp: new Date().toISOString() }]);
    } finally { setIsLoading(false); }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading) return;
    const newMsg: Message = { role: 'user', content: userInput, timestamp: new Date().toISOString() };
    const updated = [...messages, newMsg];
    setMessages(updated); setUserInput(''); setIsLoading(true);
    try {
      const res = await fetch('/api/chat-diagnosis', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated, image, quizAnswers }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const aiMsg: Message = { role: 'assistant', content: data.response, timestamp: new Date().toISOString() };
      const final = [...updated, aiMsg];
      setMessages(final);
      if (data.isComplete && !isFinalDiagnosisCalled.current) {
        isFinalDiagnosisCalled.current = true;
        setTimeout(() => handleFinalDiagnosis(final), 1000);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: t('chat.error'), timestamp: new Date().toISOString() }]);
    } finally { setIsLoading(false); }
  };

  const handleFinalDiagnosis = async (chatMessages?: Message[]) => {
    const msgs = chatMessages || messages;
    setIsLoading(true);
    try {
      const res = await fetch('/api/final-diagnosis', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: msgs, image, quizAnswers, locale: 'ja' }),
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setDiagnosisResult(data); setStep('result');
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: t('chat.error'), timestamp: new Date().toISOString() }]);
    } finally { setIsLoading(false); }
  };

  const handleReset = () => {
    isFinalDiagnosisCalled.current = false;
    setStep('upload'); setQuizStep(1); setQuizAnswers(INITIAL_ANSWERS);
    setPrelimScore(null); setShowPrelim(false);
    setImage(null); setImagePreview(null); setMessages([]);
    setDiagnosisResult(null); setUserInput(''); setUserConsent(false);
  };

  const uiStepLabels = ['画像', '問診', 'AI相談', '結果'];
  const currentUiStepIndex = ['upload', 'quiz', 'freeChat', 'result'].indexOf(step);

  // ============================================================
  // レンダリング
  // ============================================================
  return (
    <div className="flex min-h-screen flex-col bg-muted">
      <Header />
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-3xl px-4">

          {/* タイトル */}
          <div className="mb-8 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">AI Diagnosis</p>
            <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{t('subtitle')}</p>
          </div>

          {/* ステップインジケーター */}
          <div className="mb-8 flex items-center justify-center gap-2 text-sm">
            {uiStepLabels.map((label, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  currentUiStepIndex === i ? 'bg-primary text-white' :
                  currentUiStepIndex > i ? 'bg-emerald-500 text-white' : 'bg-border text-muted-foreground'
                }`}>{currentUiStepIndex > i ? '✓' : i + 1}</div>
                <span className={`hidden sm:inline ${currentUiStepIndex === i ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>{label}</span>
                {i < uiStepLabels.length - 1 && <div className="h-px w-6 bg-border" />}
              </div>
            ))}
          </div>

          {/* ===== Upload ===== */}
          {step === 'upload' && (
            <div className="rounded-xl border border-border bg-white p-8 shadow-sm">
              <div className="mb-6 flex justify-center">
                <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-primary/20 shadow-md">
                  <Image src="/images/optimized/nailanaly.jpg" alt="AI Nail Diagnosis" fill className="object-cover" sizes="112px" priority />
                </div>
              </div>
              <h2 className="mb-2 text-xl font-bold text-foreground">{t('upload.title')}</h2>
              <p className="mb-6 text-sm text-muted-foreground">{t('upload.description')}</p>
              <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">{t('upload.guideTitle')}</h3>
                <ul className="space-y-1">
                  {guideItems.map((g, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />{g}
                    </li>
                  ))}
                </ul>
              </div>
              <div
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-all ${
                  isDragging ? 'scale-[1.01] border-primary bg-primary/5' : 'border-border hover:border-primary/40'
                }`}
              >
                <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl transition-colors ${
                  isDragging ? 'bg-primary text-white' : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white'
                }`}>
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-base font-semibold text-foreground">{isDragging ? t('upload.dropHere') : t('upload.dragDrop')}</span>
                <span className="mt-1 text-sm text-muted-foreground">{t('upload.fileTypes')}</span>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) processFile(f); }} className="hidden" />
              </div>
              {imagePreview && (
                <div className="mt-6 text-center">
                  <p className="mb-2 text-sm text-muted-foreground">{t('upload.uploadedLabel')}</p>
                  <div className="relative mx-auto h-48 w-48 overflow-hidden rounded-lg border border-border">
                    <Image src={imagePreview} alt="Uploaded nail" fill className="object-cover" />
                  </div>
                </div>
              )}
              {imagePreview && (
                <div className="mt-5 rounded-xl border border-border bg-muted/50 p-4">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input type="checkbox" checked={userConsent} onChange={e => setUserConsent(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-primary" />
                    <span className="text-xs leading-relaxed text-muted-foreground">{t('upload.consent')}</span>
                  </label>
                </div>
              )}
              {imagePreview && (
                <button
                  onClick={() => { if (!image || !userConsent) return; setStep('quiz'); setQuizStep(1); }}
                  disabled={!userConsent}
                  className="mt-4 w-full rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
                >
                  問診を開始する（全{TOTAL_STEPS}問）→
                </button>
              )}
              <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-amber-800">{t('upload.disclaimer')}</p>
              </div>
            </div>
          )}

          {/* ===== Quiz ===== */}
          {step === 'quiz' && !showPrelim && (
            <div className="rounded-xl border border-border bg-white p-8 shadow-sm">
              {/* 進捗バー */}
              <div className="mb-6">
                <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
                  <span>問診 {quizStep} / {TOTAL_STEPS}</span>
                  <span>{Math.round((quizStep / TOTAL_STEPS) * 100)}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${(quizStep / TOTAL_STEPS) * 100}%` }} />
                </div>
                <div className="mt-2 flex gap-1">
                  {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                      i < quizStep - 1 ? 'bg-emerald-400' : i === quizStep - 1 ? 'bg-primary' : 'bg-muted'
                    }`} />
                  ))}
                </div>
              </div>

              {/* Q1: 競技名 */}
              {quizStep === 1 && (
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">Q1</p>
                  <h2 className="mb-5 text-xl font-bold">競技名を教えてください</h2>
                  <select value={quizAnswers.sport} onChange={e => set('sport', e.target.value)}
                    className="w-full rounded-lg border border-border px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="">選択してください</option>
                    {SPORTS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              )}

              {/* Q2: 年齢 + 性別（同一画面） */}
              {quizStep === 2 && (
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">Q2</p>
                  <h2 className="mb-5 text-xl font-bold">年齢と性別を教えてください</h2>
                  <div className="space-y-5">
                    <div>
                      <p className="mb-2 text-sm font-semibold text-foreground">年齢</p>
                      <div className="flex items-center gap-3">
                        <input type="number" min={5} max={100} value={quizAnswers.age} autoFocus
                          onChange={e => set('age', e.target.value === '' ? '' : Number(e.target.value))}
                          onKeyDown={e => e.key === 'Enter' && canProceed() && handleNext()}
                          placeholder="25"
                          className="w-32 rounded-lg border-2 border-border px-4 py-3 text-center text-2xl font-bold focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                        <span className="text-base text-muted-foreground">歳</span>
                      </div>
                    </div>
                    <div>
                      <p className="mb-2 text-sm font-semibold text-foreground">性別</p>
                      <ChoiceButtons options={['男性', '女性', 'その他']} value={quizAnswers.gender} onChange={v => set('gender', v)} cols={3} />
                    </div>
                  </div>
                </div>
              )}

              {/* Q3: 巻き爪 + 外反母趾（同一画面） */}
              {quizStep === 3 && (
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">Q3</p>
                  <h2 className="mb-5 text-xl font-bold">爪・足の状態を教えてください</h2>
                  <div className="space-y-5">
                    <div>
                      <p className="mb-2 text-sm font-semibold text-foreground">巻き爪の傾向</p>
                      <ChoiceButtons options={['なし', '少しある', '強い']} value={quizAnswers.curvedNail} onChange={v => set('curvedNail', v)} cols={3} />
                    </div>
                    <div>
                      <p className="mb-2 text-sm font-semibold text-foreground">外反母趾</p>
                      <ChoiceButtons options={['なし', 'あり（軽度）', 'あり（重度）']} value={quizAnswers.halluxValgus} onChange={v => set('halluxValgus', v)} cols={3} />
                    </div>
                  </div>
                </div>
              )}

              {/* Q4: 足指グリップ感覚 */}
              {quizStep === 4 && (
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">Q4</p>
                  <h2 className="mb-2 text-xl font-bold">足指で地面を掴める感覚は？</h2>
                  <p className="mb-5 text-sm text-muted-foreground">競技中のグリップ感覚を1〜10で教えてください</p>
                  <SliderInput value={quizAnswers.toeGrip} onChange={v => set('toeGrip', v)} leftLabel="全く感じない" rightLabel="完全に感じる" />
                </div>
              )}

              {/* Q5: グリップ力 + バランス（スライダー2つ） */}
              {quizStep === 5 && (
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">Q5</p>
                  <h2 className="mb-5 text-xl font-bold">パフォーマンスを教えてください</h2>
                  <div className="space-y-6">
                    <div>
                      <p className="mb-3 text-sm font-semibold text-foreground">踏ん張り・グリップ力の自信</p>
                      <SliderInput value={quizAnswers.gripConfidence} onChange={v => set('gripConfidence', v)} leftLabel="全く自信がない" rightLabel="とても自信がある" />
                    </div>
                    <div className="border-t border-border pt-5">
                      <p className="mb-3 text-sm font-semibold text-foreground">バランス感覚</p>
                      <SliderInput value={quizAnswers.balance} onChange={v => set('balance', v)} leftLabel="不安定" rightLabel="とても安定" />
                    </div>
                  </div>
                </div>
              )}

              {/* Q6: 捻挫歴 */}
              {quizStep === 6 && (
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">Q6</p>
                  <h2 className="mb-5 text-xl font-bold">足首の捻挫歴を教えてください</h2>
                  <ChoiceButtons options={['なし', '1回', '2〜3回', '4回以上']} value={quizAnswers.ankleSprain} onChange={v => set('ankleSprain', v)} cols={2} />
                </div>
              )}

              {/* Q7: 現在の痛み（複数選択） */}
              {quizStep === 7 && (
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">Q7（最終問）</p>
                  <h2 className="mb-2 text-xl font-bold">現在、痛みがある部位は？</h2>
                  <p className="mb-5 text-sm text-muted-foreground">複数選択できます</p>
                  <div className="grid grid-cols-3 gap-2">
                    {PAIN_AREAS.map(area => (
                      <button key={area} onClick={() => togglePainArea(area)}
                        className={`rounded-xl border-2 px-3 py-3 text-sm font-semibold transition-all ${
                          quizAnswers.currentPainAreas.includes(area)
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border text-foreground hover:border-primary/40'
                        }`}>
                        {area}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ナビゲーション */}
              <div className="mt-8 flex gap-3">
                {quizStep > 1 && (
                  <button onClick={handleBack} className="rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted">
                    ← 戻る
                  </button>
                )}
                <button onClick={handleNext} disabled={!canProceed()}
                  className="flex-1 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50">
                  {quizStep < TOTAL_STEPS ? '次へ →' : '問診完了 →'}
                </button>
              </div>
            </div>
          )}

          {/* ===== 簡易スコア ===== */}
          {step === 'quiz' && showPrelim && prelimScore !== null && (() => {
            const level = getRiskLevel(prelimScore);
            const style = getRiskStyle(level);
            const circumference = 2 * Math.PI * 44;
            const dashArray = `${(prelimScore / 100) * circumference} ${circumference}`;
            return (
              <div className="space-y-6">
                <div className={`rounded-xl border ${style.border} ${style.bg} p-8 text-center shadow-sm`}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">問診スコア（暫定）</p>
                  <h2 className="mb-6 text-xl font-bold">問診が完了しました！</h2>
                  <div className="relative mx-auto mb-4 flex h-36 w-36 items-center justify-center">
                    <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="44" fill="none" stroke="#E2E8F0" strokeWidth="7" />
                      <circle cx="50" cy="50" r="44" fill="none" stroke={style.color} strokeWidth="7"
                        strokeLinecap="round" strokeDasharray={dashArray}
                        style={{ transition: 'stroke-dasharray 1s ease-in-out' }} />
                    </svg>
                    <div>
                      <span className="text-4xl font-bold text-foreground">{prelimScore}</span>
                      <span className="text-sm text-muted-foreground">/100</span>
                    </div>
                  </div>
                  <div className={`mb-2 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 ${style.border}`}>
                    <span className={`text-sm font-bold ${style.text}`}>{style.label}</span>
                  </div>
                  <p className={`text-sm font-medium ${style.text}`}>{style.desc}</p>
                  <div className="mt-6 rounded-xl border border-border bg-white/70 p-4 text-left">
                    <p className="mb-3 text-xs font-semibold text-muted-foreground">回答サマリー</p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-foreground">
                      <span>🏅 {quizAnswers.sport}</span>
                      <span>🎂 {quizAnswers.age}歳 · {quizAnswers.gender}</span>
                      <span>👣 足指感覚: {quizAnswers.toeGrip}/10</span>
                      <span>💪 グリップ: {quizAnswers.gripConfidence}/10</span>
                      <span>⚖️ バランス: {quizAnswers.balance}/10</span>
                      <span>🩹 捻挫歴: {quizAnswers.ankleSprain}</span>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-white p-6 text-center shadow-sm">
                  <p className="mb-2 text-base font-bold text-foreground">AIとさらに詳しく話しましょう</p>
                  <p className="mb-5 text-sm text-muted-foreground">
                    爪の画像と問診結果をもとに分析します。<br />
                    競技の悩みや体の変化など、自由に話しかけてください。
                  </p>
                  <button onClick={handleStartFreeChat}
                    className="w-full rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white transition-all hover:bg-primary-dark">
                    AIと相談する →
                  </button>
                </div>
              </div>
            );
          })()}

          {/* ===== Free Chat ===== */}
          {step === 'freeChat' && (
            <div className="rounded-xl border border-border bg-white shadow-sm">
              <div className="flex items-center gap-3 border-b border-border px-6 py-4">
                {imagePreview && (
                  <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-border">
                    <Image src={imagePreview} alt="nail" fill className="object-cover" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">爪整体AIアシスタント</p>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <p className="text-xs text-muted-foreground">スポーツ専門 · {quizAnswers.sport}</p>
                  </div>
                </div>
                <div className="rounded-lg bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  問診スコア: {prelimScore}/100
                </div>
              </div>
              <div className="h-[420px] overflow-y-auto px-6 py-4">
                <div className="space-y-4">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {msg.role === 'assistant' && (
                        <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">AI</div>
                      )}
                      <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.role === 'user' ? 'rounded-tr-sm bg-primary text-white' : 'rounded-tl-sm bg-muted text-foreground'
                      }`}>
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">AI</div>
                      <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-3">
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
                          <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:0.15s]" />
                          <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:0.3s]" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              {messages.length >= 2 && (
                <div className="border-t border-border px-4 py-3 text-center">
                  <button onClick={() => handleFinalDiagnosis(messages)} disabled={isLoading}
                    className="rounded-lg bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 disabled:opacity-50">
                    診断結果を見る →
                  </button>
                </div>
              )}
              <div className="border-t border-border px-4 py-4">
                <div className="flex gap-2">
                  <input type="text" value={userInput} onChange={e => setUserInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    placeholder="気になることを自由に入力してください…"
                    disabled={isLoading}
                    className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50" />
                  <button onClick={handleSendMessage} disabled={isLoading || !userInput.trim()}
                    className="flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===== Result ===== */}
          {step === 'result' && diagnosisResult && (() => {
            const level = getRiskLevel(diagnosisResult.health_score);
            const style = getRiskStyle(level);
            const circumference = 2 * Math.PI * 44;
            const dashArray = `${(diagnosisResult.health_score / 100) * circumference} ${circumference}`;
            return (
              <div className="space-y-6">
                <div className={`rounded-xl border ${style.border} ${style.bg} p-8 text-center shadow-sm`}>
                  <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary">{t('result.title')}</p>
                  <div className="relative mx-auto mb-4 flex h-36 w-36 items-center justify-center">
                    <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="44" fill="none" stroke="#E2E8F0" strokeWidth="7" />
                      <circle cx="50" cy="50" r="44" fill="none" stroke={style.color} strokeWidth="7"
                        strokeLinecap="round" strokeDasharray={dashArray}
                        style={{ transition: 'stroke-dasharray 1s ease-in-out' }} />
                    </svg>
                    <div>
                      <span className="text-4xl font-bold text-foreground">{diagnosisResult.health_score}</span>
                      <span className="text-sm text-muted-foreground">/100</span>
                    </div>
                  </div>
                  <div className={`mb-2 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 ${style.border}`}>
                    <span className={`text-sm font-bold ${style.text}`}>{riskLevels[level].label}</span>
                  </div>
                  <p className={`text-sm font-medium ${style.text}`}>{riskLevels[level].desc}</p>
                  {(level === 'poor' || level === 'fair') && (
                    <div className="mt-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-left">
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                      <p className="text-xs text-red-700">{t('result.urgentWarning')}</p>
                    </div>
                  )}
                </div>
                <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
                  <h3 className="mb-4 flex items-center gap-2 text-base font-bold">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-100 text-amber-600">
                      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    </span>{t('result.issues')}
                  </h3>
                  <ul className="space-y-2">{diagnosisResult.detected_issues.map((issue, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm"><span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />{issue}</li>
                  ))}</ul>
                </div>
                <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
                  <h3 className="mb-4 flex items-center gap-2 text-base font-bold">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-100 text-emerald-600">
                      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    </span>{t('result.recommendations')}
                  </h3>
                  <ul className="space-y-2">{diagnosisResult.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm"><span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />{rec}</li>
                  ))}</ul>
                </div>
                <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
                  <h3 className="mb-3 text-base font-bold">{t('result.analysis')}</h3>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{diagnosisResult.analysis}</p>
                </div>
                <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs text-amber-800">{t('result.disclaimer')}</p>
                </div>
                <div className="flex justify-center pb-4">
                  <button onClick={handleReset} className="rounded-xl border border-border px-6 py-3 text-sm font-semibold hover:bg-muted">{t('result.tryAgain')}</button>
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
