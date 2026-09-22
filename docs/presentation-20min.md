# การนำเสนอโปรเจกต์ 20 นาที — Calla Lily E-commerce

> เอกสารเตรียมนำเสนอโปรเจกต์ "Calla Lily — ร้านผลิตภัณฑ์อาบน้ำและบำรุงผิวงานแฮนด์เมด"
> เวลา 20 นาที: เนื้อหา + สคริปต์พูด + ตัวอย่างท่าทางการสาธิต

---

## กำหนดการนำเสนอ (Timing)

| นาที | หัวข้อ | เนื้อหา |
|------|--------|--------|
| 0:00–3:00 | บทนำ + Project Concept | แนวคิดโปรเจกต์, เหตุผลการเลือกสินค้า |
| 3:00–10:00 | Demo สด + Highlight Features | สาธิตหน้าสำคัญ + ไฮไลต์ฟีเจอร์ |
| 10:00–16:00 | Working Process | Tech stack, Authentication, Database, ปัญหาและวิธีแก้ |
| 16:00–19:00 | Behavioral Skills and Mindset (BSM) | การทำงานเป็นทีม, บทเรียน |
| 19:00–20:00 | สรุป + Q&A | Takeaway และทิศทางต่อไป |

---

## 1. Project Concept (3 นาที)

### โปรเจกต์คืออะไร

**Calla Lily** เป็น Web Application ประเภท E-commerce สำหรับขายผลิตภัณฑ์อาบน้ำและบำรุงผิวงานแฮนด์เมด ได้แก่ **สบู่, มิสต์, ครีม, บอดี้วอช, น้ำหอม** — แสดงราคาเป็นบาท (THB)

พัฒนาเป็นโปรเจกต์ทีม 4 คน (Black, Bush, Toto, Phupha) ต่อเนื่องจาก Sprint 1–2 จนถึง Sprint 3

### ทำไมถึงเลือกสินค้าชุดนี้

- โปรเจกต์นี้คือบทเรียนการทำ Web application เพื่อ **ผู้ประกอบการ** ที่ต้องการมีช่องทางทำธุรกิจออนไลน์เป็นของตัวเอง
- ผลิตภัณฑ์ประเภทสบู่/ครีม **สะท้อนลักษณะของผู้ประกอบการที่มีพื้นฐานสินค้าที่ผลิตเอง** (handmade) — เลือกปัญหาธุรกิจจริง ไม่ใช่แค่ทำเว็บส่งงาน
- การมีแพลตฟอร์มเป็นของตัวเองช่วยให้ **บริหารธุรกิจได้อย่างยืดหยุ่น** มากกว่าการพึ่งตลาดกลาง:
  - ควบคุมแบรนด์ ราคา และโปรโมชันได้เอง
  - เข้าถึงข้อมูลลูกค้าและออเดอร์โดยตรง
  - ขยายช่องทางขายออนไลน์โดยไม่ต้องพึ่งแพลตฟอร์มภายนอก

### สคริปต์พูด (บทนำ)

> "สวัสดีครับ/ค่ะ โปรเจกต์ของเรา คือ Calla Lily เว็บขายของออนไลน์สำหรับร้านผลิตภัณฑ์อาบน้ำและบำรุงผิวแบบแฮนด์เมด...
> เราอยากสร้างแพลตฟอร์มไว้สำหรับผู้ประกอบการที่มีสินค้าผลิตเอง ซึ่งต้องการมีหน้าร้านออนไลน์เป็นของตัวเอง...
> นี่ไม่ใช่แค่การทำเว็บ แต่คือการแก้ปัญหาการเข้าถึงช่องทางธุรกิจออนไลน์ของเจ้าของธุรกิจขนาดเล็ก"

---

## 2. Demo สด + Highlight Features (7 นาที)

### โครงสร้างระบบ 2 ส่วน

