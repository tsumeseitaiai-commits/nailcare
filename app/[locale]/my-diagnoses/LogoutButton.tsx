'use client';

import { useRouter } from '@/i18n/routing';
import { createClient } from '@/lib/supabaseClient';

export default function LogoutButton({ locale }: { locale: string }) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      ログアウト
    </button>
  );
}
