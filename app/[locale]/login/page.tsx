'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabaseClient';
import { useRouter, Link } from '@/i18n/routing';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError('メールアドレスまたはパスワードが違います'); setLoading(false); return; }
    router.push('/members/textbook');
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted">
      <Header />
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-md px-4">
          <div className="rounded-xl border border-border bg-white p-8 shadow-sm">
            <h1 className="mb-2 text-2xl font-bold text-foreground">ログイン</h1>
            <p className="mb-6 text-sm text-muted-foreground">会員の方はこちらからログイン</p>
            {error && <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold">メールアドレス</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold">パスワード</label>
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-primary focus:outline-none" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-white hover:bg-primary/90 disabled:opacity-50">
                {loading ? 'ログイン中...' : 'ログイン'}
              </button>
            </form>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              アカウントをお持ちでない方は <Link href="/register" className="font-semibold text-primary hover:underline">会員登録</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