1. **ฝั่งลูกค้า (Customer)** — เลือกซื้อ, ตะกร้า, สั่งซื้อ, ติดตามพัสดุ, จัดการบัญชี
2. **ฝั่งแอดมิน (Admin)** — แดชบอร์ด, จัดการสินค้า/ออเดอร์/ลูกค้า

### ไฮไลต์ฟีเจอร์ (ไถสไลด์ / สาธิตตามนี้)

**ฝั่งลูกค้า**
1. **Homepage** — Hero banner + สินค้าแนะนำ
2. **Products** — ค้นหา, กรองตามหมวดหมู่, เรียงลำดับ, แบ่งหน้า (ทั้งหมดควบคุมผ่าน URL)
3. **Product Detail** — เช็คสต็อก, เลือกจำนวน, "You may also like"
4. **Cart** — เพิ่ม/ลด/ลบสินค้า, เก็บใน localStorage, สรุปยอด
5. **Checkout** — ฟอร์มจัดส่ง + วิธีชำระเงิน (COD / Bank Transfer / Card) — ต้องล็อกอิน
6. **Tracking** — ตรวจสถานะพัสดุด้วยเลขออเดอร์หรืออีเมล (Processing → Shipped → Delivered)
7. **Account** — แก้โปรไฟล์, เปลี่ยนรหัสผ่าน, ประวัติคำสั่งซื้อ

**ฝั่งแอดมิน**
8. **Dashboard** — สรุปยอดขาย, จำนวนออเดอร์/สินค้า/ลูกค้า
9. **Admin Products** — เพิ่ม/แก้ไข/ลบสินค้า (CRUD)
10. **Admin Orders** — ดูออเดอร์ทั้งหมด + เปลี่ยนสถานะ (ป้อนตรงนี้ ลูกค้าที่ Tracking เห็นตาม)

### ตัวอย่างสายเดโม่ที่แนะนำ (Demo Script)

```
1. เปิดหน้าแรก → สั่งสินค้าเรื่องราวของแบรนด์ (30 วิ)
2. ไปหน้า /product → โชว์ search + filter + sort + pagination (1 นาที)
3. คลิกสินค้า → เปลี่ยนจำนวน → Add to Cart (30 วิ)
4. ไปหน้า Cart → ปรับจำนวน/ลบ → Checkout (30 วิ)
5. แจ้งว่าต้องล็อกอินก่อน → ล็อกอิน (โชว์บัญชีตัวอย่าง) (1 นาที)
6. Place Order → หน้า Order Success (โชว์ order id) (30 วิ)
7. ไปหน้า Tracking → ใส่ order id → เห็น timeline (30 วิ)
8. ล็อกอินเป็น admin → Dashboard stats → เปลี่ยนสถานะออเดอร์ (1 นาที)
9. Admin Products → เพิ่มสินค้าใหม่ → เห็นขึ้นที่หน้าร้านทันที (1 นาที)
```

> **Tip ปลายทาง:** เดโม่จบปิดที่ Hi-light การ sync ระหว่าง **Admin เปลี่ยนสถานะออเดอร์ → ลูกค้า Tracking เห็นสถานะใหม่** เพราะแสดงถึงระบบ end-to-end ครบวงจร

---

## 3. Working Process (6 นาที)

### 3.1 Technical Explanation — Tech Stack

**สถาปัตยกรรมแบบ Full-stack (Monorepo แยก 2 โฟลเดอร์)**

```
[React SPA (Vite + Tailwind)]        ← frontend/
   │ fetch() ผ่าน src/api.js
   ▼
[REST API (Express)]  ←→  [MongoDB]  ← backend/
   ├── /api/products   → CRUD สินค้า
   ├── /api/users      → Auth + ผู้ใช้
   └── /api/orders     → ออเดอร์ + ติดตาม
```

| ชั้น | เทคโนโลยี |
|------|-----------|
| Frontend | React 19, Vite 8, Tailwind CSS 4, React Router 7, React Context |
| Backend | Node.js, Express 5, Mongoose 9 |
| Database | MongoDB (NoSQL) |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Deploy | Frontend: Vercel / Backend: Render |

