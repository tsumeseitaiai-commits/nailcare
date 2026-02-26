import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? '';

export async function DELETE(req: NextRequest) {
  const pw = req.headers.get('x-admin-password') ?? '';
  if (!pw || pw !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { ids } = await req.json() as { ids: string[] };
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'ids が必要です' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // 削除対象の image_path を取得
    const { data: rows, error: fetchError } = await supabase
      .from('nail_cases')
      .select('id, image_path')
      .in('id', ids);

    if (fetchError) throw fetchError;

    // Storageから画像削除
    const paths = (rows ?? [])
      .map((r) => r.image_path as string)
      .filter(Boolean);

    if (paths.length > 0) {
      const { error: storageError } = await supabase.storage
        .from('nail-images')
        .remove(paths);
      if (storageError) console.warn('[delete] storage error:', storageError.message);
    }

    // conversation_logs 削除（外部キー対応）
    await supabase.from('conversation_logs').delete().in('nail_case_id', ids);

    // nail_cases 削除
    const { error: deleteError } = await supabase
      .from('nail_cases')
      .delete()
      .in('id', ids);

    if (deleteError) throw deleteError;

    return NextResponse.json({ deleted: ids.length });
  } catch (e: unknown) {
    const err = e as { message?: string };
    console.error('[delete] error:', err?.message);
    return NextResponse.json({ error: err?.message ?? '削除に失敗しました' }, { status: 500 });
  }
}
