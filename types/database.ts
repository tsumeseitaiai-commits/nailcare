export interface NailCase {
  id: string;
  created_at: string;
  image_url: string;
  image_path: string;
  nail_condition: {
    dryness?: 'none' | 'mild' | 'moderate' | 'severe';
    vertical_lines?: boolean;
    horizontal_lines?: boolean;
    discoloration?: 'none' | 'yellow' | 'white' | 'brown';
    thickness?: 'thin' | 'normal' | 'thick';
    surface?: 'smooth' | 'rough' | 'ridged';
    shape?: 'normal' | 'curved' | 'spoon' | 'clubbed';
  };
  health_data?: {
    sleep_hours?: number;
    sleep_quality?: '良好' | 'やや不足' | '不足';
    stress_level?: '低' | '中' | '高';
    diet_balance?: '良好' | 'やや偏り' | '偏り';
    exercise_frequency?: string;
    hydration?: '十分' | 'やや不足' | '不足';
    work_hours?: number;
    screen_time?: number;
    occupation?: string;
  };
  ai_diagnosis: string;
  health_score: number;
  detected_issues: string[];
  recommendations: string[];
  model_version: string;
  locale: 'ja' | 'en' | 'ar';
  user_consent: boolean;
}
