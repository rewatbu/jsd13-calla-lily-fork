# Calla Lily — E-Commerce

เว็บขายของออนไลน์สำหรับร้านผลิตภัณฑ์อาบน้ำและบำรุงผิวงานแฮนด์เมด (สบู่, มิสต์, ครีม, บอดี้วอช, น้ำหอม) พัฒนาเป็นโปรเจกต์ทีม (Black, Bush, Toto, Phupha) ต่อเนื่องถึง Sprint 3 แสดงราคาเป็นบาท (THB)

## ภาพรวม

- **Frontend**: React SPA พร้อมระบบลูกค้า (เลือกซื้อ, ตะกร้า, สั่งซื้อ, ติดตามพัสดุ, จัดการบัญชี) และระบบหลังบ้านสำหรับแอดมิน (แดชบอร์ด, จัดการสินค้า/ออเดอร์/ลูกค้า)
- **Backend**: REST API แยกส่วนด้วย Express + MongoDB รองรับ authentication ด้วย JWT และจัดการสต็อกสินค้า
- โครงสร้างแบบ monorepo แยก `frontend/` และ `backend/`

## เครื่องมือที่ใช้

**Frontend**
- React 19 + Vite 8 (build tool)
- React Router DOM 7 (`createBrowserRouter`)
- Tailwind CSS 4 (`@tailwindcss/vite`)
- React Compiler (babel plugin) — auto memoization
- ESLint (flat config) + react-hooks / react-refresh
- Deploy: Vercel (`vercel.json` SPA rewrites)

**Backend**
- Node.js (>= 18) + Express 5
- MongoDB + Mongoose 9
- JWT (`jsonwebtoken`) + bcryptjs สำหรับ hash รหัสผ่าน
- cors
- Deploy: Render

## Features

**ฝั่งลูกค้า**
- **Homepage** — hero banner + สินค้าแนะนำ
- **Products** — ค้นหา, กรองตามหมวดหมู่, เรียงลำดับ, แบ่งหน้า (URL-driven)
- **Product Detail** — รายละเอียดสินค้า, เช็คสต็อก, เลือกจำนวน, สินค้าที่เกี่ยวข้อง
- **Cart** — เพิ่ม/ลด/ลบสินค้า พร้อมสรุปยอด (เก็บใน localStorage)
- **Checkout** — ฟอร์มจัดส่ง + วิธีการชำระเงิน (ต้องล็อกอิน)
- **Order Success** — ใบเสร็จยืนยันคำสั่งซื้อ
- **Login / Register** — สมัครสมาชิกและเข้าสู่ระบบ
- **Account** — แก้ไขโปรไฟล์, เปลี่ยนรหัสผ่าน, ประวัติคำสั่งซื้อ
- **Tracking** — ติดตามสถานะพัสดุด้วยรหัสออเดอร์หรืออีเมล (Processing → Shipped → Delivered)

**ฝั่งแอดมิน**
- **Dashboard** — สรุปยอดขาย, จำนวนออเดอร์, สินค้า, ลูกค้า
- **Products** — เพิ่ม/แก้ไข/ลบสินค้า (CRUD)
- **Orders** — ดูออเดอร์ทั้งหมดและเปลี่ยนสถานะ
- **Customers** — ดูรายชื่อผู้ใช้ทั้งหมด

## Services (API)

| Endpoint | รายละเอียด |
|----------|-----------|
| `GET/POST/PUT/DELETE /api/products` | จัดการสินค้า (อ่านสาธารณะ, เขียนเฉพาะแอดมิน) |
| `POST /api/users/login` `register` | เข้าสู่ระบบ / สมัครสมาชิก (คืน JWT) |
| `GET /api/users` | รายชื่อผู้ใช้ (แอดมิน) |
| `PUT /api/users/:id/profile` `password` | แก้ไขโปรไฟล์ / เปลี่ยนรหัสผ่าน |
| `POST /api/orders` | สร้างออเดอร์ (ตรวจและตัดสต็อก) |
| `GET /api/orders` `mine` `track` `:id` | ดูออเดอร์ (แอดมิน / ของตนเอง / ติดตาม) |
| `PATCH /api/orders/:id` | อัปเดตสถานะออเดอร์ (แอดมิน) |
| `POST /api/chat` | ส่งข้อความไปยัง Calla AI (Gemini ผ่าน Google AI Studio) |

