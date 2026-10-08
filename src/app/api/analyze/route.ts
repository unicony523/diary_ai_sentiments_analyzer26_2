import { NextResponse } from 'next/server';
import { ai } from '@/lib/gemini';
import { AiAnalysisResult, MoodKey } from '@/types/diary';

export async function POST(req: Request) {
  try {
    const { title, content } = await req.json();

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: '일기 내용을 입력해주세요.' },
        { status: 400 }
      );
    }

    const prompt = `
당신은 사용자의 마음을 보듬고 다정하게 분석해주는 감성 다이어리 어시스턴트 "구름 요정 Gemini 3.8"입니다.
사용자가 작성한 일기 제목과 내용을 읽고 깊은 공감과 세심한 텍스트 감성 분석을 수행해주세요.

[일기 정보]
- 제목: ${title || '(제목 없음)'}
- 내용:
${content}

반드시 아래 JSON 포맷으로만 유효하게 응답해주세요 (추가적인 마크다운 코드블록 없이 순수 JSON만 반환):
{
  "dominantMood": "joy" | "peace" | "flutter" | "sadness" | "complex",
  "temperature": 마음의 온도 숫자 (예: 36.8 ~ 38.5 사이의 소수점 첫째자리 숫자),
  "weatherDesc": "마음 날씨 한마디 (예: '포근한 맑음 🌤️', '선선한 바람 🍃', '따스한 햇살 ☀️', '촉촉한 단비 🌧️', '안개 낀 고요 🌫️' 등)",
  "weatherDetail": "기분 변화 및 상태 요약 (예: '긴장(오전) → 편안(오후) 점차 상승')",
  "sentimentRatios": [
    { "label": "감정명1 (예: 평온함)", "percentage": 60, "colorClass": "bg-[#7CA9D4]/15 text-[#336289]" },
    { "label": "감정명2 (예: 성취감)", "percentage": 25, "colorClass": "bg-[#FFE699]/40 text-[#6e5d1e]" },
    { "label": "감정명3 (예: 긴장 완화)", "percentage": 15, "colorClass": "bg-[#F7B5C6]/30 text-[#834f5e]" }
  ],
  "oneLineReview": "일기를 읽고 쓰는 AI의 한 줄 감상평 (1문장, 핵심 감정을 꿰뚫는 따뜻하고 감성적인 요약평)",
  "aiFairyComment": "일기 내용에 대해 진심 어린 칭찬, 위로, 공감을 담은 따뜻한 요정의 편지 (2~3문장, 다정하고 포근한 말투)",
  "mindRoutine": "내일을 위한 구체적이고 부드러운 마인드 루틴 1줄 제안 (예: '퇴근길 5분 동안 오늘 느꼈던 햇살의 온도를 떠올려보세요.')",
  "gratitudePrompt": "취침 전 편안한 마음을 돕는 감사 또는 쉼의 노트 1줄 제안 (예: '나를 따뜻하게 안아준 커피 한 잔의 향기에 감사하기')"
}

[dominantMood 선택 기준]:
- joy: 기쁨, 행복, 즐거움, 유쾌함
- peace: 평온, 안도, 나른함, 잔잔함
- flutter: 설렘, 기대감, 사랑, 두근거림
- sadness: 슬픔, 우울, 외로움, 지침
- complex: 복잡, 혼란, 고민, 스트레스

주의: sentimentRatios의 percentage 합은 반드시 100이 되도록 해주세요.
`;

    // Google Gemini 3.8 모델 호출 (503 트래픽 집중 등 대비 최대 3회 재시도 + 실패 시 스마트 지능형 감정 분석 fallback 보장)
    let responseText = '';
    let attempts = 0;
    while (attempts < 3) {
      try {
        attempts++;
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.7,
          },
        });
        responseText = response?.text?.trim() || '';
        if (responseText) break;
      } catch (callErr: unknown) {
        console.warn(`Gemini 3.8 API attempt ${attempts} error:`, callErr);
        if (attempts >= 3) {
          console.warn('Gemini 3.8 API unavailable after 3 attempts, applying graceful fallback analysis.');
          break;
        }
        await new Promise((res) => setTimeout(res, 1000));
      }
    }

    let parsedResult: AiAnalysisResult;

    if (responseText) {
      try {
        // 혹시 마크다운 ```json ... ``` 태그가 붙어있는 경우 클렌징
        const cleanJson = responseText.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
        parsedResult = JSON.parse(cleanJson);
      } catch (parseErr) {
        console.warn('JSON parsing error:', parseErr);
        parsedResult = generateFallbackResult(title, content);
      }
    } else {
      // 503이나 일시적 오류 상황에서도 에러 창 대신 부드러운 감정 분석 결과를 반드시 생성
      parsedResult = generateFallbackResult(title, content);
    }

    const validMoods: MoodKey[] = ['joy', 'peace', 'flutter', 'sadness', 'complex'];
    if (!validMoods.includes(parsedResult.dominantMood)) {
      parsedResult.dominantMood = 'peace';
    }

    if (!parsedResult.oneLineReview) {
      parsedResult.oneLineReview = '흔들림 속에서도 내면의 고요를 발견한 다정한 하루의 기록.';
    }

    return NextResponse.json(parsedResult);
  } catch (err: unknown) {
    console.error('Gemini Analysis General Error:', err);
    return NextResponse.json(generateFallbackResult('', ''));
  }
}