**โครงสร้าง Backend แบบเป็นระเบียบ** — แยก `models / controllers / routes / middlewares`:

- `models/` → Schema ของ MongoDB (Product, User, Order)
- `controllers/` → ลอจิกของ API แต่ละส่วน
- `routes/` → เส้นทาง URL (`/api/products`...)
- `middlewares/authMiddleware.js` → ตรวจ JWT + สิทธิ์ admin

**โครงสร้าง Frontend แบบ Center-State:**

- `api.js` — รวมศูนย์ HTTP request ทั้งหมด (แนบ token อัตโนมัติ, จัดการ 401)
- `context/` — state ร่วมทั้งแอป 3 ตัว: **AuthContext, CartContext, ProductContext**
- `pages/` + `pages/admin/` — แยกหน้าลูกค้า/แอดมินชัดเจน
- Design system ใช้ semantic color tokens ใน `src/index.css`

### 3.2 Authentication ทำงานอย่างไร

```
1. ผู้ใช้สมัครสมาชิก (Register) / ล็อกอิน (Login)
2. Backend ตรวจ email + เปรียบเทียบรหัสด้วย bcrypt.compare
3. สำเร็จ → สร้าง JWT (เซ็นด้วย JWT_SECRET, อายุ 7 วัน) เก็บ payload { id, role }
4. Frontend เก็บ token ใน localStorage (key: calla-token)
5. ทุก request: api.js แนบ header  Authorization: Bearer <token>
6. Middleware requireAuth → jwt.verify() → โหลด user → ใส่ req.user
7. requireAdmin → เช็ค req.user.role === 'admin' → ไม่งั้น 403
```

จุดแข็งด้านความปลอดภัย:
- **รหัสผ่านเก็บเป็น bcrypt hash** (10 rounds) ไม่ใช่รหัสจริง
- **สองชั้นป้องกัน** — `requireAuth` + `requireAdmin`
- **Token หมดอายุ (7 วัน)** → Frontend ฟัง event `calla:unauthorized` → ล็อกเอาท์อัตโนมัติ
- **`toUserJSON()` ตัด password ทิ้ง**ก่อนส่งกลับจาก API เสมอ

### 3.3 จัดเก็บ Data ใน Database อย่างไร

**MongoDB (NoSQL, document-based)** ผ่าน Mongoose — 3 คอลเลกชันหลัก:

```
Product { name, price, category, image, description, stock, timestamps }

User    { name, email (unique), password (bcrypt hash), role (user|admin),
          phone, address, city, zip, memberSince }

Order   { orderId ("CL-xxxxxx", unique), userId (ref User),
          items[]: { productId, name, price, quantity, image },
          customer: { fullName, email, phone, address, city, zip },
          payment, subtotal, shipping, discount, total,
          status (processing|shipped|delivered|cancelled) }
```

แนวปฏิบัติสำคัญ:
- **Stock ถูกตัดแบบ atomic** ด้วย `$inc: { stock: -qty }` ตอนสร้างออเดอร์ → ป้องกันการขายเกินสต็อก
- **Seed script** (`npm run seed`) เติมสินค้า 12 ชิ้น + บัญชี admin/ลูกค้าตัวอย่าง
- Frontend Cart ใช้ **localStorage** (key `calla-cart`) โดย sync กับ backend เฉพาะตอน Checkout

> Flow การสั่งซื้อ: Checkout → `POST /api/orders` → backend ตรวจ stock ทุกชิ้น → ไม่พอส่ง 400 พร้อมชื่อสินค้า → พอแล้วตัด stock + สร้างออเดอร์ → ลูกค้าได้ order id สำหรับ Tracking

### 3.4 Problem & Solution(s)

