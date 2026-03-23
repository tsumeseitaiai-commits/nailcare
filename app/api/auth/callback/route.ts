import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClientFromCookies } from '@/lib/supabaseServer';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const cookieHeader = request.headers.get('cookie');
    const supabase = createSupabaseServerClientFromCookies(cookieHeader);
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/ja/login?error=auth_callback_failed`);
}
