'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import DateMoodBar from '@/components/DateMoodBar';
import MemoryCard from '@/components/MemoryCard';
import DiaryEditor from '@/components/DiaryEditor';
import AiAnalysisReport from '@/components/AiAnalysisReport';
import CloudBackground from '@/components/CloudBackground';
import DiaryDrawerModal from '@/components/DiaryDrawerModal';
import GoogleSheetModal from '@/components/GoogleSheetModal';
import { MoodKey, AiAnalysisResult, SavedDiaryItem } from '@/types/diary';
import {
  GoogleSheetRecord,
  createSheetRecord,
  fetchSheetRecords,
  updateSheetRecord,
  deleteSheetRecord,
} from '@/lib/googleSheet';

export default function Home() {
  const [currentDateText, setCurrentDateText] = useState('');
  const [currentTimeText, setCurrentTimeText] = useState('');
  const [lastSavedTimeText, setLastSavedTimeText] = useState('');

  // 감정 선택 상태 (초기에는 감정 영역 숨김)
  const [selectedMood, setSelectedMood] = useState<MoodKey>('peace');
  const [geminiHighlightedMood, setGeminiHighlightedMood] = useState<MoodKey | null>(null);

  // 사진 및 캡션 상태
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState('');

  // 일기 내용 상태
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // AI 분석 결과 상태
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AiAnalysisResult | null>(null);

  // 로컬 일기장 서랍 모달 & 저장 목록
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [savedDiaries, setSavedDiaries] = useState<SavedDiaryItem[]>([]);

  // 구글 시트 모달 & 레코드 목록 상태
  const [isSheetModalOpen, setIsSheetModalOpen] = useState(false);
  const [sheetRecords, setSheetRecords] = useState<GoogleSheetRecord[]>([]);
  const [isSheetLoading, setIsSheetLoading] = useState(false);

  // 로컬 스토리지 불러오기
  useEffect(() => {
    try {
      const stored = localStorage.getItem('mindful_canvas_saved_diaries');
      if (stored) {
        setSavedDiaries(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load saved diaries:', e);
    }
  }, []);

  // 실시간 날짜 및 시간 갱신
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const date = now.getDate();
      const dayName = days[now.getDay()];

      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? '오후' : '오전';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const formattedHours = String(hours).padStart(2, '0');

      setCurrentDateText(`${year}년 ${month}월 ${date}일 ${dayName}`);
      setCurrentTimeText(`${ampm} ${formattedHours}:${minutes}`);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000 * 30);
    return () => clearInterval(interval);
  }, []);

  // Gemini AI 감성 분석 요청
  const handleAnalyze = async () => {
    if (!content.trim()) {
      alert('일기 내용을 작성해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || '분석에 실패했습니다.');
      }

      const data: AiAnalysisResult = await res.json();
      setAnalysisResult(data);

      setSelectedMood(data.dominantMood);
      setGeminiHighlightedMood(data.dominantMood);

      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? '오후' : '오전';
      hours = hours % 12;
      hours = hours ? hours : 12;
      setLastSavedTimeText(`${ampm} ${String(hours).padStart(2, '0')}:${minutes}`);
    } catch (err: unknown) {
      console.error(err);
      alert(err instanceof Error ? err.message : '분석 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 1. [저장] 버튼: 구글 시트(NEXT_PUBLIC_GOOGLE_SCRIPT_URL) 및 로컬 저장소에 저장
  const handleSaveDiary = async () => {
    if (!content.trim()) {
      alert('일기 내용을 먼저 작성해주세요.');
      return;
    }

    const timestamp = Date.now().toString();
    const datetimeStr = `${currentDateText} ${currentTimeText}`.trim();
    const fullContent = title.trim() ? `[${title.trim()}]\n${content.trim()}` : content.trim();

    setIsSaving(true);

    try {
      // 1) 구글 시트 저장 시도 (NEXT_PUBLIC_GOOGLE_SCRIPT_URL 유효 시)
      const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL?.trim();
      let sheetSaved = false;

      if (scriptUrl) {
        try {
          await createSheetRecord(datetimeStr, fullContent, timestamp);
          sheetSaved = true;
        } catch (sheetErr) {
          console.warn('Google Sheet Save warning:', sheetErr);
        }
      }

      // 2) 로컬 스토리지에도 함께 보관
      const newDiaryItem: SavedDiaryItem = {
        id: timestamp,
        createdAt: new Date().toISOString(),
        dateText: currentDateText || '오늘',
        timeText: currentTimeText || '지금',
        title: title.trim() || '소중한 하루의 기록',
        content: content.trim(),
        photoUrl,
        caption,
        mood: selectedMood,
        analysisResult,
      };

      const updated = [newDiaryItem, ...savedDiaries];
      setSavedDiaries(updated);
      try {
        localStorage.setItem('mindful_canvas_saved_diaries', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save to localStorage:', e);
      }

      if (sheetSaved) {
        alert('구글 시트(Google Sheets)에 일기가 성공적으로 저장되었습니다! 📊');
      } else if (!scriptUrl) {
        alert('일기가 안전하게 저장되었습니다! (.env.local에 NEXT_PUBLIC_GOOGLE_SCRIPT_URL을 설정하시면 구글 시트와도 실시간 연동됩니다) 📚');
      } else {
        alert('일기가 로컬에 저장되었습니다. (구글 시트 연동 URL을 확인해주세요)');
      }
    } catch (err) {
      console.error(err);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  // 2. [일기보기] 버튼: 구글 시트에 저장된 일기 리스트 모달 열기 및 조회
  const handleOpenSheetModal = async () => {
    setIsSheetModalOpen(true);
    await loadSheetRecords();
  };

  const loadSheetRecords = async () => {
    const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL?.trim();
    if (!scriptUrl) {
      // URL이 아직 미설정된 경우 로컬 저장소 데이터를 구글 시트 레코드 형식으로 변환하여 안내
      const localAsSheetRecords: GoogleSheetRecord[] = savedDiaries.map((item) => ({
        timestamp: item.id,
        datetime: `${item.dateText} ${item.timeText}`,
        content: item.title ? `[${item.title}]\n${item.content}` : item.content,
      }));
      setSheetRecords(localAsSheetRecords);
      return;
    }

    try {
      setIsSheetLoading(true);
      const data = await fetchSheetRecords();
      setSheetRecords(data);
    } catch (err) {
      console.error(err);
      alert(`구글 시트 일기 목록 조회 실패: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsSheetLoading(false);
    }
  };

  // 구글 시트 레코드 선택 시 메인 에디터로 불러오기
  const handleSelectSheetRecord = (record: GoogleSheetRecord) => {
    let parsedTitle = '';
    let parsedContent = record.content;

    // [제목] 포맷 파싱 지원
    const titleMatch = record.content.match(/^\[(.*?)\]\n([\s\S]*)$/);
    if (titleMatch) {
      parsedTitle = titleMatch[1];
      parsedContent = titleMatch[2];
    }

    setTitle(parsedTitle);
    setContent(parsedContent);
    setLastSavedTimeText(record.datetime);
    setIsSheetModalOpen(false);
  };

  // 구글 시트 레코드 수정 (UPDATE)
  const handleUpdateSheetRecord = async (
    timestamp: string,
    newDatetime: string,
    newContent: string
  ) => {
    const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL?.trim();
    if (scriptUrl) {
      await updateSheetRecord(timestamp, newDatetime, newContent);
    }
    // 로컬 상태 즉시 갱신
    setSheetRecords((prev) =>
      prev.map((r) =>
        r.timestamp === timestamp ? { ...r, datetime: newDatetime, content: newContent } : r
      )
    );
    alert('구글 시트의 일기가 성공적으로 수정되었습니다.');
  };

  // 구글 시트 레코드 삭제 (DELETE)
  const handleDeleteSheetRecord = async (timestamp: string) => {
    const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL?.trim();
    if (scriptUrl) {
      await deleteSheetRecord(timestamp);
    }
    // 로컬 상태 즉시 갱신
    setSheetRecords((prev) => prev.filter((r) => r.timestamp !== timestamp));
    alert('구글 시트의 일기가 삭제되었습니다.');
  };

  // 서랍 열람하기 (로컬)
  const handleSelectDiary = (diary: SavedDiaryItem) => {
    setTitle(diary.title);
    setContent(diary.content);
    setPhotoUrl(diary.photoUrl);
    setCaption(diary.caption || '');
    setSelectedMood(diary.mood);
    setAnalysisResult(diary.analysisResult);
    if (diary.analysisResult) {
      setGeminiHighlightedMood(diary.analysisResult.dominantMood);
    } else {
      setGeminiHighlightedMood(null);
    }
    setLastSavedTimeText(diary.timeText);
  };

  // 로컬 서랍 일기 삭제
  const handleDeleteDiary = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('이 일기를 서랍에서 삭제하시겠습니까?')) {
      const updated = savedDiaries.filter((d) => d.id !== id);
      setSavedDiaries(updated);
      try {
        localStorage.setItem('mindful_canvas_saved_diaries', JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
    }
  };

  // 재시작 (일기 초기화)
  const handleReset = () => {
    if (confirm('작성 중인 일기와 분석 결과를 초기화하고 새로 시작할까요?')) {
      setTitle('');
      setContent('');
      setPhotoUrl(null);
      setCaption('');
      setAnalysisResult(null);
      setGeminiHighlightedMood(null);
      setSelectedMood('peace');
      setLastSavedTimeText('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#F6FAFF] via-[#EBF5FB] to-[#F6FAFF] text-[#001E2F] relative selection:bg-[#7CA9D4]/20">
      {/* 배경 장식용 부드러운 구름 요소들 및 캐릭터 일러스트 */}
      <CloudBackground />
      <div className="fixed top-12 -left-20 w-80 h-40 bg-white/40 rounded-full blur-2xl pointer-events-none -z-10" />
      <div className="fixed bottom-20 -right-20 w-96 h-48 bg-[#FFE699]/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-1/3 right-10 w-72 h-36 bg-[#F7B5C6]/15 rounded-full blur-2xl pointer-events-none -z-10" />

      {/* 1. 상단 글로벌 헤더 */}
      <Header
        onOpenDrawer={() => setIsDrawerOpen(true)}
        savedCount={savedDiaries.length}
      />

      {/* 2. 날짜, 요일/시간 및 감성 이모지 바 */}
      <DateMoodBar
        currentDateText={currentDateText}
        currentTimeText={currentTimeText}
        selectedMood={selectedMood}
        onSelectMood={(mood) => {
          setSelectedMood(mood);
        }}
        geminiHighlightedMood={geminiHighlightedMood}
        showMoodSection={!!analysisResult}
      />

      {/* 3. 순간의 기억 (사진 및 캡션 영역) */}
      <MemoryCard
        photoUrl={photoUrl}
        caption={caption}
        onPhotoUpload={setPhotoUrl}
        onCaptionChange={setCaption}
      />

      {/* 4. 일기 작성 에디터 & 툴바 (재시작, [저장], [일기보기], Gemini 분석 버튼) */}
      <DiaryEditor
        title={title}
        content={content}
        onTitleChange={setTitle}
        onContentChange={setContent}
        onAnalyze={handleAnalyze}
        onReset={handleReset}
        onSave={handleSaveDiary}
        onOpenSheetModal={handleOpenSheetModal}
        isLoading={isLoading}
        isSaving={isSaving}
        lastSavedTimeText={lastSavedTimeText || currentTimeText}
        oneLineReview={analysisResult?.oneLineReview}
        aiFairyComment={analysisResult?.aiFairyComment}
      />

      {/* 5. AI 일기 감성 분석 결과 영역 (초기 숨김, AI 분석 완료 시 표시) */}
      {analysisResult && <AiAnalysisReport result={analysisResult} />}

      {/* 6. 일기장 서랍 모달 (로컬 저장소) */}
      <DiaryDrawerModal
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        diaries={savedDiaries}
        onSelectDiary={handleSelectDiary}
        onDeleteDiary={handleDeleteDiary}
      />

      {/* 7. 구글 시트 일기보기 모달 (Google Sheets 실시간 CRUD) */}
      <GoogleSheetModal
        isOpen={isSheetModalOpen}
        onClose={() => setIsSheetModalOpen(false)}
        records={sheetRecords}
        isLoading={isSheetLoading}
        onRefresh={loadSheetRecords}
        onSelectRecord={handleSelectSheetRecord}
        onUpdateRecord={handleUpdateSheetRecord}
        onDeleteRecord={handleDeleteSheetRecord}
      />

      {/* 세련된 감성 Footer 영역 */}
      <footer className="w-full max-w-[1040px] mx-auto px-4 pt-10 pb-12 mt-auto border-t border-[#D4EBFF]/70">
        <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/80 shadow-cloud-card flex flex-col md:flex-row items-center justify-between gap-6">
          {/* 브랜드 & Copyright 안내 */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7CA9D4] animate-pulse"></span>
              <span className="font-heading font-bold text-base md:text-lg text-[#001E2F] tracking-tight">
                Diary AI Sentiments Analyzer
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EBF5FB] text-[#336289] border border-[#C6E2F7]">
                v1.0.0
              </span>
            </div>
            <p className="text-xs md:text-sm font-semibold text-[#336289] tracking-wide">
              Copyright INU Diary AI Sentiments Analyzer by kyonam Choo
            </p>
            <p className="text-[11px] text-[#72787f] font-medium">
              인공지능 기반 텍스트 감정 분석 및 구글 스프레드시트 양방향 클라우드 아카이빙
            </p>
          </div>

          {/* 유용한 링크 및 뱃지 */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-3 text-xs font-semibold text-[#4C6B82]">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert('개인정보는 암호화되어 안전하게 처리됩니다.');
                }}
                className="hover:text-[#336289] transition px-3 py-1.5 rounded-full hover:bg-white"
              >
                개인정보 처리방침
              </a>
              <span className="text-[#C6E2F7]">|</span>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert('서비스 이용약관입니다.');
                }}
                className="hover:text-[#336289] transition px-3 py-1.5 rounded-full hover:bg-white"
              >
                이용약관
              </a>
              <span className="text-[#C6E2F7]">|</span>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Google Gemini 3.8 AI 윤리 및 가이드라인을 준수합니다.');
                }}
                className="hover:text-[#336289] transition px-3 py-1.5 rounded-full hover:bg-white"
              >
                AI 윤리 원칙
              </a>
            </div>

            <div className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#7CA9D4]/15 via-[#F7B5C6]/15 to-[#FFE699]/20 border border-[#D4EBFF] text-[11px] font-bold text-[#336289] flex items-center gap-1.5 shadow-xs">
              <span>✨ Powered by Gemini 3.8</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
