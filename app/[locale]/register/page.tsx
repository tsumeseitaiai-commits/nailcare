'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabaseClient';
import { useRouter, Link } from '@/i18n/routing';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '', display_name: '', role: 'member', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { display_name: form.display_name, role: form.role, phone: form.phone } },
    });
    if (error) { setError(error.message); setLoading(false); return; }
    router.push('/members/textbook');
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted">
      <Header />
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-md px-4">
          <div className="rounded-xl border border-border bg-white p-8 shadow-sm">
            <h1 className="mb-2 text-2xl font-bold text-foreground">会員登録</h1>
            <p className="mb-6 text-sm text-muted-foreground">登録すると爪整体テキストが閲覧できます</p>
            {error && <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold">お名前</label>
                <input type="text" required value={form.display_name}
                  onChange={e => setForm(p => ({ ...p, display_name: e.target.value }))}
                  className="w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
                  placeholder="山田 太郎" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold">職業</label>
                <div className="grid grid-cols-2 gap-2">
                  {[{ value: 'member', label: '一般' }, { value: 'practitioner', label: '整体師・施術者' }].map(opt => (
                    <button key={opt.value} type="button"
                      onClick={() => setForm(p => ({ ...p, role: opt.value }))}
                      className={`rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all ${form.role === opt.value ? 'border-primary bg-primary/5 text-primary' : 'border-border text-foreground hover:border-primary/40'}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold">電話番号</label>
                <input type="tel" value={form.phone}
                  onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                  className="w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
                  placeholder="090-0000-0000" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold">メールアドレス</label>
                <input type="email" required value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className="w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
                  placeholder="example@email.com" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold">パスワード</label>
                <input type="password" required minLength={8} value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className="w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
                  placeholder="8文字以上" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-white hover:bg-primary/90 disabled:opacity-50">
                {loading ? '登録中...' : '会員登録する'}
              </button>
            </form>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              すでにアカウントをお持ちの方は <Link href="/login" className="font-semibold text-primary hover:underline">ログイン</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
