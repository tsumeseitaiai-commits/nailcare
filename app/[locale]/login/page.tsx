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
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError('メールアドレスまたはパスワードが違います');
      setLoading(false);
      return;
    }
    router.push('/members/textbook');
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback?next=/ja/my-diagnoses`,
      },
    });
    if (error) {
      setError('Googleログインに失敗しました');
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted">
      <Header />
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-md px-4">
          <div className="rounded-xl border border-border bg-white p-8 shadow-sm">
            <h1 className="mb-2 text-2xl font-bold text-foreground">ログイン</h1>
            <p className="mb-6 text-sm text-muted-foreground">会員の方はこちらからログイン</p>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Google ログインボタン */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="mb-4 flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-white px-4 py-3 text-sm font-semibold text-foreground shadow-sm transition-all hover:bg-muted disabled:opacity-50"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {googleLoading ? 'リダイレクト中...' : 'Googleでログイン'}
            </button>

            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs text-muted-foreground">
                <span className="bg-white px-2">または</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold">メールアドレス</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold">パスワード</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-white hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? 'ログイン中...' : 'ログイン'}
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              アカウントをお持ちでない方は{' '}
              <Link href="/register" className="font-semibold text-primary hover:underline">
                会員登録
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
