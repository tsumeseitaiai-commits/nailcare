'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import ClinicSuggest from '@/components/ClinicSuggest';

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
  nail_score?: number;
  quiz_score?: number;
  heel_score?: number;
  context_score?: number;
  nail_findings?: string[];
  heel_findings?: string[];
  detected_issues: string[];
  recommendations: string[];
  self_care_steps?: string[];
  practitioner_points?: string[];
  analysis: string;
  body_part?: 'nail' | 'heel';
  severity?: 'mild' | 'moderate' | 'severe';
}

interface HeelAnswers {
  heelSeverity: string;
  heelMoisture: string;
  heelFootwear: string;
  heelStanding: string;
}

interface QuizAnswers {
  sport: string;
  age: number | '';
  gender: string;
  height: number | '';
  weight: number | '';
  dominantFoot: string;
  sportsHistory: number | '';
  practiceFrequency: string;
  nailColorChange: boolean;
  nailBrittle: boolean;
  nailPain: boolean;
  nailGrowthChange: boolean;
  archType: string;
  callusLocations: string[];
  nailCareStyle: string;
  nailCareFrequency: string;
  usesInsole: boolean | '';
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
const INITIAL_ANSWERS: QuizAnswers = {
  sport: '', age: '', gender: '',
  height: '', weight: '', dominantFoot: '',
  sportsHistory: '', practiceFrequency: '',
  nailColorChange: false, nailBrittle: false, nailPain: false, nailGrowthChange: false,
  archType: '', callusLocations: [],
  nailCareStyle: '', nailCareFrequency: '', usesInsole: '',
  curvedNail: '', halluxValgus: '',
  toeGrip: 5, gripConfidence: 5, balance: 5,
  ankleSprain: '',
  currentPainAreas: [],
};

const TOTAL_STEPS = 10;
const HEEL_TOTAL_STEPS = 4;

const INITIAL_HEEL_ANSWERS: HeelAnswers = {
  heelSeverity: '',
  heelMoisture: '',
  heelFootwear: '',
  heelStanding: '',
};

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
    excellent: { color: '#10B981', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800' },
    good:      { color: '#F59E0B', bg: 'bg-amber-50',   border: 'border-amber-200',   text: 'text-amber-800' },
    fair:      { color: '#F97316', bg: 'bg-orange-50',  border: 'border-orange-200',  text: 'text-orange-800' },
    poor:      { color: '#EF4444', bg: 'bg-red-50',     border: 'border-red-200',     text: 'text-red-800' },
  }[level];
}

