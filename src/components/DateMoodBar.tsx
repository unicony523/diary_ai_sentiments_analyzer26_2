'use client';

import React from 'react';
import { MoodKey, MoodItem } from '@/types/diary';

interface DateMoodBarProps {
  currentDateText: string;
  currentTimeText: string;
  selectedMood: MoodKey;
  onSelectMood: (mood: MoodKey) => void;
  geminiHighlightedMood?: MoodKey | null;
  showMoodSection: boolean;
}

export const MOOD_ITEMS: MoodItem[] = [
  {
    key: 'joy',
    label: '기쁨',
    emoji: '🌸',
    color: 'text-[#834f5e]',
    bgLight: 'bg-[#FFD9E1]/60',
    ringColor: 'ring-[#f7b5c6]',
  },
  {
    key: 'peace',
    label: '평온',
    emoji: '☁️',
    color: 'text-[#336289]',
    bgLight: 'bg-[#CEE5FF]/60',
    ringColor: 'ring-[#7ca9d4]',
  },
  {
    key: 'flutter',
    label: '설렘',
    emoji: '✨',
    color: 'text-[#6e5d1e]',
    bgLight: 'bg-[#FAE195]/60',
    ringColor: 'ring-[#dcc57b]',
  },
  {
    key: 'sadness',
    label: '슬픔',
    emoji: '💧',
    color: 'text-[#336289]',
    bgLight: 'bg-[#D4EBFF]/60',
    ringColor: 'ring-[#7ca9d4]',
  },
  {
    key: 'complex',
    label: '복잡',
    emoji: '💭',
    color: 'text-[#554506]',
    bgLight: 'bg-[#E5F2FF]/70',
    ringColor: 'ring-[#c2c7cf]',
  },
];

export default function DateMoodBar({
  currentDateText,
  currentTimeText,
  selectedMood,
  onSelectMood,
  geminiHighlightedMood,
  showMoodSection,
}: DateMoodBarProps) {
  return (
    <div className="w-full max-w-[1040px] mx-auto px-4 mt-2">
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 md:p-6 border border-white/90 shadow-cloud-card flex flex-col md:flex-row items-center justify-between gap-5">
        {/* 날짜, 요일 및 시간 정보 */}
        <div className="flex flex-col items-center md:items-start gap-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#EBF5FB] text-[#336289] text-xs font-semibold border border-[#C6E2F7]">
              Diary AI Sentiments Analyzer
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#EBF5FB] text-[#4C6B82] text-xs font-medium">
              Seoul 21°C 맑음
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#FFE699]/40 text-[#6e5d1e] text-xs font-medium flex items-center gap-1">
              🌸 오늘도 행복한 하루!
            </span>
          </div>

          <div className="flex flex-wrap items-baseline gap-3 mt-1">
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-[#001E2F] tracking-tight">
              {currentDateText}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#CEE5FF] text-[#003E63] text-xs font-bold">
              {currentTimeText}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#EBF5FB] text-[#7CA9D4] border border-[#C6E2F7]">
              DAY-142
            </span>
          </div>
        </div>

        {/* 감성 이모지 5종 영역: AI 분석 후 나타남 (일기 저장 버튼 및 북마크는 삭제) */}
        {showMoodSection && (
          <div className="flex items-center gap-2 p-1.5 bg-[#F6FAFF] rounded-full border border-[#D4EBFF] shadow-xs transition-all duration-500 animate-fadeIn">
            {MOOD_ITEMS.map((item) => {
              const isSelected = selectedMood === item.key;
              const isAiHighlighted = geminiHighlightedMood === item.key;

              return (
                <button
                  key={item.key}
                  onClick={() => onSelectMood(item.key)}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                    isSelected
                      ? `${item.bgLight} ${item.color} shadow-sm ring-2 ${item.ringColor} scale-105`
                      : 'text-[#72787f] hover:bg-white hover:text-[#001E2F]'
                  } ${
                    isAiHighlighted
                      ? 'ring-3 ring-[#7CA9D4] animate-bounce shadow-md bg-white'
                      : ''
                  }`}
                  title={`${item.label} 감정 ${isAiHighlighted ? '(Gemini 추천!)' : ''}`}
                >
                  <span className="text-sm">{item.emoji}</span>
                  <span>{item.label}</span>
                  {isAiHighlighted && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#7CA9D4] text-[9px] text-white">
                      AI
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
