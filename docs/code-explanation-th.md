# คำอธิบายโค้ดทั้งหมดของโปรเจกต์ Calla Lily (ภาษาไทย)

เอกสารนี้อธิบายโค้ดทุกไฟล์ในโปรเจกต์ เพื่อให้ทุกคนในทีมเข้าใจว่าแต่ละไฟล์
ทำงานอะไร ใครรับผิดชอบส่วนไหน และโค้ดไหลจากฝั่งหน้าเว็บ (frontend) ไปยัง
ฝั่งเซิร์ฟเวอร์/ฐานข้อมูล (backend) อย่างไร

---

## สารบัญ

1. [โครงสร้างโปรเจกต์](#โครงสร้างโปรเจกต์)
2. [ภาพรวมการทำงาน (Data Flow)](#ภาพรวมการทำงาน-data-flow)
3. [Frontend — ไฟล์ค่าเริ่มต้น](#frontend--ไฟล์ค่าเริ่มต้น)
4. [Frontend — src/main.jsx และ src/App.jsx](#frontend--srcmainjsx-และ-srcappjsx)
5. [Frontend — src/api.js (ตัวเชื่อมต่อ backend)](#frontend--srcapijs-ตัวเชื่อมต่อ-backend)
6. [Frontend — Context (state ร่วมทั้งแอป)](#frontend--context-state-ร่วมทั้งแอป)
7. [Frontend — Components (ส่วนประกอบ UI)](#frontend--components-ส่วนประกอบ-ui)
8. [Frontend — Pages (หน้าต่างๆ)](#frontend--pages-หน้าต่างๆ)
9. [Frontend — Admin Pages](#frontend--admin-pages)
10. [Frontend — Seed Data (ข้อมูลตั้งต้น)](#frontend--seed-data-ข้อมูลตั้งต้น)
11. [Backend — ไฟล์ค่าเริ่มต้น](#backend--ไฟล์ค่าเริ่มต้น)
12. [Backend — src/server.js และ src/config/db.js](#backend--srcserverjs-และ-srcconfigdbjs)
13. [Backend — Models (โครงสร้างข้อมูลใน MongoDB)](#backend--models-โครงสร้างข้อมูลใน-mongodb)
14. [Backend — Middlewares (ตรวจสิทธิ์)](#backend--middlewares-ตรวจสิทธิ์)
15. [Backend — Routes (เส้นทาง API)](#backend--routes-เส้นทาง-api)
16. [Backend — Controllers (ลอจิกของ API)](#backend--controllers-ลอจิกของ-api)
17. [Backend — src/seed.js (เติมข้อมูลตั้งต้น)](#backend--srcseedjs-เติมข้อมูลตั้งต้น)
18. [Backend — Payments (Stripe Checkout)](#backend--payments-stripe-checkout)
19. [Backend — Calla AI (Chat + Gemini)](#backend--calla-ai-chat--gemini)

---

## โครงสร้างโปรเจกต์

```
calla-lily-fullstack-1/
├─ backend/              # API server (Node.js + Express + MongoDB)
│  └─ src/
│     ├─ config/db.js    # เชื่อมต่อ MongoDB
│     ├─ controllers/    # ลอจิกของ API (products/users/orders/payments/chat)
│     ├─ middlewares/    # ตรวจ JWT และสิทธิ์ admin
│     ├─ models/         # โครงสร้างข้อมูล (Schema) ของ MongoDB
│     ├─ routes/         # เส้นทาง URL ของ API
│     ├─ seed.js         # สคริปต์เติมข้อมูลตั้งต้น
│     └─ server.js       # จุดเริ่มต้นของเซิร์ฟเวอร์
└─ frontend/             # เว็บแอป (React + Vite + Tailwind)
   └─ src/
      ├─ api.js          # ฟังก์ชันเรียก API ทั้งหมด
      ├─ components/     # UI ที่ใช้ซ้ำ (Navbar, Footer, Button, AIChat, ...)
      ├─ context/        # state ร่วม (สินค้า/ตะกร้า/บัญชี)
      ├─ data/           # ข้อมูลตั้งต้น (seed) ของสมาชิก/admin
      ├─ pages/          # หน้าต่างๆ ของเว็บ
      └─ pages/admin/    # หน้าเฉพาะ admin
```

---

## ภาพรวมการทำงาน (Data Flow)

1. ผู้ใช้เปิดเว็บ → `index.html` โหลด `main.jsx` → render `<App />`
2. `<App />` ครอบแอปด้วย **3 Context** (Auth, Cart, Product) และสร้าง Router
3. แต่ละหน้าเรียกใช้ **Hook** จาก Context (เช่น `useProducts()`) เพื่อขอข้อมูล
4. Context เหล่านั้นเรียกฟังก์ชันจาก **`api.js`** ซึ่ง `fetch()` ไปหา backend
   (ณ production คือ `https://backend.onrender.com/api`)
5. Backend (`server.js`) รับ request → เข้า **Route** → **Middleware**
   (ตรวจ token ถ้าจำเป็น) → **Controller** อ่าน/เขียน **MongoDB** ผ่าน Model
6. ส่งผลลัพธ์กลับเป็น JSON → หน้าแสดงผล

**เส้นทางชำระเงิน (Stripe):**
1. Checkout ส่ง `POST /api/payments/checkout` → backend สร้าง Stripe
   Checkout Session แล้วคืน `{ url }` → หน้าเว็บ redirect ไปหน้า Stripe
2. จ่ายเงินสำเร็จ Stripe redirect กลับมา `/payment-success?session_id=...`
3. หน้า PaymentSuccess เรียก `createOrder({ sessionId, ... })` →
   backend ตรวจ session กับ Stripe (`payment_status === 'paid'`) → สร้างออเดอร์
   + ลด stock → ไปหน้า `/order-success`

**เส้นทาง AI Chat (Calla AI):**
1. ปุ่ม "AI ช่วยแนะนำ" (AIChat) ส่ง `POST /api/chat` ด้วยประวัติข้อความ
2. backend เอารายการสินค้าจริงใน MongoDB มาสร้าง system instruction
   แล้วส่งให้ Gemini → คืน `{ reply }` → แสดงเป็นฟองแชท

> หมายเหตุ: คำขอที่ขึ้นต้นด้วย `/api` จะไป backend เสมอ ส่วนหน้าที่ไม่ต้อง
> ใช้ข้อมูลจากเซิร์ฟเวอร์ (เช่น หน้า Home ที่มีรูป static) จะโหลดได้ทันที

---

## Frontend — ไฟล์ค่าเริ่มต้น

### `index.html`
ไฟล์ HTML เปล่าที่ React ใช้เป็นจุดเริ่มต้น
- `<div id="root"></div>` คือจุดที่ React จะวาด UI ทั้งหมดลงไป
- `<script type="module" src="/src/main.jsx">` โหลด entry point ของแอป

### `package.json`
- ระบุ script: `dev` (รัน dev server), `build` (สร้างไฟล์ production),
  `lint` (ตรวจโค้ด), `preview` (ทดสอบ build)
- dependencies หลัก: `react`, `react-dom`, `react-router-dom`
  (จัดการหน้า/เส้นทาง), `tailwindcss` + `@tailwindcss/vite` (ออกแบบ UI)
- โปรเจกต์ใช้ `"type": "module"` หมายถึงใช้ `import` แบบ ES Module

### `vite.config.js`
ค่าตั้งค่าของ Vite (ตัว build):
- `react()` + `babel({ presets: [reactCompilerPreset()] })` — ใช้ React 19
  รุ่นใหม่พร้อม React Compiler ที่ช่วย optimize การ re-render อัตโนมัติ
- `tailwindcss()` — เปิดใช้งาน Tailwind CSS เวอร์ชัน 4
- `server.proxy` — เฉพาะตอน develop: คำขอที่ขึ้นต้น `/api` จะส่งต่อไปที่
  `http://localhost:5000` (backend ตัว local) ทำให้ dev ไม่ต้องตั้ง URL

### `vercel.json`
ตั้งค่าเมื่อ deploy ไป Vercel:
- rewrite ทุกเส้นทาง `/(.*)` → `/index.html`
  เพราะเป็น SPA (หน้าเปลี่ยนด้วย JS) เบราว์เซอร์ขอเส้นทางอะไรก็ให้ index
  ตลอด แล้วให้ React Router จัดการเอง

### `eslint.config.js`
ขอบเขตและกติกาการตรวจโค้ด:
- ข้ามโฟลเดอร์ `dist` ที่เป็นไฟล์ build
- ตรวจไฟล์ `.js/.jsx` ด้วยกฎของ ESLint, กฎ React Hooks, และกฎ
  react-refresh ที่ให้ export แค่ component เท่านั้น

### `src/index.css`
จุดรวมธีมสีของเว็บ (แถบแดง แนว Calla Lily):
- นำเข้า `tailwindcss`
- กำหนดตัวแปรสี เช่น `--color-primary: #9b151d` (แดงเข้ม),
  `--color-blush: #ffe5de` (ครีม), รวมถึงรัศมีมุม, เงา, ความเร็ว transition

---

## Frontend — src/main.jsx และ src/App.jsx

### `src/main.jsx`
- entry point ของ React: ใช้ `createRoot(...).render(<App />)`
- ครอบด้วย `<StrictMode>` ซึ่งเป็นโหมด debug ของ React ที่ช่วยจับปัญหา
  ระหว่าง development (รัน effect 2 ครั้งเพื่อตรวจสอบ)

### `src/App.jsx`
- สร้าง **Router** ด้วย `createBrowserRouter` — กำหนดเส้นทางทั้งหมด:
  - `/` → Home
  - `/product` → หน้ารายการสินค้า, `/product/:id` → รายละเอียดสินค้า
  - `/cart`, `/checkout`, `/order-success`, `/payment-success`
  - `/login`, `/register`, `/account`, `/tracking`
  - `/admin` + ลูก (`/admin/products`, `/admin/orders`, `/admin/customers`)
  - `errorElement` → ถ้าหาเส้นทางไม่เจอแสดง "Page not found"
- `export default function App()` ครอบทุกอย่างด้วย Provider เรียงลำดับ:
  ```
  <AuthProvider>      ← ข้อมูลผู้ใช้ + token
    <CartProvider>    ← ตะกร้าสินค้า
      <ProductProvider> ← สินค้าทั้งหมด
        <RouterProvider/>
  ```
- **ทำไมต้องครอบ Provider ด้านนอก?** เพราะ Context คือ "state ร่วม"
  ที่ทุกหน้าภายในต้องใช้ได้ ถ้าย้ายไปอยู่ด้านในเฉพาะบางหน้า พวกนั้นก็จะเข้า
  ไม่ถึงข้อมูล

---

## Frontend — src/api.js (ตัวเชื่อมต่อ backend)

ไฟล์เดียวที่คอยคุยกับเซิร์ฟเวอร์ผ่าน `fetch()`:

```js
const normalizeBase = (value) => {
  const raw = (value || "/api").trim().replace(/\/+$/, "");
  if (raw.startsWith("/")) return raw;
  return raw.endsWith("/api") ? raw : `${raw}/api`;
};
const BASE = normalizeBase(import.meta.env.VITE_API_URL);
```
- `VITE_API_URL` คือ env ที่ตั้งค่าไว้ตอน build (เช่น
  `https://calla-lily-fullstack-1.onrender.com/api`)
- `normalizeBase()` คอยกันความผิดพลาด: ถ้าตั้ง URL แบบลืม `/api` หรือใส่
  `/` ต่อท้าย ก็จะปรับให้ถูกต้องเอง (คือสาเหตุที่เคยเจอ "0 items" —
  เพราะตอนนั้น URL กลายเป็น `.../products` แทนที่จะเป็น `.../api/products`)

จากนั้นยังมี:
- `getToken() / storeToken()` — อ่าน-เขียน **JWT** ลง `localStorage`
  (key: `calla-token`)
- `request(path, options)` — ฟังก์ชันกลางที่:
  - เพิ่ม Header `Content-Type: application/json`
  - แนบ `Authorization: Bearer <token>` ถ้ามี
  - เรียก `fetch(BASE + path)`
  - ถ้า response เป็น `401` (token หมดอายุ) → ลบ token และส่ง Event
    `calla:unauthorized` ให้แอปออกจากระบบอัตโนมัติ
  - ถ้าไม่ ok → สร้าง `Error` พร้อมข้อความจาก backend แล้ว `throw`
- `safeRequest()` — เหมือน `request()` แต่ไม่ throw; คืน `{ error }`
  แทน (ใช้กับหน้า login/register/edit)
- export `api` พร้อมฟังก์ชันทั้งหมด:
  - สินค้า: `getProducts`, `getProduct`, `createProduct`,
    `updateProduct`, `deleteProduct`
  - ผู้ใช้: `login`, `register`, `getUsers`, `updateProfile`,
    `changePassword`
  - ออเดอร์: `getOrders`, `getMyOrders`, `trackOrder`, `getOrder`,
    `createOrder`, `updateOrderStatus`
  - ชำระเงิน: `createCheckoutSession(data)` — POST `/payments/checkout`
    คืน `{ url }` (ลิงก์หน้า Stripe) สำหรับ redirect
  - แชท: `chat(messages)` — POST `/chat` ส่งประวัติข้อความไป Gemini
    คืน `{ reply }` (ตอบของ Calla AI)
- `sortOrdersNewest(orders)` — เรียงออเดอร์ใหม่ก่อนโดยใช้ `date`

---

## Frontend — Context (state ร่วมทั้งแอป)

Context = กล่องเก็บข้อมูลที่หลายหน้าใช้ร่วมกัน ไฟล์ทั้ง 3 ตัวมีโครงสร้าง
เดียวกัน คือ สร้าง `createContext()` → `Provider` ครอบ children →
export Hook `useXxx()` ที่ใช้เรียกจากหน้าไหนก็ได้

### `src/context/ProductContext.jsx`
- เก็บ `products` (array สินค้าทั้งหมด) ไว้ state กลาง
- ตอนเริ่มแอป (`useEffect`) เรียก `api.getProducts()`
  - สำเร็จ → `setProducts(data)`
  - ล้มเหลว → `setProducts([])` (ตรงนี้แหละที่ทำให้หน้าสินค้า
    กลายเป็น "No products found" ตอน backend ตอบ error)
- ฟังก์ชัน CRUD:
  - `addProduct(data)` — สร้างสินค้าใหม่ แล้วต่อท้ายลิสต์
  - `updateProduct(id, data)` — แก้สินค้าตาม id แล้วแทนที่ในลิสต์
  - `deleteProduct(id)` — ลบสินค้าตาม id
- หน้า Home / Products / ProductDetail / admin ใช้ข้อมูลจากตรงนี้ผ่าน
  `useProducts()`

### `src/context/CartContext.jsx`
- เก็บ `cart` (array) ไว้ใน `localStorage` (key: `calla-cart`) อัตโนมัติ
  ทุกครั้งที่เปลี่ยน (ผ่าน `useEffect`)
- แต่ละชิ้นในตะกร้ามี `quantity` (จำนวน)
- ฟังก์ชัน:
  - `addToCart(product, qty=1)` — เพิ่มสินค้า ถ้ามีอยู่แล้วให้บวกจำนวน
  - `removeFromCart(id)` — เอาออก
  - `increaseQty / decreaseQty` — +1 / -1 (ไม่ต่ำกว่า 1)
  - `clearCart()` — ล้างทั้งตะกร้า (ใช้หลังสั่งซื้อ)
- ค่า derived:
  - `itemCount` = ผลรวม quantity ทั้งหมด (ตัวเลขแดงบนไอคอนตะกร้า)
  - `totalPrice` = ผลรวม `price × quantity`

### `src/context/AuthContext.jsx`
- จัดการระบบบัญชี: เก็บ `currentUser` + `token`
- อ่านค่าเริ่มต้นจาก `localStorage` (key: `calla-current-user`,
  `calla-token`) เพื่อให้ล็อกอินค้างอยู่ (refresh แล้วยังล็อกอินอยู่)
- `useEffect` บันทึก `currentUser` / `token` ลง localStorage ให้อัตโนมัติ
- ฟัง Event `calla:unauthorized` → ล็อกเอาท์อัตโนมัติเมื่อ token หมดอายุ
- ฟังก์ชัน:
  - `login(email, password)` — เรียก `api.login`; สำเร็จ→เก็บ token+user
  - `register(data)` — สมัครสมาชิกใหม่ (role เป็น `user` เสมอ)
  - `logout()` — ล้าง user + token
  - `updateProfile(data)` — แก้ข้อมูลส่วนตัว
  - `changePassword(current, next)` — เปลี่ยนรหัสผ่าน
- export `validatePassword(pw)` — ตรวจรหัสต้องยาว 8–14 ตัว (ใช้ในหน้า
  Register และ Account)

---

## Frontend — Components (ส่วนประกอบ UI)

### `src/components/Layout.jsx`
- โครงหน้าเว็บ: `Navbar` (บน) + พื้นที่ของแต่ละหน้า `<Outlet />` (กลาง)
  + `Footer` (ล่าง) + `<AIChat />` (ปุ่มลอย AI ช่วยแนะนำมุมขวาล่าง)
- พื้นหลังของเนื้อหาเป็นสีครีม `#FFE5DE`

### `src/components/Navbar.jsx`
- แถบเมนูบนสุด (sticky ติดอยู่เสมอ)
- ซ้าย: โลโก้ "Calla Lily", Home, Product และ **Admin** (เฉพาะ admin)
- ขวา: คำทักทาย "Hi, <ชื่อ>", ปุ่ม Logout, ไอคอนบัญชี, ไอคอนตะกร้า
  พร้อมป้ายตัวเลข `itemCount` (แสดงเมื่อมีสินค้า > 0)
- เช็คสิทธิ์ admin จาก `currentUser?.role === "admin"`

### `src/components/Footer.jsx`
- ส่วนท้ายสีแดง `#9B151D` จัด 3 คอลัมน์: Shop / Account / Contact
- Shop มีลิงก์ไป `/product` และ `/product?cat=...` (กรองหมวดหมู่)

### `src/components/Button.jsx`
- ปุ่มมาตรฐานสีแดงของเว็บ รับ props: `name` (ข้อความ), `onClick`,
  `type`, `disabled`, `className` (เพิ่ม class ได้)
- มี hover/active/disabled state ให้ตามธีม

### `src/components/ProductCard.jsx`
- ใช้แสดงสินค้า 1 ชิ้น (ใช้ในหน้า Home, Products, ProductDetail)
- รับ props: `product`, `onAddToCart`
- แสดงรูป, หมวดหมู่, ชื่อ, ราคา (฿) และปุ่ม "Add to Cart"
- คลิกที่ชื่อ/รูป → ไปหน้า `/product/{id}`

### `src/components/CartItem.jsx`
- ใช้แสดงสินค้า 1 ชิ้นภายในหน้า Cart
- รับ props: `name, price, image, quantity` + callbacks
  `onIncrease / onDecrease / onRemove`
- คำนวณ `itemTotal = price × quantity` แสดงเป็นราคารวมของชิ้นนั้น
- คลิกรูป/ชื่อ → ไปหน้า `/product/{id}` (มี `Link`)

### `src/components/AIChat.jsx`
- ปุ่มลอย "AI ช่วยแนะนำ" (bottom-right) ที่มีในทุกหน้า ผ่าน `<AIChat />`
  ใน Layout
- เปิด/ปิดกล่องแชท (max-height, scroll), มีข้อความต้อนรับจาก "Calla AI"
- กดส่ง → ใช้ `api.chat(nextMessages)` ส่งประวัติทั้งชุดให้ backend `/api/chat`
  → แสดงคำตอบ `{ reply }` เป็นฟองแชทฝั่ง AI
- ระหว่างรอแสดง "Calla AI กำลังพิมพ์..."; มี error handling
  (แต่ละข้อความจำกัด 2000 ตัวอักษรตรง input)

---

## Frontend — Pages (หน้าต่างๆ)

### `src/pages/Home.jsx` (/)
- ส่วน **Hero**: โปรโมชัน + ปุ่ม "Shop Now" และ "Explore Relaxation"
  (ไป `/product?cat=Relaxation`), รูปจาก Unsplash (static)
- ส่วน **Featured Products**: `products.slice(0, 3)` → แสดงสินค้า 3 ชิ้นแรก

### `src/pages/Products.jsx` (/product)
- หน้ารายการสินค้าทั้งหมด พร้อม:
  - ช่องค้นหา (search โดยชื่อ)
  - กรองหมวดหมู่ (อ่านค่าเริ่มต้นจาก URL `?cat=`)
  - เรียงลำดับ: Default / A-Z / Z-A / ราคาต่ำ-สูง / สูง-ต่ำ
- เก็บหมายเลขหน้าตอนนี้ไว้ใน URL ผ่าน `?page=N` (9 ชิ้นต่อหน้า)
- `filtered` คำนวณด้วย `useMemo` จาก search/category/sort/products
- ถ้าไม่มีสินค้าตรงเงื่อนไข → แสดง "No products found"
- Pagination: ปุ่ม Previous/Next จำกัดให้อยู่ระหว่าง 1..pageCount

### `src/pages/ProductDetail.jsx` (/product/:id)
- หาสินค้าจาก `products.find(p => p.id === id)`
- แสดงรูป, หมวดหมู่, ชื่อ, ราคา, รายละเอียด, สต็อก
- เลือกจำนวนด้วยปุ่ม −/+ หรือพิมพ์ (จำกัด 1..stock)
- กด Add to Cart → `handleAddToCart` บังคับจำนวนให้ถูกช่วงแล้วเรียก
  `addToCart(product, qty)`
- โซน "You may also like": สินค้าหมวดหมู่เดียวกันสูงสุด 3 ชิ้น
- ถ้าหาไม่เจอ → แสดง "Product not found"

### `src/pages/Cart.jsx` (/cart)
- ตะกร้าสินค้า: แสดง `CartItem` ทุกรายการ พร้อมปรับจำนวน/ลบ
- ถ้าตะกร้าว่าง → แสดง "Your cart is empty" + ปุ่มไปซื้อของ
- **Summary**: Subtotal + Shipping (ฟรี `0`) = Total
- ปุ่ม "Proceed to Checkout" → ไป `/checkout`

### `src/pages/Checkout.jsx` (/checkout)
- หน้าชำระเงิน: ฟอร์มข้อมูลจัดส่ง (pre-fill จาก `currentUser` ถ้าล็อกอิน)
- ต้องล็อกอินก่อน (ไม่ล็อกอิน → แสดงปุ่ม Log In/Register)
  และต้องมีสินค้าในตะกร้า
- จ่ายเงินด้วยบัตรผ่าน **Stripe Checkout**:
  1. กด "Pay with Card" → `handleSubmit` เรียก `api.createCheckoutSession({...})`
     ซึ่ง backend จะเช็ค stock + สร้าง Stripe Checkout Session แล้วคืน `{ url }`
  2. สำเร็จ → `window.location.href = url` (redirect ไปหน้า Stripe ให้ลูกค้ากรอก
     ข้อมูลบัตรบนหน้า Stripe — ไม่มีเลขบัตรบนเว็บเรา)
  3. ล้มเหลว → แสดง `err.message` (เช่น stock ไม่พอ)
- ยังไม่ `clearCart()` ตรงนี้ — จะล้างตอนยืนยันสำเร็จแล้วที่หน้า payment-success

### `src/pages/OrderSuccess.jsx` (/order-success)
- หน้าขอบคุณหลังสั่งซื้อ อ่านออเดอร์จาก `location.state?.order`
- ถ้าไม่มีออเดอร์ (เช่นกด URL ตรงๆ) → แสดง "No order found"
- แสดง: order id, วันที่, สรุปรายการสินค้า, ค่าขนส่ง (Free), ยอดรวม

### `src/pages/PaymentSuccess.jsx` (/payment-success)
- Stripe redirect กลับมาที่หน้านี้พร้อม `?session_id=...`
- `useEffect` (รันครั้งเดียว) → เรียก `api.createOrder({ sessionId, cart, customer })`
  - backend ตรวจ session กับ Stripe (`payment_status === 'paid'` + ยอดตรงกัน)
  - ออเดอร์ถูกสร้าง + ลด stock → สำเร็จ → `clearCart()` แล้ว
    `navigate("/order-success", { state: { order } })`
- เช็คซ้ำด้วย `stripeSessionId` (refresh หน้าไม่สร้างออเดอร์ซ้ำ)
- ถ้าไม่มี `session_id` → "No payment found"; ถ้า error → "Payment not confirmed"

### `src/pages/Login.jsx` (/login)
- ฟอร์ม email + password → `handleSubmit` เรียก `login()`
- สำเร็จ → ไป `/account`, ล้มเหลว → แสดง error (เช่น email/รหัสผิด)

### `src/pages/Register.jsx` (/register)
- ฟอร์มสมัครสมาชิก (ชื่อ, email, เบอร์, ที่อยู่, เมือง, รหัสไปรษณีย์,
  รหัสผ่าน + ยืนยันรหัส)
- ตรวจก่อน submit: รหัสยืนยันตรงกัน + ความยาว 8–14 ตัว
- เรียก `register()` → สำเร็จเข้า `/account`; email ซ้ำ → แสดง error

### `src/pages/Account.jsx` (/account)
- หน้า "My Account": ถ้าไม่ล็อกอิน → ชวนล็อกอิน/สมัคร
- แสดงการ์ดโปรไฟล์ (ชื่อย่อ 2 ตัว, ชื่อ, email, เบอร์, สมาชิกตั้งแต่, role)
- แก้โปรไฟล์ (โหมด edit เปิด-ปิด)
- เปลี่ยนรหัสผ่าน (ตรวจรหัสยืนยันตรงกัน + 8–14 ตัว)
- **Order History**: โหลด `api.getMyOrders()` แล้วเรียงใหม่ก่อน
  - คลิก "Track →" ไป `/tracking?id=ออเดอร์`
  - แสดงสถานะเป็นป้ายสี (Processing/Shipped/Delivered)

### `src/pages/Tracking.jsx` (/tracking)
- เช็คสถานะพัสดุ ค้นหาด้วย **เลขออเดอร์** หรือ **email**
- เก็บ query ลง URL เป็น `?id=...` (`useSearchParams`)
- เรียก `api.trackOrder()` → ถ้าเจอแสดง timeline:
  Processing → Shipped → Delivered (วงกลม + เส้นเชื่อม; ขั้นที่ผ่านแล้วเป็น
  สีแดงเข้มและมี ✓)
- พร้อมสรุปออเดอร์; ถ้าไม่เจอ → "Order not found"

---

## Frontend — Admin Pages

### `src/pages/admin/AdminLayout.jsx` (guard สำหรับ /admin)
- **Guard** ตรวจสิทธิ์: ถ้าไม่ได้ล็อกอิน หรือ `role !== "admin"` →
  redirect ไป `/login`
- มี sidebar (Dashboard, Products, Orders, Customers) + `<Outlet />`

### `src/pages/admin/Dashboard.jsx` (/admin)
- แสดงสถิติเป็นการ์ด: **Total Revenue** (ผลรวม `total` ของทุกออเดอร์),
  **Orders** (+ จำนวนที่ Processing), **Products**, **Customers**
- โหลดข้อมูลด้วย custom hooks: `useOrders()` → `api.getOrders()`,
  `useUsers()` → `api.getUsers()`, `useProducts()`
- ตาราง **Recent Orders** 5 รายการล่าสุด (เรียงจากใหม่)

### `src/pages/admin/AdminProducts.jsx` (/admin/products)
- จัดการสินค้า (CRUD) ผ่าน `useProducts()`:
  - ฟอร์มบน: เพิ่มสินค้าใหม่ หรือแก้ไข (โหมด edit เปลี่ยนหัวข้อฟอร์ม)
  - `handleSubmit` แปลงค่าเป็นตัวเลข (`Number() || 0`) และ
    หมวดหมู่ว่าง → "General"
  - ตารางล่าง: ทุกรายการพร้อมปุ่ม **Edit** / **Delete**
    (ลบมีการ `window.confirm` ก่อน)
- เรียก `addProduct / updateProduct / deleteProduct` ที่ส่งไปยัง
  backend จริงๆ (MongoDB)

### `src/pages/admin/AdminOrders.jsx` (/admin/orders)
- รายการออเดอร์ทั้งหมด + `<select>` ให้เปลี่ยนสถานะ
  (Processing / Shipped / Delivered)
- `updateStatus(id, status)` → `api.updateOrderStatus()` อัปเดตใน MongoDB
  → หน้า Tracking ของลูกค้าจะเปลี่ยนตาม
- มีลิงก์ "Track →" ไปหน้า tracking ดูออเดอร์ได้

### `src/pages/admin/AdminCustomers.jsx` (/admin/customers)
- ตารางลูกค้าทั้งหมดจาก `api.getUsers()`
- แสดง ชื่อ, email, เบอร์, role (ป้ายแดง=admin), วันที่สมัคร

---

## Frontend — Seed Data (ข้อมูลตั้งต้น)

### `src/data/products.js`
- ข้อมูลสินค้าตั้งต้น 12 ชิ้น (ต้นฉบับที่ใช้ในหน้า Home/Products) เช่น
  Lavender Dreams Soap, Citrus Burst Soap, ...
- แต่ละตัว: `id, name, price, category, image, description, stock`
- **จริงๆ แล้วข้อมูลชุดนี้ถูกใช้โดย `src/seed.js` ของ backend** เพื่อเติม
  เข้า MongoDB ครั้งแรก (หน้าเว็บจะอ่านจาก DB ผ่าน API ไม่ได้อ่านจากไฟล์นี้
  โดยตรง)

### `src/data/admin.js`
- บัญชี admin ตั้งต้น: `admin@callalily.com` / `admin123`
  (role: `admin` — เข้าถึงหน้า /admin)

### `src/data/user.js`
- บัญชีลูกค้าตั้งต้น: `suda@example.com` / `hello123`
  (role: `customer`/`user`)

> ทั้งสองบัญชีนี้ถูก `seed.js` นำไปสร้างใน MongoDB พร้อมเข้ารหัสรหัสผ่าน
> ด้วย bcrypt (บทบาทที่แท้จริงคือ "ข้อมูลสำหรับเติมฐานข้อมูล")

---

## Backend — ไฟล์ค่าเริ่มต้น

### `backend/package.json`
- scripts: `dev` (รันด้วย `--watch`), `start`, `seed` (เติมข้อมูล),
  `data:destroy` (ล้างข้อมูล)
- dependencies: `express`, `mongoose`, `bcryptjs` (เข้ารหัสรหัสผ่าน),
  `jsonwebtoken` (สร้าง/ตรวจ JWT), `cors`, `stripe` (ชำระเงิน)

---

## Backend — src/server.js และ src/config/db.js

### `src/server.js`
- เรียก `connectDB()` ต่อ MongoDB ก่อน
- เปิด port จาก env `PORT` (default 5000)
- **CORS**: ถ้าตั้ง `CORS_ORIGIN` ไว้ (คั่นด้วย `,`) จะอนุญาตเฉพาะ origin
  เหล่านั้น; origin ที่ไม่อนุญาต → 403; ถ้าไม่ตั้งค่า → อนุญาตทั้งหมด
  (สำหรับ dev)
- `express.json()` เพื่ออ่าน body ที่เป็น JSON
- mount routes:
  - `/api/products` → productsRoute
  - `/api/users` → usersRoute
  - `/api/orders` → ordersRoute
  - `/api/payments` → paymentsRoute (Stripe checkout)
  - `/api/chat` → chatRoute (Calla AI)
- เส้นทาง `/` → ตอบ `{ message: "Calla Lilly API is running" }`
  (ไว้เช็คว่าเซิร์ฟเวอร์ยังทำงานอยู่)

### `src/config/db.js`
- `mongoose.connect(process.env.MONGODB_URI)` เชื่อม MongoDB
- สำเร็จ → log host ที่ต่อ; ล้มเหลว → log error แล้ว `process.exit(1)`
  (กระบวนการปิด เพื่อให้ผู้ให้บริการเด้งแสดงว่า server ตาย)

---

## Backend — Models (โครงสร้างข้อมูลใน MongoDB)

### `src/models/Product.js`
- Schema สินค้า: `name` (จำเป็น), `price` (ตัวเลข, ไม่ต่ำกว่า 0),
  `category`, `image`, `description` (default ""), `stock` (default 0)
- `timestamps: true` → MongoDB เติม `createdAt`/`updatedAt` ให้อัตโนมัติ

### `src/models/User.js`
- Schema ผู้ใช้: `name`, `email` (**unique** + lowercase), `password`
  (เก็บเป็น hash ไม่ใช่รหัสจริง), `role` (จำกัด `user`/`admin`,
  default `user`), `phone/address/city/zip`, `memberSince`

### `src/models/order.model.js`
- Schema ออเดอร์:
  - `orderId` (รหัสออเดอร์แบบ human-readable เช่น `CL-123456`, unique)
  - `userId` (อ้างอิง User, default null)
  - `items[]` — แต่ละชิ้น: `productId` (อ้างอิง Product), `id`,
    `name`, `price`, `quantity` (min 1), `image`
  - `customer` — `fullName, email, phone, address, city, zip`
  - `payment` (default "COD" / `"card"` เมื่อจ่ายด้วย Stripe)
  - `stripeSessionId` (default null — เก็บ Stripe session id กันออเดอร์ซ้ำ)
  - `shippingAddress` (ข้อมูลจัดส่งจาก Stripe session)
  - `subtotal, shipping, discount, total`
  - `status` — enum `pending/confirmed/processing/shipped/delivered/cancelled`
    (default "processing")

---

## Backend — Middlewares (ตรวจสิทธิ์)

### `src/middlewares/authMiddleware.js`
- `generateToken(user)` — สร้าง **JWT** ด้วย `jsonwebtoken` โดยลงชื่อ
  `{ id, role }` ด้วย `JWT_SECRET` (จาก env; ถ้าไม่ตั้งใน dev จะใช้ค่า
  default) และหมดอายุใน 7 วัน
- `requireAuth(req, res, next)` — ตรวจว่า header มี
  `Authorization: Bearer <token>`:
  - ไม่มี token → 401
  - ตรวจ `jwt.verify()` และโหลด user จาก DB; ผ่าน → ใส่ `req.user`
    (id/role/email) แล้ว `next()`
  - token ผิด/หมดอายุ/user ถูกลบ → 401
- `requireAdmin` — เรียก `requireAuth` แล้วเช็ค `req.user.role === 'admin'`;
  ไม่ใช่ admin → 403

---

## Backend — Routes (เส้นทาง API)

### `src/routes/productsRoute.js`
- `GET /api/products` — รายการสินค้าทั้งหมด (ไม่ต้องล็อกอิน)
- `POST /api/products` — เพิ่มสินค้า (**admin เท่านั้น**)
- `GET /api/products/:id` — สินค้ารายตัว
- `PUT /api/products/:id` — แก้สินค้า (**admin**)
- `DELETE /api/products/:id` — ลบสินค้า (**admin**)

### `src/routes/userRoute.js`
- `POST /api/users/login`, `POST /api/users/register` — ไม่ต้องล็อกอิน
- จากนี้ไป `router.use(requireAuth)` → เส้นทางด้านล่างต้องมี token
- `GET /api/users` — รายชื่อผู้ใช้ทั้งหมด (**admin**)
- `PUT /api/users/:id/profile` — แก้โปรไฟล์ (เจ้าของหรือ admin)
- `PUT /api/users/:id/password` — เปลี่ยนรหัส (เจ้าของหรือ admin)

### `src/routes/orderRoute.js`
- `POST /api/orders` — สร้างออเดอร์ (ต้องล็อกอิน)
- `GET /api/orders` — ออเดอร์ทั้งหมด (**admin**)
- `GET /api/orders/mine` — ออเดอร์ของตัวเอง (ต้องล็อกอิน)
- `GET /api/orders/track?q=...` — เช็คสถานะ (ไม่ต้องล็อกอิน)
- `GET /api/orders/:id` — ดูออเดอร์ตาม id (เจ้าของหรือ admin)
- `PATCH /api/orders/:id` — เปลี่ยนสถานะ (**admin**)

### `src/routes/paymentRoute.js`
- `POST /api/payments/checkout` — สร้าง Stripe Checkout Session
  (**ต้องล็อกอิน**) → คืน `{ url }` สำหรับ redirect ไปหน้า Stripe

### `src/routes/chatRoute.js`
- `POST /api/chat` — ส่งข้อความไปยัง Gemini (Calla AI)
  รับ `{ messages: [{ role, text }] }` → คืน `{ reply }` (ไม่ต้องล็อกอิน)

---

## Backend — Controllers (ลอจิกของ API)

### `src/controllers/productController.js`
- `toProductJSON(p)` — แปลงเอกสาร MongoDB เป็น JSON ที่ส่งให้หน้าเว็บ:
  `_id` → `id` (เป็น string), รวมทั้ง name/price/category/image/
  description/stock/createdAt
- `getProducts` — อ่านสินค้าทั้งหมดจาก `Product.find({})`
- `getProductById` — หาตาม id; ไม่พบ → 404
- `createProduct` — ตรวจ name/price/category/image ครบไหม
  (ยังขาด → 400) แล้วสร้างใหม่ (ราคา/stock บังคับเป็นตัวเลข `|| 0`)
- `updateProduct` — หาสินค้า; ถ้ามีให้แก้เฉพาะ field ที่ส่งมา แล้ว `save()`
- `deleteProduct` — `findByIdAndDelete`; ไม่พบ → 404

### `src/controllers/userController.js`
- `toUserJSON(u)` — ตัด `password` ทิ้งก่อนส่งกลับ (สำคัญด้านความปลอดภัย)
- `loginUser` — หา user จาก email (trim + lowercase); ตรวจรหัสด้วย
  `bcrypt.compare`; ผ่าน → ส่ง `token` + ข้อมูลผู้ใช้
- `registerUser` — ตรวจชื่อ/email ครบ, รหัส 8–14 ตัว, email ไม่ซ้ำ
  (ซ้ำ → 400) แล้วสร้าง user ด้วย `bcrypt.hash(password, 10)`
- `getUsers` — ผู้ใช้ทั้งหมด (**admin**)
- `updateUserProfile` — เช็คว่าเป็นเจ้าของหรือ admin; ตรวจ email ไม่ชน
  กับคนอื่น; แก้เฉพาะ field ที่ส่งมา
- `changePassword` — ตรวจรหัสปัจจุบันก่อน (ผิด → 400), รหัสใหม่ต้อง
  8–14 ตัว แล้ว hash ใหม่

### `src/controllers/orderController.js`
- `toOrderJSON(order)` — แปลงเป็น JSON: `_id` → `orderId`,
  `createdAt` → date, status ปรับตัวแรกเป็นตัวพิมพ์ใหญ่
- `getOrders` — ออเดอร์ทั้งหมดเรียงใหม่ล่าสุดก่อน (**admin**)
- `getMyOrders` — ออเดอร์ที่ `userId` ตรงกับ user นั้น หรือ email ของ
  ผู้ซื้อตรงกับ email user ที่ล็อกอิน
- `trackOrder` — ค้นหาด้วย `orderId` หรือ `customer.email`; ไม่พบ → 404
- `getOrderById` — ลองหาโดย `_id` ก่อน ถ้าไม่ใช่ก็หาโดย `orderId`;
  ต้องเป็นเจ้าของหรือ admin เท่านั้น (ไม่ใช่ → 403)
- `createOrder` — สร้างออเดอร์ โดยตรวจ:
  - ตะกร้าไม่ว่าง, ข้อมูลลูกค้ามีครบ
  - ทุก item: ตรวจว่าสินค้ามีจริง และ `stock` พอ (ไม่พอ → 400 พร้อมบอก
    ชื่อ + จำนวนที่มี)
  - ถ้ามี `sessionId` (จ่ายด้วย Stripe): ตรวจว่า `stripeSessionId` ยัง
    ไม่เคยถูกใช้สร้างออเดอร์ (กันซ้ำตอน refresh) → retrieve session กับ
    Stripe → ต้อง `payment_status === 'paid'` และ `total` ตรงกับยอดจริง
    ที่จ่าย (ไม่รับยอดจาก client ตรงๆ) → ใช้ข้อมูลจัดส่งจาก
    `session.metadata.shipping`
  - สร้าง `orderId` เป็น `CL-` + 6 หลักสุดท้ายของ timestamp (หรือใช้
    ที่ส่งมา) และ `payment = "card"` ถ้ามี `sessionId`
  - ตัด stock: `Product.findByIdAndUpdate($inc: { stock: -qty })`
- `updateOrderStatus` — หาออเดอร์แล้วเปลี่ยน `status` (บันทึกเป็น
  lowercase) แล้วตอบ JSON กลับ

---

## Backend — src/seed.js (เติมข้อมูลตั้งต้น)

สคริปต์เรียกด้วย `npm run seed` เพื่อเติมข้อมูลเริ่มต้นลง MongoDB:
- `clean()` — ลบสินค้า/ผู้ใช้/ออเดอร์ทั้งหมดใน DB
- `seed()`:
  - อ่านสินค้าจาก `frontend/src/data/products.js` (12 ชิ้น) แล้ว
    `insertMany` (ตัด `id` เก่า `{ id, ...rest }` ให้ MongoDB สร้าง `_id`)
  - อ่านบัญชีเริ่มต้นจาก `data/user.js` + `data/admin.js` แล้ว hash
    รหัสผ่านด้วย bcrypt (10 rounds) ก่อน insert
  - log จำนวนสินค้าและผู้ใช้ที่ insert
- `destroy()` — เรียก `clean()` สำหรับล้างข้อมูล (คล้าย factory reset)
- รันโดยตรงเมื่อพิมพ์ node: เชื่อม `MONGODB_URI` → ถ้ามี `--destroy`
  จะล้างข้อมูล ถ้าไม่มีจะเติมข้อมูล

---

## Backend — Payments (Stripe Checkout)

### `src/controllers/paymentController.js`
- init Stripe instance ด้วย `process.env.STRIPE_SECRET_KEY`
- `createCheckoutSession(req, res)`:
  - ตรวจว่าตะกร้าไม่ว่าง + ข้อมูลจัดส่งครบ (fullName/email) → ไม่งั้น 400
  - ทุก item: หาสินค้าใน DB ด้วย `new mongoose.Types.ObjectId(item.id)` →
    ตรวจว่ามีสินค้าจริง และ `stock` พอ (`product.stock >= quantity`)
  - แปลงเป็น `line_items` สำหรับ Stripe: currency `thb`,
    `unit_amount = Math.round(price * 100)` (บาท → satang), รูปสินค้า
  - คำนวณยอด: `subtotal + shipping − discount`; ต้อง > 0
  - `stripe.checkout.sessions.create({ mode: 'payment', customer_email,
    metadata: { shipping: JSON.stringify(customer) }, success_url:
    "<CLIENT_URL>/payment-success?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: "<CLIENT_URL>/checkout" })`
  - คืน `{ url }` → ฝั่ง frontend `window.location.href = url`

### `src/routes/paymentRoute.js`
- `POST /checkout` → เรียก `createCheckoutSession` โดยผ่าน
  `requireAuth` ก่อน (ต้องล็อกอิน)

---

## Backend — Calla AI (Chat + Gemini)

### `src/controllers/chatController.js`
- ตัวแปร: `GEMINI_API_URL` (generativelanguage.googleapis.com),
  `DEFAULT_MODEL = "gemini-3.8-flash"` (หรือ `GEMINI_MODEL` จาก env),
  เก็บประวัติได้สูงสุด 16 ข้อความ, ข้อความละ ≤ 2000 ตัว
- `buildSystemInstruction(products)` — สร้าง system instruction ที่บอก
  Gemini ว่าเป็น "Calla AI" ผู้ช่วยของร้าน ตอบเป็นภาษาไทย ใช้ข้อมูลสินค้าจริง
  (ชื่อ/หมวด/ราคา/สต็อก/คำอธิบาย) ที่อ่านจาก MongoDB เป็นแหล่งเดียว
- `getClientMessages(messages)` — กรองประวัติให้เริ่มต้นด้วยฝั่งผู้ใช้
  + ตัดเกิน max length + เปลี่ยนเป็น `{ role, parts: [{ text }] }`
- `chat(req, res)`:
  - ไม่มี `GEMINI_API_KEY` → 503 (แจ้งว่า config ไม่ครบ)
  - ตรวจว่ามีข้อความผู้ใช้จริง → ไม่งั้น 400
  - ตั้ง timeout 25 วินาที (`AbortController`)
  - อ่านสินค้าจริงจาก DB (แค่ field ที่จำเป็น ไม่แก้สต็อก)
  - `fetch` ไป `/{model}:generateContent` พร้อม `x-goog-api-key`
    (key อยู่ฝั่ง backend เท่านั้น ไม่เข้า browser)
  - ตัดคำตอบจาก `candidates[0].content.parts` → คืน `{ reply }`
  - จัดการ error: 429 (AI ยุ่ง → แนะนำลองใหม่), 502/504 (บริการล่ม)

### `src/routes/chatRoute.js`
- `POST /api/chat` → เรียก `chat` (ไม่ต้องล็อกอิน)

> การตั้งค่า: `GEMINI_API_KEY`, `GEMINI_MODEL` (จาก [Google AI Studio](https://aistudio.google.com/app/apikey)) ใส่ใน `backend/.env`

---

## สรุปสาเหตุที่เคยเจอ "No products found" (บทเรียนจากบั๊ก)

- หน้าสินค้าอ่านข้อมูลจาก `useProducts()` → `api.getProducts()` →
  `GET {BASE}/products`
- ถ้า `BASE` ผิด (เช่น `https://backend.onrender.com` โดยลืม `/api` หรือ
  ใส่ `/` ต่อท้าย) คำขอจะไป `GET /products` ซึ่ง backend มีแค่
  `/api/products` → ตอบ 404
- `ProductContext` จับ error แล้ว `setProducts([])` → ทุกหน้าเห็นว่า
  ไม่มีสินค้า (หน้า Home ที่ดูปกติเพราะมี hero ภาพ static)
- **การแก้:** ตั้ง `VITE_API_URL` ให้ถูกต้อง (`.../api`) และเพิ่ม
  `normalizeBase()` ใน `api.js` เพื่อกันความผิดพลาดนี้ไม่ให้เกิดอีก +
  redeploy frontend

---

*เอกสารนี้เขียนจากโค้ดจริงในโปรเจกต์ (อัปเดตล่าสุดตามโค้ดปัจจุบัน —
  ครอบคลุม Stripe Payments + Calla AI Chat และไฟล์/โครงสร้างที่เพิ่มเข้ามาใน Sprint 3)*