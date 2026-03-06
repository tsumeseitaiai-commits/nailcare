'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import ClinicSuggest from '@/components/ClinicSuggest';
import { createClient } from '@/lib/supabaseClient';

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
  body_part?: 'nail' | 'sole';
  severity?: 'mild' | 'moderate' | 'severe';
}

interface HeelAnswers {
  heelSeverity: string;
  heelMoisture: string;
  heelFootwear: string;
  heelStanding: string;
}

interface ResearchImage {
  type: 'hand_nail' | 'foot_nail' | 'sole';
  dataUrl: string;
  b64: string;
}

interface ResearchAnswers {
  age: number | '';
  gender: string;
  height: number | '';
  weight: number | '';
  country: string;
  sport: string;
  position: string;
  dominant_hand: string;
  dominant_foot: string;
  sports_history: number | '';
  weekly_sessions: string;
  session_duration: string;
  monthly_matches: number | '';
  training_intensity: number;
  weekly_rest_days: number | '';
  fatigue_level: number;
  sleep_hours: number | '';
  sleep_quality: number;
  stress_level: number;
  body_pain: string;
  nail_cut_frequency: string;
  days_before_match: string;
  deep_nail_habit: string;
  toe_grip_sense: number;
  hallux_valgus: string;
  toe_pain: number;
  injury_count_year: number | '';
  major_injury_site: string;
  recovery_period: string;
  injury_recurrence: string;
  images: ResearchImage[];
  consent: boolean;
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

const TOTAL_STEPS = 5;
const HEEL_TOTAL_STEPS = 4;
const RESEARCH_TOTAL_STEPS = 8;

const INITIAL_RESEARCH: ResearchAnswers = {
  age: '', gender: '', height: '', weight: '', country: '', sport: '',
  position: '', dominant_hand: '', dominant_foot: '', sports_history: '',
  weekly_sessions: '', session_duration: '', monthly_matches: '', training_intensity: 5,
  weekly_rest_days: '',
  fatigue_level: 5, sleep_hours: '', sleep_quality: 5, stress_level: 5, body_pain: '',
  nail_cut_frequency: '', days_before_match: '', deep_nail_habit: '',
  toe_grip_sense: 5, hallux_valgus: '', toe_pain: 3,
  injury_count_year: '', major_injury_site: '', recovery_period: '', injury_recurrence: '',
  images: [], consent: false,
};

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
  else if (a.ankleSprain === '2-3' || a.ankleSprain === '2plus') score -= 5;
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
// DiagnosisLoadingScreen
// ============================================================
function DiagnosisLoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => Math.min(p + 0.008, 0.97));
    }, 80);
    return () => clearInterval(interval);
  }, []);

  const scanLogs = [
    '画像データを受信中...',
    '爪の形状を解析中...',
    '色素パターンを検出中...',
    '健康データと照合中...',
    'リスクファクターを評価中...',
    'データベースと照合中...',
    '診断モデルを実行中...',
    '結果を生成中...',
  ];

  const pct = Math.round(progress * 100);
  const activeLogCount = Math.min(Math.floor(progress / 0.125) + 1, scanLogs.length);
  const visibleLogs = scanLogs.slice(0, activeLogCount);

  // Circular progress ring
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${progress * circumference} ${circumference}`;

  // Radar chart (6 axes)
  const radarSize = 120;
  const center = radarSize / 2;
  const axes = 6;
  const maxR = center - 10;
  const radarValues = [0.85, 0.72, 0.90, 0.65, 0.78, 0.88];

  const radarPoints = Array.from({ length: axes }, (_, i) => {
    const angle = (i * 2 * Math.PI) / axes - Math.PI / 2;
    const r = maxR * radarValues[i] * progress;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  });
  const radarPath = radarPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  const radarGrids = [0.33, 0.67, 1.0].map(scale => {
    const pts = Array.from({ length: axes }, (_, i) => {
      const angle = (i * 2 * Math.PI) / axes - Math.PI / 2;
      return { x: center + maxR * scale * Math.cos(angle), y: center + maxR * scale * Math.sin(angle) };
    });
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
  });

  const axisLines = Array.from({ length: axes }, (_, i) => {
    const angle = (i * 2 * Math.PI) / axes - Math.PI / 2;
    return { x: center + maxR * Math.cos(angle), y: center + maxR * Math.sin(angle) };
  });

  const cornerStyles = [
    { top: 0, left: 0, borderTop: '2px solid #00e5ff', borderLeft: '2px solid #00e5ff' },
    { top: 0, right: 0, borderTop: '2px solid #00e5ff', borderRight: '2px solid #00e5ff' },
    { bottom: 0, left: 0, borderBottom: '2px solid #00e5ff', borderLeft: '2px solid #00e5ff' },
    { bottom: 0, right: 0, borderBottom: '2px solid #00e5ff', borderRight: '2px solid #00e5ff' },
  ] as const;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: '#020b14', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Courier New', monospace" }}>
      <style>{`
        @keyframes glitch-main {
          0%, 85%, 100% { transform: translate(0, 0); }
          88% { transform: translate(-3px, 1px); }
          91% { transform: translate(3px, -1px); }
          94% { transform: translate(-2px, 2px); }
          97% { transform: translate(2px, -2px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes pulse-cyan {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        @keyframes scan-line {
          0% { top: 0; }
          100% { top: 100%; }
        }
      `}</style>

      {/* Hex grid overlay */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04 }}>
        <defs>
          <pattern id="diag-hex" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
            <polygon points="30,2 58,17 58,35 30,50 2,35 2,17" fill="none" stroke="#00e5ff" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#diag-hex)" />
      </svg>

      {/* Scan line */}
      <div style={{ position: 'absolute', left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, #00e5ff, transparent)', opacity: 0.3, animation: 'scan-line 3s linear infinite' }} />

      {/* Main card */}
      <div style={{ position: 'relative', width: '100%', maxWidth: '480px', padding: '0 16px' }}>
        {/* Corner accents */}
        {cornerStyles.map((s, i) => (
          <div key={i} style={{ position: 'absolute', width: '20px', height: '20px', ...s }} />
        ))}

        <div style={{ padding: '32px', background: 'rgba(0,10,20,0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(0,229,255,0.15)' }}>
          {/* Title with glitch */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h2 style={{ color: '#00e5ff', fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', animation: 'glitch-main 3s ease-in-out infinite', display: 'inline-block', marginBottom: '4px', margin: '0 0 4px' }}>
              AI NAIL DIAGNOSIS
            </h2>
            <p style={{ color: 'rgba(0,229,255,0.5)', fontSize: '10px', letterSpacing: '2px', margin: 0 }}>SYSTEM ANALYSIS IN PROGRESS</p>
          </div>

          {/* Progress ring + Radar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px', marginBottom: '28px' }}>
            {/* Circular progress */}
            <div style={{ position: 'relative', width: '110px', height: '110px', flexShrink: 0 }}>
              <svg width="110" height="110" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="55" cy="55" r={radius} fill="none" stroke="rgba(0,229,255,0.1)" strokeWidth="6" />
                <circle cx="55" cy="55" r={radius} fill="none" stroke="#00e5ff" strokeWidth="6"
                  strokeDasharray={strokeDasharray} strokeLinecap="round"
                  style={{ filter: 'drop-shadow(0 0 6px #00e5ff)', transition: 'stroke-dasharray 0.1s linear' }} />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#00e5ff', fontSize: '26px', fontWeight: 700, lineHeight: 1, animation: 'pulse-cyan 2s ease-in-out infinite' }}>{pct}</span>
                <span style={{ color: 'rgba(0,229,255,0.6)', fontSize: '10px', letterSpacing: '1px' }}>%</span>
              </div>
            </div>

            {/* Radar chart */}
            <svg width={radarSize} height={radarSize}>
              {radarGrids.map((d, i) => (
                <path key={i} d={d} fill="none" stroke="rgba(0,229,255,0.15)" strokeWidth="0.5" />
              ))}
              {axisLines.map((pt, i) => (
                <line key={i} x1={center} y1={center} x2={pt.x} y2={pt.y} stroke="rgba(0,229,255,0.2)" strokeWidth="0.5" />
              ))}
              <path d={radarPath} fill="rgba(0,229,255,0.15)" stroke="#00e5ff" strokeWidth="1.5" style={{ filter: 'drop-shadow(0 0 4px #00e5ff)' }} />
            </svg>
          </div>

          {/* Progress bar */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ height: '3px', background: 'rgba(0,229,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${pct}%`, borderRadius: '2px',
                background: 'linear-gradient(90deg, #00e5ff 0%, rgba(0,229,255,0.6) 50%, #00e5ff 100%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s ease-in-out infinite',
                transition: 'width 0.1s linear',
                boxShadow: '0 0 8px #00e5ff',
              }} />
            </div>
          </div>

          {/* Scan logs */}
          <div style={{ background: 'rgba(0,229,255,0.03)', border: '1px solid rgba(0,229,255,0.1)', padding: '12px', height: '120px', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '4px' }}>
            {visibleLogs.map((log, i) => {
              const isLatest = i === visibleLogs.length - 1;
              const age = visibleLogs.length - 1 - i;
              const opacity = isLatest ? 1 : Math.max(0.15, 1 - age * 0.2);
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: isLatest ? '#00e5ff' : 'rgba(0,229,255,0.4)', fontSize: '10px', flexShrink: 0 }}>{isLatest ? '▶' : '✓'}</span>
                  <span style={{ color: isLatest ? '#00e5ff' : `rgba(224,247,250,${opacity})`, fontSize: '11px', letterSpacing: '0.5px', animation: isLatest ? 'pulse-cyan 1.5s ease-in-out infinite' : 'none' }}>{log}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
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
    noAnswer: string;
    simpQuiz: { q2Title: string; q3Title: string; q3Left: string; q3Right: string; q4Title: string; q5Title: string };
    heel: {
      progressLabel: string; toChat: string;
      q1: { title: string; mild: string; moderate: string; severe: string };
      q2: { title: string; daily: string; weekly: string; rarely: string };
      q3: { title: string; heels: string; flats: string; sneakers: string; barefoot: string };
      q4: { title: string; under2: string; '2to5': string; over5: string };
    };
  };

  // Select translations
  const st = t.raw('select') as { title: string; subtitle: string; nailTitle: string; nailDesc: string; heelTitle: string; heelDesc: string; researchTitle: string; researchDesc: string };
  // Research translations
  const rt = t.raw('research') as {
    step1Title: string; step1Desc: string; step1Start: string;
    step2Title: string; step3Title: string; step4Title: string;
    step5Title: string; step6Title: string; step7Title: string; step8Title: string;
    progressLabel: string; backBtn: string; nextBtn: string; submitBtn: string; submitting: string;
    doneTitle: string; doneDesc: string; doneBack: string;
    country: string; position: string; dominantHand: string; dominantFoot: string;
    weeklySessions: { label: string; '1-2': string; '3-4': string; '5-6': string; daily: string };
    sessionDuration: { label: string; under1: string; '1-2': string; '2-3': string; over3: string };
    monthlyMatches: string;
    trainingIntensity: { label: string; left: string; right: string };
    weeklyRestDays: string;
    fatigueLevel: { label: string; left: string; right: string };
    sleepHours: string; sleepQuality: { label: string; left: string; right: string };
    stressLevel: { label: string; left: string; right: string };
    bodyPain: string;
    nailCutFreq: { label: string; weekly: string; biweekly: string; monthly: string; rarely: string };
    daysBeforeMatch: { label: string; yes: string; no: string; sometimes: string };
    deepNailHabit: { label: string; yes: string; no: string };
    toeGripSense: { label: string; left: string; right: string };
    halluxValgus: { label: string; none: string; mild: string; moderate: string; severe: string };
    toePain: { label: string; left: string; right: string };
    injuryCountYear: string;
    injurySite: { label: string; ankle: string; knee: string; toe: string; hip: string; shoulder: string; elbow: string; back: string; none: string };
    recoveryPeriod: { label: string; under1week: string; '1-4weeks': string; '1-3months': string; over3months: string; none: string };
    injuryRecurrence: { label: string; yes: string; no: string };
    imageSection: { title: string; handNail: string; footNail: string; sole: string; uploadBtn: string };
    consent: string; consentRequired: string;
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

  const [bodyPart, setBodyPart] = useState<'nail' | 'sole' | 'research' | null>(null);
  const [researchAnswers, setResearchAnswers] = useState<ResearchAnswers>(INITIAL_RESEARCH);
  const [researchStep, setResearchStep] = useState(1);
  const [researchSubmitting, setResearchSubmitting] = useState(false);
  const [heelAnswers, setHeelAnswers] = useState<HeelAnswers>(INITIAL_HEEL_ANSWERS);
  const [heelStep, setHeelStep] = useState(1);
  const [practitionerMode, setPractitionerMode] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      setUserRole(profile?.role ?? 'member');
    }
    checkAuth();
  }, []);

  const [step, setStep] = useState<'select' | 'upload' | 'quiz' | 'freeChat' | 'result' | 'research' | 'researchDone'>('select');
  const [quizStep, setQuizStep] = useState(1);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers>(INITIAL_ANSWERS);
  const [prelimScore, setPrelimScore] = useState<number | null>(null);
  const [showPrelim, setShowPrelim] = useState(false);

  const [image, setImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFinalLoading, setIsFinalLoading] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [userConsent, setUserConsent] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraSupported, setCameraSupported] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isFinalDiagnosisCalled = useRef(false);
  const isInitialFetchCalled = useRef(false);
  const [caseId, setCaseId] = useState<string | null>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  useEffect(() => { setCameraSupported(!!navigator?.mediaDevices?.getUserMedia); }, []);
  useEffect(() => { return () => { cameraStream?.getTracks().forEach(t => t.stop()); }; }, [cameraStream]);

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
    if (quizStep === 2) return quizAnswers.age !== '' && Number(quizAnswers.age) >= 5;
    if (quizStep === 4) return quizAnswers.ankleSprain !== '';
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

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      setCameraStream(stream);
      setCameraActive(true);
      setTimeout(() => { if (videoRef.current) videoRef.current.srcObject = stream; }, 100);
    } catch {
      alert('カメラへのアクセスが許可されていません');
    }
  };

  const stopCamera = () => {
    cameraStream?.getTracks().forEach(t => t.stop());
    setCameraStream(null);
    setCameraActive(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setImage(dataUrl.split(',')[1]);
    setImagePreview(dataUrl);
    stopCamera();
  };

  // ============================================================
  // フリーチャット
  // ============================================================
  const handleStartFreeChat = () => {
    setShowPrelim(false); setStep('freeChat'); setMessages([]);
    isFinalDiagnosisCalled.current = false;
    isInitialFetchCalled.current = false;
    // 現時点のstateを引数として直接渡す（クロージャ問題を回避）
    const currentAnswers = bodyPart === 'sole' ? heelAnswers : quizAnswers;
    // 定型質問完了時点で画像＋回答を保存
    saveQuizData(currentAnswers);
    fetchInitialFreeMessage(currentAnswers);
  };

  const saveQuizData = async (answers: typeof quizAnswers | typeof heelAnswers) => {
    try {
      const res = await fetch('/api/save-quiz', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image, quizAnswers: bodyPart === 'nail' ? answers : undefined, heelAnswers: bodyPart === 'sole' ? answers : undefined, bodyPart, locale }),
      });
      const data = await res.json();
      if (data.id) setCaseId(data.id);
    } catch (e) {
      console.error('[save-quiz]', e); // 保存失敗しても診断フローは止めない
    }
  };

  const fetchInitialFreeMessage = async (answers: typeof quizAnswers | typeof heelAnswers) => {
    if (isInitialFetchCalled.current) return;
    isInitialFetchCalled.current = true;
    setIsLoading(true);
    try {
      const res = await fetch('/api/chat-diagnosis', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: qt.chatBar.initialMessage }], image, quizAnswers: answers, isInitial: true, locale, bodyPart }),
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
        body: JSON.stringify({ messages: updated, image, quizAnswers: bodyPart === 'sole' ? heelAnswers : quizAnswers, locale, bodyPart }),
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
    setIsFinalLoading(true);
    try {
      const res = await fetch('/api/final-diagnosis', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: msgs, image, quizAnswers: bodyPart === 'sole' ? heelAnswers : quizAnswers, locale, bodyPart, caseId }),
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setDiagnosisResult(data); setStep('result');
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: t('chat.error'), timestamp: new Date().toISOString() }]);
    } finally { setIsLoading(false); setIsFinalLoading(false); }
  };

  const handleReset = () => {
    isFinalDiagnosisCalled.current = false;
    setStep('select'); setBodyPart(null);
    setQuizStep(1); setQuizAnswers(INITIAL_ANSWERS);
    setHeelStep(1); setHeelAnswers(INITIAL_HEEL_ANSWERS);
    setResearchStep(1); setResearchAnswers(INITIAL_RESEARCH);
    setPrelimScore(null); setShowPrelim(false);
    setImage(null); setImagePreview(null); setMessages([]);
    setDiagnosisResult(null); setUserInput(''); setUserConsent(false);
    setPractitionerMode(false); setCaseId(null);
    setCameraActive(false);
    cameraStream?.getTracks().forEach(t => t.stop()); setCameraStream(null);
  };

  const uiStepLabels = qt.uiSteps;
  const currentUiStepIndex = step === 'select' ? -1 : ['upload', 'quiz', 'freeChat', 'result'].indexOf(step);

  // ============================================================
  // レンダリング
  // ============================================================
  return (
    <div className="flex min-h-screen flex-col bg-muted">
      {isFinalLoading && !diagnosisResult && <DiagnosisLoadingScreen />}
      <Header />
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-3xl px-4">
          <canvas ref={canvasRef} className="hidden" />

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
                <h2 className="text-2xl font-bold text-foreground">{st.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{st.subtitle}</p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* 爪カード */}
                <button
                  onClick={() => { setBodyPart('nail'); setStep('upload'); }}
                  className="group flex flex-col items-center gap-4 rounded-2xl border-2 border-border p-8 text-center transition-all hover:border-primary hover:bg-primary/5 hover:shadow-md"
                >
                  <span className="text-5xl">💅</span>
                  <div>
                    <p className="text-lg font-bold text-foreground group-hover:text-primary">{st.nailTitle}</p>
                    <p className="mt-1 text-xs text-muted-foreground" style={{ whiteSpace: 'pre-line' }}>{st.nailDesc}</p>
                  </div>
                </button>
                {/* 足裏カード */}
                <button
                  onClick={() => { setBodyPart('sole'); setStep('upload'); }}
                  className="group flex flex-col items-center gap-4 rounded-2xl border-2 border-border p-8 text-center transition-all hover:border-primary hover:bg-primary/5 hover:shadow-md"
                >
                  <span className="text-5xl">🦶</span>
                  <div>
                    <p className="text-lg font-bold text-foreground group-hover:text-primary">{st.heelTitle}</p>
                    <p className="mt-1 text-xs text-muted-foreground" style={{ whiteSpace: 'pre-line' }}>{st.heelDesc}</p>
                  </div>
                </button>
                {/* 研究データカード */}
                <button
                  onClick={() => { setBodyPart('research'); setStep('research'); }}
                  className="group flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-border p-8 text-center transition-all hover:border-emerald-400 hover:bg-emerald-50 hover:shadow-md"
                >
                  <span className="text-5xl">🔬</span>
                  <div>
                    <p className="text-lg font-bold text-foreground group-hover:text-emerald-700">{st.researchTitle}</p>
                    <p className="mt-1 text-xs text-muted-foreground" style={{ whiteSpace: 'pre-line' }}>{st.researchDesc}</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* ===== Upload ===== */}
          {step === 'upload' && (
            <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
              {cameraActive ? (
                <div className="relative bg-black" style={{ minHeight: '320px' }}>
                  <button onClick={stopCamera}
                    className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white text-sm font-bold">✕</button>
                  <video ref={videoRef} autoPlay playsInline style={{ width: '100%', display: 'block' }} />
                  <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center">
                    <button onClick={capturePhoto}
                      className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-2xl shadow-lg transition-transform active:scale-95">
                      📸
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8">
                  <div className="mb-6 flex justify-center">
                    <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-primary/20 shadow-md">
                      <Image src="/images/optimized/nailanaly.jpg" alt="AI Nail Diagnosis" fill className="object-cover" sizes="112px" priority />
                    </div>
                  </div>
                  <h2 className="mb-2 text-xl font-bold text-foreground">{bodyPart === 'sole' ? t('upload.heelTitle') : t('upload.title')}</h2>
                  <p className="mb-6 text-sm text-muted-foreground">{bodyPart === 'sole' ? t('upload.heelDescription') : t('upload.description')}</p>
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
                  {cameraSupported && (
                    <button onClick={startCamera}
                      className="mt-3 w-full rounded-xl border-2 border-dashed border-border py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/40">
                      📷 カメラで撮影
                    </button>
                  )}
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
            </div>
          )}

          {/* ===== かかとQuiz ===== */}
          {step === 'quiz' && bodyPart === 'sole' && (() => {
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

            const ht = qt.heel;
            const severityOpts = [
              { value: 'mild', label: ht.q1.mild },
              { value: 'moderate', label: ht.q1.moderate },
              { value: 'severe', label: ht.q1.severe },
            ];
            const moistureOpts = [
              { value: 'daily', label: ht.q2.daily },
              { value: 'weekly', label: ht.q2.weekly },
              { value: 'rarely', label: ht.q2.rarely },
            ];
            const footwearOpts = [
              { value: 'heels', label: ht.q3.heels },
              { value: 'flats', label: ht.q3.flats },
              { value: 'sneakers', label: ht.q3.sneakers },
              { value: 'barefoot', label: ht.q3.barefoot },
            ];
            const standingOpts = [
              { value: 'under2', label: ht.q4.under2 },
              { value: '2to5', label: ht.q4['2to5'] },
              { value: 'over5', label: ht.q4.over5 },
            ];

            return (
              <div className="rounded-xl border border-border bg-white p-8 shadow-sm">
                {/* 進捗バー */}
                <div className="mb-6">
                  <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{ht.progressLabel} {heelStep} / {HEEL_TOTAL_STEPS}</span>
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
                    <h2 className="mb-5 text-xl font-bold">{ht.q1.title}</h2>
                    <ChoiceButtons options={severityOpts} value={heelAnswers.heelSeverity}
                      onChange={v => setHeelAnswers(prev => ({ ...prev, heelSeverity: v }))} cols={3} />
                  </div>
                )}

                {/* Q2 */}
                {heelStep === 2 && (
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">Q2</p>
                    <h2 className="mb-5 text-xl font-bold">{ht.q2.title}</h2>
                    <ChoiceButtons options={moistureOpts} value={heelAnswers.heelMoisture}
                      onChange={v => setHeelAnswers(prev => ({ ...prev, heelMoisture: v }))} cols={3} />
                  </div>
                )}

                {/* Q3 */}
                {heelStep === 3 && (
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">Q3</p>
                    <h2 className="mb-5 text-xl font-bold">{ht.q3.title}</h2>
                    <ChoiceButtons options={footwearOpts} value={heelAnswers.heelFootwear}
                      onChange={v => setHeelAnswers(prev => ({ ...prev, heelFootwear: v }))} cols={2} />
                  </div>
                )}

                {/* Q4 */}
                {heelStep === 4 && (
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">Q4</p>
                    <h2 className="mb-5 text-xl font-bold">{ht.q4.title}</h2>
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
                    {heelStep < HEEL_TOTAL_STEPS ? qt.nextBtn : ht.toChat}
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

              {/* Q2: 年齢 */}
              {quizStep === 2 && (
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">Q2</p>
                  <h2 className="mb-5 text-xl font-bold">{qt.simpQuiz.q2Title}</h2>
                  <div className="flex items-center gap-3">
                    <input type="number" min={5} max={100} value={quizAnswers.age} autoFocus
                      onChange={e => set('age', e.target.value === '' ? '' : Number(e.target.value))}
                      onKeyDown={e => e.key === 'Enter' && canProceed() && handleNext()}
                      placeholder="25"
                      className="w-32 rounded-lg border-2 border-border px-4 py-3 text-center text-2xl font-bold focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    <span className="text-base text-muted-foreground">{qt.q2.ageUnit}</span>
                  </div>
                </div>
              )}

              {/* Q3: 足指で地面を掴める感覚 */}
              {quizStep === 3 && (
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">Q3</p>
                  <h2 className="mb-5 text-xl font-bold">{qt.simpQuiz.q3Title}</h2>
                  <SliderInput value={quizAnswers.toeGrip} onChange={v => set('toeGrip', v)}
                    leftLabel={qt.simpQuiz.q3Left} rightLabel={qt.simpQuiz.q3Right} />
                </div>
              )}

              {/* Q4: 足首の捻挫歴 */}
              {quizStep === 4 && (
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">Q4</p>
                  <h2 className="mb-5 text-xl font-bold">{qt.simpQuiz.q4Title}</h2>
                  <ChoiceButtons
                    options={[
                      { value: 'none',  label: qt.ankleSprain.none },
                      { value: 'once',  label: qt.ankleSprain.once },
                      { value: '2plus', label: qt.ankleSprain['2plus'] },
                    ]}
                    value={quizAnswers.ankleSprain}
                    onChange={v => set('ankleSprain', v)}
                    cols={3}
                  />
                </div>
              )}

              {/* Q5: 踏ん張り・グリップ力の自信 */}
              {quizStep === 5 && (
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">Q5</p>
                  <h2 className="mb-5 text-xl font-bold">{qt.simpQuiz.q5Title}</h2>
                  <SliderInput value={quizAnswers.gripConfidence} onChange={v => set('gripConfidence', v)}
                    leftLabel={qt.q9.gripConfLeft} rightLabel={qt.q9.gripConfRight} />
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
                      <span>🎂 {quizAnswers.age}{qt.q2.ageUnit}</span>
                      <span>{qt.prelim.toeGrip} {quizAnswers.toeGrip}/10</span>
                      <span>{qt.prelim.grip} {quizAnswers.gripConfidence}/10</span>
                      <span>{qt.prelim.ankleSprain} {ankleSprainLabel(quizAnswers.ankleSprain) || qt.noAnswer}</span>
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
              {messages.length >= 1 && (
                <div className="border-t border-border px-4 py-3 text-center">
                  <button onClick={() => handleFinalDiagnosis(messages)} disabled={isLoading}
                    className="w-full rounded-lg bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 disabled:opacity-50">
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
                {diagnosisResult.body_part === 'sole' && diagnosisResult.heel_findings && diagnosisResult.heel_findings.length > 0 && (
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
                {diagnosisResult.body_part === 'sole' && diagnosisResult.self_care_steps && diagnosisResult.self_care_steps.length > 0 && (
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
                {userRole === 'practitioner' && (
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
                )}

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
                <ClinicSuggest bodyPart={bodyPart as 'nail' | 'sole' | null} />

                {/* 会員登録バナー */}
                {!userRole && (
                  <div className="rounded-xl border border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10 p-6 text-center">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">Members Only</p>
                    <h3 className="mb-2 text-base font-bold text-foreground">爪整体テキストを無料で閲覧</h3>
                    <p className="mb-4 text-sm text-muted-foreground">会員登録すると、プロ向け爪整体テキスト（全11冊）のPDFが無料でダウンロードできます。</p>
                    <div className="flex gap-3 justify-center">
                      <a href="/ja/register" className="rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white hover:bg-primary/90">無料で会員登録</a>
                      <a href="/ja/login" className="rounded-xl border border-primary px-6 py-2.5 text-sm font-bold text-primary hover:bg-primary/5">ログイン</a>
                    </div>
                  </div>
                )}

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

          {/* ===== 研究フォーム ===== */}
          {step === 'research' && (() => {
            const setR = <K extends keyof ResearchAnswers>(key: K, value: ResearchAnswers[K]) =>
              setResearchAnswers(prev => ({ ...prev, [key]: value }));

            const researchCanProceed = () => {
              if (researchStep === 2) return researchAnswers.age !== '' && researchAnswers.gender !== '' && researchAnswers.sport !== '';
              return true;
            };

            const researchNext = () => {
              if (researchStep < RESEARCH_TOTAL_STEPS) setResearchStep(researchStep + 1);
            };
            const researchBack = () => {
              if (researchStep > 1) setResearchStep(researchStep - 1);
              else { setStep('select'); setBodyPart(null); }
            };

            const handleResearchImageUpload = (type: ResearchImage['type'], file: File) => {
              if (!file.type.startsWith('image/')) return;
              const reader = new FileReader();
              reader.onload = e => {
                const dataUrl = e.target?.result as string;
                const b64 = dataUrl.split(',')[1];
                setR('images', [...researchAnswers.images.filter(i => i.type !== type), { type, dataUrl, b64 }]);
              };
              reader.readAsDataURL(file);
            };

            const handleResearchSubmit = async () => {
              if (!researchAnswers.consent) return;
              setResearchSubmitting(true);
              try {
                await fetch('/api/save-research', {
                  method: 'POST', headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ ...researchAnswers, locale }),
                });
                setStep('researchDone');
              } catch {
                // 送信失敗してもDone画面へ
                setStep('researchDone');
              } finally { setResearchSubmitting(false); }
            };

            const wkSessionOpts = [
              { value: '1-2', label: rt.weeklySessions['1-2'] },
              { value: '3-4', label: rt.weeklySessions['3-4'] },
              { value: '5-6', label: rt.weeklySessions['5-6'] },
              { value: 'daily', label: rt.weeklySessions.daily },
            ];
            const sessionDurOpts = [
              { value: 'under1', label: rt.sessionDuration.under1 },
              { value: '1-2', label: rt.sessionDuration['1-2'] },
              { value: '2-3', label: rt.sessionDuration['2-3'] },
              { value: 'over3', label: rt.sessionDuration.over3 },
            ];
            const nailCutOpts = [
              { value: 'weekly', label: rt.nailCutFreq.weekly },
              { value: 'biweekly', label: rt.nailCutFreq.biweekly },
              { value: 'monthly', label: rt.nailCutFreq.monthly },
              { value: 'rarely', label: rt.nailCutFreq.rarely },
            ];
            const daysBefOpts = [
              { value: 'yes', label: rt.daysBeforeMatch.yes },
              { value: 'no', label: rt.daysBeforeMatch.no },
              { value: 'sometimes', label: rt.daysBeforeMatch.sometimes },
            ];
            const deepNailOpts = [
              { value: 'yes', label: rt.deepNailHabit.yes },
              { value: 'no', label: rt.deepNailHabit.no },
            ];
            const halluxOpts = [
              { value: 'none', label: rt.halluxValgus.none },
              { value: 'mild', label: rt.halluxValgus.mild },
              { value: 'moderate', label: rt.halluxValgus.moderate },
              { value: 'severe', label: rt.halluxValgus.severe },
            ];
            const injurySiteOpts = [
              { value: 'ankle', label: rt.injurySite.ankle },
              { value: 'knee', label: rt.injurySite.knee },
              { value: 'toe', label: rt.injurySite.toe },
              { value: 'hip', label: rt.injurySite.hip },
              { value: 'shoulder', label: rt.injurySite.shoulder },
              { value: 'elbow', label: rt.injurySite.elbow },
              { value: 'back', label: rt.injurySite.back },
              { value: 'none', label: rt.injurySite.none },
            ];
            const recoveryOpts = [
              { value: 'none', label: rt.recoveryPeriod.none },
              { value: 'under1week', label: rt.recoveryPeriod.under1week },
              { value: '1-4weeks', label: rt.recoveryPeriod['1-4weeks'] },
              { value: '1-3months', label: rt.recoveryPeriod['1-3months'] },
              { value: 'over3months', label: rt.recoveryPeriod.over3months },
            ];
            const injuryRecurOpts = [
              { value: 'yes', label: rt.injuryRecurrence.yes },
              { value: 'no', label: rt.injuryRecurrence.no },
            ];

            return (
              <div className="rounded-xl border border-border bg-white p-8 shadow-sm">
                {/* Step 1 は進捗バーなし */}
                {researchStep > 1 && (
                  <div className="mb-6">
                    <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{rt.progressLabel} {researchStep} / {RESEARCH_TOTAL_STEPS}</span>
                      <span>{Math.round((researchStep / RESEARCH_TOTAL_STEPS) * 100)}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                        style={{ width: `${(researchStep / RESEARCH_TOTAL_STEPS) * 100}%` }} />
                    </div>
                  </div>
                )}

                {/* Step 1: 説明 */}
                {researchStep === 1 && (
                  <div className="text-center">
                    <span className="text-6xl">🔬</span>
                    <h2 className="mt-4 mb-3 text-2xl font-bold text-foreground">{rt.step1Title}</h2>
                    <p className="mb-8 text-sm text-muted-foreground leading-relaxed">{rt.step1Desc}</p>
                    <button onClick={researchNext}
                      className="w-full rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-emerald-600">
                      {rt.step1Start}
                    </button>
                  </div>
                )}

                {/* Step 2: 基本情報 */}
                {researchStep === 2 && (
                  <div className="space-y-5">
                    <h2 className="text-xl font-bold">{rt.step2Title}</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-muted-foreground">{qt.q2.ageLabel} *</label>
                        <input type="number" min={5} max={100} value={researchAnswers.age}
                          onChange={e => setR('age', e.target.value === '' ? '' : Number(e.target.value))}
                          className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none" />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-muted-foreground">{qt.q2.genderLabel} *</label>
                        <ChoiceButtons options={toOpts(qt.gender)} value={researchAnswers.gender} onChange={v => setR('gender', v)} cols={3} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-muted-foreground">{qt.q3.heightLabel}</label>
                        <input type="number" min={100} max={250} value={researchAnswers.height}
                          onChange={e => setR('height', e.target.value === '' ? '' : Number(e.target.value))}
                          className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none" />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-muted-foreground">{qt.q3.weightLabel}</label>
                        <input type="number" min={30} max={200} value={researchAnswers.weight}
                          onChange={e => setR('weight', e.target.value === '' ? '' : Number(e.target.value))}
                          className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-muted-foreground">{rt.country}</label>
                      <input type="text" value={researchAnswers.country} onChange={e => setR('country', e.target.value)}
                        placeholder="Japan"
                        className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-muted-foreground">{qt.q1.title} *</label>
                      <select value={researchAnswers.sport} onChange={e => setR('sport', e.target.value)}
                        className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none">
                        <option value="">{qt.q1.placeholder}</option>
                        {SPORTS_LIST.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </div>
                  </div>
                )}

                {/* Step 3: 競技情報 */}
                {researchStep === 3 && (
                  <div className="space-y-5">
                    <h2 className="text-xl font-bold">{rt.step3Title}</h2>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-muted-foreground">{rt.position}</label>
                      <input type="text" value={researchAnswers.position} onChange={e => setR('position', e.target.value)}
                        className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-muted-foreground">{rt.dominantHand}</label>
                      <ChoiceButtons options={toOpts(qt.dominantFoot)} value={researchAnswers.dominant_hand} onChange={v => setR('dominant_hand', v)} cols={3} />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-muted-foreground">{rt.dominantFoot}</label>
                      <ChoiceButtons options={toOpts(qt.dominantFoot)} value={researchAnswers.dominant_foot} onChange={v => setR('dominant_foot', v)} cols={3} />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-muted-foreground">{qt.q4.historyLabel}（{qt.q4.historyUnit}）</label>
                      <input type="number" min={0} max={50} value={researchAnswers.sports_history}
                        onChange={e => setR('sports_history', e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-32 rounded-lg border border-border px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none" />
                    </div>
                  </div>
                )}

                {/* Step 4: トレーニング */}
                {researchStep === 4 && (
                  <div className="space-y-5">
                    <h2 className="text-xl font-bold">{rt.step4Title}</h2>
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-muted-foreground">{rt.weeklySessions.label}</label>
                      <ChoiceButtons options={wkSessionOpts} value={researchAnswers.weekly_sessions} onChange={v => setR('weekly_sessions', v)} cols={2} />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-muted-foreground">{rt.sessionDuration.label}</label>
                      <ChoiceButtons options={sessionDurOpts} value={researchAnswers.session_duration} onChange={v => setR('session_duration', v)} cols={2} />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-muted-foreground">{rt.monthlyMatches}</label>
                      <input type="number" min={0} max={30} value={researchAnswers.monthly_matches}
                        onChange={e => setR('monthly_matches', e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-32 rounded-lg border border-border px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-muted-foreground">{rt.trainingIntensity.label}</label>
                      <SliderInput value={researchAnswers.training_intensity} onChange={v => setR('training_intensity', v)}
                        leftLabel={rt.trainingIntensity.left} rightLabel={rt.trainingIntensity.right} />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-muted-foreground">{rt.weeklyRestDays}</label>
                      <input type="number" min={0} max={7} value={researchAnswers.weekly_rest_days}
                        onChange={e => setR('weekly_rest_days', e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-32 rounded-lg border border-border px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none" />
                    </div>
                  </div>
                )}

                {/* Step 5: コンディション */}
                {researchStep === 5 && (
                  <div className="space-y-5">
                    <h2 className="text-xl font-bold">{rt.step5Title}</h2>
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-muted-foreground">{rt.fatigueLevel.label}</label>
                      <SliderInput value={researchAnswers.fatigue_level} onChange={v => setR('fatigue_level', v)}
                        leftLabel={rt.fatigueLevel.left} rightLabel={rt.fatigueLevel.right} />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-muted-foreground">{rt.sleepHours}</label>
                      <input type="number" min={2} max={12} step={0.5} value={researchAnswers.sleep_hours}
                        onChange={e => setR('sleep_hours', e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-32 rounded-lg border border-border px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-muted-foreground">{rt.sleepQuality.label}</label>
                      <SliderInput value={researchAnswers.sleep_quality} onChange={v => setR('sleep_quality', v)}
                        leftLabel={rt.sleepQuality.left} rightLabel={rt.sleepQuality.right} />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-muted-foreground">{rt.stressLevel.label}</label>
                      <SliderInput value={researchAnswers.stress_level} onChange={v => setR('stress_level', v)}
                        leftLabel={rt.stressLevel.left} rightLabel={rt.stressLevel.right} />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-muted-foreground">{rt.bodyPain}</label>
                      <input type="text" value={researchAnswers.body_pain} onChange={e => setR('body_pain', e.target.value)}
                        placeholder="なし"
                        className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none" />
                    </div>
                  </div>
                )}

                {/* Step 6: 足・爪の状態 */}
                {researchStep === 6 && (
                  <div className="space-y-5">
                    <h2 className="text-xl font-bold">{rt.step6Title}</h2>
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-muted-foreground">{rt.nailCutFreq.label}</label>
                      <ChoiceButtons options={nailCutOpts} value={researchAnswers.nail_cut_frequency} onChange={v => setR('nail_cut_frequency', v)} cols={2} />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-muted-foreground">{rt.daysBeforeMatch.label}</label>
                      <ChoiceButtons options={daysBefOpts} value={researchAnswers.days_before_match} onChange={v => setR('days_before_match', v)} cols={3} />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-muted-foreground">{rt.deepNailHabit.label}</label>
                      <ChoiceButtons options={deepNailOpts} value={researchAnswers.deep_nail_habit} onChange={v => setR('deep_nail_habit', v)} cols={2} />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-muted-foreground">{rt.toeGripSense.label}</label>
                      <SliderInput value={researchAnswers.toe_grip_sense} onChange={v => setR('toe_grip_sense', v)}
                        leftLabel={rt.toeGripSense.left} rightLabel={rt.toeGripSense.right} />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-muted-foreground">{rt.halluxValgus.label}</label>
                      <ChoiceButtons options={halluxOpts} value={researchAnswers.hallux_valgus} onChange={v => setR('hallux_valgus', v)} cols={2} />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-muted-foreground">{rt.toePain.label}</label>
                      <SliderInput value={researchAnswers.toe_pain} onChange={v => setR('toe_pain', v)}
                        leftLabel={rt.toePain.left} rightLabel={rt.toePain.right} />
                    </div>
                  </div>
                )}

                {/* Step 7: ケガ歴 */}
                {researchStep === 7 && (
                  <div className="space-y-5">
                    <h2 className="text-xl font-bold">{rt.step7Title}</h2>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-muted-foreground">{rt.injuryCountYear}</label>
                      <input type="number" min={0} max={50} value={researchAnswers.injury_count_year}
                        onChange={e => setR('injury_count_year', e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-32 rounded-lg border border-border px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-muted-foreground">{rt.injurySite.label}</label>
                      <ChoiceButtons options={injurySiteOpts} value={researchAnswers.major_injury_site} onChange={v => setR('major_injury_site', v)} cols={2} />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-muted-foreground">{rt.recoveryPeriod.label}</label>
                      <ChoiceButtons options={recoveryOpts} value={researchAnswers.recovery_period} onChange={v => setR('recovery_period', v)} cols={2} />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-muted-foreground">{rt.injuryRecurrence.label}</label>
                      <ChoiceButtons options={injuryRecurOpts} value={researchAnswers.injury_recurrence} onChange={v => setR('injury_recurrence', v)} cols={2} />
                    </div>
                  </div>
                )}

                {/* Step 8: 写真提供 + 同意 + 送信 */}
                {researchStep === 8 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold">{rt.step8Title}</h2>
                    <p className="text-xs text-muted-foreground">{rt.imageSection.title}</p>
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-600">{t('upload.guideTitle')}</h3>
                      <ul className="space-y-1">
                        {guideItems.map((g, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />{g}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {(['hand_nail', 'foot_nail', 'sole'] as const).map(type => {
                        const existing = researchAnswers.images.find(i => i.type === type);
                        const label = type === 'hand_nail' ? rt.imageSection.handNail : type === 'foot_nail' ? rt.imageSection.footNail : rt.imageSection.sole;
                        return (
                          <div key={type} className="text-center">
                            <label className="mb-2 block text-xs font-semibold text-muted-foreground">{label}</label>
                            {existing ? (
                              <div className="relative">
                                <img src={existing.dataUrl} alt={type} className="h-24 w-full rounded-xl object-cover border border-border" />
                                <button onClick={() => setR('images', researchAnswers.images.filter(i => i.type !== type))}
                                  className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">✕</button>
                              </div>
                            ) : (
                              <label className="flex h-24 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border hover:border-emerald-400 transition-colors">
                                <span className="text-2xl">📷</span>
                                <span className="mt-1 text-[10px] text-muted-foreground">{rt.imageSection.uploadBtn}</span>
                                <input type="file" accept="image/*" className="hidden"
                                  onChange={e => { const f = e.target.files?.[0]; if (f) handleResearchImageUpload(type, f); }} />
                              </label>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="rounded-xl border border-border bg-muted/50 p-4">
                      <label className="flex cursor-pointer items-start gap-3">
                        <input type="checkbox" checked={researchAnswers.consent} onChange={e => setR('consent', e.target.checked)}
                          className="mt-0.5 h-4 w-4 shrink-0 accent-emerald-500" />
                        <span className="text-xs leading-relaxed text-muted-foreground">{rt.consent}</span>
                      </label>
                    </div>

                    {!researchAnswers.consent && (
                      <p className="text-center text-xs text-red-500">{rt.consentRequired}</p>
                    )}

                    <button onClick={handleResearchSubmit} disabled={!researchAnswers.consent || researchSubmitting}
                      className="w-full rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50">
                      {researchSubmitting ? rt.submitting : rt.submitBtn}
                    </button>
                  </div>
                )}

                {/* ナビゲーション */}
                {researchStep > 1 && researchStep < 8 && (
                  <div className="mt-8 flex gap-3">
                    <button onClick={researchBack} className="rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted">
                      {rt.backBtn}
                    </button>
                    <button onClick={researchNext} disabled={!researchCanProceed()}
                      className="flex-1 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50">
                      {rt.nextBtn}
                    </button>
                  </div>
                )}
                {researchStep === 1 && (
                  <div className="mt-4 text-center">
                    <button onClick={researchBack} className="text-xs text-muted-foreground hover:underline">
                      {rt.backBtn}
                    </button>
                  </div>
                )}
                {researchStep === 8 && (
                  <div className="mt-4">
                    <button onClick={researchBack} className="rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted">
                      {rt.backBtn}
                    </button>
                  </div>
                )}
              </div>
            );
          })()}

          {/* ===== 研究完了 ===== */}
          {step === 'researchDone' && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center shadow-sm">
              <span className="text-6xl">🎉</span>
              <h2 className="mt-4 mb-3 text-2xl font-bold text-emerald-800">{rt.doneTitle}</h2>
              <p className="mb-8 text-sm text-emerald-700 leading-relaxed">{rt.doneDesc}</p>
              <button onClick={handleReset}
                className="rounded-xl bg-emerald-500 px-8 py-3 text-sm font-bold text-white transition-all hover:bg-emerald-600">
                {rt.doneBack}
              </button>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}
