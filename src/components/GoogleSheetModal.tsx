'use client';

import React, { useState } from 'react';
import { GoogleSheetRecord } from '@/lib/googleSheet';
import {
  X,
  Table,
  Calendar,
  Clock,
  RefreshCw,
  Trash2,
  Edit3,
  ExternalLink,
  AlertCircle,
  Check,
} from 'lucide-react';

interface GoogleSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: GoogleSheetRecord[];
  isLoading: boolean;
  onRefresh: () => void;
  onSelectRecord: (record: GoogleSheetRecord) => void;
  onUpdateRecord: (timestamp: string, newDatetime: string, newContent: string) => Promise<void>;
  onDeleteRecord: (timestamp: string) => Promise<void>;
}

export default function GoogleSheetModal({
  isOpen,
  onClose,
  records,
  isLoading,
  onRefresh,
  onSelectRecord,
  onUpdateRecord,
  onDeleteRecord,
}: GoogleSheetModalProps) {
  const [editingTimestamp, setEditingTimestamp] = useState<string | null>(null);
  const [editDatetime, setEditDatetime] = useState('');
  const [editContent, setEditContent] = useState('');
  const [isActionLoading, setIsActionLoading] = useState(false);

  if (!isOpen) return null;

  const handleStartEdit = (record: GoogleSheetRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTimestamp(record.timestamp);
    setEditDatetime(record.datetime);
    setEditContent(record.content);
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTimestamp(null);
  };

  const handleSaveEdit = async (timestamp: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editContent.trim()) {
      alert('수정할 일기 내용을 입력해주세요.');
      return;
    }
    try {
      setIsActionLoading(true);
      await onUpdateRecord(timestamp, editDatetime, editContent);
      setEditingTimestamp(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : '수정에 실패했습니다.');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDelete = async (timestamp: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('구글 시트에서 이 일기(데이터)를 삭제하시겠습니까?')) {
      try {
        setIsActionLoading(true);
        await onDeleteRecord(timestamp);
      } catch (err: unknown) {
        alert(err instanceof Error ? err.message : '삭제에 실패했습니다.');
      } finally {
        setIsActionLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white/95 rounded-3xl border border-white max-w-3xl w-full max-h-[85vh] flex flex-col shadow-cloud-float overflow-hidden">
        {/* 모달 상단 헤더 */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#EBF5FB] bg-[#F6FAFF]/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#34A853]/20 via-[#4285F4]/20 to-[#FBBC05]/20 border border-[#34A853]/30 flex items-center justify-center text-emerald-600 shadow-xs">
              <Table className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-lg text-[#001E2F]">
                  구글 시트 일기 목록 📊
                </h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                  {records.length}개 동기화됨
                </span>
              </div>
              <p className="text-xs text-[#72787f]">
                Google Sheets (`timestamp`, `datetime`, `content`) 실시간 CRUD
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              disabled={isLoading || isActionLoading}
              className="p-2 rounded-full bg-white hover:bg-[#EBF5FB] border border-[#D4EBFF] text-[#4C6B82] transition shadow-xs disabled:opacity-50"
              title="새로고침"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#7CA9D4]' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white hover:bg-[#EBF5FB] border border-[#D4EBFF] text-[#72787f] hover:text-[#001E2F] transition"
              title="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 안내 바: 구글 시트 링크 */}
        <div className="px-6 py-2.5 bg-[#F8FAFC] border-b border-[#EBF5FB] flex items-center justify-between text-xs text-[#4C6B82]">
          <span className="flex items-center gap-1.5 font-medium">
            <AlertCircle className="w-3.5 h-3.5 text-[#7CA9D4]" />
            카드를 클릭하면 메인 일기장으로 바로 불러옵니다.
          </span>
          <a
            href="https://docs.google.com/spreadsheets/d/1Bg3UdMQk2U0yYn_vhU3tfVP3rTY1YDpOCcf8ee-AeEI/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[#336289] hover:underline font-semibold"
          >
            <span>스프레드시트 열기</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* 일기 리스트 본문 */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3.5">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-[#7CA9D4] gap-3">
              <RefreshCw className="w-8 h-8 animate-spin" />
              <p className="font-heading text-sm font-semibold text-[#4C6B82]">
                구글 시트에서 일기를 불러오는 중입니다...
              </p>
            </div>
          ) : records.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center justify-center text-[#72787f]">
              <div className="w-16 h-16 rounded-full bg-[#EBF5FB] flex items-center justify-center text-3xl mb-3">
                📋
              </div>
              <p className="font-heading text-base font-bold text-[#4C6B82]">
                구글 시트에 저장된 일기가 없습니다
              </p>
              <p className="text-xs mt-1">일기를 작성한 후 [저장] 버튼을 누르면 여기에 나타납니다.</p>
            </div>
          ) : (
            records.map((record) => {
              const isEditing = editingTimestamp === record.timestamp;

              return (
                <div
                  key={record.timestamp}
                  onClick={() => !isEditing && onSelectRecord(record)}
                  className={`group relative p-4 rounded-2xl border transition-all ${
                    isEditing
                      ? 'bg-white border-[#7CA9D4] shadow-md'
                      : 'bg-[#FBFDFE] border-[#D4EBFF] hover:bg-white hover:border-[#7CA9D4] hover:shadow-cloud-card cursor-pointer'
                  }`}
                >
                  {isEditing ? (
                    /* 수정 모드 */
                    <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-between">
                        <span className="font-heading font-bold text-xs text-[#336289]">
                          일기 수정 (timestamp: {record.timestamp})
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => handleSaveEdit(record.timestamp, e)}
                            disabled={isActionLoading}
                            className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#7CA9D4] text-white text-xs font-semibold hover:bg-[#6897c4] transition"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>저장</span>
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            disabled={isActionLoading}
                            className="px-2.5 py-1 rounded-full bg-gray-100 text-[#4C6B82] text-xs font-semibold hover:bg-gray-200 transition"
                          >
                            취소
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-[#72787f] block mb-1">
                          날짜 및 시간 (datetime)
                        </label>
                        <input
                          type="text"
                          value={editDatetime}
                          onChange={(e) => setEditDatetime(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#D4EBFF] focus:outline-none focus:ring-1 focus:ring-[#7CA9D4]"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-[#72787f] block mb-1">
                          일기 내용 (content)
                        </label>
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-[#D4EBFF] focus:outline-none focus:ring-1 focus:ring-[#7CA9D4] leading-relaxed"
                        />
                      </div>
                    </div>
                  ) : (
                    /* 일반 뷰 모드 */
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-[#4C6B82]">
                          <span className="flex items-center gap-1 font-semibold text-[#001E2F]">
                            <Calendar className="w-3.5 h-3.5 text-[#7CA9D4]" />
                            {record.datetime}
                          </span>
                          <span className="text-[#c2c7cf]">|</span>
                          <span className="flex items-center gap-1 font-medium text-[11px] text-[#72787f]">
                            <Clock className="w-3 h-3 text-[#72787f]" />
                            ID: {record.timestamp}
                          </span>
                        </div>

                        {/* 수정 / 삭제 버튼 */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => handleStartEdit(record, e)}
                            className="p-1.5 rounded-full text-[#72787f] hover:text-[#336289] hover:bg-[#EBF5FB] transition"
                            title="일기 수정 (UPDATE)"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(record.timestamp, e)}
                            className="p-1.5 rounded-full text-[#72787f] hover:text-red-500 hover:bg-red-50 transition"
                            title="일기 삭제 (DELETE)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* 내용 미리보기 */}
                      <p className="text-xs md:text-sm text-[#001E2F] line-clamp-3 leading-relaxed font-medium whitespace-pre-wrap">
                        {record.content}
                      </p>

                      <div className="pt-2 border-t border-[#F0F6FA] flex items-center justify-between text-[11px] text-[#72787f]">
                        <span className="text-[#8FAABA]">클릭하여 메인 일기장에 열기</span>
                        <span className="text-[#336289] font-semibold group-hover:underline">
                          불러오기 →
                        </span>
                      </div>
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
