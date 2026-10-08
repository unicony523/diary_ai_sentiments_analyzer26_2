'use client';

import React from 'react';
import { AiAnalysisResult } from '@/types/diary';
import {
  Sparkles,
  ShieldCheck,
  Sprout,
  Moon,
  Lock,
} from 'lucide-react';

interface AiAnalysisReportProps {
  result: AiAnalysisResult;
}

export default function AiAnalysisReport({ result }: AiAnalysisReportProps) {
  return (
    <div className="w-full max-w-[1040px] mx-auto px-4 mt-6 mb-16 transition-all duration-500 animate-fadeIn">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 md:p-8 border border-white shadow-cloud-card relative overflow-hidden">
        {/* 헤더: 구름 요정 Gemini 3.8 Flash 마음 리포트 & 감정 비율 칩 */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-[#EBF5FB] gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#C6E2F7] via-[#F7B5C6] to-[#FFE699] flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-heading text-base md:text-lg font-bold text-[#001E2F]">
                  구름 요정 Gemini 3.8 마음 리포트
                </h3>
                <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#EBF5FB] text-[#336289] border border-[#C6E2F7]">
                  <ShieldCheck className="w-3 h-3 text-[#7CA9D4]" />
                  AI Verified
                </span>
              </div>
              <p className="text-xs text-[#72787f]">
                차분한 어휘 발달 지수 & 실시간 텍스트 감성 분석 완료
              </p>
            </div>
          </div>

          {/* 감정 비율 태그들 */}
          <div className="flex items-center gap-2 flex-wrap">
            {result.sentimentRatios.map((ratio, idx) => (
              <span
                key={idx}
                className={`text-xs font-semibold px-3 py-1 rounded-full border border-black/5 shadow-xs flex items-center gap-1.5 ${ratio.colorClass}`}
              >
                <span className="w-2 h-2 rounded-full bg-current opacity-60"></span>
                <span>{ratio.label}</span>
                <span>{ratio.percentage}%</span>
              </span>
            ))}
          </div>
        </div>

        {/* 메인 리포트 콘텐츠: 온도 다이얼 + 구름 요정 코멘트 & 루틴 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mt-6 items-stretch">
          {/* 마음 온도계 다이얼 카드 */}
          <div className="md:col-span-4 bg-[#F8FAFC] rounded-2xl p-5 border border-[#D4EBFF] flex flex-col items-center justify-center text-center relative shadow-xs">
            {/* 원형 온도 표시 */}
            <div className="relative w-36 h-36 rounded-full flex items-center justify-center bg-white shadow-cloud-card border-4 border-[#C6E2F7]">
              <div className="flex flex-col items-center">
                <span className="font-heading font-extrabold text-3xl text-[#336289] tracking-tight">
                  {result.temperature.toFixed(1)}°C
                </span>
                <span className="text-[11px] font-semibold text-[#8FAABA] px-2 py-0.5 mt-0.5 rounded-full bg-[#EBF5FB]">
                  마음 온도계
                </span>
              </div>
            </div>

            {/* 날씨 텍스트 및 상세 변화 */}
            <div className="mt-4">
              <p className="font-heading font-bold text-base text-[#001E2F]">
                {result.weatherDesc}
              </p>
              <p className="text-xs text-[#72787f] mt-1 font-medium">
                {result.weatherDetail}
              </p>
            </div>
          </div>

          {/* 구름 요정의 한줄평 & 다정한 한마디 & 루틴 추천 */}
          <div className="md:col-span-8 flex flex-col gap-3 justify-between">
            {/* AI의 다이어리 한줄평 박스 */}
            {result.oneLineReview && (
              <div className="bg-[#FFFDF0] rounded-2xl p-4 border border-[#FFE699] flex items-center gap-3 shadow-xs">
                <div className="w-8 h-8 rounded-full bg-[#FFE699]/60 flex items-center justify-center text-sm shrink-0">
                  ✨
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <h4 className="font-heading font-bold text-xs text-[#6e5d1e]">
                      AI의 다이어리 한줄평
                    </h4>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#FFE699]/80 text-[#473900] font-semibold">
                      핵심 감상평
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-[#554506] font-semibold tracking-wide">
                    &ldquo;{result.oneLineReview}&rdquo;
                  </p>
                </div>
              </div>
            )}

            {/* 다정한 한마디 박스 */}
            <div className="bg-[#F0F6FA]/70 rounded-2xl p-5 border border-[#D4EBFF] relative">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="text-base">💌</span>
                <h4 className="font-heading font-bold text-sm text-[#001E2F]">
                  구름 요정의 다정한 한마디
                </h4>
              </div>
              <p className="text-xs md:text-sm text-[#4C6B82] leading-relaxed font-medium whitespace-pre-line">
                &ldquo;{result.aiFairyComment}&rdquo;
              </p>
            </div>

            {/* 내일을 위한 루틴 & 취침 전 감사노트 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* 마인드 루틴 */}
              <div className="bg-[#F6FAFF] rounded-2xl p-4 border border-[#C6E2F7] flex items-start gap-3 shadow-xs">
                <div className="w-8 h-8 rounded-full bg-[#EBF5FB] flex items-center justify-center text-[#7CA9D4] shrink-0 mt-0.5">
                  <Sprout className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <h5 className="font-heading font-bold text-xs text-[#001E2F]">
                    내일을 위한 마인드 루틴
                  </h5>
                  <p className="text-[11px] text-[#72787f] mt-1 leading-normal font-medium">
                    {result.mindRoutine}
                  </p>
                </div>
              </div>

              {/* 취침 전 감사노트 */}
              <div className="bg-[#FFFDF7] rounded-2xl p-4 border border-[#FFE699] flex items-start gap-3 shadow-xs">
                <div className="w-8 h-8 rounded-full bg-[#FFF9E6] flex items-center justify-center text-amber-500 shrink-0 mt-0.5">
                  <Moon className="w-4 h-4 text-amber-500 fill-amber-500" />
                </div>
                <div>
                  <h5 className="font-heading font-bold text-xs text-[#001E2F]">
                    취침 전 감사 노트
                  </h5>
                  <p className="text-[11px] text-[#72787f] mt-1 leading-normal font-medium">
                    {result.gratitudePrompt}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 푸터 바: 보안 안내 */}
        <div className="mt-6 pt-4 border-t border-[#EBF5FB] flex items-center justify-between text-xs text-[#72787f]">
          <div className="flex items-center gap-1.5 font-medium">
            <Lock className="w-3.5 h-3.5 text-[#7CA9D4]" />
            <span>엔드투엔드 온디바이스 가이드라인 안전 암호화 완료</span>
          </div>
        </div>
      </div>
    </div>
  );
}
