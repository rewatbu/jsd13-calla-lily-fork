# Build Order — Calla Lily E-commerce

> ลำดับขั้นตอนที่เหมาะสำหรับการสร้างโปรเจกต์นี้ตั้งแต่ต้น
> (React SPA + Express/MongoDB)

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

11. Layout/Navbar/Footer + shared components (Button, ProductCard, CartItem)
12. Home → Products (filter/search/pagination) → ProductDetail
13. Cart → Checkout → OrderSuccess
14. Login/Register → Account → Tracking

## Phase 5 — Admin

15. `AdminLayout` + guard
16. Dashboard → AdminProducts (CRUD) → AdminOrders → AdminCustomers

## Phase 6 — Polish

17. Loading/empty states, error toasts, responsive design
18. Docs + README, lint/build pass, deploy (Render backend, Vercel frontend)

---

## หลักการสำคัญ

- **Backend API ต้องทำงานได้ครบและ verified ก่อนเริ่ม frontend**
- แต่ละ feature ควรทำแบบ **vertical (model → route → page)** ให้ครบ end-to-end
  แทนที่จะทำแบบ layer-by-layer (เช่น ทำ products ทั้งระบบก่อน แล้วค่อยทำ auth)