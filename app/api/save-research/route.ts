import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

interface ResearchImage {
  type: 'hand_nail' | 'foot_nail' | 'sole';
  dataUrl: string;
  b64: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      locale = 'ja',
      age, gender, height, weight, country, sport,
      position, dominant_hand, dominant_foot, sports_history,
      weekly_sessions, session_duration, monthly_matches, training_intensity, weekly_rest_days,
      fatigue_level, sleep_hours, sleep_quality, stress_level, body_pain,
      nail_cut_frequency, days_before_match, deep_nail_habit, toe_grip_sense, hallux_valgus, toe_pain,
      injury_count_year, major_injury_site, recovery_period, injury_recurrence,
      images = [] as ResearchImage[],
    } = body;

    const supabase = getSupabaseAdmin();

    // Upload images to Storage
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const ts = now.getTime();

    const uploadedImages: { type: string; path: string; url: string }[] = [];

    for (let i = 0; i < images.length; i++) {
      const img = images[i] as ResearchImage;
      if (!img.b64) continue;

      const path = `cases/${year}/${month}/${ts}-research-${img.type}-${i}.jpg`;
      const buffer = Buffer.from(img.b64, 'base64');

      const { error: uploadError } = await supabase.storage
        .from('nail-images')
        .upload(path, buffer, { contentType: 'image/jpeg', upsert: false });

      if (uploadError) {
        console.warn(`[save-research] image upload error (${img.type}):`, uploadError.message);
        continue;
      }

      const { data: urlData } = supabase.storage.from('nail-images').getPublicUrl(path);
      uploadedImages.push({ type: img.type, path, url: urlData?.publicUrl ?? '' });
    }

    const { data: saved, error } = await supabase
      .from('research_cases')
      .insert({
        locale,
        age: age !== '' ? age : null,
        gender: gender || null,
        height: height !== '' ? height : null,
        weight: weight !== '' ? weight : null,
        country: country || null,
        sport: sport || null,
        position: position || null,
        dominant_hand: dominant_hand || null,
        dominant_foot: dominant_foot || null,
        sports_history: sports_history !== '' ? sports_history : null,
        weekly_sessions: weekly_sessions || null,
        session_duration: session_duration || null,
        monthly_matches: monthly_matches !== '' ? monthly_matches : null,
        training_intensity: training_intensity ?? null,
        weekly_rest_days: weekly_rest_days !== '' ? weekly_rest_days : null,
        fatigue_level: fatigue_level ?? null,
        sleep_hours: sleep_hours !== '' ? sleep_hours : null,
        sleep_quality: sleep_quality ?? null,
        stress_level: stress_level ?? null,
        body_pain: body_pain || null,
        nail_cut_frequency: nail_cut_frequency || null,
        days_before_match: days_before_match || null,
        deep_nail_habit: deep_nail_habit || null,
        toe_grip_sense: toe_grip_sense ?? null,
        hallux_valgus: hallux_valgus || null,
        toe_pain: toe_pain ?? null,
        injury_count_year: injury_count_year !== '' ? injury_count_year : null,
        major_injury_site: major_injury_site || null,
        recovery_period: recovery_period || null,
        injury_recurrence: injury_recurrence || null,
        images: uploadedImages,
        image_count: uploadedImages.length,
        user_consent: true,
      })
      .select('id')
      .single();

    if (error) throw error;

    return NextResponse.json({ id: saved.id });
  } catch (e: unknown) {
    const err = e as { message?: string };
    console.error('[save-research] error:', err?.message);
    return NextResponse.json({ error: err?.message ?? '保存に失敗しました' }, { status: 500 });
  }
}
