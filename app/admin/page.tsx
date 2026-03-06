'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// ────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────
interface ConversationLog {
  session_id: string;
  messages: { role: string; content: string }[];
}

interface NailCase {
  id: string;
  created_at: string;
  health_score: number;
  nail_score: number | null;
  quiz_score: number | null;
  nail_findings: string[] | null;
  locale: string;
  model_version: string;
  image_url: string | null;
  ai_diagnosis: string;
  detected_issues: string[];
  recommendations: string[];
  sport: string | null;
  age: number | null;
  gender: string | null;
  height: number | null;
  weight: number | null;
  dominant_foot: string | null;
  arch_type: string | null;
  callus_locations: string[] | null;
  sports_history: number | null;
  practice_frequency: string | null;
  nail_care_style: string | null;
  nail_care_frequency: string | null;
  uses_insole: boolean | null;
  nail_color_change: boolean | null;
  nail_brittle: boolean | null;
  nail_pain: boolean | null;
  nail_growth_change: boolean | null;
  curved_nail: string | null;
  hallux_valgus: string | null;
  toe_grip: number | null;
  grip_confidence: number | null;
  balance: number | null;
  ankle_sprain: string | null;
  current_pain_areas: string[] | null;
  health_data: Record<string, unknown>;
  conversation_logs: ConversationLog[];
}

type SortKey = 'created_at' | 'health_score' | 'nail_score' | 'quiz_score' | 'age' | 'toe_grip' | 'balance';
type SortDir = 'asc' | 'desc';

interface Filters {
  scoreMin: string; scoreMax: string;
  nail_score_min: string; nail_score_max: string;
  sport: string;
  gender: string;
  ageMin: string; ageMax: string;
  dominant_foot: string;
  practice_frequency: string;
  curved_nail: string;
  hallux_valgus: string;
  arch_type: string;
  nail_color_change: string;
  nail_brittle: string;
  nail_pain: string;
  nail_growth_change: string;
  nail_care_style: string;
  nail_care_frequency: string;
  uses_insole: string;
  ankle_sprain: string;
  toe_grip_min: string; toe_grip_max: string;
  balance_min: string;  balance_max: string;
}

const EMPTY: Filters = {
  scoreMin: '', scoreMax: '', nail_score_min: '', nail_score_max: '',
  sport: '', gender: '', ageMin: '', ageMax: '', dominant_foot: '',
  practice_frequency: '', curved_nail: '', hallux_valgus: '', arch_type: '',
  nail_color_change: '', nail_brittle: '', nail_pain: '', nail_growth_change: '',
  nail_care_style: '', nail_care_frequency: '', uses_insole: '',
  ankle_sprain: '', toe_grip_min: '', toe_grip_max: '', balance_min: '', balance_max: '',
};

// ────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────
function scoreColor(s: number) {
  if (s >= 80) return { bg: 'bg-emerald-100', text: 'text-emerald-700', ring: 'ring-emerald-400' };
  if (s >= 50) return { bg: 'bg-amber-100',   text: 'text-amber-700',   ring: 'ring-amber-400'   };
  if (s >= 20) return { bg: 'bg-orange-100',  text: 'text-orange-700',  ring: 'ring-orange-400'  };
  return         { bg: 'bg-red-100',    text: 'text-red-700',    ring: 'ring-red-400'    };
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
}
function getSport(c: NailCase) { return c.sport ?? (c.health_data?.sport as string) ?? ''; }
function uniq(arr: (string | null | undefined)[]) {
  return Array.from(new Set(arr.filter(Boolean))).sort() as string[];
}

