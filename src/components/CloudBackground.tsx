'use client';

import React from 'react';

export default function CloudBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* 1. 좌측 상단 몽글이 구름 (screen.png 스타일: 눈과 미소가 있는 귀여운 파스텔 구름) */}
      <div className="absolute top-16 left-2 md:left-10 w-48 md:w-60 h-32 md:h-40 opacity-90 animate-float-slow">
        <svg viewBox="0 0 200 120" className="w-full h-full drop-shadow-md">
          {/* 구름 몸체 */}
          <path
            d="M40,90 Q20,90 20,70 Q20,50 40,45 Q50,20 85,25 Q115,10 145,30 Q175,25 180,55 Q195,70 185,90 Q170,105 140,98 Q100,105 40,90 Z"
            fill="#C9E6FF"
            opacity="0.8"
          />
          <path
            d="M45,85 Q25,85 25,68 Q25,52 45,48 Q55,25 85,30 Q112,18 140,35 Q168,30 172,58 Q185,70 176,86 Q162,98 135,92 Q98,98 45,85 Z"
            fill="#EBF5FB"
          />
          {/* 볼터치 */}
          <ellipse cx="68" cy="68" rx="8" ry="5" fill="#F7B5C6" opacity="0.8" />
          <ellipse cx="122" cy="68" rx="8" ry="5" fill="#F7B5C6" opacity="0.8" />
          {/* 눈 두 개 */}
          <circle cx="78" cy="60" r="3.5" fill="#336289" />
          <circle cx="112" cy="60" r="3.5" fill="#336289" />
          {/* 귀여운 미소 입 */}
          <path
            d="M89,65 Q95,72 101,65"
            stroke="#336289"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* 2. 우측 중앙 몽글이 구름 (screen.png 스타일) */}
      <div className="absolute top-[40%] right-2 md:right-12 w-52 md:w-68 h-36 md:h-44 opacity-85 animate-float-reverse">
        <svg viewBox="0 0 220 130" className="w-full h-full drop-shadow-md">
          <path
            d="M40,95 Q15,90 20,65 Q20,40 50,40 Q65,15 105,20 Q140,8 170,30 Q195,30 200,60 Q215,85 190,105 Q160,115 120,105 Q70,115 40,95 Z"
            fill="#FFE699"
            opacity="0.4"
          />
          <path
            d="M45,90 Q22,86 26,65 Q26,45 53,44 Q68,22 103,26 Q135,16 163,35 Q186,36 190,62 Q202,82 182,98 Q155,106 118,98 Q72,106 45,90 Z"
            fill="#F6FAFF"
          />
          {/* 눈 & 볼터치 */}
          <ellipse cx="85" cy="65" rx="6" ry="3.5" fill="#F7B5C6" opacity="0.7" />
          <ellipse cx="135" cy="65" rx="6" ry="3.5" fill="#F7B5C6" opacity="0.7" />
          <circle cx="95" cy="58" r="3" fill="#336289" />
          <circle cx="125" cy="58" r="3" fill="#336289" />
          {/* 반짝이 별 장식 */}
          <text x="155" y="45" fontSize="16" fill="#F7B5C6">✨</text>
        </svg>
      </div>

      {/* 3. 우측 하단 아늑한 솜사탕 구름 */}
      <div className="absolute -bottom-10 right-12 w-64 md:w-80 h-36 md:h-44 opacity-80 animate-float-slow">
        <svg viewBox="0 0 240 140" className="w-full h-full drop-shadow-sm">
          <path
            d="M30,100 C10,95 10,65 35,55 C40,30 75,25 95,40 C115,15 160,20 180,45 C205,40 225,65 220,90 C225,120 190,130 160,120 C120,135 60,125 30,100 Z"
            fill="#E0F0FF"
          />
          {/* 살포시 감은 눈(졸린 표정) */}
          <path
            d="M100,75 Q106,70 112,75"
            stroke="#4C6B82"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M130,75 Q136,70 142,75"
            stroke="#4C6B82"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          <ellipse cx="94" cy="80" rx="5" ry="3" fill="#F7B5C6" opacity="0.7" />
          <ellipse cx="148" cy="80" rx="5" ry="3" fill="#F7B5C6" opacity="0.7" />
          <text x="75" y="55" fontSize="14">💤</text>
        </svg>
      </div>

      {/* 4. 좌측 하단 미니 떠다니는 구름 조각 */}
      <div className="absolute bottom-24 left-10 w-28 h-18 opacity-60 animate-float-reverse">
        <svg viewBox="0 0 100 60" className="w-full h-full">
          <path
            d="M20,45 Q5,45 8,30 Q10,18 25,20 Q35,5 55,12 Q70,5 82,18 Q95,22 92,36 Q90,48 75,46 Q55,50 20,45 Z"
            fill="#C9E6FF"
          />
        </svg>
      </div>
    </div>
  );
}
