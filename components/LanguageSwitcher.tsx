"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { routing } from "@/i18n/routing";

const localeDisplay: Record<string, { flag: string; label: string }> = {
  ja: { flag: "\u{1F1EF}\u{1F1F5}", label: "\u65E5\u672C\u8A9E" },
  en: { flag: "\u{1F1EC}\u{1F1E7}", label: "English" },
  ar: { flag: "\u{1F1F8}\u{1F1E6}", label: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629" },
};

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("languageSwitcher");

  function handleChange(nextLocale: string) {
    router.replace(pathname, { locale: nextLocale as "ja" | "en" | "ar" });
  }

  return (
    <div className="flex items-center gap-1" role="group" aria-label={t("label")}>
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => handleChange(loc)}
          aria-label={localeDisplay[loc].label}
          aria-current={locale === loc ? "true" : undefined}
          className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
            locale === loc
              ? "bg-primary text-white"
              : "text-foreground hover:bg-primary/10"
          }`}
        >
          <span className="me-0.5">{localeDisplay[loc].flag}</span>
          <span className="hidden sm:inline">{localeDisplay[loc].label}</span>
        </button>
      ))}
    </div>
  );
}
