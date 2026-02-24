import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { image, fileName } = await req.json();

    // data:image/... プレフィックスを除去
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const timestamp = Date.now();
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const path = `cases/${year}/${month}/${timestamp}-${fileName}`;

    const { error } = await supabase.storage
      .from('nail-images')
      .upload(path, buffer, {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      return NextResponse.json(
        { error: 'アップロードに失敗しました' },
        { status: 500 }
      );
    }

    const { data: urlData } = supabase.storage
      .from('nail-images')
      .getPublicUrl(path);

    return NextResponse.json({
      path,
      url: urlData.publicUrl,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'アップロード処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
