export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: NextRequest) {
  try {
    const { image, quizAnswers, heelAnswers, bodyPart, locale = 'ja' } = await req.json();
    const q = quizAnswers as Record<string, unknown> | undefined;
    const h = heelAnswers as Record<string, unknown> | undefined;

    const supabase = getSupabaseAdmin();
    const timestamp = Date.now();
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const suffix = bodyPart === 'sole' ? 'sole' : 'nail';
    const imagePath = `cases/${year}/${month}/${timestamp}-${suffix}.jpg`;

    // 画像アップロード
    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }
    const buffer = Buffer.from(image, 'base64');
    const { error: uploadError } = await supabase.storage
      .from('nail-images')
      .upload(imagePath, buffer, { contentType: 'image/jpeg', upsert: false });

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage.from('nail-images').getPublicUrl(imagePath);
    const imageUrl = urlData.publicUrl;

    // 足裏診断は sole_cases テーブルへ、爪診断は nail_cases テーブルへ
    if (bodyPart === 'sole') {
      const soleData = {
        image_url: imageUrl,
        image_path: imagePath,
        heel_severity: h?.heelSeverity ?? null,
        heel_moisture: h?.heelMoisture ?? null,
        heel_footwear: h?.heelFootwear ?? null,
        heel_standing: h?.heelStanding ?? null,
        health_data: h ?? {},
        model_version: 'quiz-only',
        user_consent: true,
        locale,
      };
      const { data: savedCase, error: insertError } = await supabase
        .from('sole_cases')
        .insert(soleData)
        .select('id')
        .single();
      if (insertError) throw insertError;
      console.log(`[save-quiz] 足裏保存成功: id=${savedCase.id}`);
      return NextResponse.json({ id: savedCase.id });
    }

    const insertData = {
          image_url: imageUrl,
          image_path: imagePath,
          body_part: 'nail',
          sport:               q?.sport ?? null,
          age:                 q?.age ? Number(q.age) : null,
          gender:              q?.gender ?? null,
          height:              q?.height ? Number(q.height) : null,
          weight:              q?.weight ? Number(q.weight) : null,
          dominant_foot:       q?.dominantFoot ?? null,
          arch_type:           q?.archType ?? null,
          callus_locations:    q?.callusLocations ?? [],
          sports_history:      q?.sportsHistory ? Number(q.sportsHistory) : null,
          practice_frequency:  q?.practiceFrequency ?? null,
          nail_care_style:     q?.nailCareStyle ?? null,
          nail_care_frequency: q?.nailCareFrequency ?? null,
          uses_insole:         q?.usesInsole === true ? true : q?.usesInsole === false ? false : null,
          nail_color_change:   q?.nailColorChange ?? false,
          nail_brittle:        q?.nailBrittle ?? false,
          nail_pain:           q?.nailPain ?? false,
          nail_growth_change:  q?.nailGrowthChange ?? false,
          curved_nail:         q?.curvedNail ?? null,
          hallux_valgus:       q?.halluxValgus ?? null,
          toe_grip:            q?.toeGrip ? Number(q.toeGrip) : null,
          grip_confidence:     q?.gripConfidence ? Number(q.gripConfidence) : null,
          balance:             q?.balance ? Number(q.balance) : null,
          ankle_sprain:        q?.ankleSprain ?? null,
          current_pain_areas:  q?.currentPainAreas ?? [],
          nail_condition: {},
          health_data: q ?? {},
          model_version: 'quiz-only',
          user_consent: true,
          locale,
        };

    const { data: savedCase, error: insertError } = await supabase
      .from('nail_cases')
      .insert(insertData)
      .select('id')
      .single();

    if (insertError) throw insertError;

    console.log(`[save-quiz] 保存成功: id=${savedCase.id}`);
    return NextResponse.json({ id: savedCase.id });

  } catch (error) {
    const err = error as { message?: string };
    console.error('[save-quiz] エラー:', err?.message);
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}
