'use client';

import React from 'react';
import {
  PenLine,
  Sparkles,
  RotateCcw,
  Clock,
  FileText,
  Cloud,
  BookmarkCheck,
  Table,
} from 'lucide-react';

interface DiaryEditorProps {
  title: string;
  content: string;
  onTitleChange: (val: string) => void;
  onContentChange: (val: string) => void;
  onAnalyze: () => void;
  onReset: () => void;
  onSave: () => void;
  onOpenSheetModal: () => void;
  isLoading: boolean;
  isSaving?: boolean;
  lastSavedTimeText: string;
  oneLineReview?: string | null;
  aiFairyComment?: string | null;
}

export default function DiaryEditor({
  title,
  content,
  onTitleChange,
  onContentChange,
  onAnalyze,
  onReset,
  onSave,
  onOpenSheetModal,
  isLoading,
  isSaving,
  lastSavedTimeText,
  oneLineReview,
  aiFairyComment,
}: DiaryEditorProps) {
  // 글자 수 및 단어 수 계산
  const charCount = content.length;
  const wordCount = content.trim().length > 0 ? content.trim().split(/\s+/).length : 0;

  return (
    <div className="w-full max-w-[1040px] mx-auto px-4 mt-6">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 md:p-8 border border-white shadow-cloud-card relative">
        {/* 상단 헤더: 오늘의 다이어리 */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EBF5FB] mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#EBF5FB] flex items-center justify-center text-[#7CA9D4]">
              <PenLine className="w-4 h-4" />
            </div>
            <h2 className="font-heading font-bold text-base md:text-lg text-[#001E2F]">
              오늘의 다이어리
            </h2>
          </div>
        </div>

        {/* 미니 구름 배너 */}
        <div className="flex justify-center mb-3">
          <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-[#EBF5FB] border border-[#C6E2F7] text-xs font-semibold text-[#336289] shadow-xs">
            <Cloud className="w-3.5 h-3.5" />
            <span>오늘도 행복한 하루!</span>
            <Cloud className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* 일기 제목 입력 영역 */}
        <div className="mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="제목을 입력하세요"
            className="w-full px-4 py-2.5 text-base md:text-lg font-bold text-[#001E2F] placeholder:text-[#8FAABA] bg-[#F6FAFF]/60 rounded-2xl border border-[#D4EBFF] focus:outline-none focus:ring-2 focus:ring-[#7CA9D4] focus:bg-white transition"
          />
        </div>

        {/* 일기 본문 줄노트 작성 영역 */}
        <div className="relative rounded-2xl border border-[#D4EBFF] bg-[#FBFDFE] p-4 shadow-cloud-inset space-y-4">
          <textarea
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder={`오늘 당신의 마음은 어떠셨나요?
자유롭게 일기를 작성해보세요...`}
            rows={9}
            className="w-full bg-transparent resize-y outline-none font-medium text-sm md:text-base text-[#001E2F] placeholder:text-[#8FAABA] lined-paper leading-7"
          />

          {/* 1. [AI의 일기 한줄평 칸] - AI 감정 분석 후 표시 */}
          {oneLineReview && (
            <div className="p-3.5 rounded-2xl bg-[#FFFDF0] border border-[#FFE699] flex items-center gap-3 shadow-xs animate-fadeIn">
              <div className="w-8 h-8 rounded-full bg-[#FFE699]/60 flex items-center justify-center text-sm shrink-0">
                ✨
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="font-heading font-bold text-xs text-[#6e5d1e]">
                    AI의 다이어리 한줄평
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#FFE699]/80 text-[#473900] font-semibold">
                    한줄 요약
                  </span>
                </div>
                <p className="text-xs md:text-sm text-[#554506] font-semibold tracking-wide">
                  &ldquo;{oneLineReview}&rdquo;
                </p>
              </div>
            </div>
          )}

          {/* 2. [구름 요정 Gemini의 따뜻한 답장 칸] - AI 감정 분석 후 표시 */}
          {aiFairyComment && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#F0F6FA] via-[#FDF5F8] to-[#FFFBEB] border-2 border-dashed border-[#C6E2F7] shadow-xs animate-fadeIn">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-xs shadow-xs text-[#7CA9D4]">
                  💌
                </div>
                <span className="font-heading font-bold text-xs text-[#336289] flex items-center gap-1">
                  구름 요정 Gemini 3.8의 따뜻한 답장
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EBF5FB] text-[#7CA9D4] border border-[#D4EBFF]">
                  AI 코멘트
                </span>
              </div>
              <p className="text-xs md:text-sm text-[#4C6B82] leading-relaxed font-medium pl-2 border-l-2 border-[#F7B5C6]">
                &ldquo;{aiFairyComment}&rdquo;
              </p>
            </div>
          )}
        </div>

        {/* 하단 툴바: 작성 날짜/시간, 글자수 카운터, 재시작, [저장], [일기보기], Gemini 분석 버튼 */}
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-[#EBF5FB]">
          <div className="flex items-center gap-4 text-xs text-[#72787f]">
            <div className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-[#7CA9D4]" />
              <span>작성 시간: {lastSavedTimeText}</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <FileText className="w-3.5 h-3.5 text-[#7CA9D4]" />
              <span>글자수: {charCount}자 (단어 {wordCount}개)</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            {/* 재시작 (초기화) 버튼 */}
            <button
              onClick={onReset}
              disabled={isLoading || isSaving}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-full border border-[#D4EBFF] bg-white text-xs font-semibold text-[#4C6B82] hover:bg-[#F6FAFF] hover:text-[#001E2F] transition shadow-xs disabled:opacity-50"
              title="일기 작성 내용 초기화"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#72787f]" />
              <span>재시작</span>
            </button>

            {/* [저장] 버튼: 구글 시트 저장 */}
            <button
              onClick={onSave}
              disabled={isLoading || isSaving || content.trim().length === 0}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full border border-[#7CA9D4] bg-[#EBF5FB] text-[#336289] text-xs font-bold hover:bg-[#dbeeff] transition shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
              title="구글 시트에 일기 저장"
            >
              <BookmarkCheck className={`w-3.5 h-3.5 text-[#336289] ${isSaving ? 'animate-bounce' : ''}`} />
              <span>{isSaving ? '저장 중...' : '저장'}</span>
            </button>

            {/* [일기보기] 버튼: [저장] 버튼 오른쪽에 위치, 구글 시트 일기 리스트 출력 */}
            <button
              onClick={onOpenSheetModal}
              disabled={isLoading || isSaving}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full border border-[#FFE699] bg-[#FFFBEB] text-[#6e5d1e] text-xs font-bold hover:bg-[#FEF3C7] transition shadow-xs disabled:opacity-50"
              title="구글 시트에 저장된 일기 목록 보기"
            >
              <Table className="w-3.5 h-3.5 text-[#B45309]" />
              <span>일기보기</span>
            </button>

            {/* Gemini AI 분석 버튼 */}
            <button
              onClick={onAnalyze}
              disabled={isLoading || isSaving || content.trim().length === 0}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#7CA9D4] via-[#6897c4] to-[#336289] text-white text-xs font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-cloud-float disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-spin' : 'animate-soft-pulse'}`} />
              <span>{isLoading ? 'Gemini 3.8 분석 중...' : 'Gemini AI로 분석하기'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
