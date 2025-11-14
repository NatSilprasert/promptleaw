// scripts/about.js
// --- config ปลายทาง ---
const HOME_URL   = "index.html";     // ไปหน้านี้ถ้า "ล็อกอินแล้ว"
const SIGNUP_URL = "register.html";  // ไปหน้านี้ถ้ายังไม่ได้ล็อกอิน

// ช่วยอ่าน cookie แบบง่าย ๆ
function readCookie(name) {
  return document.cookie
    .split("; ")
    .find((c) => c.startsWith(name + "="))
    ?.split("=")[1];
}

// ตรวจหน้าตา JWT แบบคร่าว ๆ (สามส่วนคั่นด้วย .)
function looksLikeJWT(token = "") {
  return token.split(".").length === 3 && token.length > 20;
}

// เกณฑ์ตัดสินว่า "ล็อกอินแล้ว"
function isLoggedIn() {
  // flag ง่าย ๆ (แนะนำให้ตั้งในตอน login สำเร็จ)
  if (localStorage.getItem("pl_auth") === "1") return true;

  // คีย์ที่มักใช้เก็บโทเคน (แก้/เติมได้ตามโปรเจกต์)
  const CANDIDATES = [
    "pl_token",
    "token",
    "jwt",
    "access_token",
    "id_token",
    "authToken",
    "session",
    "pl_session"
  ];

  for (const k of CANDIDATES) {
    const v =
      localStorage.getItem(k) ||
      sessionStorage.getItem(k) ||
      readCookie(k);

    if (!v) continue;

    // ถ้าเป็น JWT หรือ string ยาวพอ (เดาเป็นโทเคน) → ถือว่า logged-in
    if (looksLikeJWT(v) || v.length > 24) return true;
  }
  return false;
}

// จับปุ่ม Get Started (ปุ่ม .btn ตัวแรกใน .about-cta ซึ่งไม่ใช่ปุ่ม .ghost)
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".about-cta .btn:not(.ghost)");
  if (!btn) return;

  e.preventDefault();
  window.location.href = isLoggedIn() ? HOME_URL : SIGNUP_URL;
});
