# System Design — Calla Lily E-commerce

> เอกสารอธิบายสถาปัตยกรรม โครงสร้าง และแผนพัฒนาของโปรเจกต์
> ครอบคลุมทั้งเฟสปัจจุบัน (Frontend-only) และเฟสอนาคต (Backend)

---

## 1. สถาปัตยกรรมภาพรวม

โปรเจกต์แบ่งพัฒนาเป็น 2 เฟส ตาม backlog:

- **เฟสปัจจุบัน = Frontend-only (SPA)**
  - ข้อมูลสินค้ามาจากไฟล์ local `src/data/product.js`
  - ระบบ cart จำลองด้วย `localStorage` ของเบราว์เซอร์ (ยังไม่มีฐานข้อมูล)
- **เฟสอนาคต = Full-stack**
  - เพิ่ม Node.js + Express (REST API)
  - เพิ่ม MongoDB ใช้เก็บ Product / User / Order

```
[React SPA (Vite + Tailwind)]
   │
   ├── ข้อมูล local: src/data/product.js   → ตอนนี้ยังไม่มี API
   ├── localStorage: cart                  → จำลอง persistent state
   │
   [อนาคต] REST API (Express) ←→ MongoDB
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
| Backend (อนาคต) | Node.js + Express |
| Database (อนาคต) | MongoDB |

---

## 3. โครงสร้างโฟลเดอร์

### ปัจจุบัน

```
src/
├── main.jsx          → Entry point (render <App/>)
├── App.jsx           → Router (Routes)
├── index.css         → Tailwind import
├── data/
│   └── product.js    → ข้อมูลสินค้า (ชั่วคราว)
├── components/       → UI ที่ใช้ซ้ำ
│   ├── Layout.jsx    → Navbar + Outlet + Footer
│   ├── Navbar.jsx    → แถบนำทาง (sticky)
│   ├── Footer.jsx
│   ├── ProductCard.jsx
│   ├── Button.jsx
│   └── CartItem.jsx
└── pages/
    ├── Home.jsx
    └── Products.jsx
```

### เป้าหมาย (เต็มรูปแบบ)

```
src/
├── main.jsx                    # Entry + ครอบ <CartProvider>
├── App.jsx                     # Router
├── index.css                   # Tailwind + :root (CSS variables)
├── data/product.js             # ข้อมูลสินค้า (ชั่วคราว)
├── context/
│   ├── CartContext.jsx         # (วางแผน) — Toto
│   └── AuthContext.jsx         # (วางแผน) — Black
├── components/
│   ├── Layout / Navbar / Footer
│   ├── ProductCard / Button / CartItem
│   └── (เพิ่ม) ProtectedRoute, AdminLayout, ...
└── pages/
    ├── public/  : Home, Products, ProductDetail, Cart, Checkout, OrderSuccess
    ├── auth/    : Login, Register
    ├── user/    : Account, OrderHistory, OrderTracking
    └── admin/   : Dashboard, ProductsCRUD, Orders, Customers
