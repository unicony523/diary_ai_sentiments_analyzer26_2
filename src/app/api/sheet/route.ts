import { NextResponse } from 'next/server';

const getScriptUrl = () => {
  return process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL?.trim() || '';
};

// 1. GET: 목록 조회 (Read)
export async function GET(req: Request) {
  try {
    const scriptUrl = getScriptUrl();
    if (!scriptUrl) {
      return NextResponse.json(
        { success: false, message: 'NEXT_PUBLIC_GOOGLE_SCRIPT_URL이 .env.local에 설정되지 않았습니다.' },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action') || 'read';
    const timestamp = searchParams.get('timestamp') || '';

    let targetUrl = `${scriptUrl}?action=${encodeURIComponent(action)}&_t=${Date.now()}`;
    if (timestamp) {
      targetUrl += `&timestamp=${encodeURIComponent(timestamp)}`;
    }

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
      redirect: 'follow', // GAS 302 리다이렉트 자동 추적
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: `구글 시트 응답 오류 (상태 코드: ${response.status})` },
        { status: response.status }
      );
    }

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { success: false, message: '구글 시트 응답 파싱 실패', raw: text },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    console.error('GAS Proxy GET Error:', err);
    return NextResponse.json(
      { success: false, message: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

// 2. POST: 생성(Create), 수정(Update), 삭제(Delete)
export async function POST(req: Request) {
  try {
    const scriptUrl = getScriptUrl();
    if (!scriptUrl) {
      return NextResponse.json(
        { success: false, message: 'NEXT_PUBLIC_GOOGLE_SCRIPT_URL이 .env.local에 설정되지 않았습니다.' },
        { status: 400 }
      );
    }

    const body = await req.json();

    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', // GAS는 text/plain으로 받음
      },
      body: JSON.stringify(body),
      redirect: 'follow', // GAS 302 리다이렉트 추적
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: `구글 시트 전송 실패 (상태 코드: ${response.status})` },
        { status: response.status }
      );
    }

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { success: true, message: '처리 완료', raw: text }
      );
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    console.error('GAS Proxy POST Error:', err);
    return NextResponse.json(
      { success: false, message: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
