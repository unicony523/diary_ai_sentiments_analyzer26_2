/**
 * Google Apps Script Web App 연동 클라이언트 모듈
 * 내부 /api/sheet 프록시를 통해 브라우저 CORS 및 302 리다이렉트 문제를 완벽히 해결합니다.
 */

export interface GoogleSheetRecord {
  rowIndex?: number;
  timestamp: string;
  datetime: string;
  content: string;
}

export interface GoogleSheetResponse<T = unknown> {
  success: boolean;
  message?: string;
  count?: number;
  data?: T;
}

/**
 * 1. CREATE: 구글 시트에 일기 추가 (timestamp, datetime, content)
 */
export async function createSheetRecord(
  datetime: string,
  content: string,
  customTimestamp?: string
): Promise<GoogleSheetResponse<GoogleSheetRecord>> {
  const timestamp = customTimestamp || Date.now().toString();

  const response = await fetch('/api/sheet', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'create',
      timestamp,
      datetime,
      content,
    }),
  });

  const result = await response.json();
  if (!response.ok || (result && result.success === false)) {
    throw new Error(result?.message || '구글 시트 저장에 실패했습니다.');
  }

  return result;
}

/**
 * 2. READ: 구글 시트에서 일기 목록 전체 조회
 */
export async function fetchSheetRecords(): Promise<GoogleSheetRecord[]> {
  const response = await fetch(`/api/sheet?action=read&_t=${Date.now()}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  const result = await response.json();
  if (!response.ok || (result && result.success === false)) {
    throw new Error(result?.message || '구글 시트 일기 목록 조회에 실패했습니다.');
  }

  return Array.isArray(result.data) ? result.data : [];
}

/**
 * 3. UPDATE: 구글 시트의 특정 일기 수정
 */
export async function updateSheetRecord(
  timestamp: string,
  newDatetime: string,
  newContent: string
): Promise<GoogleSheetResponse<GoogleSheetRecord>> {
  const response = await fetch('/api/sheet', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'update',
      timestamp,
      datetime: newDatetime,
      content: newContent,
    }),
  });

  const result = await response.json();
  if (!response.ok || (result && result.success === false)) {
    throw new Error(result?.message || '구글 시트 일기 수정에 실패했습니다.');
  }

  return result;
}

/**
 * 4. DELETE: 구글 시트의 특정 일기 삭제
 */
export async function deleteSheetRecord(
  timestamp: string
): Promise<GoogleSheetResponse> {
  const response = await fetch('/api/sheet', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'delete',
      timestamp,
    }),
  });

  const result = await response.json();
  if (!response.ok || (result && result.success === false)) {
    throw new Error(result?.message || '구글 시트 일기 삭제에 실패했습니다.');
  }

  return result;
}
