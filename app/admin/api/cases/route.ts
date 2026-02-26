import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

function checkAuth(req: NextRequest): boolean {
  const password = req.headers.get('x-admin-password');
  return password === process.env.ADMIN_PASSWORD;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const format = searchParams.get('format'); // 'csv' | 'json' | null
  const from = (page - 1) * limit;

  const supabase = getSupabaseAdmin();

  // 全件取得（エクスポート用）
  if (format === 'csv' || format === 'json') {
    const { data, error } = await supabase
      .from('nail_cases')
      .select(`
        id,
        created_at,
        health_score,
        locale,
        ai_diagnosis,
        detected_issues,
        recommendations,
        image_url,
        image_path,
        health_data,
        model_version,
        conversation_logs ( session_id, messages, extracted_health_data )
      `)
      .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    if (format === 'json') {
      return new NextResponse(JSON.stringify(data, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="nail_cases_${Date.now()}.json"`,
        },
      });
    }

    // CSV
    const rows = (data || []).map((c) => ({
      id: c.id,
      created_at: c.created_at,
      health_score: c.health_score,
      locale: c.locale,
      detected_issues: Array.isArray(c.detected_issues) ? c.detected_issues.join(' / ') : '',
      recommendations: Array.isArray(c.recommendations) ? c.recommendations.join(' / ') : '',
      ai_diagnosis: String(c.ai_diagnosis || '').replace(/\n/g, ' '),
      image_url: c.image_url,
      model_version: c.model_version,
    }));

    if (rows.length === 0) {
      return new NextResponse('id,created_at,health_score\n', {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="nail_cases_${Date.now()}.csv"`,
        },
      });
    }

    const headers = Object.keys(rows[0]);
    const csvLines = [
      headers.join(','),
      ...rows.map((r) =>
        headers.map((h) => `"${String((r as Record<string, unknown>)[h] ?? '').replace(/"/g, '""')}"`).join(',')
      ),
    ];

    return new NextResponse('\uFEFF' + csvLines.join('\n'), {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="nail_cases_${Date.now()}.csv"`,
      },
    });
  }

  // ページネーション付き一覧
  const { data, error, count } = await supabase
    .from('nail_cases')
    .select(`
      id, created_at, locale, model_version, image_url,
      health_score, nail_score, quiz_score, nail_findings,
      ai_diagnosis, detected_issues, recommendations,
      sport, age, gender, height, weight, dominant_foot,
      arch_type, callus_locations, sports_history, practice_frequency,
      nail_care_style, nail_care_frequency, uses_insole,
      nail_color_change, nail_brittle, nail_pain, nail_growth_change,
      curved_nail, hallux_valgus, toe_grip, grip_confidence, balance,
      ankle_sprain, current_pain_areas,
      health_data,
      conversation_logs ( session_id, messages )
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, from + limit - 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data, total: count, page, limit });
}
