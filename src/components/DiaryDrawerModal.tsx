'use client';

import React from 'react';
import { SavedDiaryItem } from '@/types/diary';
import { MOOD_ITEMS } from '@/components/DateMoodBar';
import { X, Calendar, Clock, Sparkles, Trash2, BookOpen } from 'lucide-react';

interface DiaryDrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
  diaries: SavedDiaryItem[];
  onSelectDiary: (item: SavedDiaryItem) => void;
  onDeleteDiary: (id: string, e: React.MouseEvent) => void;
}

export default function DiaryDrawerModal({
  isOpen,
  onClose,
  diaries,
  onSelectDiary,
  onDeleteDiary,
}: DiaryDrawerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white/95 rounded-3xl border border-white max-w-2xl w-full max-h-[85vh] flex flex-col shadow-cloud-float overflow-hidden">
        {/* 모달 상단 헤더 */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#EBF5FB] bg-[#F6FAFF]/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#C6E2F7] via-[#F7B5C6] to-[#FFE699] flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-[#001E2F]">
                나의 일기장 서랍 📚
              </h3>
              <p className="text-xs text-[#72787f]">
                차곡차곡 모아둔 마음의 조각들 ({diaries.length}편)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white hover:bg-[#EBF5FB] border border-[#D4EBFF] flex items-center justify-center text-[#72787f] hover:text-[#001E2F] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 일기 리스트 본문 */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {diaries.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center justify-center text-[#72787f]">
              <div className="w-16 h-16 rounded-full bg-[#EBF5FB] flex items-center justify-center text-3xl mb-3">
                ☁️
              </div>
              <p className="font-heading text-base font-bold text-[#4C6B82]">
                아직 저장된 일기가 없어요
              </p>
              <p className="text-xs mt-1">오늘의 마음을 작성하고 [일기 저장] 버튼을 눌러보세요!</p>
            </div>
          ) : (
            diaries.map((diary) => {
              const moodInfo = MOOD_ITEMS.find((m) => m.key === diary.mood) || MOOD_ITEMS[1];

              return (
                <div
                  key={diary.id}
                  onClick={() => {
                    onSelectDiary(diary);
                    onClose();
                  }}
                  className="group relative p-4 rounded-2xl border border-[#D4EBFF] bg-[#FBFDFE] hover:bg-white hover:border-[#7CA9D4] hover:shadow-cloud-card transition-all cursor-pointer flex flex-col gap-2.5"
                >
                  {/* 상단 날짜 및 감정 뱃지 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-[#72787f]">
                      <span className="flex items-center gap-1 font-semibold text-[#001E2F]">
                        <Calendar className="w-3.5 h-3.5 text-[#7CA9D4]" />
                        {diary.dateText}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-[#7CA9D4]" />
                        {diary.timeText}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1 ${moodInfo.bgLight} ${moodInfo.color}`}
                      >
                        <span>{moodInfo.emoji}</span>
                        <span>{moodInfo.label}</span>
                      </span>

                      {/* 삭제 버튼 */}
                      <button
                        onClick={(e) => onDeleteDiary(diary.id, e)}
                        className="p-1.5 rounded-full text-[#c2c7cf] hover:text-red-500 hover:bg-red-50 transition"
                        title="일기 삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* 제목 */}
                  <h4 className="font-heading font-bold text-base text-[#001E2F] group-hover:text-[#336289] transition line-clamp-1">
                    {diary.title || '(제목 없음)'}
                  </h4>

                  {/* 내용 요약 */}
                  <p className="text-xs text-[#4C6B82] line-clamp-2 leading-relaxed font-medium">
                    {diary.content}
                  </p>

                  {/* AI 분석 요약 뱃지 및 한줄평 (존재 시) */}
                  {diary.analysisResult && (
                    <div className="pt-2 border-t border-[#F0F6FA] flex flex-col gap-1 text-[11px] text-[#72787f]">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 font-semibold text-[#336289]">
                          <Sparkles className="w-3 h-3 text-[#7CA9D4]" />
                          마음 온도: {diary.analysisResult.temperature.toFixed(1)}°C ({diary.analysisResult.weatherDesc})
                        </span>
                        <span className="text-[#8FAABA] underline group-hover:text-[#336289]">
                          열어보기 →
                        </span>
                      </div>
                      {diary.analysisResult.oneLineReview && (
                        <p className="text-[11px] text-[#554506] bg-[#FFFDF0] px-2.5 py-1 rounded-lg border border-[#FFE699]/60 line-clamp-1">
                          ✨ {diary.analysisResult.oneLineReview}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
