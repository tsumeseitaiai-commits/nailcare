import { Link } from "@/i18n/routing";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Error
        </p>
        <h1 className="mt-4 text-8xl font-bold text-foreground">404</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          ページが見つかりません
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-xl bg-primary px-8 py-4 text-base font-bold text-white shadow-md transition-all hover:bg-primary-dark hover:shadow-lg"
        >
          トップページへ戻る
        </Link>
      </main>
      <Footer />
    </div>
  );
}
