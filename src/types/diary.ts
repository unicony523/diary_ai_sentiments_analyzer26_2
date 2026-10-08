export type MoodKey = 'joy' | 'peace' | 'flutter' | 'sadness' | 'complex';

export interface MoodItem {
  key: MoodKey;
  label: string;
  emoji: string;
  iconName?: string;
  color: string;
  bgLight: string;
  ringColor: string;
}

export interface SentimentRatio {
  label: string;
  percentage: number;
  colorClass: string;
}

export interface AiAnalysisResult {
  dominantMood: MoodKey;
  temperature: number;
  weatherDesc: string;
  weatherDetail: string;
  sentimentRatios: SentimentRatio[];
  oneLineReview: string; // AI가 일기를 읽고 쓰는 한줄평
  aiFairyComment: string; // 구름 요정의 다정한 답장
  mindRoutine: string;
  gratitudePrompt: string;
}

export interface SavedDiaryItem {
  id: string;
  createdAt: string;
  dateText: string;
  timeText: string;
  title: string;
  content: string;
  photoUrl: string | null;
  caption: string;
  mood: MoodKey;
  analysisResult: AiAnalysisResult | null;
}
