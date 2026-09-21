# System Design — Calla Lily E-commerce

> เอกสารอธิบายสถาปัตยกรรม โครงสร้าง และฟีเจอร์ของโปรเจกต์
> ปัจจุบันเป็น Full-stack: React SPA + Node.js/Express + MongoDB

---

## 1. สถาปัตยกรรมภาพรวม

โปรเจกต์เป็น Full-stack E-commerce:

- **Frontend** = React SPA (Vite + Tailwind CSS)
  - ข้อมูลสินค้าโหลดจาก backend ผ่าน REST API
  - ระบบ cart ใช้ `localStorage` ของเบราว์เซอร์ (sync กับ server ตอน checkout)
- **Backend** = Node.js + Express + MongoDB
  - REST API สำหรับ Product / User / Order
  - JWT authentication + bcrypt password hashing

```
[React SPA (Vite + Tailwind)]
   │
   ├── fetch() ผ่าน src/api.js
   │
   ▼
[REST API (Express)] ←→ [MongoDB]
   │
   ├── /api/products   → Product CRUD
   ├── /api/users      → Auth + User management
   └── /api/orders     → Order creation + tracking
```

---

## 2. เทคโนโลยีที่ใช้

| หมวด | เทคโนโลยี |
|------|-----------|
| Framework | React 19 |
| Build tool | Vite 8 |
| Styling | Tailwind CSS 4 |
| Routing | React Router 7 |
| Lint | ESLint 10 |
| Backend | Node.js + Express 5 |
| Database | MongoDB (Mongoose 9) |
| Auth | JWT (jsonwebtoken) + bcrypt |

---

## 3. โครงสร้างโฟลเดอร์

### Frontend (`frontend/src/`)

```
src/
├── main.jsx              → Entry point (<App/> ใน StrictMode)
├── App.jsx               → Router (createBrowserRouter) + Provider nesting
├── api.js                → REST API client (fetch wrapper + JWT token)
├── index.css             → Tailwind import + CSS variables
├── assets/               → hero.png, svg logos
├── context/
│   ├── AuthContext.jsx   → ระบบบัญชี (login/register/logout/profile)
│   ├── CartContext.jsx   → ตะกร้าสินค้า (localStorage)
│   └── ProductContext.jsx→ สินค้าทั้งหมด (โหลดจาก API)
├── components/
│   ├── Layout.jsx        → Navbar + Outlet + Footer
│   ├── Navbar.jsx        → แถบนำทาง (sticky) + cart badge
│   ├── Footer.jsx        → footer 3 คอลัมน์
│   ├── Button.jsx        → ปุ่มมาตรฐาน
│   ├── ProductCard.jsx   → การ์ดสินค้า (ใช้ใน Home/Products/Detail)
│   └── CartItem.jsx      → รายการสินค้าในตะกร้า
├── pages/
│   ├── Home.jsx          → หน้าแรก (Hero + Featured)
│   ├── Products.jsx      → รายการสินค้า (ค้นหา/กรอง/เรียง/pagination)
│   ├── ProductDetail.jsx → รายละเอียดสินค้า (/product/:id)
│   ├── Cart.jsx          → ตะกร้าสินค้า
│   ├── Checkout.jsx      → ชำระเงิน
│   ├── OrderSuccess.jsx  → หน้ายืนยันคำสั่งซื้อ
│   ├── Login.jsx         → เข้าสู่ระบบ
│   ├── Register.jsx      → สมัครสมาชิก
│   ├── Account.jsx       → บัญชีผู้ใช้ + ประวัติออเดอร์
│   └── Tracking.jsx      → เช็คสถานะพัสดุ
├── pages/admin/
│   ├── AdminLayout.jsx   → Guard + Sidebar
│   ├── Dashboard.jsx     → สถิติ
│   ├── AdminProducts.jsx → CRUD สินค้า
│   ├── AdminOrders.jsx   → จัดการออเดอร์
│   └── AdminCustomers.jsx→ รายชื่อลูกค้า
└── data/
    ├── products.js       → ข้อมูลสินค้าตั้งต้น (seed → MongoDB)
    ├── admin.js          → บัญชี admin ตั้งต้น
    └── user.js           → บัญชีลูกค้าตั้งต้น
```

### Backend (`backend/src/`)

```
src/
├── server.js             → จุดเริ่มต้นเซิร์ฟเวอร์ (Express + CORS + routes)
├── config/db.js          → เชื่อมต่อ MongoDB (mongoose)
├── seed.js               → สคริปต์เติมข้อมูลตั้งต้น
├── models/
│   ├── Product.js        → Schema สินค้า
│   ├── User.js           → Schema ผู้ใช้ (password hash)
│   └── order.model.js    → Schema ออเดอร์
├── controllers/
│   ├── productController.js → ลอจิก CRUD สินค้า
│   ├── userController.js    → ลอจิก auth + จัดการผู้ใช้
│   └── orderController.js   → ลอจิกสร้าง/ดู/อัปเดตออเดอร์
├── routes/
│   ├── productsRoute.js  → /api/products
│   ├── userRoute.js      → /api/users
│   └── orderRoute.js     → /api/orders
└── middlewares/
    └── authMiddleware.js → JWT verify + requireAdmin
```

