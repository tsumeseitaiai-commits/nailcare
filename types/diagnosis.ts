export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface HealthData {
  sleep_hours?: number;
  sleep_quality?: '良好' | 'やや不足' | '不足';
  stress_level?: '低' | '中' | '高';
  diet_balance?: '良好' | 'やや偏り' | '偏り';
  exercise_frequency?: string;
  hydration?: '十分' | 'やや不足' | '不足';
  work_hours?: number;
  screen_time?: number;
  occupation?: string;
}

export interface DiagnosisResult {
  health_score: number;
  detected_issues: string[];
  recommendations: string[];
  analysis: string;
}