// ────────────────────────────────────────────────
// Login
// ────────────────────────────────────────────────
function LoginScreen({ onLogin, loading }: { onLogin: (pw: string) => void; loading: boolean }) {
  const [pw, setPw] = useState('');
  const [tried, setTried] = useState(false);
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#7c6b5e] text-2xl text-white">🔐</div>
          <h1 className="text-xl font-bold text-slate-800">管理画面</h1>
        </div>
        <form onSubmit={e => { e.preventDefault(); setTried(true); onLogin(pw); }} className="space-y-4">
          <input type="password" value={pw} onChange={e => { setPw(e.target.value); setTried(false); }}
            placeholder="パスワード" disabled={loading}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#7c6b5e] focus:outline-none" />
          <button type="submit" disabled={loading || !pw.trim()}
            className="w-full rounded-xl bg-[#7c6b5e] py-3 text-sm font-bold text-white hover:bg-[#6a5a4e] disabled:opacity-50">
            {loading ? '認証中...' : 'ログイン'}
          </button>
          {tried && !loading && <p className="text-center text-xs text-red-500">パスワードが正しくありません</p>}
        </form>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// Detail Modal
// ────────────────────────────────────────────────
function DetailModal({ item, onClose }: { item: NailCase; onClose: () => void }) {
  const color = scoreColor(item.health_score);
  const logs = item.conversation_logs?.[0];
  const bmi = item.height && item.weight ? (item.weight / Math.pow(item.height / 100, 2)).toFixed(1) : null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 pt-10 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <p className="text-xs text-slate-400">{fmtDate(item.created_at)}</p>
            <p className="font-mono text-xs text-slate-500">{item.id}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-5 p-6">
          <div className="flex items-start gap-4">
            {item.image_url
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={item.image_url} alt="nail" className="h-28 w-28 shrink-0 rounded-xl border object-cover shadow-sm" />
              : <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-4xl">💅</div>}
            <div>
              <div className={`inline-flex items-baseline gap-1 rounded-xl px-4 py-2 ring-2 ${color.bg} ${color.ring}`}>
                <span className={`text-4xl font-bold ${color.text}`}>{item.health_score}</span>
                <span className={`text-sm ${color.text}`}>/100</span>
              </div>
              {(item.nail_score != null || item.quiz_score != null) && (
                <div className="mt-2 flex gap-2">
                  {item.nail_score != null && <span className="rounded-lg bg-pink-50 px-2 py-1 text-xs font-semibold text-pink-600">💅 爪 {item.nail_score}</span>}
                  {item.quiz_score != null && <span className="rounded-lg bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">📋 問診 {item.quiz_score}</span>}
                </div>
              )}
            </div>
          </div>
          {item.nail_findings && item.nail_findings.length > 0 && (
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">💅 爪所見</h3>
              <ul className="space-y-1">{item.nail_findings.map((f, i) => <li key={i} className="flex gap-2 text-sm"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-pink-400" />{f}</li>)}</ul>
            </div>
          )}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">📋 問診データ</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 rounded-xl bg-slate-50 p-4 text-xs">
              {([
                ['競技', getSport(item)], ['年齢', item.age ? `${item.age}歳` : null], ['性別', item.gender],
                ['身長/体重', item.height && item.weight ? `${item.height}cm / ${item.weight}kg (BMI ${bmi})` : null],
                ['利き足', item.dominant_foot], ['競技歴', item.sports_history ? `${item.sports_history}年` : null],
                ['練習頻度', item.practice_frequency], ['アーチ', item.arch_type],
                ['インソール', item.uses_insole === true ? 'あり' : item.uses_insole === false ? 'なし' : null],
                ['爪の切り方', item.nail_care_style], ['ケア頻度', item.nail_care_frequency],
                ['巻き爪', item.curved_nail], ['外反母趾', item.hallux_valgus], ['捻挫歴', item.ankle_sprain],
                ['足指感覚', item.toe_grip != null ? `${item.toe_grip}/10` : null],
                ['グリップ', item.grip_confidence != null ? `${item.grip_confidence}/10` : null],
                ['バランス', item.balance != null ? `${item.balance}/10` : null],
              ] as [string, string | null][]).filter(([, v]) => v).map(([label, value], i) => (
                <div key={i} className="flex gap-2">
                  <span className="w-20 shrink-0 font-semibold text-slate-500">{label}</span>
                  <span className="text-slate-700">{value}</span>
                </div>
              ))}
              {(item.nail_color_change || item.nail_brittle || item.nail_pain || item.nail_growth_change) && (
                <div className="col-span-2 flex gap-2">
                  <span className="w-20 shrink-0 font-semibold text-slate-500">爪の症状</span>
                  <span className="text-slate-700">{[item.nail_color_change && '色変化', item.nail_brittle && '割れ', item.nail_pain && '痛み', item.nail_growth_change && '成長変化'].filter(Boolean).join(' / ')}</span>
                </div>
              )}
              {item.callus_locations?.length ? (
                <div className="col-span-2 flex gap-2"><span className="w-20 shrink-0 font-semibold text-slate-500">タコ</span><span className="text-slate-700">{item.callus_locations.join(' / ')}</span></div>
              ) : null}
              {item.current_pain_areas?.length ? (
                <div className="col-span-2 flex gap-2"><span className="w-20 shrink-0 font-semibold text-slate-500">現在の痛み</span><span className="text-slate-700">{item.current_pain_areas.join(' / ')}</span></div>
              ) : null}
            </div>
          </div>
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">検出された問題</h3>
            <ul className="space-y-1">{(item.detected_issues || []).map((x, i) => <li key={i} className="flex gap-2 text-sm"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />{x}</li>)}</ul>
          </div>
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">推奨事項</h3>
            <ul className="space-y-1">{(item.recommendations || []).map((x, i) => <li key={i} className="flex gap-2 text-sm"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />{x}</li>)}</ul>
          </div>
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">AI 分析</h3>
            <p className="whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">{item.ai_diagnosis}</p>
          </div>
          {logs?.messages?.length ? (
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">問診ログ（{logs.messages.length}件）</h3>
              <div className="max-h-64 overflow-y-auto rounded-xl border border-slate-100 bg-slate-50 p-3 space-y-2">
                {logs.messages.map((msg, i) => (
                  <div key={i} className={`flex text-xs ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <span className={`max-w-[80%] rounded-lg px-3 py-2 ${msg.role === 'user' ? 'bg-[#7c6b5e] text-white' : 'border bg-white text-slate-700'}`}>{msg.content}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// Filter Panel
// ────────────────────────────────────────────────
function FilterPanel({ f, set, reset, cases }: {
  f: Filters; set: (p: Partial<Filters>) => void; reset: () => void; cases: NailCase[];
}) {
  const sports     = uniq(cases.map(c => getSport(c)));
  const genders    = uniq(cases.map(c => c.gender));
  const feet       = uniq(cases.map(c => c.dominant_foot));
  const freqs      = uniq(cases.map(c => c.practice_frequency));
  const curveds    = uniq(cases.map(c => c.curved_nail));
  const halluxes   = uniq(cases.map(c => c.hallux_valgus));
  const arches     = uniq(cases.map(c => c.arch_type));
  const careStyles = uniq(cases.map(c => c.nail_care_style));
  const careFreqs  = uniq(cases.map(c => c.nail_care_frequency));
  const sprains    = uniq(cases.map(c => c.ankle_sprain));

  const active = Object.values(f).filter(v => v !== '').length;

  // サブコンポーネント
  const Sel = ({ label, field, opts }: { label: string; field: keyof Filters; opts: string[] }) => (
    <label className="block">
      <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</span>
      <select value={f[field]} onChange={e => set({ [field]: e.target.value })}
        className={`w-full rounded-lg border px-2 py-1.5 text-xs focus:outline-none focus:border-[#7c6b5e] ${f[field] ? 'border-[#7c6b5e] bg-[#7c6b5e]/5 font-semibold text-[#7c6b5e]' : 'border-slate-200 bg-white text-slate-700'}`}>
        <option value="">すべて</option>
        {opts.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );

  const Rng = ({ label, kMin, kMax, lo, hi }: { label: string; kMin: keyof Filters; kMax: keyof Filters; lo: number; hi: number }) => {
    const active = f[kMin] || f[kMax];
    return (
      <div>
        <span className={`mb-1 block text-[10px] font-semibold uppercase tracking-wider ${active ? 'text-[#7c6b5e]' : 'text-slate-400'}`}>{label}</span>
        <div className="flex items-center gap-1">
          <input type="number" min={lo} max={hi} placeholder={String(lo)} value={f[kMin]}
            onChange={e => set({ [kMin]: e.target.value })}
            className={`w-full rounded-lg border px-2 py-1.5 text-xs text-center focus:outline-none focus:border-[#7c6b5e] ${f[kMin] ? 'border-[#7c6b5e] bg-[#7c6b5e]/5' : 'border-slate-200'}`} />
          <span className="shrink-0 text-[10px] text-slate-400">〜</span>
          <input type="number" min={lo} max={hi} placeholder={String(hi)} value={f[kMax]}
            onChange={e => set({ [kMax]: e.target.value })}
            className={`w-full rounded-lg border px-2 py-1.5 text-xs text-center focus:outline-none focus:border-[#7c6b5e] ${f[kMax] ? 'border-[#7c6b5e] bg-[#7c6b5e]/5' : 'border-slate-200'}`} />
        </div>
      </div>
    );
  };

  const Bool = ({ label, field }: { label: string; field: keyof Filters }) => (
    <div>
      <span className={`mb-1 block text-[10px] font-semibold uppercase tracking-wider ${f[field] ? 'text-[#7c6b5e]' : 'text-slate-400'}`}>{label}</span>
      <div className="flex gap-1">
        {(['', 'すべて'] as const).concat() && [['', 'すべて'], ['true', 'あり'], ['false', 'なし']].map(([val, lbl]) => (
          <button key={val} onClick={() => set({ [field]: val })}
            className={`flex-1 rounded-lg border py-1.5 text-xs font-semibold transition ${f[field] === val ? 'border-[#7c6b5e] bg-[#7c6b5e] text-white' : 'border-slate-200 text-slate-500 hover:border-[#7c6b5e]/40'}`}>
            {lbl}
          </button>
        ))}
      </div>
    </div>
  );

  const Section = ({ emoji, title, children }: { emoji: string; title: string; children: React.ReactNode }) => (
    <div className="space-y-3">
      <p className="text-[11px] font-bold uppercase tracking-widest text-[#7c6b5e]">{emoji} {title}</p>
      {children}
    </div>
  );

  return (
    <div className="w-60 shrink-0">
      <div className="sticky top-[61px] rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* ヘッダー */}
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-700">🔍 絞り込み</span>
            {active > 0 && <span className="rounded-full bg-[#7c6b5e] px-2 py-0.5 text-[10px] font-bold text-white">{active}</span>}
          </div>
          {active > 0 && <button onClick={reset} className="text-xs text-slate-400 hover:text-red-500 transition font-semibold">全リセット</button>}
        </div>

        {/* スクロールエリア */}
        <div className="overflow-y-auto p-4 space-y-5" style={{ maxHeight: 'calc(100vh - 130px)' }}>

          <Section emoji="📊" title="スコア">
            <Rng label="総合スコア" kMin="scoreMin" kMax="scoreMax" lo={0} hi={100} />
            <Rng label="爪スコア"   kMin="nail_score_min" kMax="nail_score_max" lo={0} hi={100} />
          </Section>

          <div className="border-t border-slate-100" />

          <Section emoji="👤" title="属性">
            <Sel label="競技" field="sport" opts={sports} />
            <Sel label="性別" field="gender" opts={genders} />
            <Rng label="年齢" kMin="ageMin" kMax="ageMax" lo={5} hi={80} />
            <Sel label="利き足" field="dominant_foot" opts={feet} />
            <Sel label="練習頻度" field="practice_frequency" opts={freqs} />
          </Section>

          <div className="border-t border-slate-100" />

          <Section emoji="🦶" title="足・爪の形態">
            <Sel label="巻き爪" field="curved_nail" opts={curveds} />
            <Sel label="外反母趾" field="hallux_valgus" opts={halluxes} />
            <Sel label="アーチタイプ" field="arch_type" opts={arches} />
          </Section>

          <div className="border-t border-slate-100" />

          <Section emoji="💅" title="爪の自覚症状">
            <Bool label="🎨 色の変化" field="nail_color_change" />
            <Bool label="💔 割れやすい" field="nail_brittle" />
            <Bool label="😣 痛み・圧痛" field="nail_pain" />
            <Bool label="📏 成長速度変化" field="nail_growth_change" />
          </Section>

          <div className="border-t border-slate-100" />

          <Section emoji="✂️" title="ケア習慣">
            <Sel label="爪の切り方" field="nail_care_style" opts={careStyles} />
            <Sel label="ケア頻度" field="nail_care_frequency" opts={careFreqs} />
            <Bool label="🦴 インソール使用" field="uses_insole" />
          </Section>

          <div className="border-t border-slate-100" />

          <Section emoji="⚡" title="機能・ケガ歴">
            <Sel label="捻挫歴" field="ankle_sprain" opts={sprains} />
            <Rng label="足指感覚 (1-10)" kMin="toe_grip_min" kMax="toe_grip_max" lo={1} hi={10} />
            <Rng label="バランス (1-10)" kMin="balance_min"  kMax="balance_max"  lo={1} hi={10} />
          </Section>

        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// Sort Th
// ────────────────────────────────────────────────
function SortTh({ label, sk, cur, dir, onChange }: { label: string; sk: SortKey; cur: SortKey; dir: SortDir; onChange: (k: SortKey) => void }) {
  const on = cur === sk;
  return (
    <th className="cursor-pointer select-none px-4 py-3 whitespace-nowrap" onClick={() => onChange(sk)}>
      <span className={`flex items-center gap-1 text-xs font-semibold uppercase tracking-wider ${on ? 'text-[#7c6b5e]' : 'text-slate-400'}`}>
        {label}<span className="text-[10px]">{on ? (dir === 'desc' ? '▼' : '▲') : '↕'}</span>
      </span>
    </th>
  );
}

// ────────────────────────────────────────────────
// Export Overlay
// ────────────────────────────────────────────────
function ExportOverlay({ label }: { label: string }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-white px-10 py-8 shadow-2xl">
        <svg className="h-10 w-10 animate-spin text-[#7c6b5e]" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p className="text-sm font-semibold text-slate-700">{label}</p>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// Textbook Tab
// ────────────────────────────────────────────────
interface Textbook {
  id: string;
  title: string;
  level: string;
  order_num: number;
  file_path: string;
  created_at: string;
}

const LEVEL_OPTIONS = [
  { value: 'beginner', label: '初級編' },
  { value: 'high', label: '上級編' },
  { value: 'professional', label: 'プロ編' },
  { value: 'student', label: '受講者向け' },
];

function TextbookTab({ password }: { password: string }) {
  const [books, setBooks] = useState<Textbook[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [level, setLevel] = useState('beginner');
  const [orderNum, setOrderNum] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/admin/api/textbooks', { headers: { 'x-admin-password': password } });
      const json = await res.json();
      setBooks(json.data || []);
    } catch {
      setError('取得に失敗しました');
    } finally { setLoading(false); }
  }, [password]);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file || !title.trim()) return;
    setUploading(true); setError('');
    try {
      const fd = new FormData();
      fd.append('title', title.trim());
      fd.append('level', level);
      fd.append('order_num', orderNum || '0');
      fd.append('file', file);
      const res = await fetch('/admin/api/textbooks', { method: 'POST', headers: { 'x-admin-password': password }, body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setTitle(''); setOrderNum(''); setLevel('beginner');
      if (fileRef.current) fileRef.current.value = '';
      await fetchBooks();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'アップロードに失敗しました');
    } finally { setUploading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('削除しますか？')) return;
    try {
      const res = await fetch('/admin/api/textbooks', { method: 'DELETE', headers: { 'Content-Type': 'application/json', 'x-admin-password': password }, body: JSON.stringify({ id }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      await fetchBooks();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '削除に失敗しました');
    }
  };

  return (
    <div className="mx-auto max-w-[1000px] px-4 py-6">
      {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">⚠️ {error}</div>}

      {/* Add form */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-bold text-slate-700">📚 教科書を追加</h2>
        <form onSubmit={handleAdd} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <label className="mb-1 block text-xs font-semibold text-slate-500">タイトル</label>
            <input type="text" required value={title} onChange={e => setTitle(e.target.value)}
              placeholder="例：基礎テキスト" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#7c6b5e] focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">レベル</label>
            <select value={level} onChange={e => setLevel(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#7c6b5e] focus:outline-none">
              {LEVEL_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">順序番号</label>
            <input type="number" min="0" value={orderNum} onChange={e => setOrderNum(e.target.value)}
              placeholder="0" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#7c6b5e] focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">PDFファイル</label>
            <input ref={fileRef} type="file" accept=".pdf" required
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 file:mr-2 file:rounded file:border-0 file:bg-slate-100 file:px-2 file:py-1 file:text-xs" />
          </div>
          <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
            <button type="submit" disabled={uploading}
              className="rounded-xl bg-[#7c6b5e] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#6a5a4e] disabled:opacity-50">
              {uploading ? 'アップロード中...' : 'アップロード'}
            </button>
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 px-5 py-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-700">教科書一覧 <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{books.length} 件</span></h2>
          {loading && <span className="text-xs text-slate-400">読み込み中...</span>}
        </div>
        {books.length === 0 && !loading ? (
          <div className="py-16 text-center text-slate-400"><p className="text-3xl mb-2">📚</p><p className="text-sm">教科書がありません</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left">
                  <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400">タイトル</th>
                  <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400">レベル</th>
                  <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400">順序</th>
                  <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400">ファイルパス</th>
                  <th className="px-4 py-2.5 w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {books.map(b => (
                  <tr key={b.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-medium text-slate-700">{b.title}</td>
                    <td className="px-4 py-3 text-xs">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">
                        {LEVEL_OPTIONS.find(o => o.value === b.level)?.label ?? b.level}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">{b.order_num}</td>
                    <td className="px-4 py-3 text-xs text-slate-400 font-mono max-w-[200px] truncate">{b.file_path}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDelete(b.id)}
                        className="rounded-lg bg-red-50 px-2.5 py-1.5 text-xs text-red-400 hover:bg-red-500 hover:text-white transition">
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// Main
// ────────────────────────────────────────────────
export default function AdminPage() {
  const [tab, setTab]                   = useState<'cases' | 'textbooks'>('cases');
  const [password, setPassword]         = useState<string | null>(null);
  const [authed, setAuthed]             = useState(false);
  const [cases, setCases]               = useState<NailCase[]>([]);
  const [total, setTotal]               = useState(0);
  const [page, setPage]                 = useState(1);
  const [loading, setLoading]           = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError]               = useState('');
  const [selected, setSelected]         = useState<NailCase | null>(null);
  const [searchQuery, setSearchQuery]   = useState('');
  const [exporting, setExporting]       = useState<string | null>(null);
  const [checkedIds, setCheckedIds]     = useState<Set<string>>(new Set());
  const [deleting, setDeleting]         = useState(false);
  const [sortKey, setSortKey]           = useState<SortKey>('created_at');
  const [sortDir, setSortDir]           = useState<SortDir>('desc');
  const [filters, setFilters]           = useState<Filters>(EMPTY);

  const LIMIT = 20;
  const totalPages = Math.ceil(total / LIMIT);

  const fetchCases = useCallback(async (pw: string, p: number) => {
    setLoading(true); setError('');
    try {
      const res = await fetch(`/admin/api/cases?page=${p}&limit=${LIMIT}`, { headers: { 'x-admin-password': pw } });
      if (res.status === 401) { setAuthed(false); return; }
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setCases(json.data || []); setTotal(json.total || 0);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'データ取得に失敗しました');
    } finally { setLoading(false); }
  }, []);

  const handleLogin = async (pw: string) => {
    setLoginLoading(true);
    try {
      const res = await fetch('/admin/api/cases?page=1&limit=1', { headers: { 'x-admin-password': pw } });
      if (res.status === 401) { setLoginLoading(false); return; }
      setPassword(pw); setAuthed(true);
      await fetchCases(pw, 1);
    } finally { setLoginLoading(false); }
  };

  useEffect(() => { if (authed && password) fetchCases(password, page); }, [authed, password, page, fetchCases]);

  const handleExportCsv = async () => {
    if (!password) return;
    setExporting('CSV を生成中...');
    try {
      const res = await fetch('/admin/api/cases?format=csv', { headers: { 'x-admin-password': password } });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `nail_cases_${Date.now()}.csv`; a.click();
      URL.revokeObjectURL(url);
    } finally { setExporting(null); }
  };

  const handleExportZip = async () => {
    if (!password) return;
    setExporting('ZIP を生成中...');
    try {
      const res = await fetch('/admin/api/export-zip', { headers: { 'x-admin-password': password } });
      if (!res.ok) throw new Error('ZIP生成に失敗しました');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `nail_export_${Date.now()}.zip`; a.click();
      URL.revokeObjectURL(url);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'ZIPエクスポートに失敗しました');
    } finally { setExporting(null); }
  };

  const handleDelete = async (ids: string[]) => {
    if (!password || !ids.length) return;
    if (!confirm(`${ids.length === 1 ? 'この1件' : `${ids.length}件`}を削除しますか？`)) return;
    setDeleting(true);
    try {
      const res = await fetch('/admin/api/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ ids }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setCheckedIds(new Set());
      await fetchCases(password, page);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '削除に失敗しました');
    } finally { setDeleting(false); }
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const setF = (p: Partial<Filters>) => setFilters(prev => ({ ...prev, ...p }));
  const resetF = () => { setFilters(EMPTY); setSearchQuery(''); };
  const activeFilters = Object.values(filters).filter(v => v !== '').length + (searchQuery ? 1 : 0);

  // ── フィルタリング ──────────────────────────────────────
  const filtered = cases
    .filter(c => {
      const v = filters;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (![c.id, c.ai_diagnosis ?? '', getSport(c), ...(c.detected_issues ?? []), c.gender ?? '', c.arch_type ?? '', c.curved_nail ?? ''].join(' ').toLowerCase().includes(q)) return false;
      }
      if (v.scoreMin       && c.health_score < +v.scoreMin) return false;
      if (v.scoreMax       && c.health_score > +v.scoreMax) return false;
      if (v.nail_score_min && (c.nail_score ?? 0)   < +v.nail_score_min) return false;
      if (v.nail_score_max && (c.nail_score ?? 999) > +v.nail_score_max) return false;
      if (v.sport          && getSport(c) !== v.sport)            return false;
      if (v.gender         && c.gender !== v.gender)              return false;
      if (v.ageMin         && (c.age ?? 0)   < +v.ageMin)        return false;
      if (v.ageMax         && (c.age ?? 999) > +v.ageMax)        return false;
      if (v.dominant_foot  && c.dominant_foot !== v.dominant_foot) return false;
      if (v.practice_frequency && c.practice_frequency !== v.practice_frequency) return false;
      if (v.curved_nail    && c.curved_nail !== v.curved_nail)     return false;
      if (v.hallux_valgus  && c.hallux_valgus !== v.hallux_valgus) return false;
      if (v.arch_type      && c.arch_type !== v.arch_type)         return false;
      if (v.nail_color_change === 'true'  && !c.nail_color_change)          return false;
      if (v.nail_color_change === 'false' && c.nail_color_change !== false)  return false;
      if (v.nail_brittle   === 'true'     && !c.nail_brittle)               return false;
      if (v.nail_brittle   === 'false'    && c.nail_brittle !== false)       return false;
      if (v.nail_pain      === 'true'     && !c.nail_pain)                  return false;
      if (v.nail_pain      === 'false'    && c.nail_pain !== false)          return false;
      if (v.nail_growth_change === 'true'  && !c.nail_growth_change)         return false;
      if (v.nail_growth_change === 'false' && c.nail_growth_change !== false) return false;
      if (v.nail_care_style    && c.nail_care_style !== v.nail_care_style)    return false;
      if (v.nail_care_frequency && c.nail_care_frequency !== v.nail_care_frequency) return false;
      if (v.uses_insole === 'true'  && !c.uses_insole)              return false;
      if (v.uses_insole === 'false' && c.uses_insole !== false)     return false;
      if (v.ankle_sprain   && c.ankle_sprain !== v.ankle_sprain)    return false;
      if (v.toe_grip_min   && (c.toe_grip ?? 0)  < +v.toe_grip_min) return false;
      if (v.toe_grip_max   && (c.toe_grip ?? 99) > +v.toe_grip_max) return false;
      if (v.balance_min    && (c.balance ?? 0)   < +v.balance_min)  return false;
      if (v.balance_max    && (c.balance ?? 99)  > +v.balance_max)  return false;
      return true;
    })
    .sort((a, b) => {
      const av = a[sortKey] ?? (sortDir === 'desc' ? -Infinity : Infinity);
      const bv = b[sortKey] ?? (sortDir === 'desc' ? -Infinity : Infinity);
      if (av < bv) return sortDir === 'desc' ? 1 : -1;
      if (av > bv) return sortDir === 'desc' ? -1 : 1;
      return 0;
    });

  const toggleAll = () => setCheckedIds(checkedIds.size === filtered.length ? new Set() : new Set(filtered.map(c => c.id)));
  const toggleCheck = (id: string) => setCheckedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const avgScore = filtered.length ? Math.round(filtered.reduce((s, c) => s + c.health_score, 0) / filtered.length) : null;

  if (!authed) return <LoginScreen onLogin={handleLogin} loading={loginLoading} />;

  return (
    <div className="min-h-screen bg-slate-50">
      {exporting && <ExportOverlay label={exporting} />}

      {/* Topbar */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7c6b5e] text-lg text-white">💅</div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-slate-800">爪整体 管理画面</h1>
              <p className="text-xs text-slate-400">診断データ一覧</p>
            </div>
          </div>

          {/* 検索 */}
          <div className="relative flex-1 max-w-xs">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="キーワード検索..."
              className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-8 pr-7 text-xs focus:border-[#7c6b5e] focus:outline-none" />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">✕</button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">計 {total} 件</span>
            {activeFilters > 0 && (
              <span className="rounded-full bg-[#7c6b5e] px-2 py-1 text-xs font-bold text-white">{filtered.length} 件絞込中</span>
            )}
            <button onClick={handleExportCsv} disabled={!!exporting || total === 0}
              className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40">
              📊 <span className="hidden sm:inline">CSV</span>
            </button>
            <button onClick={handleExportZip} disabled={!!exporting || total === 0}
              className="flex items-center gap-1 rounded-lg bg-[#7c6b5e] px-3 py-2 text-xs font-semibold text-white hover:bg-[#6a5a4e] disabled:opacity-40">
              📦 <span className="hidden sm:inline">ZIP</span>
            </button>
            {checkedIds.size > 0 && (
              <button onClick={() => handleDelete(Array.from(checkedIds))} disabled={deleting}
                className="flex items-center gap-1 rounded-lg bg-red-500 px-3 py-2 text-xs font-semibold text-white hover:bg-red-600 disabled:opacity-40">
                🗑️ {checkedIds.size}件
              </button>
            )}
            <button onClick={() => { setAuthed(false); setPassword(null); }} className="rounded-lg px-3 py-2 text-xs text-slate-400 hover:bg-slate-100">✕</button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-slate-200 bg-white px-4">
        <div className="mx-auto flex max-w-[1400px] gap-1">
          {(['cases', 'textbooks'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition ${tab === t ? 'border-[#7c6b5e] text-[#7c6b5e]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
              {t === 'cases' ? '診断データ' : 'テキスト管理'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      {tab === 'cases' && avgScore !== null && (
        <div className="border-b border-slate-200 bg-white px-4 py-2">
          <div className="mx-auto flex max-w-[1400px] items-center gap-4 text-xs text-slate-500">
            <span>表示 <b className="text-slate-800">{filtered.length}</b> 件</span>
            <span>平均 <b className="text-slate-800">{avgScore}</b></span>
            <span>最高 <b className="text-emerald-600">{Math.max(...filtered.map(c => c.health_score))}</b></span>
            <span>最低 <b className="text-red-500">{Math.min(...filtered.map(c => c.health_score))}</b></span>
            {activeFilters > 0 && <button onClick={resetF} className="ml-auto text-red-400 hover:text-red-600 font-semibold">フィルターをすべてリセット ✕</button>}
          </div>
        </div>
      )}

      {tab === 'textbooks' && password && <TextbookTab password={password} />}

      {/* Body: Filter + Table */}
      {tab === 'cases' && <div className="mx-auto flex max-w-[1400px] gap-5 px-4 py-6">

        {/* Filter Panel */}
        <FilterPanel f={filters} set={setF} reset={resetF} cases={cases} />

        {/* Table */}
        <div className="flex-1 min-w-0">
          {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">⚠️ {error}</div>}

          {loading ? (
            <div className="flex items-center justify-center py-32 text-slate-400 gap-3">
              <svg className="h-6 w-6 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              読み込み中...
            </div>
          ) : cases.length === 0 ? (
            <div className="py-32 text-center text-slate-400"><p className="text-4xl mb-2">📭</p><p className="text-sm">データがありません</p></div>
          ) : filtered.length === 0 ? (
            <div className="py-32 text-center text-slate-400">
              <p className="text-4xl mb-2">🔍</p>
              <p className="text-sm">条件に一致するデータがありません</p>
              <button onClick={resetF} className="mt-3 rounded-lg bg-[#7c6b5e] px-4 py-2 text-xs font-semibold text-white">フィルターをリセット</button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-sm min-w-[750px]">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50 text-left">
                      <th className="px-3 py-3 w-10">
                        <input type="checkbox" checked={checkedIds.size === filtered.length && filtered.length > 0}
                          onChange={toggleAll} className="h-4 w-4 cursor-pointer accent-[#7c6b5e]" />
                      </th>
                      <th className="px-3 py-3 w-14 text-xs font-semibold uppercase tracking-wider text-slate-400">画像</th>
                      <SortTh label="総合" sk="health_score" cur={sortKey} dir={sortDir} onChange={handleSort} />
                      <SortTh label="爪"   sk="nail_score"   cur={sortKey} dir={sortDir} onChange={handleSort} />
                      <SortTh label="問診" sk="quiz_score"   cur={sortKey} dir={sortDir} onChange={handleSort} />
                      <SortTh label="日時" sk="created_at"   cur={sortKey} dir={sortDir} onChange={handleSort} />
                      <SortTh label="年齢" sk="age"          cur={sortKey} dir={sortDir} onChange={handleSort} />
                      <SortTh label="足指" sk="toe_grip"     cur={sortKey} dir={sortDir} onChange={handleSort} />
                      <SortTh label="バランス" sk="balance"  cur={sortKey} dir={sortDir} onChange={handleSort} />
                      <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">競技</th>
                      <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">問題</th>
                      <th className="px-3 py-3 w-20"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map(c => {
                      const col = scoreColor(c.health_score);
                      return (
                        <tr key={c.id} className={`transition hover:bg-slate-50/80 ${checkedIds.has(c.id) ? 'bg-red-50/40' : ''}`}>
                          <td className="px-3 py-2.5">
                            <input type="checkbox" checked={checkedIds.has(c.id)} onChange={() => toggleCheck(c.id)}
                              className="h-4 w-4 cursor-pointer accent-[#7c6b5e]" />
                          </td>
                          <td className="px-3 py-2.5">
                            {c.image_url
                              // eslint-disable-next-line @next/next/no-img-element
                              ? <img src={c.image_url} alt="nail" className="h-11 w-11 rounded-lg border object-cover shadow-sm"
                                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                              : <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-lg text-slate-300">💅</div>
                            }
                          </td>
                          <td className="px-3 py-2.5">
                            <span className={`inline-flex rounded-lg px-2 py-1 text-sm font-bold ring-1 ${col.bg} ${col.text} ${col.ring}`}>{c.health_score}</span>
                          </td>
                          <td className="px-3 py-2.5 text-xs font-semibold text-pink-600">{c.nail_score ?? '—'}</td>
                          <td className="px-3 py-2.5 text-xs font-semibold text-blue-600">{c.quiz_score ?? '—'}</td>
                          <td className="px-3 py-2.5 text-xs text-slate-500 whitespace-nowrap">{fmtDate(c.created_at)}</td>
                          <td className="px-3 py-2.5 text-xs text-slate-600">{c.age ? `${c.age}歳` : '—'}</td>
                          <td className="px-3 py-2.5 text-xs text-slate-600">{c.toe_grip ?? '—'}</td>
                          <td className="px-3 py-2.5 text-xs text-slate-600">{c.balance ?? '—'}</td>
                          <td className="px-3 py-2.5 text-xs text-slate-600">{getSport(c) || '—'}</td>
                          <td className="px-3 py-2.5 max-w-[180px]">
                            <div className="flex flex-wrap gap-1">
                              {(c.detected_issues || []).slice(0, 2).map((x, i) => (
                                <span key={i} className="rounded-full border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] text-amber-700">
                                  {x.length > 12 ? x.slice(0, 12) + '…' : x}
                                </span>
                              ))}
                              {(c.detected_issues || []).length > 2 && (
                                <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500">+{c.detected_issues.length - 2}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="flex gap-1">
                              <button onClick={() => setSelected(c)}
                                className="rounded-lg bg-[#7c6b5e]/10 px-2.5 py-1.5 text-xs font-semibold text-[#7c6b5e] hover:bg-[#7c6b5e] hover:text-white transition">
                                詳細
                              </button>
                              <button onClick={() => handleDelete([c.id])} disabled={deleting}
                                className="rounded-lg bg-red-50 px-2 py-1.5 text-xs text-red-400 hover:bg-red-500 hover:text-white transition disabled:opacity-40">
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-center gap-2">
                  <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40">← 前へ</button>
                  <span className="text-xs text-slate-500">{page} / {totalPages}</span>
                  <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40">次へ →</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>}

      {selected && <DetailModal item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