---

## 4. Routing Map

> เส้นทางทั้งหมดใช้ตัวพิมพ์เล็ก (เช่น `/product` ไม่ใช่ `/Product`)

| Path | หน้า / ฟังก์ชัน |
|------|----------------|
| `/` | Home (Hero + Featured Products) |
| `/product` | รายการสินค้า (ค้นหา/กรอง/เรียง/pagination) |
| `/product/:id` | รายละเอียดสินค้า |
| `/cart` | ตะกร้าสินค้า |
| `/checkout` | ชำระเงิน (ต้องล็อกอิน + มีสินค้าในตะกร้า) |
| `/order-success` | หน้ายืนยันคำสั่งซื้อ |
| `/login` | เข้าสู่ระบบ |
| `/register` | สมัครสมาชิก |
| `/account` | บัญชีผู้ใช้ + ประวัติออเดอร์ |
| `/tracking` | เช็คสถานะพัสดุ |
| `/admin` | Dashboard (admin เท่านั้น) |
| `/admin/products` | จัดการสินค้า CRUD (admin) |
| `/admin/orders` | จัดการออเดอร์ (admin) |
| `/admin/customers` | รายชื่อลูกค้า (admin) |

---

## 5. State Management (Context)

### CartContext — ระบบตะกร้า

```
CartContext
├── state: cart[]  (โหลดจาก localStorage key "calla-cart" ตอนเริ่ม)
├── useEffect → เขียนกลับ localStorage ทุกครั้งที่ cart เปลี่ยน
├── addToCart(product, qty=1)  → เพิ่มสินค้า (ถ้ามีอยู่แล้ว +qty)
├── removeFromCart(id)         → ลบสินค้าออก
├── increaseQty(id)            → เพิ่มจำนวน (+1)
├── decreaseQty(id)            → ลดจำนวน (-1, ขั้นต่ำ 1)
├── clearCart()                → ล้างตะกร้า (ใช้หลังสั่งซื้อ)
├── itemCount                  → จำนวนสินค้าทั้งหมด (reduce quantity)
└── totalPrice                 → ราคารวม (reduce price × quantity)
```

Data shape ของ item ใน cart:

```
{ id, name, price, category, image, description, stock, createdAt, quantity }
```

> แต่ละ item คือ product object ทั้งก้อน spread แล้วต่อ `quantity`
> `id` คือ MongoDB ObjectId (string) เช่น `"65f1c3a2..."`

### AuthContext — การเข้าสู่ระบบ

```
AuthContext
├── state: currentUser | null, token | null
├── useEffect → บันทึก currentUser/token ลง localStorage อัตโนมัติ
├── useEffect → ฟัง Event "calla:unauthorized" → logout อัตโนมัติ
├── login(email, password)        → เรียก api.login()
├── register(data)                → เรียก api.register()
├── logout()                      → ล้าง user + token
├── updateProfile(data)           → แก้ข้อมูลส่วนตัว
├── changePassword(current, next) → เปลี่ยนรหัสผ่าน
└── validatePassword(pw)          → export ตรวจความยาว 8-14 ตัว
```

### ProductContext — รายการสินค้า

```
ProductContext
├── state: products[]  (โหลดจาก api.getProducts() ตอนเริ่ม)
├── addProduct(data)      → api.createProduct() + ต่อท้ายลิสต์
├── updateProduct(id, data) → api.updateProduct() + แทนที่ในลิสต์
└── deleteProduct(id)     → api.deleteProduct() + กรองออก
```

---

## 6. Data Model

### Product (MongoDB)
```
{ name, price, category, image, description, stock, createdAt, updatedAt }
```
- `id` = MongoDB `_id` (string) — เพิ่มโดย `toProductJSON()` ใน controller
- `timestamps: true` → `createdAt`/`updatedAt` อัตโนมัติ

### User (MongoDB)
```
{ name, email (unique), password (hash), role ("user"|"admin"),
  phone, address, city, zip, memberSince, createdAt, updatedAt }
```
- `role` default = `"user"`, admin ตั้งค่าตอน seed
- `password` เก็บเป็น bcrypt hash (ไม่ใช่รหัสจริง)

### Order (MongoDB)
```
{ orderId (unique, "CL-xxxxxx"), userId (ref User, nullable),
  items[]: { productId (ref Product), id, name, price, quantity, image },
  customer: { fullName, email, phone, address, city, zip },
  payment, subtotal, shipping, discount, total,
  status ("processing"|"shipped"|"delivered"|"cancelled"),
  createdAt, updatedAt }
```

