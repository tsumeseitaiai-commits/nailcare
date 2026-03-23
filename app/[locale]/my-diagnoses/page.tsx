import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LogoutButton from './LogoutButton';

type DiagnosisRecord = {
  id: string;
  created_at: string;
  body_part: string;
  health_score: number | null;
  detected_issues: string[] | null;
  image_url: string | null;
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default async function MyDiagnosesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  // nail_cases を取得
  const { data: nailCases } = await supabase
    .from('nail_cases')
    .select('id, created_at, body_part, health_score, detected_issues, image_url')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20);

  // sole_cases を取得（body_part = 'sole' として扱う）
  const { data: soleCases } = await supabase
    .from('sole_cases')
    .select('id, created_at, health_score, detected_issues, image_url')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20);

  const nailRecords: DiagnosisRecord[] = (nailCases ?? []).map((r) => ({
    ...r,
    body_part: r.body_part ?? 'nail',
  }));
  const soleRecords: DiagnosisRecord[] = (soleCases ?? []).map((r) => ({
    ...r,
    body_part: 'sole',
  }));

  // 日付降順でマージして最大20件
  const all = [...nailRecords, ...soleRecords]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 20);

  return (
    <div className="flex min-h-screen flex-col bg-muted">
      <Header />
      <main className="flex-1 py-10">
        <div className="mx-auto max-w-3xl px-4">
          {/* タイトル行 */}
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">診断履歴</h1>
            <LogoutButton locale={locale} />
          </div>

          {all.length === 0 ? (
            <div className="rounded-xl border border-border bg-white p-10 text-center shadow-sm">
              <p className="mb-4 text-muted-foreground">まだ診断履歴がありません</p>
              <a
                href={`/${locale}/ai-diagnosis`}
                className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-primary/90"
              >
                AI診断を試す
              </a>
            </div>
          ) : (
            <div className="space-y-3">
              {all.map((record) => (
                <div
                  key={`${record.body_part}-${record.id}`}
                  className="flex items-center gap-4 rounded-xl border border-border bg-white p-4 shadow-sm"
                >
                  {/* サムネイル */}
                  {record.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={record.image_url}
                      alt="診断画像"
                      width={50}
                      height={50}
                      className="h-[50px] w-[50px] shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-lg bg-muted text-xs text-muted-foreground">
                      No img
                    </div>
                  )}

                  {/* 情報 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                          record.body_part === 'sole'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-primary/10 text-primary'
                        }`}
                      >
                        {record.body_part === 'sole' ? '足裏' : '爪'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(record.created_at)}
                      </span>
                    </div>
                    <p className="truncate text-sm text-foreground">
                      {record.detected_issues?.[0] ?? '問題なし'}
                    </p>
                  </div>

                  {/* スコア */}
                  <div className="shrink-0 text-right">
                    <span className="text-lg font-bold text-foreground">
                      {record.health_score ?? '-'}
                    </span>
                    <span className="text-xs text-muted-foreground">/100</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
