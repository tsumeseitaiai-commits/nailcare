import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

function checkAuth(req: NextRequest): boolean {
  return req.headers.get('x-admin-password') === process.env.ADMIN_PASSWORD;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('user_id'); // 特定ユーザーの診断一覧
  const supabase = getSupabaseAdmin();

  // 特定ユーザーの診断履歴を返す
  if (userId) {
    const [nailResult, soleResult] = await Promise.all([
      supabase
        .from('nail_cases')
        .select('id, created_at, body_part, health_score, nail_score, quiz_score, detected_issues, image_url, sport, age, gender, ai_diagnosis, recommendations')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50),
      supabase
        .from('sole_cases')
        .select('id, created_at, health_score, sole_score, detected_issues, image_url, severity, ai_diagnosis, recommendations')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50),
    ]);

    const nailCases = (nailResult.data ?? []).map(r => ({ ...r, body_part: r.body_part ?? 'nail' }));
    const soleCases = (soleResult.data ?? []).map(r => ({ ...r, body_part: 'sole' }));
    const all = [...nailCases, ...soleCases].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return NextResponse.json({ data: all });
  }

  // ユーザー一覧を返す
  const { data: authData, error: authError } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 500 });
  }

  const users = authData.users;
  if (users.length === 0) {
    return NextResponse.json({ data: [] });
  }

  const userIds = users.map(u => u.id);

  // nail_cases と sole_cases の件数を集計
  const [nailCounts, soleCounts] = await Promise.all([
    supabase
      .from('nail_cases')
      .select('user_id')
      .in('user_id', userIds),
    supabase
      .from('sole_cases')
      .select('user_id')
      .in('user_id', userIds),
  ]);

  const nailCountMap: Record<string, number> = {};
  for (const row of nailCounts.data ?? []) {
    if (row.user_id) nailCountMap[row.user_id] = (nailCountMap[row.user_id] ?? 0) + 1;
  }

  const soleCountMap: Record<string, number> = {};
  for (const row of soleCounts.data ?? []) {
    if (row.user_id) soleCountMap[row.user_id] = (soleCountMap[row.user_id] ?? 0) + 1;
  }

  const result = users.map(u => {
    const provider = u.app_metadata?.provider ?? 'email';
    const name = u.user_metadata?.full_name ?? u.user_metadata?.name ?? null;
    return {
      id: u.id,
      email: u.email ?? null,
      name,
      provider,
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at ?? null,
      nail_count: nailCountMap[u.id] ?? 0,
      sole_count: soleCountMap[u.id] ?? 0,
    };
  });

  // 診断数降順でソート
  result.sort((a, b) => (b.nail_count + b.sole_count) - (a.nail_count + a.sole_count));

  return NextResponse.json({ data: result, total: result.length });
}