| ปัญหา | สาเหตุ | วิธีแก้ |
|-------|--------|--------|
| **สินค้าหายทั้งหมด "No products found"** | URL API ผิด — `VITE_API_URL` ตั้งโดยลืม `/api` ทำให้ request ไป `GET /products` แทน `GET /api/products` → 404 → Context จับ error แล้ว `setProducts([])` | เพิ่มฟังก์ชัน `normalizeBase()` ใน `api.js` ที่ปรับ URL ให้ถูกต้องอัตโนมัติ (กัน root cause ไม่ให้เกิดซ้ำ) + แก้ env + redeploy |
| **สินค้าใน Cart ไปหน้ารายละเอียดไม่ได้** | `CartItem` ไม่มี `id` prop และไม่ได้ครอบด้วย `<Link>` | เพิ่ม `id` prop + `<Link to="/product/:id">` ให้เหมือน `ProductCard` |
| **ขายสินค้าล้นสต็อก** (oversell) | เชื่อข้อมูลจากหน้าบ้านอย่างเดียว | ตรวจ stock ฝั่ง backend ทุก item + ตัด stock แบบ atomic ก่อนตอบกลับ |
| **ระบบสั่งจ่าย "card" ไม่ชำระจริง** | ยังเป็นภาพจำลอง | จัดทำแผน Stripe (ดู `stripe-payments.md`) — สร้าง Checkout Session, webhook เป็นตัวยืนยันออเดอร์ + ลด stock จริง |
| **Coordinates ระหว่าง front/back ผิดพลาด** | สมาชิกทีมความเข้าใจเทคนิคต่างกัน | ใช้ documents อธิบายโค้ด (`code-explanation-th.md`, `system-design.md`) + ขอคำปรึกษาจากภายนอก |

### 3.5 ปรับปรุงต่อได้ (Roadmap)

Cart database ฝั่งเซิร์ฟเวอร์, Testing, TypeScript, Stripe จริง, rate limiting, route guard ฝั่งแอดมิน, CI/CD

---

## 4. Behavioral Skills and Mindset — BSM (3 นาที)

### บริบทของทีม

โปรเจกต์นี้มี**ข้อจำกัดด้านสมาชิกในทีม** — สมาชิกทุกคนเป็นผู้ที่เพิ่งเริ่มเรียนรู้การทำ Web application

### สิ่งที่ทีมเจอ (ปัญหา)

1. **การแบ่งงานกันทำและการช่วยเหลือซึ่งกันและกันมีอุปสรรคด้านการสื่อสาร**
   เนื่องจากความเข้าใจด้านเทคนิคที่จำกัดและไม่เท่ากัน — อธิบายงานให้กันฟังแล้วคนฟังไม่เข้าใจ
2. **การพึ่ง AI เพื่อให้งานคืบหน้า** — การใช้ AI ช่วยให้งานเดินต่อในระยะเวลาจำกัด แต่ก็เกิดความท้าทาย
   ในการ**ทำให้งานส่วนต่าง ๆ ที่แต่ละคนทำมาเข้ากันได้** (integration ของโค้ดคนละสไตล์)
3. **ความเสี่ยงจากความไม่เข้าใจกันภายในทีม** — ถ้าปล่อยไว้จะทำให้งานตัน

### วิธีแก้และบทเรียน (Behaviors)

- **การพูดคุยกันเพื่อเข้าใจกันและกัน** — เปิดใจรับฟัง อธิบายช้า ๆ ตรวจสอบความเข้าใจของกัน ไม่ปล่อยให้ใครงานค้าง
- **การขอคำปรึกษาจากภายนอก** — เมื่อทีมตัน ให้ขอความช่วยเหลือจาก mentor / เอกสาร / ตัวอย่างภายนอก
- **ใช้เอกสารเป็นสื่อกลาง** — ทีมสร้าง documents อธิบายโค้ดทั้งโปรเจกต์ (ภาษาไทย) เพื่อให้ทุกคนเทียบ
  ความเข้าใจได้แม้ความสามารถเทคนิคต่างกัน