มี seed script (`npm run seed`) สำหรับเพิ่มสินค้า 12 รายการและผู้ใช้ตัวอย่าง และ `npm run data:destroy` สำหรับล้างข้อมูล

## สิ่งที่ทำได้ดี

- **สถาปัตยกรรมชัดเจน** — แยก frontend/backend, แยก models / controllers / routes / middlewares อย่างเป็นระบบ
- **Authentication ปลอดภัย** — รหัสผ่าน hash ด้วย bcrypt, JWT อายุ 7 วัน, ป้องกันด้วย middleware `requireAuth` + `requireAdmin` ทั้งสองชั้น
- **จัดการ State เป็นระเบียบ** — ใช้ React Context (Auth, Cart, Product) และรวมศูนย์ HTTP request ไว้ที่ `api.js` (แนบ token อัตโนมัติ, จัดการ 401)
- **UX ครบถ้วน** — มี loading/empty state, การแจ้งเตือน, ปุ่ม/ดีไซน์สม่ำเสมอด้วย design system และ reusable components
- **จัดการสต็อกถูกต้อง** — ตรวจสต็อกก่อนสั่งซื้อและตัดสต็อกแบบ atomic ป้องกันการขายเกิน

## จุดที่ยังต้องพัฒนาปรับปรุง

- **ไม่มี Cart database** - ไม่มีฐานข้อมูลสำหรับตะกร้าสินค้า ทำให้ไม่ผู้ใช้งานไม่สามารถเก็บจัดเก็บตะกร้าสินค้าไปใช้งานเมื่อเข้าระบบจากอุปกรณ์อื่นได้ 
- **ไม่มี Testing** — ยังไม่มี test files หรือ test runner และ backend test script เป็น placeholder
- **ไม่มี TypeScript** — ใช้ JavaScript ล้วน ทำให้พลาด type-related bug ได้ง่าย
- **ความปลอดภัย/Validation** — ควรเพิ่ม rate limiting, validation ฝั่ง backend ที่รัดกุมขึ้น และไม่ควรเชื่อ client
- **Frontend route guard ยังไม่สมบูรณ์** — หน้าแอดมินพึ่ง `AdminLayout` เป็นหลัก ควรเพิ่ม route-level protection
- **การชำระเงินเป็น mock** — ยังไม่มี payment gateway จริง
- **Config/Environment** — ควรมี validation ของ environment variables และจัดการ error อย่างเป็นระบบ
- **ไม่มี CI/CD และ monitoring** — ควรเพิ่ม pipeline (lint/test/build) และ log/observability

## เริ่มต้นใช้งาน

```bash
# Backend
cd backend
cp .env.example .env   # ตั้งค่า MongoDB URI, JWT secret, CORS
npm install
npm run seed           # เพิ่มข้อมูลตัวอย่าง
npm run dev            # http://localhost:5000

# Frontend (อีก terminal)
cd frontend
cp .env.example .env   # ตั้งค่า VITE_API_URL
npm install
npm run dev            # Vite dev server (proxy /api ไปที่ backend)
```

## AI Chat (Google AI Studio)

สร้าง API key ใน [Google AI Studio](https://aistudio.google.com/app/apikey) แล้วใส่ค่านั้นใน `backend/.env`:

```env
GEMINI_API_KEY=your-key
GEMINI_MODEL=gemini-2.5-flash
```

หน้าเว็บจะมีปุ่ม **AI ช่วยแนะนำ** ลอยที่มุมขวาล่าง และเรียก backend ที่ `POST /api/chat` เท่านั้น จึงไม่ส่ง API key ไปยัง browser

คำสั่งที่มีให้: frontend `npm run dev | build | lint | preview`, backend `npm run dev | start | seed | data:destroy`