// Uses locale-neutral codes for comparison
function calcPrelimScore(a: QuizAnswers): number {
  let score = 50;
  score += (a.toeGrip - 5) * 3;
  score += (a.gripConfidence - 5) * 2;
  score += (a.balance - 5) * 2;
  if (a.ankleSprain === 'none') score += 5;
  else if (a.ankleSprain === 'once') score += 0;
  else if (a.ankleSprain === '2-3') score -= 5;
  else if (a.ankleSprain === '4plus') score -= 10;
  if (a.curvedNail === 'strong') score -= 8;
  else if (a.curvedNail === 'mild') score -= 3;
  if (a.halluxValgus !== 'none' && a.halluxValgus !== '') score -= 5;
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
  options: { value: string; label: string }[]; value: string; onChange: (v: string) => void; cols?: number;
}) {
  return (
    <div className={`grid gap-2 ${cols === 2 ? 'grid-cols-2' : cols === 3 ? 'grid-cols-3' : 'grid-cols-1'}`}>
      {options.map(opt => (
        <button key={opt.value} onClick={() => onChange(opt.value)}
          className={`rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all ${
            value === opt.value ? 'border-primary bg-primary/5 text-primary' : 'border-border text-foreground hover:border-primary/40'
          }`}>
          {opt.label}
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
  const locale = useLocale();
  const guideItems = t.raw('upload.guide') as string[];
  const riskLevels = t.raw('result.riskLevels') as Record<RiskLevel, { label: string; desc: string }>;

  // Quiz translations
  const qt = t.raw('quiz') as {
    uiSteps: string[];
    progressLabel: string;
    startBtn: string;
    backBtn: string;
    nextBtn: string;
    finishBtn: string;
    q1: { title: string; placeholder: string };
    q2: { title: string; ageLabel: string; ageUnit: string; genderLabel: string };
    q3: { title: string; heightLabel: string; weightLabel: string; dominantFootLabel: string };
    q4: { title: string; historyLabel: string; historyUnit: string; freqLabel: string };
    q5: { title: string; sub: string; colorChange: string; brittle: string; pain: string; growthChange: string };
    q6: { title: string; archLabel: string; callusLabel: string };
    q7: { title: string; styleLabel: string; freqLabel: string; insoleLabel: string };
    q8: { title: string; curvedNailLabel: string; halluxLabel: string };
    q9: { title: string; toeGripLabel: string; toeGripLeft: string; toeGripRight: string; gripConfLabel: string; gripConfLeft: string; gripConfRight: string; balanceLabel: string; balanceLeft: string; balanceRight: string };
    q10: { title: string; finalLabel: string; ankleSprainLabel: string; painAreasLabel: string };
    gender: Record<string, string>;
    dominantFoot: Record<string, string>;
    practiceFreq: Record<string, string>;
    archType: Record<string, string>;
    nailCareStyle: Record<string, string>;
    careFreq: Record<string, string>;
    insole: Record<string, string>;
    curvedNail: Record<string, string>;
    halluxValgus: Record<string, string>;
    ankleSprain: Record<string, string>;
    painAreas: Record<string, string>;
    callusLocs: Record<string, string>;
    sports: Record<string, string>;
    prelim: { badge: string; title: string; summaryLabel: string; ageSep: string; toeGrip: string; grip: string; balance: string; ankleSprain: string; chatTitle: string; chatDesc: string; chatBtn: string };
    chatBar: { specialistLabel: string; quizScore: string; viewResult: string; placeholder: string; initialMessage: string };
    scoreBreakdown: { nail: string; quiz: string; nailDiagnosis: string };
  };

  // Convert translation maps to option arrays
  const toOpts = (map: Record<string, string>) => Object.entries(map).map(([value, label]) => ({ value, label }));
  const SPORTS_LIST = toOpts(qt.sports);
  const PAIN_AREAS = toOpts(qt.painAreas);
  const CALLUS_LOCATIONS = toOpts(qt.callusLocs);

  // Label lookup helpers
  const sportLabel = (v: string) => SPORTS_LIST.find(s => s.value === v)?.label ?? v;
  const ankleSprainLabel = (v: string) => toOpts(qt.ankleSprain).find(o => o.value === v)?.label ?? v;
  const genderLabel = (v: string) => toOpts(qt.gender).find(o => o.value === v)?.label ?? v;

  const [bodyPart, setBodyPart] = useState<'nail' | 'heel' | null>(null);
  const [heelAnswers, setHeelAnswers] = useState<HeelAnswers>(INITIAL_HEEL_ANSWERS);
  const [heelStep, setHeelStep] = useState(1);
  const [practitionerMode, setPractitionerMode] = useState(false);

  const [step, setStep] = useState<'select' | 'upload' | 'quiz' | 'freeChat' | 'result'>('select');
  const [quizStep, setQuizStep] = useState(1);
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
  const isInitialFetchCalled = useRef(false);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const set = <K extends keyof QuizAnswers>(key: K, value: QuizAnswers[K]) =>
    setQuizAnswers(prev => ({ ...prev, [key]: value }));

  const togglePainArea = (area: string) => {
    if (area === 'none') { set('currentPainAreas', ['none']); return; }
    const current = quizAnswers.currentPainAreas.filter(a => a !== 'none');
    const next = current.includes(area) ? current.filter(a => a !== area) : [...current, area];
    set('currentPainAreas', next);
  };

  const toggleCallusLocation = (loc: string) => {
    if (loc === 'none') { set('callusLocations', ['none']); return; }
    const current = quizAnswers.callusLocations.filter(l => l !== 'none');
    const next = current.includes(loc) ? current.filter(l => l !== loc) : [...current, loc];
    set('callusLocations', next);
  };

  // ============================================================
  // バリデーション
  // ============================================================
  const canProceed = (): boolean => {
    if (quizStep === 1) return quizAnswers.sport !== '';
    if (quizStep === 2) return quizAnswers.age !== '' && Number(quizAnswers.age) >= 5 && quizAnswers.gender !== '';
    if (quizStep === 3) return quizAnswers.height !== '' && quizAnswers.weight !== '' && quizAnswers.dominantFoot !== '';
    if (quizStep === 4) return quizAnswers.sportsHistory !== '' && quizAnswers.practiceFrequency !== '';
    if (quizStep === 6) return quizAnswers.archType !== '';
    if (quizStep === 7) return quizAnswers.nailCareStyle !== '' && quizAnswers.nailCareFrequency !== '' && quizAnswers.usesInsole !== '';
    if (quizStep === 8) return quizAnswers.curvedNail !== '' && quizAnswers.halluxValgus !== '';
    if (quizStep === 10) return quizAnswers.ankleSprain !== '';
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
    isInitialFetchCalled.current = false;
    fetchInitialFreeMessage();
  };

  const fetchInitialFreeMessage = async () => {
    if (isInitialFetchCalled.current) return;
    isInitialFetchCalled.current = true;
    setIsLoading(true);
    try {
      const res = await fetch('/api/chat-diagnosis', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: qt.chatBar.initialMessage }], image, quizAnswers: bodyPart === 'heel' ? heelAnswers : quizAnswers, isInitial: true, locale, bodyPart }),
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
        body: JSON.stringify({ messages: updated, image, quizAnswers: bodyPart === 'heel' ? heelAnswers : quizAnswers, locale, bodyPart }),
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
        body: JSON.stringify({ messages: msgs, image, quizAnswers: bodyPart === 'heel' ? heelAnswers : quizAnswers, locale, bodyPart }),
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
    setStep('select'); setBodyPart(null);
    setQuizStep(1); setQuizAnswers(INITIAL_ANSWERS);
    setHeelStep(1); setHeelAnswers(INITIAL_HEEL_ANSWERS);
    setPrelimScore(null); setShowPrelim(false);
    setImage(null); setImagePreview(null); setMessages([]);
    setDiagnosisResult(null); setUserInput(''); setUserConsent(false);
    setPractitionerMode(false);
  };

  const uiStepLabels = qt.uiSteps;
  const currentUiStepIndex = ['select', 'upload', 'quiz', 'freeChat', 'result'].indexOf(step) - 1;

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

          {/* ===== 部位選択 ===== */}
          {step === 'select' && (
            <div className="rounded-xl border border-border bg-white p-8 shadow-sm">
              <div className="mb-6 text-center">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">STEP 1</p>
                <h2 className="text-2xl font-bold text-foreground">どこを診断しますか？</h2>
                <p className="mt-2 text-sm text-muted-foreground">写真をアップロードして、AIが詳しく診断します</p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* 爪カード */}
                <button
                  onClick={() => { setBodyPart('nail'); setStep('upload'); }}
                  className="group flex flex-col items-center gap-4 rounded-2xl border-2 border-border p-8 text-center transition-all hover:border-primary hover:bg-primary/5 hover:shadow-md"
                >
                  <span className="text-5xl">💅</span>
                  <div>
                    <p className="text-lg font-bold text-foreground group-hover:text-primary">爪を診断する</p>
                    <p className="mt-1 text-xs text-muted-foreground">爪の形・色・状態をAIが分析<br />スポーツパフォーマンスとの関係も診断</p>
                  </div>
                </button>
                {/* かかとカード */}
                <button
                  onClick={() => { setBodyPart('heel'); setStep('upload'); }}
                  className="group flex flex-col items-center gap-4 rounded-2xl border-2 border-border p-8 text-center transition-all hover:border-primary hover:bg-primary/5 hover:shadow-md"
                >
                  <span className="text-5xl">🦶</span>
                  <div>
                    <p className="text-lg font-bold text-foreground group-hover:text-primary">かかとを診断する</p>
                    <p className="mt-1 text-xs text-muted-foreground">かかとの角質・ひび割れをAIが分析<br />セルフケア手順と施術ポイントをご提案</p>
                  </div>
                </button>
              </div>
            </div>
          )}

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
                  onClick={() => { if (!image || !userConsent) return; setStep('quiz'); setQuizStep(1); setHeelStep(1); }}
                  disabled={!userConsent}
                  className="mt-4 w-full rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {qt.startBtn.replace('{total}', String(TOTAL_STEPS))}
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

          {/* ===== かかとQuiz ===== */}
          {step === 'quiz' && bodyPart === 'heel' && (() => {
            const heelCanProceed = () => {
              if (heelStep === 1) return heelAnswers.heelSeverity !== '';
              if (heelStep === 2) return heelAnswers.heelMoisture !== '';
              if (heelStep === 3) return heelAnswers.heelFootwear !== '';
              if (heelStep === 4) return heelAnswers.heelStanding !== '';
              return true;
            };
            const heelNext = () => {
              if (heelStep < HEEL_TOTAL_STEPS) { setHeelStep(heelStep + 1); }
              else { handleStartFreeChat(); }
            };
            const heelBack = () => {
              if (heelStep > 1) setHeelStep(heelStep - 1);
              else setStep('upload');
            };

            const severityOpts = [
              { value: 'mild', label: '気にならない' },
              { value: 'moderate', label: '少し気になる' },
              { value: 'severe', label: 'ひどい' },
            ];
            const moistureOpts = [
              { value: 'daily', label: '毎日' },
              { value: 'weekly', label: '週几回' },
              { value: 'rarely', label: 'ほぼしない' },
            ];
            const footwearOpts = [
              { value: 'heels', label: 'ヒール' },
              { value: 'flats', label: 'フラット' },
              { value: 'sneakers', label: 'スニーカー' },
              { value: 'barefoot', label: '裸足が多い' },
            ];
            const standingOpts = [
              { value: 'under2', label: '2時間未満' },
              { value: '2to5', label: '2〜5時間' },
              { value: 'over5', label: '5時間以上' },
            ];

            return (
              <div className="rounded-xl border border-border bg-white p-8 shadow-sm">
                {/* 進捗バー */}
                <div className="mb-6">
                  <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
                    <span>質問 {heelStep} / {HEEL_TOTAL_STEPS}</span>
                    <span>{Math.round((heelStep / HEEL_TOTAL_STEPS) * 100)}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${(heelStep / HEEL_TOTAL_STEPS) * 100}%` }} />
                  </div>
                </div>

                {/* Q1 */}
                {heelStep === 1 && (
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">Q1</p>
                    <h2 className="mb-5 text-xl font-bold">かかとのひび割れ・硬さはどの程度ですか？</h2>
                    <ChoiceButtons options={severityOpts} value={heelAnswers.heelSeverity}
                      onChange={v => setHeelAnswers(prev => ({ ...prev, heelSeverity: v }))} cols={3} />
                  </div>
                )}

                {/* Q2 */}
                {heelStep === 2 && (
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">Q2</p>
                    <h2 className="mb-5 text-xl font-bold">保湿ケアの頻度は？</h2>
                    <ChoiceButtons options={moistureOpts} value={heelAnswers.heelMoisture}
                      onChange={v => setHeelAnswers(prev => ({ ...prev, heelMoisture: v }))} cols={3} />
                  </div>
                )}

                {/* Q3 */}
                {heelStep === 3 && (
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">Q3</p>
                    <h2 className="mb-5 text-xl font-bold">よく履く靴の種類は？</h2>
                    <ChoiceButtons options={footwearOpts} value={heelAnswers.heelFootwear}
                      onChange={v => setHeelAnswers(prev => ({ ...prev, heelFootwear: v }))} cols={2} />
                  </div>
                )}

                {/* Q4 */}
                {heelStep === 4 && (
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">Q4</p>
                    <h2 className="mb-5 text-xl font-bold">1日の立ち仕事の時間は？</h2>
                    <ChoiceButtons options={standingOpts} value={heelAnswers.heelStanding}
                      onChange={v => setHeelAnswers(prev => ({ ...prev, heelStanding: v }))} cols={3} />
                  </div>
                )}

                {/* ナビゲーション */}
                <div className="mt-8 flex gap-3">
                  <button onClick={heelBack} className="rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted">
                    {qt.backBtn}
                  </button>
                  <button onClick={heelNext} disabled={!heelCanProceed()}
                    className="flex-1 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50">
                    {heelStep < HEEL_TOTAL_STEPS ? qt.nextBtn : 'チャットへ進む'}
                  </button>
                </div>
              </div>
            );
          })()}

          {/* ===== 爪Quiz ===== */}
          {step === 'quiz' && bodyPart === 'nail' && !showPrelim && (
            <div className="rounded-xl border border-border bg-white p-8 shadow-sm">
              {/* 進捗バー */}
              <div className="mb-6">
                <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{qt.progressLabel} {quizStep} / {TOTAL_STEPS}</span>
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
                  <h2 className="mb-5 text-xl font-bold">{qt.q1.title}</h2>
                  <select value={quizAnswers.sport} onChange={e => set('sport', e.target.value)}
                    className="w-full rounded-lg border border-border px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="">{qt.q1.placeholder}</option>
                    {SPORTS_LIST.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
              )}

              {/* Q2: 年齢 + 性別 */}
              {quizStep === 2 && (
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">Q2</p>
                  <h2 className="mb-5 text-xl font-bold">{qt.q2.title}</h2>
                  <div className="space-y-5">
                    <div>
                      <p className="mb-2 text-sm font-semibold text-foreground">{qt.q2.ageLabel}</p>
                      <div className="flex items-center gap-3">
                        <input type="number" min={5} max={100} value={quizAnswers.age} autoFocus
                          onChange={e => set('age', e.target.value === '' ? '' : Number(e.target.value))}
                          onKeyDown={e => e.key === 'Enter' && canProceed() && handleNext()}
                          placeholder="25"
                          className="w-32 rounded-lg border-2 border-border px-4 py-3 text-center text-2xl font-bold focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                        <span className="text-base text-muted-foreground">{qt.q2.ageUnit}</span>
                      </div>
                    </div>
                    <div>
                      <p className="mb-2 text-sm font-semibold text-foreground">{qt.q2.genderLabel}</p>
                      <ChoiceButtons options={toOpts(qt.gender)} value={quizAnswers.gender} onChange={v => set('gender', v)} cols={3} />
                    </div>
                  </div>
                </div>
              )}

              {/* Q3: 身長・体重・利き足 */}
              {quizStep === 3 && (
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">Q3</p>
                  <h2 className="mb-5 text-xl font-bold">{qt.q3.title}</h2>
                  <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="mb-2 text-sm font-semibold text-foreground">{qt.q3.heightLabel}</p>
                        <div className="flex items-center gap-2">
                          <input type="number" min={100} max={250} value={quizAnswers.height}
                            onChange={e => set('height', e.target.value === '' ? '' : Number(e.target.value))}
                            placeholder="170"
                            className="w-full rounded-lg border-2 border-border px-3 py-3 text-center text-xl font-bold focus:border-primary focus:outline-none" />
                          <span className="text-sm text-muted-foreground shrink-0">cm</span>
                        </div>
                      </div>
                      <div>
                        <p className="mb-2 text-sm font-semibold text-foreground">{qt.q3.weightLabel}</p>
                        <div className="flex items-center gap-2">
                          <input type="number" min={20} max={200} value={quizAnswers.weight}
                            onChange={e => set('weight', e.target.value === '' ? '' : Number(e.target.value))}
                            placeholder="65"
                            className="w-full rounded-lg border-2 border-border px-3 py-3 text-center text-xl font-bold focus:border-primary focus:outline-none" />
                          <span className="text-sm text-muted-foreground shrink-0">kg</span>
                        </div>
                      </div>
                    </div>
                    {quizAnswers.height && quizAnswers.weight && (
                      <p className="text-center text-sm text-muted-foreground">
                        BMI: <span className="font-bold text-foreground">{(Number(quizAnswers.weight) / Math.pow(Number(quizAnswers.height) / 100, 2)).toFixed(1)}</span>
                      </p>
                    )}
                    <div>
                      <p className="mb-2 text-sm font-semibold text-foreground">{qt.q3.dominantFootLabel}</p>
                      <ChoiceButtons options={toOpts(qt.dominantFoot)} value={quizAnswers.dominantFoot} onChange={v => set('dominantFoot', v)} cols={3} />
                    </div>
                  </div>
                </div>
              )}

              {/* Q4: 競技歴・練習頻度 */}
              {quizStep === 4 && (
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">Q4</p>
                  <h2 className="mb-5 text-xl font-bold">{qt.q4.title}</h2>
                  <div className="space-y-5">
                    <div>
                      <p className="mb-2 text-sm font-semibold text-foreground">{qt.q4.historyLabel}</p>
                      <div className="flex items-center gap-3">
                        <input type="number" min={0} max={50} value={quizAnswers.sportsHistory}
                          onChange={e => set('sportsHistory', e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder="5"
                          className="w-28 rounded-lg border-2 border-border px-4 py-3 text-center text-2xl font-bold focus:border-primary focus:outline-none" />
                        <span className="text-base text-muted-foreground">{qt.q4.historyUnit}</span>
                      </div>
                    </div>
                    <div>
                      <p className="mb-2 text-sm font-semibold text-foreground">{qt.q4.freqLabel}</p>
                      <ChoiceButtons options={toOpts(qt.practiceFreq)} value={quizAnswers.practiceFrequency} onChange={v => set('practiceFrequency', v)} cols={2} />
                    </div>
                  </div>
                </div>
              )}

              {/* Q5: 爪の自覚症状 */}
              {quizStep === 5 && (
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">Q5</p>
                  <h2 className="mb-2 text-xl font-bold">{qt.q5.title}</h2>
                  <p className="mb-5 text-sm text-muted-foreground">{qt.q5.sub}</p>
                  <div className="space-y-3">
                    {([
                      { key: 'nailColorChange', label: qt.q5.colorChange, icon: '🎨' },
                      { key: 'nailBrittle',     label: qt.q5.brittle,     icon: '💔' },
                      { key: 'nailPain',        label: qt.q5.pain,        icon: '😣' },
                      { key: 'nailGrowthChange',label: qt.q5.growthChange,icon: '📏' },
                    ] as { key: keyof QuizAnswers; label: string; icon: string }[]).map(({ key, label, icon }) => (
                      <button key={key}
                        onClick={() => set(key, !quizAnswers[key] as QuizAnswers[typeof key])}
                        className={`flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm font-semibold transition-all ${
                          quizAnswers[key] ? 'border-primary bg-primary/5 text-primary' : 'border-border text-foreground hover:border-primary/40'
                        }`}>
                        <span className="text-xl">{icon}</span>{label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Q6: 足の形態 */}
              {quizStep === 6 && (
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">Q6</p>
                  <h2 className="mb-5 text-xl font-bold">{qt.q6.title}</h2>
                  <div className="space-y-5">
                    <div>
                      <p className="mb-2 text-sm font-semibold text-foreground">{qt.q6.archLabel}</p>
                      <ChoiceButtons options={toOpts(qt.archType)} value={quizAnswers.archType} onChange={v => set('archType', v)} cols={2} />
                    </div>
                    <div>
                      <p className="mb-2 text-sm font-semibold text-foreground">{qt.q6.callusLabel}</p>
                      <div className="grid grid-cols-2 gap-2">
                        {CALLUS_LOCATIONS.map(loc => (
                          <button key={loc.value} onClick={() => toggleCallusLocation(loc.value)}
                            className={`rounded-xl border-2 px-3 py-3 text-sm font-semibold transition-all ${
                              quizAnswers.callusLocations.includes(loc.value)
                                ? 'border-primary bg-primary/5 text-primary'
                                : 'border-border text-foreground hover:border-primary/40'
                            }`}>{loc.label}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Q7: 爪ケア習慣 */}
              {quizStep === 7 && (
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">Q7</p>
                  <h2 className="mb-5 text-xl font-bold">{qt.q7.title}</h2>
                  <div className="space-y-5">
                    <div>
                      <p className="mb-2 text-sm font-semibold text-foreground">{qt.q7.styleLabel}</p>
                      <ChoiceButtons options={toOpts(qt.nailCareStyle)} value={quizAnswers.nailCareStyle} onChange={v => set('nailCareStyle', v)} cols={2} />
                    </div>
                    <div>
                      <p className="mb-2 text-sm font-semibold text-foreground">{qt.q7.freqLabel}</p>
                      <ChoiceButtons options={toOpts(qt.careFreq)} value={quizAnswers.nailCareFrequency} onChange={v => set('nailCareFrequency', v)} cols={2} />
                    </div>
                    <div>
                      <p className="mb-2 text-sm font-semibold text-foreground">{qt.q7.insoleLabel}</p>
                      <ChoiceButtons
                        options={toOpts(qt.insole)}
                        value={quizAnswers.usesInsole === '' ? '' : quizAnswers.usesInsole ? 'yes' : 'no'}
                        onChange={v => set('usesInsole', v === 'yes')}
                        cols={2} />
                    </div>
                  </div>
                </div>
              )}

              {/* Q8: 巻き爪 + 外反母趾 */}
              {quizStep === 8 && (
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">Q8</p>
                  <h2 className="mb-5 text-xl font-bold">{qt.q8.title}</h2>
                  <div className="space-y-5">
                    <div>
                      <p className="mb-2 text-sm font-semibold text-foreground">{qt.q8.curvedNailLabel}</p>
                      <ChoiceButtons options={toOpts(qt.curvedNail)} value={quizAnswers.curvedNail} onChange={v => set('curvedNail', v)} cols={3} />
                    </div>
                    <div>
                      <p className="mb-2 text-sm font-semibold text-foreground">{qt.q8.halluxLabel}</p>
                      <ChoiceButtons options={toOpts(qt.halluxValgus)} value={quizAnswers.halluxValgus} onChange={v => set('halluxValgus', v)} cols={3} />
                    </div>
                  </div>
                </div>
              )}

              {/* Q9: 機能スコア */}
              {quizStep === 9 && (
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">Q9</p>
                  <h2 className="mb-5 text-xl font-bold">{qt.q9.title}</h2>
                  <div className="space-y-6">
                    <div>
                      <p className="mb-3 text-sm font-semibold text-foreground">{qt.q9.toeGripLabel}</p>
                      <SliderInput value={quizAnswers.toeGrip} onChange={v => set('toeGrip', v)} leftLabel={qt.q9.toeGripLeft} rightLabel={qt.q9.toeGripRight} />
                    </div>
                    <div className="border-t border-border pt-5">
                      <p className="mb-3 text-sm font-semibold text-foreground">{qt.q9.gripConfLabel}</p>
                      <SliderInput value={quizAnswers.gripConfidence} onChange={v => set('gripConfidence', v)} leftLabel={qt.q9.gripConfLeft} rightLabel={qt.q9.gripConfRight} />
                    </div>
                    <div className="border-t border-border pt-5">
                      <p className="mb-3 text-sm font-semibold text-foreground">{qt.q9.balanceLabel}</p>
                      <SliderInput value={quizAnswers.balance} onChange={v => set('balance', v)} leftLabel={qt.q9.balanceLeft} rightLabel={qt.q9.balanceRight} />
                    </div>
                  </div>
                </div>
              )}

              {/* Q10: 捻挫歴 + 現在の痛み */}
              {quizStep === 10 && (
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">{qt.q10.finalLabel}</p>
                  <h2 className="mb-5 text-xl font-bold">{qt.q10.title}</h2>
                  <div className="space-y-5">
                    <div>
                      <p className="mb-2 text-sm font-semibold text-foreground">{qt.q10.ankleSprainLabel}</p>
                      <ChoiceButtons options={toOpts(qt.ankleSprain)} value={quizAnswers.ankleSprain} onChange={v => set('ankleSprain', v)} cols={2} />
                    </div>
                    <div>
                      <p className="mb-2 text-sm font-semibold text-foreground">{qt.q10.painAreasLabel}</p>
                      <div className="grid grid-cols-3 gap-2">
                        {PAIN_AREAS.map(area => (
                          <button key={area.value} onClick={() => togglePainArea(area.value)}
                            className={`rounded-xl border-2 px-3 py-3 text-sm font-semibold transition-all ${
                              quizAnswers.currentPainAreas.includes(area.value)
                                ? 'border-primary bg-primary/5 text-primary'
                                : 'border-border text-foreground hover:border-primary/40'
                            }`}>
                            {area.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ナビゲーション */}
              <div className="mt-8 flex gap-3">
                {quizStep > 1 && (
                  <button onClick={handleBack} className="rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted">
                    {qt.backBtn}
                  </button>
                )}
                <button onClick={handleNext} disabled={!canProceed()}
                  className="flex-1 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50">
                  {quizStep < TOTAL_STEPS ? qt.nextBtn : qt.finishBtn}
                </button>
              </div>
            </div>
          )}

          {/* ===== 簡易スコア（爪）===== */}
          {step === 'quiz' && bodyPart === 'nail' && showPrelim && prelimScore !== null && (() => {
            const level = getRiskLevel(prelimScore);
            const style = getRiskStyle(level);
            const circumference = 2 * Math.PI * 44;
            const dashArray = `${(prelimScore / 100) * circumference} ${circumference}`;
            return (
              <div className="space-y-6">
                <div className={`rounded-xl border ${style.border} ${style.bg} p-8 text-center shadow-sm`}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">{qt.prelim.badge}</p>
                  <h2 className="mb-6 text-xl font-bold">{qt.prelim.title}</h2>
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
                    <span className={`text-sm font-bold ${style.text}`}>{riskLevels[level].label}</span>
                  </div>
                  <p className={`text-sm font-medium ${style.text}`}>{riskLevels[level].desc}</p>
                  <div className="mt-6 rounded-xl border border-border bg-white/70 p-4 text-left">
                    <p className="mb-3 text-xs font-semibold text-muted-foreground">{qt.prelim.summaryLabel}</p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-foreground">
                      <span>🏅 {sportLabel(quizAnswers.sport)}</span>
                      <span>🎂 {quizAnswers.age}{qt.prelim.ageSep} {genderLabel(quizAnswers.gender)}</span>
                      <span>{qt.prelim.toeGrip} {quizAnswers.toeGrip}/10</span>
                      <span>{qt.prelim.grip} {quizAnswers.gripConfidence}/10</span>
                      <span>{qt.prelim.balance} {quizAnswers.balance}/10</span>
                      <span>{qt.prelim.ankleSprain} {ankleSprainLabel(quizAnswers.ankleSprain)}</span>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-white p-6 text-center shadow-sm">
                  <p className="mb-2 text-base font-bold text-foreground">{qt.prelim.chatTitle}</p>
                  <p className="mb-5 text-sm text-muted-foreground" style={{ whiteSpace: 'pre-line' }}>
                    {qt.prelim.chatDesc}
                  </p>
                  <button onClick={handleStartFreeChat}
                    className="w-full rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white transition-all hover:bg-primary-dark">
                    {qt.prelim.chatBtn}
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
                  <p className="text-sm font-semibold text-foreground">{t('chat.aiAssistant')}</p>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <p className="text-xs text-muted-foreground">{qt.chatBar.specialistLabel} {sportLabel(quizAnswers.sport)}</p>
                  </div>
                </div>
                <div className="rounded-lg bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {qt.chatBar.quizScore} {prelimScore}/100
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
                    {qt.chatBar.viewResult}
                  </button>
                </div>
              )}
              <div className="border-t border-border px-4 py-4">
                <div className="flex gap-2">
                  <input type="text" value={userInput} onChange={e => setUserInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    placeholder={qt.chatBar.placeholder}
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

                  {/* スコア内訳 */}
                  {(diagnosisResult.nail_score !== undefined && diagnosisResult.quiz_score !== undefined) && (
                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-border bg-white/80 p-3 text-center">
                        <p className="text-xs text-muted-foreground mb-1">{qt.scoreBreakdown.nail}</p>
                        <p className="text-2xl font-bold text-foreground">{diagnosisResult.nail_score}</p>
                        <p className="text-xs text-muted-foreground">× 60%</p>
                      </div>
                      <div className="rounded-xl border border-border bg-white/80 p-3 text-center">
                        <p className="text-xs text-muted-foreground mb-1">{qt.scoreBreakdown.quiz}</p>
                        <p className="text-2xl font-bold text-foreground">{diagnosisResult.quiz_score}</p>
                        <p className="text-xs text-muted-foreground">× 40%</p>
                      </div>
                    </div>
                  )}

                  {(level === 'poor' || level === 'fair') && (
                    <div className="mt-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-left">
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                      <p className="text-xs text-red-700">{t('result.urgentWarning')}</p>
                    </div>
                  )}
                </div>

                {/* かかと所見 */}
                {diagnosisResult.body_part === 'heel' && diagnosisResult.heel_findings && diagnosisResult.heel_findings.length > 0 && (
                  <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
                    <h3 className="mb-4 flex items-center gap-2 text-base font-bold">
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-orange-100 text-orange-600">🦶</span>
                      かかとの状態
                    </h3>
                    <ul className="space-y-2">{diagnosisResult.heel_findings.map((f, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm"><span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />{f}</li>
                    ))}</ul>
                  </div>
                )}

                {/* セルフケア手順（かかと） */}
                {diagnosisResult.body_part === 'heel' && diagnosisResult.self_care_steps && diagnosisResult.self_care_steps.length > 0 && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
                    <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-emerald-800">
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-200 text-emerald-700">🏠</span>
                      セルフケア手順
                    </h3>
                    <ol className="space-y-3">{diagnosisResult.self_care_steps.map((s, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">{i + 1}</span>
                        <span className="leading-relaxed text-emerald-900">{s}</span>
                      </li>
                    ))}</ol>
                  </div>
                )}

                {/* 整体師モードボタン */}
                <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
                  <button
                    onClick={() => setPractitionerMode(prev => !prev)}
                    className={`w-full rounded-lg px-4 py-2.5 text-sm font-bold transition-all ${
                      practitionerMode
                        ? 'bg-indigo-600 text-white'
                        : 'border border-indigo-300 bg-white text-indigo-700 hover:bg-indigo-100'
                    }`}
                  >
                    {practitionerMode ? '✅ 整体師モード ON' : '🔧 整体師モードをONにする'}
                  </button>
                  {practitionerMode && diagnosisResult.practitioner_points && diagnosisResult.practitioner_points.length > 0 && (
                    <div className="mt-4">
                      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-indigo-700">施術者向け情報</p>
                      <div className="space-y-2">
                        {diagnosisResult.practitioner_points.map((p, i) => (
                          <div key={i} className="flex items-start gap-2 rounded-lg border border-indigo-200 bg-white p-3 text-sm text-indigo-900">
                            <span className="text-lg">📌</span>{p}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 爪の観察結果 */}
                {diagnosisResult.nail_findings && diagnosisResult.nail_findings.length > 0 && (
                  <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
                    <h3 className="mb-4 flex items-center gap-2 text-base font-bold">
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-pink-100 text-pink-600">
                        💅
                      </span>{qt.scoreBreakdown.nailDiagnosis}
                    </h3>
                    <ul className="space-y-2">{diagnosisResult.nail_findings.map((f, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm"><span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-pink-400" />{f}</li>
                    ))}</ul>
                  </div>
                )}

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
                {/* 登録店舗サジェスト */}
                <ClinicSuggest bodyPart={bodyPart} />

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
