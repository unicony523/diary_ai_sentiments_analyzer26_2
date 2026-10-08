/**
 * 스프레드시트 설정
 * 시트가 연결된 바운드 스크립트(Container-bound)인 경우 getActiveSpreadsheet() 사용,
 * 독립형 스크립트인 경우 아래 SPREADSHEET_ID를 사용합니다.
 */
const SPREADSHEET_ID = "1Bg3UdMQk2U0yYn_vhU3tfVP3rTY1YDpOCcf8ee-AeEI";
const SHEET_NAME = "시트1"; // 사용하는 시트 탭 이름으로 변경하세요 (예: Sheet1, 시트1 등)

function getTargetSheet() {
  let ss;
  try {
    ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) {
      ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    }
  } catch (e) {
    ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  }
  
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.getSheets()[0]; // 첫 번째 탭 기본 선택
  }
  return sheet;
}

/**
 * 0. 시트 헤더 초기화 (최초 1회 실행용)
 * A1: timestamp | B1: datetime | C1: content
 */
function initSheetHeaders() {
  const sheet = getTargetSheet();
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["timestamp", "datetime", "content"]);
  } else {
    const headers = sheet.getRange(1, 1, 1, 3).getValues()[0];
    if (!headers[0] || !headers[1] || !headers[2]) {
      sheet.getRange(1, 1, 1, 3).setValues([["timestamp", "datetime", "content"]]);
    }
  }
  return "헤더 설정 완료";
}

// ==========================================
// 1. CREATE (데이터 추가)
// ==========================================
function createRecord(datetime, content, customTimestamp) {
  const sheet = getTargetSheet();
  
  // timestamp는 고유 식별자(ID) 역할을 하므로 지정되지 않은 경우 현재 밀리초 타임스탬프 사용
  const timestamp = customTimestamp || new Date().getTime().toString();
  const dateStr = datetime || Utilities.formatDate(new Date(), "Asia/Seoul", "yyyy-MM-dd HH:mm:ss");
  
  sheet.appendRow([timestamp, dateStr, content || ""]);
  
  return {
    success: true,
    message: "성공적으로 추가되었습니다.",
    data: {
      timestamp: timestamp,
      datetime: dateStr,
      content: content
    }
  };
}

// ==========================================
// 2. READ (전체 조회 또는 단일 조회)
// ==========================================
function readRecords(timestamp) {
  const sheet = getTargetSheet();
  const lastRow = sheet.getLastRow();
  
  if (lastRow <= 1) {
    return { success: true, count: 0, data: [] };
  }
  
  const values = sheet.getRange(2, 1, lastRow - 1, 3).getValues();
  
  const records = values.map((row, index) => ({
    rowIndex: index + 2,
    timestamp: String(row[0]),
    datetime: row[1] instanceof Date ? Utilities.formatDate(row[1], "Asia/Seoul", "yyyy-MM-dd HH:mm:ss") : String(row[1]),
    content: String(row[2])
  }));
  
  // 특정 timestamp 단일 조회
  if (timestamp) {
    const target = records.find(item => item.timestamp === String(timestamp));
    if (target) {
      return { success: true, data: target };
    } else {
      return { success: false, message: "해당 timestamp의 데이터를 찾을 수 없습니다." };
    }
  }
  
  // 전체 목록 반환
  return {
    success: true,
    count: records.length,
    data: records
  };
}

// ==========================================
// 3. UPDATE (수정)
// ==========================================
function updateRecord(timestamp, newDatetime, newContent) {
  if (!timestamp) {
    return { success: false, message: "수정할 대상의 timestamp를 입력해주세요." };
  }
  
  const sheet = getTargetSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    return { success: false, message: "수정할 데이터가 없습니다." };
  }
  
  const values = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  
  for (let i = 0; i < values.length; i++) {
    if (String(values[i][0]) === String(timestamp)) {
      const targetRow = i + 2;
      
      if (newDatetime !== undefined && newDatetime !== null) {
        sheet.getRange(targetRow, 2).setValue(newDatetime);
      }
      if (newContent !== undefined && newContent !== null) {
        sheet.getRange(targetRow, 3).setValue(newContent);
      }
      
      return {
        success: true,
        message: "성공적으로 수정되었습니다.",
        data: {
          timestamp: timestamp,
          datetime: sheet.getRange(targetRow, 2).getValue(),
          content: sheet.getRange(targetRow, 3).getValue()
        }
      };
    }
  }
  
  return { success: false, message: "일치하는 timestamp를 찾을 수 없습니다." };
}

// ==========================================
// 4. DELETE (삭제)
// ==========================================
function deleteRecord(timestamp) {
  if (!timestamp) {
    return { success: false, message: "삭제할 대상의 timestamp를 입력해주세요." };
  }
  
  const sheet = getTargetSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    return { success: false, message: "삭제할 데이터가 없습니다." };
  }
  
  const values = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  
  for (let i = 0; i < values.length; i++) {
    if (String(values[i][0]) === String(timestamp)) {
      const targetRow = i + 2;
      sheet.deleteRow(targetRow);
      return { success: true, message: `timestamp '${timestamp}' 데이터가 삭제되었습니다.` };
    }
  }
  
  return { success: false, message: "삭제할 대상의 timestamp를 찾을 수 없습니다." };
}

// =========================================================================
// 5. Web App API 엔드포인트 (외부 웹 앱 / Next.js 등에서 HTTP 요청 시 사용)
// =========================================================================

/**
 * GET 요청 처리 (목록 조회 또는 단일 조회)
 * 예: 
 * - 전체 조회: ?action=read
 * - 단일 조회: ?action=read&timestamp=1710000000000
 */
function doGet(e) {
  const action = e.parameter.action || "read";
  const timestamp = e.parameter.timestamp;
  let result;
  
  if (action === "read") {
    result = readRecords(timestamp);
  } else if (action === "delete") {
    result = deleteRecord(timestamp);
  } else {
    result = { success: false, message: "유효하지 않은 GET 액션입니다." };
  }
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * POST 요청 처리 (생성, 수정, 삭제)
 * Body(JSON):
 * 1) 생성(Create):
 *    { "action": "create", "datetime": "2026-10-08 15:00:00", "content": "일기 내용..." }
 * 
 * 2) 수정(Update):
 *    { "action": "update", "timestamp": "1710000000000", "datetime": "수정일시", "content": "수정내용" }
 * 
 * 3) 삭제(Delete):
 *    { "action": "delete", "timestamp": "1710000000000" }
 */
function doPost(e) {
  let result;
  try {
    let postData = {};
    if (e.postData && e.postData.contents) {
      postData = JSON.parse(e.postData.contents);
    } else {
      postData = e.parameter;
    }
    
    const action = postData.action || "create";
    
    switch (action) {
      case "create":
        result = createRecord(postData.datetime, postData.content, postData.timestamp);
        break;
        
      case "update":
        result = updateRecord(postData.timestamp, postData.datetime, postData.content);
        break;
        
      case "delete":
        result = deleteRecord(postData.timestamp);
        break;
        
      case "read":
        result = readRecords(postData.timestamp);
        break;
        
      default:
        result = { success: false, message: "지원하지 않는 action입니다." };
        break;
    }
  } catch (error) {
    result = { success: false, message: error.toString() };
  }
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
