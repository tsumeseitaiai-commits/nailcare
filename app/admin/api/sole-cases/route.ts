import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

function checkAuth(req: NextRequest): boolean {
  return req.headers.get('x-admin-password') === process.env.ADMIN_PASSWORD;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const format = searchParams.get('format');
  const supabase = getSupabaseAdmin();

  const SELECT_FIELDS = `
    id, created_at, locale, model_version, image_url, image_path,
    health_score, sole_score, context_score, severity,
    heel_severity, heel_moisture, heel_footwear, heel_standing,
    ai_diagnosis, detected_issues, recommendations,
    sole_findings, self_care_steps, practitioner_points,
    health_data, messages_count,
    conversation_logs (session_id, messages)
  `;

  if (format === 'csv' || format === 'json') {
    const { data, error } = await supabase
      .from('sole_cases')
      .select(SELECT_FIELDS)
      .order('created_at', { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    if (format === 'json') return NextResponse.json({ data });

    // CSV
    const headers = ['id','created_at','locale','health_score','sole_score','context_score','severity',
      'heel_severity','heel_moisture','heel_footwear','heel_standing','ai_diagnosis'];
    const rows = (data || []).map(c => headers.map(h => {
      const v = (c as Record<string, unknown>)[h];
      return typeof v === 'string' ? `"${v.replace(/"/g,'""')}"` : v ?? '';
    }).join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    return new Response(csv, { headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="sole_cases.csv"' } });
  }

  const from = (page - 1) * limit;
  const { data, error, count } = await supabase
    .from('sole_cases')
    .select(SELECT_FIELDS, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, from + limit - 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data, total: count ?? 0 });
}
