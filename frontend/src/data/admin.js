// ============================================================
// บัญชีผู้ดูแลระบบตั้งต้น (Seed Admin)
// - AuthContext จะ Inject บัญชีนี้เข้าไปใน localStorage
//   (calla-users) โดยอัตโนมัติเสมอ หากยังไม่มี admin ในระบบ
// - เข้าสู่ระบบด้วย admin@callalily.com / admin123
// - role: "admin" = เข้าถึงหน้า /admin ได้ (Dashboard, สินค้า,
//   ออเดอร์, ลูกค้า) และเห็นลิงก์ Admin ใน Navbar
// ============================================================
const adminUser = {
  id: 2,
  name: "Admin Calla",
  email: "admin@callalily.com",
  phone: "02-000-0000",
  address: "Calla Lily HQ, Wattana",
  city: "Bangkok",
  zip: "10110",
  memberSince: "2024-01-01",
  role: "admin",
  password: "admin123",
};

export default adminUser;