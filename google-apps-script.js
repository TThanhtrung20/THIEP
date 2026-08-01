// ================================================
// GOOGLE APPS SCRIPT - Thiệp Tốt Nghiệp Minzther
// Dán toàn bộ code này vào Google Apps Script
// ================================================

// Tên 2 sheet trong Google Spreadsheet
const SHEET_WISHES = "Lời Chúc";
const SHEET_RSVP   = "Tham Dự";

// ------------------------------------------------
// Hàm chạy 1 lần để tạo header cho cả 2 sheet
// Vào Apps Script → chọn setupSheets → Run
// ------------------------------------------------
function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Sheet lời chúc
  let wsWishes = ss.getSheetByName(SHEET_WISHES);
  if (!wsWishes) wsWishes = ss.insertSheet(SHEET_WISHES);
  wsWishes.clearContents();
  wsWishes.getRange(1, 1, 1, 4).setValues([["STT", "Tên", "Lời Chúc", "Thời Gian"]]);
  wsWishes.getRange(1, 1, 1, 4)
    .setBackground("#4aa8c8")
    .setFontColor("#ffffff")
    .setFontWeight("bold");
  wsWishes.setColumnWidth(1, 50);
  wsWishes.setColumnWidth(2, 160);
  wsWishes.setColumnWidth(3, 380);
  wsWishes.setColumnWidth(4, 180);
  wsWishes.setFrozenRows(1);

  // Sheet RSVP
  let wsRsvp = ss.getSheetByName(SHEET_RSVP);
  if (!wsRsvp) wsRsvp = ss.insertSheet(SHEET_RSVP);
  wsRsvp.clearContents();
  wsRsvp.getRange(1, 1, 1, 4).setValues([["STT", "Tên", "Trả Lời", "Thời Gian"]]);
  wsRsvp.getRange(1, 1, 1, 4)
    .setBackground("#4aa8c8")
    .setFontColor("#ffffff")
    .setFontWeight("bold");
  wsRsvp.setColumnWidth(1, 50);
  wsRsvp.setColumnWidth(2, 160);
  wsRsvp.setColumnWidth(3, 180);
  wsRsvp.setColumnWidth(4, 180);
  wsRsvp.setFrozenRows(1);

  SpreadsheetApp.getUi().alert("✅ Setup xong! 2 sheet đã được tạo.");
}

// ------------------------------------------------
// Nhận POST request từ thiệp và ghi vào Sheets
// ------------------------------------------------
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss   = SpreadsheetApp.getActiveSpreadsheet();
    const now  = Utilities.formatDate(
      new Date(), "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm:ss"
    );

    if (data.type === "wish") {
      const ws  = ss.getSheetByName(SHEET_WISHES);
      const row = ws.getLastRow() + 1;
      ws.getRange(row, 1, 1, 4).setValues([[
        row - 1,          // STT
        data.name,        // Tên
        data.text,        // Lời chúc
        now               // Thời gian
      ]]);

      // Tô màu xen kẽ dòng
      if (row % 2 === 0) {
        ws.getRange(row, 1, 1, 4).setBackground("#eaf6fb");
      }
    }

    else if (data.type === "rsvp") {
      const ws  = ss.getSheetByName(SHEET_RSVP);
      const row = ws.getLastRow() + 1;
      const answer = data.answer === "yes" ? "✅ Sẽ đến" : "❌ Không đến";
      ws.getRange(row, 1, 1, 4).setValues([[
        row - 1,
        data.name,
        answer,
        now
      ]]);

      if (row % 2 === 0) {
        ws.getRange(row, 1, 1, 4).setBackground("#eaf6fb");
      }
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ------------------------------------------------
// Nhận GET request (test xem script hoạt động chưa)
// ------------------------------------------------
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok", message: "Thiệp Minzther API đang chạy 🎓" }))
    .setMimeType(ContentService.MimeType.JSON);
}
