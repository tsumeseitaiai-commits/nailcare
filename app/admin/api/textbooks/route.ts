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
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('textbooks')
    .select('id, title, level, order_num, file_path, created_at')
    .order('level')
    .order('order_num');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const supabase = getSupabaseAdmin();
  const formData = await req.formData();
  const title = formData.get('title') as string;
  const level = formData.get('level') as string;
  const order_num = parseInt(formData.get('order_num') as string) || 0;
  const file = formData.get('file') as File | null;

  if (!title || !level || !file) {
    return NextResponse.json({ error: 'title, level, file are required' }, { status: 400 });
  }

  const ext = file.name.split('.').pop() ?? 'pdf';
  const file_path = `${level}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

  const arrayBuffer = await file.arrayBuffer();
  const { error: uploadError } = await supabase.storage
    .from('textbooks')
    .upload(file_path, arrayBuffer, { contentType: file.type || `application/${ext}`, upsert: false });

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data, error: insertError } = await supabase
    .from('textbooks')
    .insert({ title, level, order_num, file_path })
    .select()
    .single();

  if (insertError) {
    await supabase.storage.from('textbooks').remove([file_path]);
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const supabase = getSupabaseAdmin();
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

  const { data: book, error: fetchError } = await supabase
    .from('textbooks')
    .select('file_path')
    .eq('id', id)
    .single();

  if (fetchError || !book) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await supabase.storage.from('textbooks').remove([book.file_path]);

  const { error: deleteError } = await supabase.from('textbooks').delete().eq('id', id);
  if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
