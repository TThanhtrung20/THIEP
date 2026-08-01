# 📋 HƯỚNG DẪN KẾT NỐI GOOGLE SHEETS

## Bước 1 — Tạo Google Spreadsheet

1. Mở [sheets.google.com](https://sheets.google.com)
2. Nhấn **"+ Trống"** để tạo bảng tính mới
3. Đặt tên bảng tính là: `Thiệp Tốt Nghiệp Minzther`

---

## Bước 2 — Mở Google Apps Script

1. Trong bảng tính vừa tạo, nhấn menu **Tiện ích mở rộng** (Extensions)
2. Chọn **Apps Script**
3. Xóa hết code mặc định trong editor (thường là `function myFunction() {}`)

---

## Bước 3 — Dán code vào Apps Script

1. Mở file `google-apps-script.js` trong thư mục thiệp
2. **Copy toàn bộ** nội dung file đó
3. **Dán vào** Apps Script editor
4. Nhấn **💾 Save** (Ctrl+S)

---

## Bước 4 — Chạy setupSheets để tạo 2 sheet

1. Ở thanh toolbar phía trên, chọn hàm **`setupSheets`** từ dropdown
2. Nhấn nút **▶ Run**
3. Lần đầu sẽ hỏi cấp quyền → nhấn **Review permissions**
4. Chọn tài khoản Google của bạn
5. Nhấn **Advanced** → **Go to Thiệp Tốt Nghiệp (unsafe)** → **Allow**
6. Chờ chạy xong → sẽ hiện thông báo ✅ Setup xong!
7. Quay lại bảng tính → thấy 2 sheet mới: **Lời Chúc** và **Tham Dự**

---

## Bước 5 — Deploy thành Web App

1. Trong Apps Script, nhấn nút **Deploy** (góc trên phải)
2. Chọn **New deployment**
3. Nhấn ⚙️ (bánh răng) → chọn **Web app**
4. Điền thông tin:
   - **Description**: Thiệp Minzther
   - **Execute as**: `Me` (tài khoản của bạn)
   - **Who has access**: `Anyone` ← **QUAN TRỌNG**, phải chọn Anyone
5. Nhấn **Deploy**
6. Copy **Web app URL** — trông giống như:
   ```
   https://script.google.com/macros/s/AKfycbxxxxxxxxxxxxxxxx/exec
   ```

---

## Bước 6 — Dán URL vào script.js

1. Mở file `script.js` trong thư mục thiệp
2. Tìm dòng:
   ```js
   sheetsWebAppUrl: "",
   ```
3. Dán URL vào giữa dấu `""`:
   ```js
   sheetsWebAppUrl: "https://script.google.com/macros/s/AKfycbxxxxxxxxxxxxxxxx/exec",
   ```
4. Lưu file lại

---

## Bước 7 — Test thử

1. Mở thiệp trên trình duyệt
2. Vào tab **Tham Dự** → nhập tên → bấm "Mình sẽ đến!"
3. Vào tab **Lời Chúc** → nhập tên + lời chúc → bấm Gửi
4. Quay lại Google Sheets → F5 để reload
5. Kiểm tra sheet **Tham Dự** và **Lời Chúc** — phải có dữ liệu mới

---

## ⚠️ Lưu ý quan trọng

| Vấn đề | Giải thích |
|--------|------------|
| Dữ liệu không lên Sheets | Kiểm tra lại URL trong `sheetsWebAppUrl` có đúng không |
| Quên chọn "Anyone" | Deploy lại, đổi Who has access → Anyone |
| Sửa code Apps Script | Phải **Deploy mới** (New deployment), không dùng URL cũ |
| Thiệp đang dùng localhost | Một số trình duyệt chặn fetch từ file:// → cần host thiệp lên web |

---

## 📊 Xem dữ liệu hàng ngày

- Mở [sheets.google.com](https://sheets.google.com) → mở bảng tính **Thiệp Tốt Nghiệp Minzther**
- Sheet **Lời Chúc**: xem tất cả lời chúc từ khách
- Sheet **Tham Dự**: xem ai đã xác nhận đến / không đến
- Có thể xem trên điện thoại qua app **Google Sheets** (iOS / Android)

---

*Dữ liệu vẫn được lưu localStorage trên máy khách làm backup, kể cả khi mất mạng.*