```

---

## 4. Routing Map

> หมายเหตุ: แนะนำให้ใช้ตัวพิมพ์เล็ก เช่น `/products` แทน `/Product`

| Path | หน้า / ฟังก์ชัน | เจ้าของ (ทีม) |
|------|----------------|---------------|
| `/` | Home | Black |
| `/products` | แสดง/ค้นหา/กรอง/เรียงสินค้า | Phupha |
| `/product/:id` | สินค้ารายละเอียด | Phupha |
| `/cart` | ตะกร้าสินค้า | Toto |
| `/checkout` | ชำระเงิน | Toto |
| `/login`, `/register` | เข้าสู่ระบบ/สมัคร | Black |
| `/account` | บัญชีผู้ใช้ | Bush |
| `/tracking` | ติดตามคำสั่งซื้อ | Bush |
| `/admin/*` | หน้าแอดมิน | Phupha |

---

## 5. State Management (Context)

### CartContext — ระบบตะกร้า (Toto)

```
CartContext
├── state: cart[]  (โหลดจาก localStorage ตอนเริ่ม)
├── useEffect → เขียนกลับ localStorage ทุกครั้งที่ cart เปลี่ยน
├── addToCart(product)      → เพิ่มสินค้า (ถ้ามีอยู่แล้ว +qty)
├── removeFromCart(id)      → ลบสินค้าออก
├── increaseQty(id)         → เพิ่มจำนวน
├── decreaseQty(id)         → ลดจำนวน (ขั้นต่ำ 1)
├── clearCart()             → ล้างตะกร้า
├── totalPrice              → ราคารวม (reduce)
└── totalItemCount          → จำนวนสินค้าทั้งหมด (reduce)
```

Data shape ของ item ใน cart:

```
{ id, name, price, image, qty }
```

### AuthContext — การเข้าสู่ระบบ (Black, เฟสหลัง)

```
AuthContext
├── state: user | null, token
├── login(email, password)
├── logout()
└── isAuthenticated
```

---

## 6. Data Model (สำหรับเฟส backend)

```
Product   { id, name, price, category, image, description, stock }
User      { id, name, email, password(hash), role: "customer" | "admin" }
Order     { id, userId, items[], total, status }
```

ตัวอย่าง:

```js
// Product
{
  id: 1,
  name: "Lavender Dreams Soap",
  price: 12.99,
  category: "Relaxation",
  image: "https://...",
  description: "...",
  stock: 50
}

// CartItem (ภายในตะกร้าผู้ใช้)
{
  productId: 1,
  name: "Lavender Dreams Soap",
  price: 12.99,
  image: "https://...",
  qty: 2
}
```

---

## 7. API Design (REST — เฟสอนาคต)

### Products
```
GET    /api/products          # รายการสินค้า
GET    /api/products/:id      # สินค้าเดี่ยว
POST   /api/products          # เพิ่มสินค้า (admin)
PUT    /api/products/:id      # แก้ไขสินค้า (admin)
DELETE /api/products/:id      # ลบสินค้า (admin)
```

### Auth
```
POST   /api/auth/register     # สมัครสมาชิก
POST   /api/auth/login        # เข้าสู่ระบบ
```

### Orders
```
POST   /api/orders            # สร้างคำสั่งซื้อ
GET    /api/orders/:id        # ดูคำสั่งซื้อ/สถานะ
PUT    /api/orders/:id/status # เปลี่ยนสถานะ (admin)
```

---

## 8. Feature พร้อมผู้รับผิดชอบ (Sprint 2)

| Feature | รายละเอียด | ทีม |
|---------|-----------|-----|
| Login / Register | หน้า + Auth state | Black |
| Homepage | หน้าแรก | Black |
| Tracking | หน้า + ProgressTracker | Bush |
| Account | หน้าโปรไฟล์ผู้ใช้ | Bush |
| Cart | CartContext + หน้าตะกร้า + localStorage | Toto |
| Checkout | หน้า + สร้างคำสั่งซื้อ | Toto |
| Products | ค้นหา/กรอง/เรียง + ProductCard | Phupha |
| Product Detail | หน้ารายละเอียด | Phupha |
| Admin | Dashboard / CRUD / Orders / Customers | Phupha |

---

## 9. จุดบกพร่องที่ควรแก้ (ตามสถานะปัจจุบัน)

| จุด | ปัญหา | วิธีแก้ |
|-----|-------|--------|
| CSS variables | `--color-primary` ฯลฯ ถูกใช้ แต่ **ไม่มีการนิยาม `:root`** → UI สีเพี้ยน | เพิ่มตัวแปรใน `index.css` |
| `main.jsx` | import `StrictMode` แต่ไม่ใช้ | ครอบ `<StrictMode>` หรือลบ import |
| Unused imports | `React` ใน Button/CartItem/ProductCard | ลบ import `React` |
| Route ตัวพิมพ์ใหญ่ | `Navbar` ใช้ `/Product` | เปลี่ยนเป็น `/products` ให้ตรงกัน |
| Home | ยังเป็น placeholder | พัฒนาตามงานของ Black |

---

## 10. ขั้นตอนแนะนำต่อไป (ตามลำดับ)

1. **ตั้งค่า CSS variables** ใน `index.css` (แก้สีเพี้ยนให้ทั่วโปรเจกต์)
2. **ทำ CartContext + localStorage** แล้วครอบ `<CartProvider>` ใน `main.jsx`
3. **เชื่อม Add to Cart** จาก ProductCard → Products → CartContext
4. **สร้างหน้า Cart + Navbar badge**
5. ต่อยอด: Checkout, Auth, Product Detail, Admin (ตาม Sprint)
