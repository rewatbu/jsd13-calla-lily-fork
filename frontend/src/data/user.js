// ============================================================
// บัญชีลูกค้าตั้งต้น (Seed Customer) สำหรับการทดลองใช้งาน
// - ใช้เป็นข้อมูลเริ่มต้นใน localStorage (key: calla-users)
//   ตอนที่ยังไม่มีผู้ใช้คนอื่น
// - เข้าสู่ระบบด้วย suda@example.com / hello123
// - role: "customer" = ผู้ใช้ทั่วไป (ไม่ใช่ผู้ดูแล)
// ============================================================
const user = {
  id: 1,
  name: "Suda Wong",
  email: "suda@example.com",
  phone: "081-234-5678",
  address: "123 Sukhumvit Rd, Wattana",
  city: "Bangkok",
  zip: "10110",
  memberSince: "2025-03-12",
  role: "customer",
  password: "hello123",
};

export default user;