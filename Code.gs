// Google Apps Script - 기존 "2026 Vision Camp 등록 URL(응답)" 스프레드시트에 붙여넣을 코드
// 이 스크립트는 반드시 해당 스프레드시트에서 "확장 프로그램 → Apps Script"로 열어야 합니다.
// (그래야 SpreadsheetApp.getActiveSpreadsheet()가 이 시트를 가리킵니다.)
// 사용법은 DEPLOY.md 참고

// 구글 폼이 자동으로 만든 응답 시트 탭 이름 (기존 데이터가 있는 탭)
const SHEET_NAME = "설문지 응답 시트1";

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = JSON.parse(e.postData.contents);

  // 기존 시트의 열 순서(타임스탬프 | 1. 이름 | 2. 캠퍼스 | 3. 학번)에 맞춰 추가
  sheet.appendRow([
    new Date(),
    data["이름"] || "",
    data["캠퍼스"] || "",
    data["학번"] || "",
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ result: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return ContentService.createTextOutput("2026 Vision Camp 등록 엔드포인트가 정상 작동 중입니다.");
}
