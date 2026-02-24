import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Noto_Sans_JP, Roboto, Noto_Sans_Arabic } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-noto-sans-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  display: "swap",
});

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`../../messages/${locale}.json`)).default;

  return {
    title: messages.metadata.title,
    description: messages.metadata.description,
  };
}

function getFontClass(locale: string) {
  switch (locale) {
    case "ar":
      return notoSansArabic.variable;
    case "ja":
      return notoSansJP.variable;
    default:
      return roboto.variable;
  }
}

function getFontFamily(locale: string) {
  switch (locale) {
    case "ar":
      return "var(--font-noto-sans-arabic), sans-serif";
    case "ja":
      return "var(--font-noto-sans-jp), sans-serif";
    default:
      return "var(--font-roboto), sans-serif";
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "ja" | "en" | "ar")) {
    notFound();
  }

  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";
  const fontClass = `${notoSansJP.variable} ${roboto.variable} ${notoSansArabic.variable}`;

  return (
    <html lang={locale} dir={dir}>
      <body
        className={fontClass}
        style={{ fontFamily: getFontFamily(locale) }}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