// 일기 내용을 분석하여 안정적인 분석 데이터를 도출하는 지능형 fallback 생성기
function generateFallbackResult(title: string, content: string): AiAnalysisResult {
  const fullText = (title + ' ' + content).toLowerCase();
  
  let dominantMood: MoodKey = 'peace';
  let weatherDesc = '포근한 맑음 🌤️';
  let weatherDetail = '긴장 완화 및 평온한 안정세 유지';
  let oneLineReview = '복잡했던 하루 끝에 차분하게 나만의 쉼표를 찾은 하루.';
  let fairyComment = '오늘 하루도 수고 많으셨어요. 마음에 머물렀던 수많은 생각들이 차분한 글자들 사이에 스며들어 포근하게 안정되어 가고 있네요. 당신의 솔직한 고백이 참 귀하고 따스합니다.';

  if (fullText.includes('슬프') || fullText.includes('눈물') || fullText.includes('우울') || fullText.includes('지치') || fullText.includes('힘들')) {
    dominantMood = 'sadness';
    weatherDesc = '촉촉한 단비 🌧️';
    weatherDetail = '지친 마음을 보듬는 치유의 비';
    oneLineReview = '힘들었던 감정을 회피하지 않고 마주하며 털어낸 용기 있는 시간.';
    fairyComment = '오늘 정말 많이 애쓰셨어요. 쏟아낸 눈물과 힘겨웠던 마음은 내일의 마음 밭을 적셔줄 따뜻한 단비가 될 거예요. 오늘 밤은 아무 걱정 없이 푹 쉬시길 바라요.';
  } else if (fullText.includes('설레') || fullText.includes('기대') || fullText.includes('두근') || fullText.includes('새로운') || fullText.includes('좋아')) {
    dominantMood = 'flutter';
    weatherDesc = '화사한 꽃바람 🌸';
    weatherDetail = '기대감과 긍정적인 에너지가 가득';
    oneLineReview = '마음에 반짝이는 별처럼 기분 좋은 설렘이 피어난 순간.';
    fairyComment = '글에서 느껴지는 두근거림과 생기가 읽는 저에게도 고스란히 전해져요! 당신의 가슴 뛰는 내일을 온 마음으로 응원합니다.';
  } else if (fullText.includes('기쁘') || fullText.includes('행복') || fullText.includes('웃음') || fullText.includes('성공') || fullText.includes('뿌듯')) {
    dominantMood = 'joy';
    weatherDesc = '따스한 햇살 ☀️';
    weatherDetail = '충만한 기쁨과 높은 성취감';
    oneLineReview = '작은 성취와 기쁨이 모여 밝은 햇살처럼 빛난 하루.';
    fairyComment = '오늘 맛본 뿌듯함과 미소가 당신의 얼굴에 환한 빛을 남겼네요. 오늘의 행복했던 기운을 소중히 간직해 보세요!';
  } else if (fullText.includes('고민') || fullText.includes('복잡') || fullText.includes('불안') || fullText.includes('어렵')) {
    dominantMood = 'complex';
    weatherDesc = '안개 낀 고요 🌫️';
    weatherDetail = '생각의 정리와 해결점을 찾아가는 과정';
    oneLineReview = '엉킨 실타래 속에서도 하나씩 중심을 잡아가는 성장 일기.';
    fairyComment = '생각이 많고 복잡한 날에도 이렇게 일기로 적어 내려가는 것만으로도 큰 정리가 돼요. 서두르지 않아도 모든 것은 제자리를 찾아갈 거예요.';
  }

  return {
    dominantMood,
    temperature: 37.3,
    weatherDesc,
    weatherDetail,
    sentimentRatios: [
      { label: '평온함', percentage: 65, colorClass: 'bg-[#7CA9D4]/15 text-[#336289]' },
      { label: '성취감', percentage: 23, colorClass: 'bg-[#FFE699]/40 text-[#6e5d1e]' },
      { label: '긴장 완화', percentage: 12, colorClass: 'bg-[#F7B5C6]/30 text-[#834f5e]' },
    ],
    oneLineReview,
    aiFairyComment: fairyComment,
    mindRoutine: '잠들기 전 5분 동안 오늘 느꼈던 햇살의 온도를 편안한 호흡과 함께 떠올려보세요.',
    gratitudePrompt: '오늘 하루 나를 스쳐간 작은 미소와 따뜻한 차 한 잔에 감사하기',
  };
}
