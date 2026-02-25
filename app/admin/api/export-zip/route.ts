export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import JSZip from 'jszip';

function checkAuth(req: NextRequest): boolean {
  const password = req.headers.get('x-admin-password');
  return password === process.env.ADMIN_PASSWORD;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();

  // 全件取得
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

  const cases = data || [];
  const zip = new JSZip();
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

  // ── 1. CSV ──────────────────────────────────────────────
  const csvRows = cases.map((c) => ({
    id: c.id,
    created_at: c.created_at,
    health_score: c.health_score,
    locale: c.locale,
    detected_issues: Array.isArray(c.detected_issues) ? c.detected_issues.join(' / ') : '',
    recommendations: Array.isArray(c.recommendations) ? c.recommendations.join(' / ') : '',
    ai_diagnosis: String(c.ai_diagnosis || '').replace(/\n/g, ' '),
    image_filename: c.image_path ? `images/${c.id}.jpg` : '',
    model_version: c.model_version,
  }));

  if (csvRows.length > 0) {
    const headers = Object.keys(csvRows[0]);
    const csvLines = [
      headers.join(','),
      ...csvRows.map((r) =>
        headers
          .map((h) => `"${String((r as Record<string, unknown>)[h] ?? '').replace(/"/g, '""')}"`)
          .join(',')
      ),
    ];
    zip.file('nail_cases.csv', '\uFEFF' + csvLines.join('\n'));
  }

  // ── 2. JSON（問診ログ込み） ─────────────────────────────
  zip.file('nail_cases.json', JSON.stringify(cases, null, 2));

  // ── 3. 画像をStorageから取得して images/ フォルダへ ──────
  const imgFolder = zip.folder('images')!;
  const imageResults: { id: string; status: string }[] = [];

  await Promise.allSettled(
    cases
      .filter((c) => c.image_path)
      .map(async (c) => {
        try {
          const { data: fileData, error: dlError } = await supabase.storage
            .from('nail-images')
            .download(c.image_path as string);

          if (dlError || !fileData) {
            imageResults.push({ id: c.id, status: `error: ${dlError?.message}` });
            return;
          }

          const arrayBuffer = await fileData.arrayBuffer();
          imgFolder.file(`${c.id}.jpg`, arrayBuffer);
          imageResults.push({ id: c.id, status: 'ok' });
        } catch (e: unknown) {
          imageResults.push({ id: c.id, status: `exception: ${e instanceof Error ? e.message : 'unknown'}` });
        }
      })
  );

  // ── 4. README ──────────────────────────────────────────
  const readme = [
    `# 爪整体 AI 診断データ エクスポート`,
    `生成日時: ${new Date().toLocaleString('ja-JP')}`,
    `総件数: ${cases.length} 件`,
    `画像取得: ${imageResults.filter((r) => r.status === 'ok').length} / ${imageResults.length} 件`,
    ``,
    `## ファイル構成`,
    `- nail_cases.csv   : 診断データ一覧（Excel で開けます）`,
    `- nail_cases.json  : 問診ログ含む完全データ`,
    `- images/          : 爪画像（ファイル名 = nail_cases の id）`,
  ].join('\n');

  zip.file('README.md', readme);

  // ── 5. ZIP生成 ──────────────────────────────────────────
  const zipBuffer = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  return new NextResponse(zipBuffer, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="nail_export_${ts}.zip"`,
      'Content-Length': String(zipBuffer.length),
    },
  });
}
