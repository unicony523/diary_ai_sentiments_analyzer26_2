'use client';

import React, { useRef } from 'react';
import { Camera, ImagePlus, Heart, Sparkles, X } from 'lucide-react';

interface MemoryCardProps {
  photoUrl: string | null;
  caption: string;
  onPhotoUpload: (url: string | null) => void;
  onCaptionChange: (caption: string) => void;
}

export default function MemoryCard({
  photoUrl,
  caption,
  onPhotoUpload,
  onCaptionChange,
}: MemoryCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onPhotoUpload(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full max-w-[1040px] mx-auto px-4 mt-6">
      <div className="bg-white/85 backdrop-blur-md rounded-3xl p-5 md:p-6 border border-white/90 shadow-cloud-card relative overflow-hidden">
        {/* 상단 레이블 & 사진 수량 카운트 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#EBF5FB] flex items-center justify-center text-[#7CA9D4]">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-sm md:text-base text-[#001E2F]">
                순간의 기억
              </h2>
              <p className="text-[11px] text-[#72787f]">오늘 마음을 머물게 한 다정한 장면</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#FFD9E1]/60 text-[#834f5e] font-semibold flex items-center gap-1">
              🏷️ 오늘의 힐링
            </span>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#C6E2F7] bg-[#F6FAFF] text-xs font-semibold text-[#4C6B82] hover:bg-[#EBF5FB] transition"
            >
              <ImagePlus className="w-3.5 h-3.5 text-[#7CA9D4]" />
              <span>사진 추가 {photoUrl ? '(1/5)' : '(0/5)'}</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>

        {/* 사진 갤러리 영역 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
          {/* 메인 사진 카드 */}
          <div className="md:col-span-7 bg-[#F0F6FA] rounded-2xl p-2.5 border border-[#D4EBFF] relative flex flex-col justify-between overflow-hidden min-h-[220px]">
            {photoUrl ? (
              <div className="relative w-full h-[220px] rounded-xl overflow-hidden group">
                <img
                  src={photoUrl}
                  alt="업로드된 순간의 사진"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => onPhotoUpload(null)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition"
                  title="사진 삭제"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-[220px] rounded-xl border-2 border-dashed border-[#C6E2F7] flex flex-col items-center justify-center cursor-pointer hover:bg-white/50 transition group"
              >
                <div className="w-12 h-12 rounded-full bg-[#EBF5FB] flex items-center justify-center text-[#7CA9D4] group-hover:scale-110 transition">
                  <ImagePlus className="w-6 h-6" />
                </div>
                <p className="mt-2 text-xs font-semibold text-[#4C6B82]">
                  오늘을 담은 사진을 올려보세요
                </p>
                <p className="text-[11px] text-[#72787f]">클릭하여 이미지 파일 선택</p>
              </div>
            )}

            {/* 사진 하단 캡션 인풋 */}
            <div className="mt-2.5 flex items-center gap-2 bg-white/90 px-3 py-1.5 rounded-xl border border-white shadow-xs">
              <span className="text-xs text-[#7CA9D4]">✏️</span>
              <input
                type="text"
                value={caption}
                onChange={(e) => onCaptionChange(e.target.value)}
                placeholder="창가로 쏟아지던 따스한 5월의 햇살과 라떼 한 모금"
                className="flex-1 bg-transparent text-xs text-[#001E2F] placeholder:text-[#8FAABA] outline-none font-medium"
              />
              <Heart className="w-3.5 h-3.5 text-[#F7B5C6] fill-[#F7B5C6]" />
            </div>
          </div>

          {/* 서브 사진 카드 & 요정 알림 팁 */}
          <div className="md:col-span-5 flex flex-col gap-3 justify-between">
            <div className="grid grid-cols-2 gap-3 h-full">
              {/* 기본 감성 서브 사진 프리셋 */}
              <div className="rounded-2xl overflow-hidden border border-[#D4EBFF] bg-[#F0F6FA] relative h-[150px]">
                <img
                  src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=400&q=80"
                  alt="나뭇잎 감성 프리셋"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-full bg-black/40 text-white text-[10px] backdrop-blur-xs">
                  연둣빛 바람
                </span>
              </div>

              {/* 추가 슬롯 */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="rounded-2xl border-2 border-dashed border-[#C6E2F7] bg-[#FBFDFE] flex flex-col items-center justify-center cursor-pointer hover:bg-[#EBF5FB] transition p-2 h-[150px]"
              >
                <div className="w-8 h-8 rounded-full bg-[#EBF5FB] flex items-center justify-center text-[#7CA9D4]">
                  <ImagePlus className="w-4 h-4" />
                </div>
                <span className="mt-1 text-[11px] font-semibold text-[#4C6B82]">사진 쏙 넣기</span>
                <span className="text-[10px] text-[#72787f]">또는 끌어내려 첨부</span>
              </div>
            </div>

            {/* 요정의 힌트 팁 배너 */}
            <div className="p-3 rounded-2xl bg-gradient-to-r from-[#EBF5FB] to-[#FDF4F6] border border-[#C6E2F7] flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#7CA9D4] shadow-xs shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <p className="text-[11px] text-[#4C6B82] leading-tight">
                <strong className="text-[#336289]">Gemini 요정</strong>이 사진의 햇살과 초록 잎사귀를 보고 오늘의 맑은 지수를 듬뿍 더했어요!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
