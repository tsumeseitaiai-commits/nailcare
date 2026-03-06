'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

interface Clinic {
  id: string;
  name: string;
  tel: string;
  address: string;
  hours_weekday: string;
  hours_saturday: string;
  closed_days: string;
  services: string[];
}

interface Props {
  bodyPart: 'nail' | 'sole' | null;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ClinicSuggest({ bodyPart }: Props) {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClinics() {
      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .eq('is_active', true)
        .contains('services', [bodyPart ?? 'nail']);

      if (!error && data) setClinics(data);
      setLoading(false);
    }
    fetchClinics();
  }, [bodyPart]);

  if (loading || clinics.length === 0) return null;

  return (
    <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white text-sm">📍</span>
        <h3 className="text-base font-bold text-foreground">この施術が受けられる店舗</h3>
      </div>

      <div className="space-y-4">
        {clinics.map((clinic) => (
          <div key={clinic.id} className="rounded-xl border border-border bg-white p-5">
            <p className="mb-3 text-base font-bold text-foreground">{clinic.name}</p>

            <div className="mb-2 flex items-start gap-2 text-sm text-muted-foreground">
              <span className="mt-0.5 shrink-0">📮</span>
              <span>{clinic.address}</span>
            </div>

            <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
              <span className="shrink-0">📞</span>
              <a href={`tel:${clinic.tel}`} className="font-semibold text-primary hover:underline">
                {clinic.tel}
              </a>
            </div>

            <div className="mb-4 rounded-lg bg-muted/50 p-3 text-xs space-y-1">
              <div className="flex gap-2">
                <span className="shrink-0 text-muted-foreground">平日</span>
                <span className="font-medium">{clinic.hours_weekday}</span>
              </div>
              <div className="flex gap-2">
                <span className="shrink-0 text-muted-foreground">土曜</span>
                <span className="font-medium">{clinic.hours_saturday}</span>
              </div>
              <div className="flex gap-2">
                <span className="shrink-0 text-muted-foreground">定休</span>
                <span className="font-medium text-red-600">{clinic.closed_days}</span>
              </div>
            </div>

            <a
              href={`tel:${clinic.tel}`}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-white transition-all hover:bg-primary/90 active:scale-95"
            >
              <span>📅</span>
              <span>電話で予約する</span>
            </a>
          </div>
        ))}
      </div>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        ※ 診断結果をお持ちの上、ご来院ください
      </p>
    </div>
  );
}
