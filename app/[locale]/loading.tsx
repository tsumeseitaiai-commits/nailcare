import { getTranslations } from 'next-intl/server';

export default async function Loading() {
  const t = await getTranslations('loading');
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-border border-t-primary" />
        <p className="text-sm text-muted-foreground">{t('message')}</p>
      </div>
    </div>
  );
}
