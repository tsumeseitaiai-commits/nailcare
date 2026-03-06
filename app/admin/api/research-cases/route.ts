import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

function checkAuth(req: NextRequest): boolean {
  return req.headers.get('x-admin-password') === process.env.ADMIN_PASSWORD;
}

const SELECT_FIELDS = `
  id, created_at, locale,
  age, gender, height, weight, country, sport,
  position, dominant_hand, dominant_foot, sports_history,
  weekly_sessions, session_duration, monthly_matches, training_intensity, weekly_rest_days,
  fatigue_level, sleep_hours, sleep_quality, stress_level, body_pain,
  nail_cut_frequency, days_before_match, deep_nail_habit, toe_grip_sense, hallux_valgus, toe_pain,
  injury_count_year, major_injury_site, recovery_period, injury_recurrence,
  images, image_count, user_consent
`;

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const format = searchParams.get('format');
  const supabase = getSupabaseAdmin();

  if (format === 'csv' || format === 'json') {
    const { data, error } = await supabase
      .from('research_cases')
      .select(SELECT_FIELDS)
      .order('created_at', { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    if (format === 'json') return NextResponse.json({ data });

    // CSV
    const headers = [
      'id','created_at','locale','age','gender','height','weight','country','sport',
      'position','dominant_hand','dominant_foot','sports_history',
      'weekly_sessions','session_duration','monthly_matches','training_intensity','weekly_rest_days',
      'fatigue_level','sleep_hours','sleep_quality','stress_level','body_pain',
      'nail_cut_frequency','days_before_match','deep_nail_habit','toe_grip_sense','hallux_valgus','toe_pain',
      'injury_count_year','major_injury_site','recovery_period','injury_recurrence','image_count',
    ];
    const rows = (data || []).map(c => headers.map(h => {
      const v = (c as Record<string, unknown>)[h];
      return typeof v === 'string' ? `"${v.replace(/"/g,'""')}"` : v ?? '';
    }).join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    return new Response(csv, {
      headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="research_cases.csv"' },
    });
  }

  const from = (page - 1) * limit;
  const { data, error, count } = await supabase
    .from('research_cases')
    .select(SELECT_FIELDS, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, from + limit - 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data, total: count ?? 0 });
}
