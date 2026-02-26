'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

// ────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────
interface ConversationLog {
  session_id: string;
  messages: { role: string; content: string }[];
}

interface NailCondition {
  nail_score?: number;
  quiz_score?: number;
  nail_findings?: string[];
}

interface NailCase {
  id: string;
  created_at: string;
  health_score: number;
  locale: string;
  ai_diagnosis: string;
  detected_issues: string[];
  recommendations: string[];
  image_url: string | null;
  health_data: Record<string, unknown>;
  nail_condition: NailCondition;
  model_version: string;
  conversation_logs: ConversationLog[];
}

// ────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────
function scoreColor(score: number) {
  if (score >= 80) return { bg: 'bg-emerald-100', text: 'text-emerald-700', ring: 'ring-emerald-400' };
  if (score >= 50) return { bg: 'bg-amber-100',   text: 'text-amber-700',   ring: 'ring-amber-400'   };
  if (score >= 20) return { bg: 'bg-orange-100',  text: 'text-orange-700',  ring: 'ring-orange-400'  };
  return             { bg: 'bg-red-100',    text: 'text-red-700',    ring: 'ring-red-400'    };
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString('ja-JP', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });
}

// ────────────────────────────────────────────────
// Login Screen
// ────────────────────────────────────────────────
function LoginScreen({ onLogin, loading }: { onLogin: (pw: string) => void; loading: boolean }) {
  const [pw, setPw] = useState('');
  const [attempted, setAttempted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pw.trim()) return;
    setAttempted(true);
    onLogin(pw);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#7c6b5e] text-2xl text-white shadow">
            🔐
          </div>
          <h1 className="text-xl font-bold text-slate-800">管理画面</h1>
          <p className="mt-1 text-sm text-slate-500">爪整体 AI 診断データ</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={pw}
            onChange={(e) => { setPw(e.target.value); setAttempted(false); }}
            placeholder="パスワードを入力"
            disabled={loading}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#7c6b5e] focus:outline-none focus:ring-2 focus:ring-[#7c6b5e]/20"
          />
          <button
            type="submit"
            disabled={loading || !pw.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#7c6b5e] py-3 text-sm font-bold text-white transition hover:bg-[#6a5a4e] disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                認証中...
              </>
            ) : 'ログイン'}
          </button>
          {attempted && !loading && (
            <p className="text-center text-xs text-red-500">パスワードが正しくありません</p>
          )}
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 pt-10 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <p className="text-xs text-slate-400">{fmtDate(item.created_at)}</p>
            <p className="font-mono text-xs font-semibold text-slate-500 mt-0.5">{item.id}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 transition">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-5 p-6">
          {/* Score + Image */}
          <div className="flex items-start gap-4">
            {item.image_url ? (
              <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl border border-slate-200 shadow-sm">
                <Image src={item.image_url} alt="nail" fill className="object-cover" />
              </div>
            ) : (
              <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-300 text-4xl">
                💅
              </div>
            )}
            <div className="flex-1">
              <div className={`inline-flex items-baseline gap-1 rounded-xl px-4 py-2 ring-2 ${color.bg} ${color.ring}`}>
                <span className={`text-4xl font-bold ${color.text}`}>{item.health_score}</span>
                <span className={`text-sm ${color.text}`}>/100 総合</span>
              </div>
              {/* スコア内訳 */}
              {(item.nail_condition?.nail_score != null || item.nail_condition?.quiz_score != null) && (
                <div className="mt-2 flex gap-2">
                  {item.nail_condition.nail_score != null && (
                    <span className="rounded-lg bg-pink-50 px-2 py-1 text-xs font-semibold text-pink-600">
                      💅 爪 {item.nail_condition.nail_score}
                    </span>
                  )}
                  {item.nail_condition.quiz_score != null && (
                    <span className="rounded-lg bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
                      📋 問診 {item.nail_condition.quiz_score}
                    </span>
                  )}
                </div>
              )}
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                <span className="rounded-full bg-slate-100 px-2 py-1 font-medium">{item.locale.toUpperCase()}</span>
                <span className="rounded-full bg-slate-100 px-2 py-1">{item.model_version}</span>
              </div>
            </div>
          </div>

          {/* 爪所見 */}
          {item.nail_condition?.nail_findings && item.nail_condition.nail_findings.length > 0 && (
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">💅 画像からの爪所見</h3>
              <ul className="space-y-1">
                {item.nail_condition.nail_findings.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-pink-400" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Issues */}
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">検出された問題</h3>
            <ul className="space-y-1">
              {(item.detected_issues || []).map((issue, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                  {issue}
                </li>
              ))}
            </ul>
          </div>

          {/* Recommendations */}
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">推奨事項</h3>
            <ul className="space-y-1">
              {(item.recommendations || []).map((rec, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>

          {/* AI Analysis */}
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">AI 分析</h3>
            <p className="whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
              {item.ai_diagnosis}
            </p>
          </div>

          {/* Conversation Log */}
          {logs && logs.messages && logs.messages.length > 0 && (
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                問診ログ（{logs.messages.length} メッセージ）
              </h3>
              <div className="max-h-64 overflow-y-auto rounded-xl border border-slate-100 bg-slate-50 p-3 space-y-2">
                {logs.messages.map((msg, i) => (
                  <div key={i} className={`flex gap-2 text-xs ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <span className={`max-w-[80%] rounded-lg px-3 py-2 leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#7c6b5e] text-white'
                        : 'bg-white text-slate-700 border border-slate-200'
                    }`}>
                      {msg.content}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// Export Progress Overlay
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
        <p className="text-xs text-slate-400">画像が多い場合は少し時間がかかります</p>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// Main Admin Page
// ────────────────────────────────────────────────
export default function AdminPage() {
  const [password, setPassword]     = useState<string | null>(null);
  const [authed, setAuthed]         = useState(false);
  const [cases, setCases]           = useState<NailCase[]>([]);
  const [total, setTotal]           = useState(0);
  const [page, setPage]             = useState(1);
  const [loading, setLoading]       = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError]           = useState('');
  const [selected, setSelected]     = useState<NailCase | null>(null);
  const [sportFilter, setSportFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [exporting, setExporting]   = useState<string | null>(null);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [deleting, setDeleting]     = useState(false);

  const LIMIT = 20;
  const totalPages = Math.ceil(total / LIMIT);

  const fetchCases = useCallback(async (pw: string, p: number) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/admin/api/cases?page=${p}&limit=${LIMIT}`, {
        headers: { 'x-admin-password': pw },
      });
      if (res.status === 401) { setAuthed(false); return; }
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setCases(json.data || []);
      setTotal(json.total || 0);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'データ取得に失敗しました');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogin = async (pw: string) => {
    setLoginLoading(true);
    try {
      const res = await fetch('/admin/api/cases?page=1&limit=1', {
        headers: { 'x-admin-password': pw },
      });
      if (res.status === 401) { setLoginLoading(false); return; }
      setPassword(pw);
      setAuthed(true);
      await fetchCases(pw, 1);
    } finally {
      setLoginLoading(false);
    }
  };

  useEffect(() => {
    if (authed && password) fetchCases(password, page);
  }, [authed, password, page, fetchCases]);

  // ── CSV only ──────────────────────────────────
  const handleExportCsv = async () => {
    if (!password) return;
    setExporting('CSV を生成中...');
    try {
      const res = await fetch('/admin/api/cases?format=csv', {
        headers: { 'x-admin-password': password },
      });
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `nail_cases_${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(null);
    }
  };

  // ── ZIP (CSV + JSON + 画像) ───────────────────
  const handleExportZip = async () => {
    if (!password) return;
    setExporting('ZIP を生成中（画像含む）...');
    try {
      const res = await fetch('/admin/api/export-zip', {
        headers: { 'x-admin-password': password },
      });
      if (!res.ok) throw new Error('ZIP生成に失敗しました');
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `nail_export_${Date.now()}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'ZIPエクスポートに失敗しました');
    } finally {
      setExporting(null);
    }
  };

  // ── 削除 ─────────────────────────────────────
  const handleDelete = async (ids: string[]) => {
    if (!password || ids.length === 0) return;
    const label = ids.length === 1 ? 'この1件' : `選択した${ids.length}件`;
    if (!confirm(`${label}を削除しますか？この操作は取り消せません。`)) return;
    setDeleting(true);
    setError('');
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
    } finally {
      setDeleting(false);
    }
  };

  const toggleCheck = (id: string) => {
    setCheckedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (checkedIds.size === filteredCases.length) {
      setCheckedIds(new Set());
    } else {
      setCheckedIds(new Set(filteredCases.map(c => c.id)));
    }
  };

  // ── フィルタリング ──────────────────────────────
  const filteredCases = cases.filter((c) => {
    if (sportFilter) {
      const sport = (c.health_data?.sport as string) ?? '';
      if (sport !== sportFilter) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const searchTargets = [
        c.id,
        c.ai_diagnosis ?? '',
        (c.detected_issues ?? []).join(' '),
        (c.recommendations ?? []).join(' '),
        (c.health_data?.sport as string) ?? '',
        String(c.health_score),
        c.locale,
      ].join(' ').toLowerCase();
      if (!searchTargets.includes(q)) return false;
    }
    return true;
  });

  // 競技名リスト（重複なし）
  const sportOptions = Array.from(
    new Set(cases.map((c) => (c.health_data?.sport as string) ?? '').filter(Boolean))
  ).sort();

  // ── avg / hi / low ────────────────────────────
  const avgScore = filteredCases.length
    ? Math.round(filteredCases.reduce((s, c) => s + c.health_score, 0) / filteredCases.length)
    : null;

  if (!authed) {
    return <LoginScreen onLogin={handleLogin} loading={loginLoading} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {exporting && <ExportOverlay label={exporting} />}

      {/* ── Topbar ─────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">

          {/* Brand */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7c6b5e] text-lg text-white shadow">
              💅
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-slate-800 leading-tight">爪整体 管理画面</h1>
              <p className="text-xs text-slate-400 leading-tight">診断データ一覧</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
              計 {total} 件
            </span>

            {/* CSV */}
            <button
              onClick={handleExportCsv}
              disabled={!!exporting || total === 0}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
            >
              <span>📊</span>
              <span className="hidden sm:inline">CSV</span>
            </button>

            {/* ZIP */}
            <button
              onClick={handleExportZip}
              disabled={!!exporting || total === 0}
              className="flex items-center gap-1.5 rounded-lg bg-[#7c6b5e] px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#6a5a4e] disabled:opacity-40"
            >
              <span>📦</span>
              <span className="hidden sm:inline">ZIP（画像込み）</span>
            </button>

            {/* 一括削除 */}
            {checkedIds.size > 0 && (
              <button
                onClick={() => handleDelete(Array.from(checkedIds))}
                disabled={deleting}
                className="flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-red-600 disabled:opacity-40"
              >
                <span>🗑️</span>
                <span>{checkedIds.size}件削除</span>
              </button>
            )}

            <button
              onClick={() => { setAuthed(false); setPassword(null); }}
              className="rounded-lg px-3 py-2 text-xs text-slate-400 hover:bg-slate-100 transition"
              title="ログアウト"
            >
              ✕
            </button>
          </div>
        </div>
      </header>

      {/* ── Stats Bar ──────────────────────────────── */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-2.5">
          {/* 検索 */}
          <div className="relative flex items-center">
            <svg className="absolute left-3 h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="キーワード検索..."
              className="rounded-lg border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-600 placeholder:text-slate-400 focus:border-[#7c6b5e] focus:outline-none focus:ring-2 focus:ring-[#7c6b5e]/20 w-44"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2 text-slate-400 hover:text-slate-600">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* 競技フィルター */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">競技:</span>
            <select
              value={sportFilter}
              onChange={(e) => { setSportFilter(e.target.value); setPage(1); }}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 focus:border-[#7c6b5e] focus:outline-none focus:ring-2 focus:ring-[#7c6b5e]/20"
            >
              <option value="">すべて</option>
              {sportOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {sportFilter && (
              <button
                onClick={() => setSportFilter('')}
                className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-500 hover:bg-slate-200 transition"
              >
                ✕ クリア
              </button>
            )}
          </div>

          {/* Stats */}
          {avgScore !== null && (
            <div className="flex gap-4 text-sm">
              <span className="text-slate-500">
                {sportFilter ? `${sportFilter} ` : ''}平均: <span className="font-bold text-slate-800">{avgScore}</span>
              </span>
              <span className="text-slate-500">
                最高: <span className="font-bold text-emerald-600">{Math.max(...filteredCases.map((c) => c.health_score))}</span>
              </span>
              <span className="text-slate-500">
                最低: <span className="font-bold text-red-500">{Math.min(...filteredCases.map((c) => c.health_score))}</span>
              </span>
              {sportFilter && (
                <span className="text-slate-400 text-xs self-center">{filteredCases.length}件</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Main ───────────────────────────────────── */}
      <main className="mx-auto max-w-7xl px-4 py-6">
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24 text-slate-400 gap-3">
            <svg className="h-6 w-6 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            読み込み中...
          </div>
        ) : cases.length === 0 ? (
          <div className="py-24 text-center text-slate-400">
            <p className="text-4xl mb-2">📭</p>
            <p className="text-sm">データがありません</p>
          </div>
        ) : (
          <>
            {/* ── Table ─────────────────────────────── */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-sm min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <th className="px-4 py-3 w-10">
                      <input
                        type="checkbox"
                        checked={checkedIds.size === filteredCases.length && filteredCases.length > 0}
                        onChange={toggleAll}
                        className="h-4 w-4 cursor-pointer accent-[#7c6b5e]"
                      />
                    </th>
                    <th className="px-4 py-3 w-16">画像</th>
                    <th className="px-4 py-3 w-20">スコア</th>
                    <th className="px-4 py-3">日時</th>
                    <th className="px-4 py-3">検出された問題</th>
                    <th className="px-4 py-3 w-14">言語</th>
                    <th className="px-4 py-3 w-20">問診</th>
                    <th className="px-4 py-3 w-28"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCases.map((c) => {
                    const color = scoreColor(c.health_score);
                    const logs  = c.conversation_logs?.[0];
                    return (
                      <tr key={c.id} className={`transition hover:bg-slate-50/80 cursor-default ${checkedIds.has(c.id) ? 'bg-red-50/40' : ''}`}>

                        {/* Checkbox */}
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={checkedIds.has(c.id)}
                            onChange={() => toggleCheck(c.id)}
                            className="h-4 w-4 cursor-pointer accent-[#7c6b5e]"
                          />
                        </td>

                        {/* Thumbnail */}
                        <td className="px-4 py-3">
                          {c.image_url ? (
                            <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-slate-200 shadow-sm">
                              <Image src={c.image_url} alt="nail" fill className="object-cover" sizes="48px" />
                            </div>
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-xl text-slate-300">
                              💅
                            </div>
                          )}
                        </td>

                        {/* Score badge */}
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-sm font-bold ring-1 ${color.bg} ${color.text} ${color.ring}`}>
                            {c.health_score}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                          {fmtDate(c.created_at)}
                        </td>

                        {/* Issues chips */}
                        <td className="px-4 py-3 max-w-xs">
                          <div className="flex flex-wrap gap-1">
                            {(c.detected_issues || []).slice(0, 3).map((issue, i) => (
                              <span key={i} className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
                                {issue.length > 16 ? issue.slice(0, 16) + '…' : issue}
                              </span>
                            ))}
                            {(c.detected_issues || []).length > 3 && (
                              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                                +{c.detected_issues.length - 3}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Locale */}
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500 uppercase">
                            {c.locale}
                          </span>
                        </td>

                        {/* Msg count */}
                        <td className="px-4 py-3 text-xs text-slate-400">
                          {logs ? `${logs.messages?.length ?? 0} msg` : '—'}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setSelected(c)}
                              className="rounded-lg bg-[#7c6b5e]/10 px-3 py-1.5 text-xs font-semibold text-[#7c6b5e] transition hover:bg-[#7c6b5e] hover:text-white"
                            >
                              詳細
                            </button>
                            <button
                              onClick={() => handleDelete([c.id])}
                              disabled={deleting}
                              className="rounded-lg bg-red-50 px-2 py-1.5 text-xs font-semibold text-red-400 transition hover:bg-red-500 hover:text-white disabled:opacity-40"
                              title="削除"
                            >
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

            {/* ── Pagination ────────────────────────── */}
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition"
                >
                  ← 前へ
                </button>
                <span className="text-xs text-slate-500">{page} / {totalPages}</span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition"
                >
                  次へ →
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* ── Detail Modal ───────────────────────────── */}
      {selected && <DetailModal item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
