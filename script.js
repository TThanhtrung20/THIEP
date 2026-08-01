/* ================================================
   THIỆP MỜI TỐT NGHIỆP - script.js
   ================================================ */

// ================================================
// CẤU HÌNH - Chỉnh sửa tại đây cho phù hợp
// ================================================
const CONFIG = {
  // Ngày giờ sự kiện (năm, tháng-1, ngày, giờ, phút)
  eventDate: new Date(2025, 7, 16, 17, 30, 0), // 16/08/2025 lúc 17:30

  // Mật khẩu admin để xem lời chúc
  adminPassword: "thuha2025",

  // Key lưu localStorage
  storageKey_wishes: "graduation_wishes",
  storageKey_rsvp:   "graduation_rsvp",

  // ⬇⬇ DÁN URL GOOGLE APPS SCRIPT VÀO ĐÂY sau khi deploy ⬇⬇
  // Hướng dẫn lấy URL ở file HUONG-DAN-SETUP.md
  sheetsWebAppUrl: "",   // Ví dụ: "https://script.google.com/macros/s/AKfyc.../exec"
};

// ================================================
// GOOGLE SHEETS - Gửi dữ liệu lên Sheets
// ================================================
function sendToSheet(payload) {
  if (!CONFIG.sheetsWebAppUrl) return; // chưa cấu hình URL thì bỏ qua

  fetch(CONFIG.sheetsWebAppUrl, {
    method: "POST",
    mode:   "no-cors",   // Apps Script không hỗ trợ CORS nên dùng no-cors
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => {
    // Lỗi mạng — đã có localStorage làm backup, không cần báo lỗi người dùng
  });
}

// ================================================
// NETLIFY FORMS - Gửi dữ liệu lên Netlify
// ================================================
function sendToNetlify(formName, fields) {
  const body = new URLSearchParams({
    "form-name": formName,
    ...fields,
  });
  fetch("/", {
    method:  "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body:    body.toString(),
  }).catch(() => {
    // Lỗi mạng — localStorage vẫn giữ bản backup
  });
}

// ================================================
// 3D CAROUSEL
// ================================================
let currentSlide = 0;
const TOTAL = 5;
let slideTimer = null;

// Các vị trí theo thứ tự: center, right1, right2, left2, left1
const POSITIONS = ['pos-center','pos-right1','pos-right2','pos-left2','pos-left1'];

function updateCarousel() {
  const items = document.querySelectorAll('.c-item');
  items.forEach((item, i) => {
    // Xoá tất cả class vị trí cũ
    item.classList.remove('pos-center','pos-right1','pos-right2','pos-left2','pos-left1');
    // Tính vị trí tương đối so với currentSlide
    const offset = (i - currentSlide + TOTAL) % TOTAL;
    item.classList.add(POSITIONS[offset]);
  });

  // Cập nhật dots
  document.querySelectorAll('.dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

function goToSlide(index) {
  currentSlide = (index + TOTAL) % TOTAL;
  updateCarousel();
  // Reset timer
  clearInterval(slideTimer);
  slideTimer = setInterval(() => goToSlide(currentSlide + 1), 2800);
}

function initSlideshow() {
  // Chỉ render vị trí ban đầu, timer sẽ khởi động sau khi thiệp mở
  updateCarousel();

  // Bấm vào ảnh carousel để chuyển
  document.querySelectorAll('.c-item').forEach((item, i) => {
    item.addEventListener('click', () => goToSlide(i));
  });

  // Lightbox cho gallery
  document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('click', () => {
      const lb = document.createElement('div');
      lb.className = 'gallery-lightbox';
      lb.innerHTML = `<img src="${img.src}" alt="" />`;
      lb.addEventListener('click', () => lb.remove());
      document.body.appendChild(lb);
    });
  });
}

// ================================================
// HEART COLLAGE - Trang bìa
// ================================================
const HEART_PHOTOS = [
  'img/a1.jpeg','img/a2.jpeg','img/a3.jpeg','img/a4.jpeg','img/a5.jpeg',
  'img/photo1.jpg','img/photo2.jpg','img/photo3.jpg','img/photo4.jpg','img/photo5.jpg',
  'img/g1.jpg','img/g2.jpg','img/g3.jpg','img/g4.jpg','img/g5.jpg',
  'img/g6.jpg','img/g7.jpg','img/g8.jpg','img/g9.jpg','img/g10.jpg',
  'img/g11.jpg','img/g12.jpg','img/g13.jpg','img/23.jpg',
];

function buildHeartCollage() {
  const container = document.getElementById('heartCollage');
  if (!container) return;

  const W = window.innerWidth;
  const H = window.innerHeight;

  // Tâm và scale trái tim
  const cx = W / 2;
  const cy = H / 2;
  const scale = Math.min(W, H) * 0.21;

  // Tạo tọa độ trái tim bằng parametric: x=16sin³t, y=13cost-5cos2t-2cos3t-cos4t
  const points = [];
  const steps = HEART_PHOTOS.length;
  for (let i = 0; i < steps; i++) {
    const t = (i / steps) * 2 * Math.PI;
    const hx = 16 * Math.pow(Math.sin(t), 3);
    const hy = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
    points.push({
      x: cx + hx * scale / 16,
      y: cy + hy * scale / 16,
    });
  }

  const size = Math.max(36, Math.min(W, H) * 0.072);

  points.forEach((pt, i) => {
    const div = document.createElement('div');
    div.className = 'heart-photo';
    div.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${pt.x - size/2}px;
      top:  ${pt.y - size/2}px;
      animation-delay: ${i * 0.05}s;
    `;
    const img = document.createElement('img');
    img.src = HEART_PHOTOS[i % HEART_PHOTOS.length];
    img.alt = '';
    div.appendChild(img);
    container.appendChild(div);
  });
}

// ================================================
// KHỞI TẠO KHI TRANG TẢI
// ================================================
document.addEventListener("DOMContentLoaded", () => {
  buildHeartCollage();
  createParticles();
  startCountdown();
  initMusicState();
  initAdminShortcut();
  initCharCounter();
  initSlideshow();
});

// ================================================
// TAB NAVIGATION
// ================================================
function switchTab(index) {
  document.querySelectorAll(".tab-panel").forEach(panel => panel.classList.remove("active"));
  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));

  const targetPanel = document.querySelector(`.tab-panel[data-panel="${index}"]`);
  if (targetPanel) targetPanel.classList.add("active");

  const targetBtn = document.querySelector(`.tab-btn[data-tab="${index}"]`);
  if (targetBtn) targetBtn.classList.add("active");

  // Khi vào tab Lời Chúc (index 3), tự lấy tên từ RSVP hiển thị lên
  if (index === 3) {
    const rsvpName = document.getElementById("rsvpName").value.trim();
    const display  = document.getElementById("wishNameDisplay");
    if (display) {
      display.textContent = rsvpName || "Khách mời";
    }
  }

  const cardWrapper = document.getElementById("cardWrapper");
  if (cardWrapper) {
    cardWrapper.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// ================================================
// PARTICLES - Bong bóng + Hoa + Hello Kitty
// ================================================
function createParticles() {
  const container = document.getElementById("particles");
  const isMobile  = window.innerWidth < 480;

  // ---- 1. Bong bóng tròn ----
  const bubbleColors = [
    "rgba(255,133,161,0.45)",
    "rgba(255,179,198,0.55)",
    "rgba(232,82,122,0.35)",
    "rgba(255,255,255,0.75)",
    "rgba(255,214,224,0.65)",
    "rgba(255,240,244,0.7)",
  ];
  const bubbleCount = isMobile ? 16 : 26;

  for (let i = 0; i < bubbleCount; i++) {
    const p    = document.createElement("div");
    p.className = "particle bubble";
    const size = Math.random() * 18 + 6;
    p.style.cssText = `
      width:  ${size}px;
      height: ${size}px;
      left:   ${Math.random() * 100}%;
      bottom: ${Math.random() * -20}%;
      background: ${bubbleColors[Math.floor(Math.random() * bubbleColors.length)]};
      --dur:   ${Math.random() * 10 + 8}s;
      --delay: ${Math.random() * 10}s;
    `;
    container.appendChild(p);
  }

  // ---- 2. Hoa rơi ----
  const flowers  = ["🌸", "🌺", "🌼", "🌷", "💮", "🌻"];
  const flowerCount = isMobile ? 10 : 16;

  for (let i = 0; i < flowerCount; i++) {
    const f = document.createElement("div");
    f.className = "particle flower";
    const size = Math.random() * 14 + 14; // 14–28px
    const emoji = flowers[Math.floor(Math.random() * flowers.length)];
    f.textContent = emoji;
    f.style.cssText = `
      font-size: ${size}px;
      left:   ${Math.random() * 100}%;
      bottom: ${Math.random() * -20}%;
      --dur:   ${Math.random() * 12 + 10}s;
      --delay: ${Math.random() * 12}s;
      --sway:  ${(Math.random() - 0.5) * 60}px;
    `;
    container.appendChild(f);
  }

  // ---- 3. Hello Kitty ----
  const kittyCount = isMobile ? 4 : 7;

  for (let i = 0; i < kittyCount; i++) {
    const k = document.createElement("div");
    k.className = "particle kitty";
    const size = Math.random() * 12 + 20; // 20–32px
    k.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"
      width="${size}" height="${size}" style="display:block">
      <!-- Tai trái -->
      <polygon points="10,40 22,10 35,38" fill="#fff" stroke="#ffb7c5" stroke-width="3"/>
      <!-- Tai phải -->
      <polygon points="65,38 78,10 90,40" fill="#fff" stroke="#ffb7c5" stroke-width="3"/>
      <!-- Nơ tai trái -->
      <path d="M14,30 Q22,22 18,14 Q26,20 22,30Z" fill="#ff6b8a" opacity="0.85"/>
      <!-- Mặt -->
      <ellipse cx="50" cy="58" rx="38" ry="36" fill="#fff" stroke="#ffb7c5" stroke-width="2.5"/>
      <!-- Mắt trái -->
      <ellipse cx="37" cy="52" rx="4.5" ry="5" fill="#333"/>
      <circle cx="38.5" cy="50.5" r="1.5" fill="#fff"/>
      <!-- Mắt phải -->
      <ellipse cx="63" cy="52" rx="4.5" ry="5" fill="#333"/>
      <circle cx="64.5" cy="50.5" r="1.5" fill="#fff"/>
      <!-- Mũi -->
      <ellipse cx="50" cy="60" rx="3" ry="2" fill="#ff9db5"/>
      <!-- Râu trái -->
      <line x1="12" y1="60" x2="43" y2="62" stroke="#bbb" stroke-width="1.8"/>
      <line x1="12" y1="66" x2="43" y2="65" stroke="#bbb" stroke-width="1.8"/>
      <!-- Râu phải -->
      <line x1="57" y1="62" x2="88" y2="60" stroke="#bbb" stroke-width="1.8"/>
      <line x1="57" y1="65" x2="88" y2="66" stroke="#bbb" stroke-width="1.8"/>
      <!-- Nơ đầu -->
      <path d="M44,26 Q50,18 56,26 Q50,22 44,26Z" fill="#ff6b8a"/>
      <path d="M44,26 Q38,20 42,14 Q50,20 44,26Z" fill="#ff6b8a"/>
      <path d="M56,26 Q58,14 66,16 Q62,22 56,26Z" fill="#ff6b8a"/>
      <circle cx="50" cy="25" r="4" fill="#ff3d6b"/>
    </svg>`;
    k.style.cssText = `
      left:   ${Math.random() * 100}%;
      bottom: ${Math.random() * -20}%;
      --dur:   ${Math.random() * 14 + 12}s;
      --delay: ${Math.random() * 14}s;
      --sway:  ${(Math.random() - 0.5) * 80}px;
      opacity: 0;
    `;
    container.appendChild(k);
  }
}

// ================================================
// MỞ THIỆP - Animation
// ================================================
function openCard() {
  const cover = document.getElementById("coverPage");
  const card  = document.getElementById("cardWrapper");

  // Phát nhạc ngay lập tức khi bấm — trình duyệt cho phép vì có tương tác
  const audio = document.getElementById("bgMusic");
  audio.volume = 0.45;
  audio.play().then(() => {
    musicPlaying = true;
    updateMusicIcons(true);
  }).catch(() => {});

  cover.classList.add("hide");

  setTimeout(() => {
    cover.style.display = "none";
    card.classList.add("visible");
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Render carousel + khởi động timer sau khi thiệp visible
    updateCarousel();
    clearInterval(slideTimer);
    slideTimer = setInterval(() => goToSlide(currentSlide + 1), 2800);
  }, 750);
}

// ================================================
// ĐÓNG THIỆP - Quay về bìa
// ================================================
function closeCard() {
  const cover = document.getElementById("coverPage");
  const card  = document.getElementById("cardWrapper");

  card.classList.remove("visible");
  cover.style.display = "flex";

  // Chờ 1 frame rồi mới xóa class hide để animation chạy lại
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      cover.classList.remove("hide");
    });
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ================================================
// NHẠC NỀN
// ================================================
let musicPlaying = false;

function initMusicState() {
  const audio = document.getElementById("bgMusic");
  audio.volume = 0.45;
  updateMusicIcons(false);
}

function autoPlayMusic() {
  const audio = document.getElementById("bgMusic");
  audio.play()
    .then(() => {
      musicPlaying = true;
      updateMusicIcons(true);
    })
    .catch(() => {
      // Trình duyệt chặn autoplay - chờ người dùng bấm
      musicPlaying = false;
      updateMusicIcons(false);
    });
}

function toggleMusic() {
  const audio = document.getElementById("bgMusic");
  if (musicPlaying) {
    audio.pause();
    musicPlaying = false;
  } else {
    audio.play().catch(() => {});
    musicPlaying = true;
  }
  updateMusicIcons(musicPlaying);
}

function updateMusicIcons(isPlaying) {
  const ids = ["musicToggle", "musicToggleInside"];
  ids.forEach(id => {
    const btn = document.getElementById(id);
    if (!btn) return;
    if (isPlaying) {
      btn.classList.add("playing");
    } else {
      btn.classList.remove("playing");
    }
  });

  const iconIds = ["musicIcon", "musicIconInside"];
  iconIds.forEach(id => {
    const icon = document.getElementById(id);
    if (!icon) return;
    icon.className = isPlaying ? "fa-solid fa-pause" : "fa-solid fa-music";
  });
}

// ================================================
// ĐẾM NGƯỢC
// ================================================
function startCountdown() {
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

function updateCountdown() {
  const now  = new Date();
  const diff = CONFIG.eventDate - now;

  if (diff <= 0) {
    // Sự kiện đã diễn ra
    setCountdownText("00", "00", "00", "00");
    document.querySelector(".countdown-label").textContent = "Sự kiện đã diễn ra 🎓";
    return;
  }

  const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs  = Math.floor((diff % (1000 * 60)) / 1000);

  setCountdownText(
    pad(days), pad(hours), pad(mins), pad(secs)
  );
}

function setCountdownText(d, h, m, s) {
  document.getElementById("cdDays").textContent  = d;
  document.getElementById("cdHours").textContent = h;
  document.getElementById("cdMins").textContent  = m;
  document.getElementById("cdSecs").textContent  = s;
}

function pad(n) {
  return String(n).padStart(2, "0");
}

// ================================================
// XÁC NHẬN THAM DỰ (RSVP)
// ================================================
function submitRSVP(answer) {
  const nameInput = document.getElementById("rsvpName");
  const name = nameInput.value.trim();

  if (!name) {
    shakeInput(nameInput);
    nameInput.placeholder = "Bạn chưa nhập tên kìa! 👇";
    setTimeout(() => nameInput.placeholder = "Tên của bạn...", 2500);
    return;
  }

  // Lưu vào localStorage (backup)
  const rsvpData = {
    name,
    answer,
    time: new Date().toLocaleString("vi-VN"),
  };
  const existing = JSON.parse(localStorage.getItem(CONFIG.storageKey_rsvp) || "[]");
  existing.push(rsvpData);
  localStorage.setItem(CONFIG.storageKey_rsvp, JSON.stringify(existing));

  // Gửi lên Google Sheets
  sendToSheet({ type: "rsvp", name, answer });

  // Gửi lên Netlify Forms
  sendToNetlify("rsvp", { name, answer });

  // Hiển thị kết quả
  const form   = document.getElementById("rsvpForm");
  const result = document.getElementById("rsvpResult");
  const emoji  = document.getElementById("resultEmoji");
  const msg    = document.getElementById("resultMsg");

  form.style.display = "none";
  result.style.display = "block";

  const photoYes = document.getElementById("rsvpResultPhoto");
  const photoNo  = document.getElementById("rsvpResultPhotoNo");

  if (answer === "yes") {
    emoji.textContent = "🎉";
    msg.innerHTML = `Yay! Cảm ơn <strong>${escapeHtml(name)}</strong> đã xác nhận tham dự!<br/>
      Mình rất vui khi được đón bạn! Hẹn gặp nhau nhé 🎀`;
    if (photoYes) photoYes.style.display = "block";
    if (photoNo)  photoNo.style.display  = "none";
  } else {
    emoji.textContent = "";
    msg.innerHTML = `Ôi thật tiếc khi <strong>${escapeHtml(name)}</strong> không đến được!<br/>
      Mình hiểu mà, lần khác nhất định hội tụ nhé! 🌸`;
    if (photoNo)  photoNo.style.display  = "block";
    if (photoYes) photoYes.style.display = "none";
  }

  // Confetti nếu đến
  if (answer === "yes") {
    launchConfetti();
  }
}

// ================================================
// GỬI LỜI CHÚC
// ================================================
function initCharCounter() {
  const textarea = document.getElementById("wishText");
  if (!textarea) return;
  textarea.addEventListener("input", () => {
    document.getElementById("charCount").textContent = textarea.value.length;
  });
}

function sendWish() {
  const textInput = document.getElementById("wishText");
  const text = textInput.value.trim();

  // Lấy tên từ ô RSVP
  const name = document.getElementById("rsvpName").value.trim() || "Khách mời";

  if (!text) {
    shakeInput(textInput);
    textInput.placeholder = "Bạn chưa viết lời chúc kìa! 💌";
    setTimeout(() => textInput.placeholder = "Viết lời chúc của bạn tại đây... 🌸", 2500);
    return;
  }

  // Lưu vào localStorage (backup)
  const wish = {
    name,
    text,
    time: new Date().toLocaleString("vi-VN"),
  };
  const wishes = JSON.parse(localStorage.getItem(CONFIG.storageKey_wishes) || "[]");
  wishes.push(wish);
  localStorage.setItem(CONFIG.storageKey_wishes, JSON.stringify(wishes));

  // Gửi lên Google Sheets
  sendToSheet({ type: "wish", name, text });

  // Gửi lên Netlify Forms
  sendToNetlify("wish", { name, text });

  // Chuyển sang màn hình cảm ơn
  document.getElementById("wishForm").style.display = "none";
  document.getElementById("wishSent").style.display = "block";
}

function sendAnother() {
  document.getElementById("wishText").value = "";
  document.getElementById("charCount").textContent = "0";
  document.getElementById("wishForm").style.display = "block";
  document.getElementById("wishSent").style.display = "none";
  removeWishPhoto();
}

// ================================================
// UPLOAD ẢNH KÈM LỜI CHÚC
// ================================================
function previewWishPhoto(input) {
  const file = input.files[0];
  if (!file) return;

  // Giới hạn 5MB
  if (file.size > 5 * 1024 * 1024) {
    alert("Ảnh quá lớn! Vui lòng chọn ảnh dưới 5MB nhé 🌸");
    input.value = "";
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    document.getElementById("wishPhotoImg").src = e.target.result;
    document.getElementById("wishPhotoPreview").style.display = "block";
    document.getElementById("wishPhotoLabel").textContent = "✅ Đã chọn: " + file.name;
  };
  reader.readAsDataURL(file);
}

function removeWishPhoto() {
  document.getElementById("wishPhoto").value = "";
  document.getElementById("wishPhotoImg").src = "";
  document.getElementById("wishPhotoPreview").style.display = "none";
  document.getElementById("wishPhotoLabel").textContent = "Thêm ảnh kèm theo (tuỳ chọn)";
}

// ================================================
// ADMIN PANEL
// ================================================
let adminKeyBuffer = "";
let adminKeyTimer  = null;

function initAdminShortcut() {
  // Nhấn A → D → M liên tiếp trong 2 giây để mở admin
  document.addEventListener("keydown", (e) => {
    adminKeyBuffer += e.key.toLowerCase();
    clearTimeout(adminKeyTimer);
    adminKeyTimer = setTimeout(() => { adminKeyBuffer = ""; }, 2000);
    if (adminKeyBuffer.includes("adm")) {
      adminKeyBuffer = "";
      openAdmin();
    }
  });
}

function openAdmin() {
  document.getElementById("adminOverlay").style.display = "flex";
  document.getElementById("adminErr").textContent = "";
  document.getElementById("adminPass").value = "";
  document.getElementById("adminLogin").style.display = "block";
  document.getElementById("adminContent").style.display = "none";
  setTimeout(() => document.getElementById("adminPass").focus(), 100);
}

function closeAdmin() {
  document.getElementById("adminOverlay").style.display = "none";
  document.getElementById("adminContent").style.display = "none";
}

function checkAdmin() {
  const pass = document.getElementById("adminPass").value;
  if (pass === CONFIG.adminPassword) {
    document.getElementById("adminLogin").style.display = "none";
    document.getElementById("adminContent").style.display = "block";
    loadWishes();
  } else {
    document.getElementById("adminErr").textContent = "❌ Sai mật khẩu rồi!";
    document.getElementById("adminPass").value = "";
    shakeInput(document.getElementById("adminPass"));
  }
}

function loadWishes() {
  const wishes = JSON.parse(localStorage.getItem(CONFIG.storageKey_wishes) || "[]");
  const rsvps  = JSON.parse(localStorage.getItem(CONFIG.storageKey_rsvp)   || "[]");
  const list   = document.getElementById("wishesList");
  const stats  = document.getElementById("adminStats");

  // Thống kê
  const yesCount = rsvps.filter(r => r.answer === "yes").length;
  const noCount  = rsvps.filter(r => r.answer === "no").length;
  stats.innerHTML = `
    📊 <strong>${wishes.length}</strong> lời chúc &nbsp;|&nbsp;
    ✅ <strong>${yesCount}</strong> người sẽ đến &nbsp;|&nbsp;
    ❌ <strong>${noCount}</strong> người không đến
  `;

  // Danh sách lời chúc
  if (wishes.length === 0) {
    list.innerHTML = `<p class="no-wishes">Chưa có lời chúc nào 💌</p>`;
    return;
  }

  list.innerHTML = wishes
    .slice()
    .reverse()
    .map(w => `
      <div class="wish-card">
        <div class="wish-from">💙 ${escapeHtml(w.name)}</div>
        <div class="wish-content">${escapeHtml(w.text)}</div>
        <div class="wish-time">🕐 ${w.time}</div>
      </div>
    `)
    .join("");
}

function clearWishes() {
  if (!confirm("Xác nhận xóa tất cả lời chúc và RSVP?")) return;
  localStorage.removeItem(CONFIG.storageKey_wishes);
  localStorage.removeItem(CONFIG.storageKey_rsvp);
  loadWishes();
}

// ================================================
// CONFETTI NHỎ - Khi xác nhận tham dự
// ================================================
function launchConfetti() {
  const colors = ["#ff85a1", "#ffb3c6", "#e8527a", "#ffffff", "#ffd6e0", "#ff4d7a"];
  const count  = 60;

  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const dot = document.createElement("div");
      const size = Math.random() * 8 + 5;
      dot.style.cssText = `
        position: fixed;
        width:  ${size}px;
        height: ${size}px;
        border-radius: ${Math.random() > 0.5 ? "50%" : "2px"};
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${Math.random() * 100}vw;
        top: -10px;
        z-index: 9999;
        pointer-events: none;
        animation: confettiFall ${Math.random() * 1.5 + 1.2}s ease-in forwards;
      `;
      document.body.appendChild(dot);
      setTimeout(() => dot.remove(), 3000);
    }, i * 35);
  }

  // Keyframe confetti được inject 1 lần
  if (!document.getElementById("confettiStyle")) {
    const style = document.createElement("style");
    style.id = "confettiStyle";
    style.textContent = `
      @keyframes confettiFall {
        0%   { transform: translateY(0) rotate(0deg);   opacity: 1; }
        100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}

// ================================================
// TIỆN ÍCH
// ================================================

// Shake animation khi input trống
function shakeInput(el) {
  el.style.animation = "none";
  el.offsetHeight; // reflow
  el.style.animation = "shakeIt 0.4s ease";
  // Inject keyframe 1 lần
  if (!document.getElementById("shakeStyle")) {
    const s = document.createElement("style");
    s.id = "shakeStyle";
    s.textContent = `
      @keyframes shakeIt {
        0%, 100% { transform: translateX(0); }
        20%       { transform: translateX(-7px); }
        40%       { transform: translateX(7px); }
        60%       { transform: translateX(-5px); }
        80%       { transform: translateX(5px); }
      }
    `;
    document.head.appendChild(s);
  }
  setTimeout(() => { el.style.animation = ""; }, 500);
}

// Escape HTML để tránh XSS
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