- **ใช้ Git และการ Merge อย่างเป็นระบบ** — แยก branch ทำงานคนละส่วน แล้ว merge ผ่าน Pull Request
  (ดูจากประวัติ commit: มี merge PR จากสมาชิกหลายคน) — ใช้เป็นกลไกตรวจสอบความเข้ากันของงาน

### ประเมิน BSM ทั้ง 4 ด้าน

| ด้าน | สิ่งที่ทีมแสดงออก |
|------|------------------|
| Self-awareness | รับรู้ว่าทีมเป็นมือใหม่ เลือกผลิตสินค้างานแฮนด์เมดที่สอดคล้องกับที่ผู้ประกอบการทำได้จริง |
| Self-discipline | วาง road map เป็น Phase, สร้างเอกสาร, ทำงานตาม sprint อย่างต่อเนื่อง |
| Collaboration | แบ่งงานตามถนัด, พูดคุยกันเรื่องที่ยังไม่เข้าใจ, ช่วยเหลืองานกันข้ามฝั่ง |
| Continuous Growth | เรียนรู้จากบั๊ก "No products found", ศึกษา Stripe, วางแผนปรับปรุงระบบอย่างต่อเนื่อง |

> **Message หลัก:** ทีมไม่ได้เก่งเทคนิคตั้งแต่แรก แต่ใช้ **การสื่อสาร + เอกสาร + เครื่องมือ (AI/Git) + การขอคำปรึกษา**
> เพื่อทำให้โปรเจกต์เดินหน้าสำเร็จได้จริงในเวลาจำกัด

---

## 5. สรุป (1 นาที)

- Calla Lily คือ E-commerce เต็มรูป (Frontend + Backend + Database) สำหรับธุรกิจผลิตภัณฑ์แฮนด์เมด
- มีระบบครบวงจร: หน้าผู้ค้า (admin) + หน้าลูกค้า พร้อม Authentication ที่ปลอดภัยด้วย JWT + bcrypt
- การจัดการสต็อกแบบ atomic ป้องกันการขายเกิน
- จุดแข็งของทีมไม่ใช่แค่โค้ด แต่คือ **การทำงานเป็นทีมที่สื่อสารกัน, ช่วยเหลือกัน, และพร้อมเรียนรู้ต่อเนื่อง**

### Q&A ที่อาจถูกถาม (เตรียมคำตอบ)

1. **ทำไมเลือก MongoDB?** — ข้อมูลโครงสร้างไม่ซับซ้อน, Schema ยืดหยุ่นเหมาะกับมือใหม่, ใช้กับ Render ฟรีได้
2. **ความปลอดภัยของรหัสผ่าน?** — bcrypt hash 10 rounds, JWT 7 วัน, 2 ชั้น middleware, ไม่คืน password ให้ client
3. **ป้องกันขายเกินสต็อกยังไง?** — ตรวจ stock ทุก item ตอนสร้างออเดอร์ + ตัดด้วย `$inc` แบบ atomic ในคำสั่งเดียว
4. **เส้นทางพัฒนา?** — Stripe จริง, cart ฝั่ง DB, testing, TypeScript

---

## ภาคผนวก — ข้อมูลอ้างอิงจากโปรเจกต์

- เอกสารโปรเจกต์เต็ม: `docs/README.md`
- สถาปัตยกรรม + ข้อมูลโมเดล: `docs/system-design.md`
- คำอธิบายโค้ดทุกไฟล์ (ไทย): `docs/code-explanation-th.md`
- ขั้นตอนการ build ตั้งแต่ต้น: `docs/build-order.md`
- แผนเพิ่ม Stripe: `docs/stripe-payments.md`
- Design system: `frontend/docs/DESIGN.md`
- สินค้า 12 รายการ / บัญชีตัวอย่าง: `backend/src/seed.js`, `frontend/src/data/`