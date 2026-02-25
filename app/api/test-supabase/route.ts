import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('Testing Supabase connection...');

    // 1. 環境変数チェック
    const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
    const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // 2. nail_cases テーブル接続チェック
    const { data: casesData, error: casesError } = await supabase
      .from('nail_cases')
      .select('id')
      .limit(1);

    // 3. conversation_logs テーブル接続チェック
    const { data: logsData, error: logsError } = await supabase
      .from('conversation_logs')
      .select('id')
      .limit(1);

    // 4. Storage バケット確認
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();

    return NextResponse.json({
      status: 'ok',
      env: { hasUrl, hasKey },
      tables: {
        nail_cases: casesError
          ? { error: casesError.message, code: casesError.code }
          : { success: true, rowCount: casesData?.length ?? 0 },
        conversation_logs: logsError
          ? { error: logsError.message, code: logsError.code }
          : { success: true, rowCount: logsData?.length ?? 0 },
      },
      storage: bucketsError
        ? { error: bucketsError.message }
        : { success: true, buckets: buckets?.map((b) => b.name) ?? [] },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Supabase test error:', message);
    return NextResponse.json({ status: 'error', message }, { status: 500 });
  }
}
