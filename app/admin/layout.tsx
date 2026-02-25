import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: '管理画面 | 爪整体',
  robots: 'noindex, nofollow',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
