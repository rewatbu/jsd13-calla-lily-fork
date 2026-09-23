# Build Order — Calla Lily E-commerce

> ลำดับขั้นตอนที่เหมาะสำหรับการสร้างโปรเจกต์นี้ตั้งแต่ต้น
> (React SPA + Express/MongoDB + Stripe Payments + AI Chat)

---

## Phase 1 — Foundations

1. Set up repo + monorepo structure (`frontend/`, `backend/`), `.gitignore`, `.env.example` files
2. Scaffold backend: `npm init`, Express server, `config/db.js`, CORS, basic error handling
3. Scaffold frontend: Vite + React + Tailwind + Router, ESLint config, `vercel.json`

## Phase 2 — Backend core (API-first)

4. Define Mongoose models: `Product`, `User` (bcrypt hashing), `Order` (order.model.js)
5. Build product CRUD routes/controllers (public read, admin write)
6. Build auth: register/login → JWT, `authMiddleware.js` (`requireAuth`, `requireAdmin`)
7. Build order routes/controllers (create with stock deduction, tracking, status)
8. `seed.js` for sample data; verify all endpoints with curl/Postman

## Phase 3 — Frontend data layer

9. `api.js` (fetch wrapper with token + 401 handling)
10. Contexts: `AuthContext`, `ProductContext`, `CartContext` (localStorage)

## Phase 4 — Customer pages (bottom-up)

11. Layout/Navbar/Footer + shared components (Button, ProductCard, CartItem, AIChat)
12. Home → Products (filter/search/pagination) → ProductDetail
13. Cart → Checkout (Stripe hosted redirect) → PaymentSuccess → OrderSuccess
14. Login/Register → Account → Tracking

## Phase 5 — Admin

15. `AdminLayout` + guard
16. Dashboard → AdminProducts (CRUD) → AdminOrders → AdminCustomers

## Phase 6 — Payments (Stripe) + AI Chat

17. **Stripe payments**
    - Add `stripe` dependency + `STRIPE_SECRET_KEY` / `CLIENT_URL` in `backend/.env`
    - `paymentController.js` (`createCheckoutSession`): validate stock, unit_amount
      as satang (THB), build `line_items`, `metadata.shipping`, success/cancel URL
    - `paymentRoute.js` → `POST /api/payments/checkout` (ต้องล็อกอิน)
    - Order confirm: `orderController.createOrder` รับ `sessionId` → verify กับ Stripe
      (`payment_status === 'paid'` + ยอดตรงกัน) → สร้างออเดอร์ + ลด stock
      → เก็บ `stripeSessionId` กันออเดอร์ซ้ำตอน refresh
    - Frontend: `api.createCheckoutSession()` + `PaymentSuccess.jsx` (ยืนยัน → สร้างออเดอร์
      → ล้างตะกร้า → `/order-success`)

18. **Calla AI chat**
    - Add `GEMINI_API_KEY` + `GEMINI_MODEL=gemini-3.8-flash` in `backend/.env`
    - `chatController.js` (`chat`): อ่านสินค้าจริงจาก DB → สร้าง system instruction
      → ส่ง `contents` ไป Gemini `:generateContent` → คืน `{ reply }`
      (key อยู่ฝั่ง backend เท่านั้น)
    - `chatRoute.js` → `POST /api/chat`
    - Frontend: `api.chat()` + `AIChat.jsx` ปุ่มลอย "AI ช่วยแนะนำ" (อยู่ใน Layout)

## Phase 7 — Polish

19. Loading/empty states, error toasts, responsive design
20. Docs + README, lint/build pass, deploy (Render backend, Vercel frontend)

---

## หลักการสำคัญ

- **Backend API ต้องทำงานได้ครบและ verified ก่อนเริ่ม frontend**
- แต่ละ feature ควรทำแบบ **vertical (model → route → page)** ให้ครบ end-to-end
  แทนที่จะทำแบบ layer-by-layer (เช่น ทำ products ทั้งระบบก่อน แล้วค่อยทำ auth)
- **ราคา/สต็อกต้องมาจาก DB เสมอ** — อย่าเชื่อยอดเงินที่ client ส่งมา
  (`paymentController` / `createOrder` ตรวจ stock + เปรียบเทียบยอดกับ Stripe อีกครั้ง)