### CartItem (Frontend — localStorage)
```
{ id, name, price, category, image, description, stock, createdAt, quantity }
```
- คือ product object ทั้งก้อน spread แล้วต่อ `quantity`
- เก็บใน `localStorage` key `"calla-cart"`

---

## 7. API Design (REST)

### Products
```
GET    /api/products          # รายการสินค้าทั้งหมด (ไม่ต้องล็อกอิน)
POST   /api/products          # เพิ่มสินค้า (admin เท่านั้น)
GET    /api/products/:id      # สินค้ารายตัว
PUT    /api/products/:id      # แก้ไขสินค้า (admin)
DELETE /api/products/:id      # ลบสินค้า (admin)
```

### Users (Auth)
```
POST   /api/users/login       # เข้าสู่ระบบ (ไม่ต้องล็อกอิน)
POST   /api/users/register    # สมัครสมาชิก (ไม่ต้องล็อกอิน)
GET    /api/users              # รายชื่อผู้ใช้ทั้งหมด (admin)
PUT    /api/users/:id/profile  # แก้โปรไฟล์ (เจ้าของหรือ admin)
PUT    /api/users/:id/password # เปลี่ยนรหัสผ่าน (เจ้าของหรือ admin)
```

### Orders
```
POST   /api/orders            # สร้างคำสั่งซื้อ (ต้องล็อกอิน)
GET    /api/orders            # ออเดอร์ทั้งหมด (admin)
GET    /api/orders/mine       # ออเดอร์ของตัวเอง (ต้องล็อกอิน)
GET    /api/orders/track?q=   # เช็คสถานะ (ไม่ต้องล็อกอิน)
GET    /api/orders/:id        # ดูออเดอร์ตาม id (เจ้าของหรือ admin)
PATCH  /api/orders/:id        # เปลี่ยนสถานะ (admin)
```

---

## 8. Feature สถานะปัจจุบัน

| Feature | สถานะ | รายละเอียด |
|---------|-------|-----------|
| Homepage | ✅ | Hero + Featured Products (3 ชิ้นแรก) |
| Products | ✅ | ค้นหา/กรองหมวด/เรียง/pagination (9 ชิ้น/หน้า) |
| Product Detail | ✅ | รายละเอียด + เลือกจำนวน + Add to Cart + สินค้าที่เกี่ยวข้อง |
| Cart | ✅ | ตะกร้า + localStorage + ปรับจำนวน/ลบ |
| Checkout | ✅ | ฟอร์มจัดส่ง + ชำระเงิน (COD/Transfer/Card) + สร้างออเดอร์ |
| Order Success | ✅ | หน้ายืนยันหลังสั่งซื้อ |
| Login / Register | ✅ | ฟอร์ม + JWT auth + validation |
| Account | ✅ | โปรไฟล์ + แก้ไข + เปลี่ยนรหัสผ่าน + ประวัติออเดอร์ |
| Tracking | ✅ | เช็คสถานะด้วย Order ID หรือ email |
| Admin Dashboard | ✅ | สถิติ + Recent Orders |
| Admin Products | ✅ | CRUD สินค้า (เพิ่ม/แก้ไข/ลบ) |
| Admin Orders | ✅ | รายการออเดอร์ + เปลี่ยนสถานะ |
| Admin Customers | ✅ | รายชื่อลูกค้า |

---

## 9. จุดที่ควรปรับปรุง

| จุด | ปัญหา | วิธีแก้ |
|-----|-------|--------|
| CartItem → Product Detail | คลิกสินค้าในตะกร้าไม่ไปหน้ารายละเอียด | เพิ่ม `id` prop + `<Link>` ใน CartItem |
| No .gitignore | ไม่มีไฟล์ .gitignore | เพิ่ม .gitignore (node_modules, .env, dist, docs) |
| เวอร์ชัน docs | docs อาจไม่ sync กับโค้ด | อัปเดต docs ทุกครั้งที่เปลี่ยนโครงสร้าง |

---

## 10. ขั้นตอนแนะนำต่อไป

1. **CartItem → Product Detail**: ส่ง `id` prop ให้ CartItem แล้วครอบรูป/ชื่อด้วย
   `<Link to={/product/${id}}>` เหมือน ProductCard
2. **เพิ่ม .gitignore** เพื่อกัน node_modules / .env / dist / docs ไม่ให้ขึ้น git
3. **ปรับปรุง Cart**: แสดง stock ที่เหลือ และเตือนเมื่อเกิน stock
4. **ปรับปรุง Checkout**: รองรับ shipping fee / discount จริง
5. เพิ่มฟีเจอร์: รีวิวสินค้า, คูปองส่วนลด, อัปโหลดรูปสินค้า
