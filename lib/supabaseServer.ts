import { createServerClient } from '@supabase/ssr';

/**
 * サーバーコンポーネント用: Next.js の cookies() を使う
 */
export async function createSupabaseServerClient() {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component から呼ばれた場合は set が使えないので無視
          }
        },
      },
    }
  );
}

/**
 * API Route / Middleware 用: Cookie ヘッダー文字列から作成
 */
export function createSupabaseServerClientFromCookies(cookieHeader: string | null) {
  const parseCookies = (header: string | null): Record<string, string> => {
    if (!header) return {};
    return Object.fromEntries(
      header.split(';').map((c) => {
        const [key, ...v] = c.trim().split('=');
        return [key.trim(), decodeURIComponent(v.join('='))];
      })
    );
  };

  const parsed = parseCookies(cookieHeader);

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return Object.entries(parsed).map(([name, value]) => ({ name, value }));
        },
        setAll() {
          // API Route では set 不要
        },
      },
    }
  );
}
