'use client';

import React from 'react';
import { Cloud, Calendar, BookOpen, BarChart3, Settings, Smile } from 'lucide-react';

interface HeaderProps {
  onOpenDrawer: () => void;
  savedCount?: number;
}

export default function Header({ onOpenDrawer, savedCount = 0 }: HeaderProps) {
  return (
    <header className="w-full max-w-[1040px] mx-auto px-4 pt-6 pb-4">
      <div className="flex flex-wrap items-center justify-between gap-4 py-2">
        {/* 로고 & 슬로건 */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#C6E2F7] via-[#F7B5C6] to-[#FFE699] flex items-center justify-center shadow-sm">
            <Cloud className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-lg md:text-xl text-[#336289] tracking-tight">
                Diary AI Sentiments Analyzer
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#FFE699]/60 text-[#6e5d1e]">
                AI 3.8
              </span>
            </div>
            <p className="text-xs text-[#72787f] font-medium">당신의 마음에 귀 기울이는 인공지능 감성 일기장</p>
          </div>
        </div>

        {/* 상단 탭 네비게이션 */}
        <div className="flex items-center gap-1.5 p-1 bg-white/70 backdrop-blur-md rounded-full border border-white/80 shadow-sm text-sm">
          <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#7CA9D4] text-white font-semibold shadow-xs transition hover:bg-[#6897c4]">
            <Calendar className="w-4 h-4" />
            <span>오늘의 일기</span>
          </button>

          {/* 일기장 서랍 버튼 */}
          <button
            onClick={onOpenDrawer}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[#4C6B82] hover:bg-[#EBF5FB] transition font-medium group"
          >
            <BookOpen className="w-4 h-4 text-[#7CA9D4] group-hover:scale-110 transition" />
            <span>일기장 서랍</span>
            {savedCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#F7B5C6] text-white text-[10px] font-bold">
                {savedCount}
              </span>
            )}
          </button>

          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[#4C6B82] hover:bg-[#EBF5FB] transition font-medium">
            <BarChart3 className="w-4 h-4 text-[#7CA9D4]" />
            <span>감정 통계</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[#4C6B82] hover:bg-[#EBF5FB] transition font-medium">
            <Settings className="w-4 h-4 text-[#7CA9D4]" />
            <span>설정</span>
          </button>
        </div>

        {/* 사용자 상태 칩 */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full bg-white/80 border border-white shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7CA9D4] animate-pulse"></span>
            <span className="text-xs font-semibold text-[#4C6B82]">포근한 하루 ☁️</span>
            <div className="w-7 h-7 rounded-full bg-[#EBF5FB] flex items-center justify-center border border-[#C6E2F7]">
              <Smile className="w-4 h-4 text-[#7CA9D4]" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
