'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Textbook {
  id: string;
  title: string;
  level: string;
  order_num: number;
  file_path: string;
  signed_url?: string;
}

const LEVEL_LABELS: Record<string, string> = {
  beginner: '初級編',
  high: '上級編',
  professional: 'プロ編',
  student: '受講者向け',
};

const LEVEL_COLORS: Record<string, string> = {
  beginner: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  high: 'bg-blue-100 text-blue-700 border-blue-200',
  professional: 'bg-purple-100 text-purple-700 border-purple-200',
  student: 'bg-amber-100 text-amber-700 border-amber-200',
};

export default function TextbookPage() {
  const router = useRouter();
  const [textbooks, setTextbooks] = useState<Textbook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/ja/login'); return; }

      const { data: books } = await supabase
        .from('textbooks')
        .select('id, title, level, order_num, file_path')
        .order('level').order('order_num');

      if (!books) { setLoading(false); return; }

      const booksWithUrls = await Promise.all(
        books.map(async (book) => {
          const { data } = await supabase.storage
            .from('textbooks')
            .createSignedUrl(book.file_path, 3600);
          return { ...book, signed_url: data?.signedUrl };
        })
      );

      setTextbooks(booksWithUrls);
      setLoading(false);
    }
    load();
  }, [router]);

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-muted-foreground">読み込み中...</p>
    </div>
  );

  const levels = ['beginner', 'high', 'professional', 'student'];

  return (
    <div className="flex min-h-screen flex-col bg-muted">
      <Header />
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-8">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Members Only</p>
            <h1 className="text-3xl font-bold text-foreground">爪整体テキスト</h1>
            <p className="mt-2 text-sm text-muted-foreground">会員限定の学習教材です。PDFをダウンロードしてご活用ください。</p>
          </div>
          {levels.map(level => {
            const books = textbooks.filter(b => b.level === level);
            if (books.length === 0) return null;
            return (
              <div key={level} className="mb-8">
                <div className={`mb-4 inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${LEVEL_COLORS[level]}`}>
                  {LEVEL_LABELS[level]}
                </div>
                <div className="space-y-3">
                  {books.map(book => (
                    <div key={book.id} className="flex items-center justify-between rounded-xl border border-border bg-white p-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-lg">📄</span>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{book.title}</p>
                          <p className="text-xs text-muted-foreground">PDF</p>
                        </div>
                      </div>
                      {book.signed_url ? (
                        <a href={book.signed_url} target="_blank" rel="noopener noreferrer" download
                          className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary/90">
                          ⬇ ダウンロード
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground">準備中</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
