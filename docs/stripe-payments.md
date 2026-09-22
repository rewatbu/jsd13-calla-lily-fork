# Stripe Payments — Calla Lily E-commerce

> แผนการเพิ่มระบบชำระเงินด้วย Stripe Checkout ให้โปรเจกต์
> (React SPA + Express/MongoDB — ปัจจุบันรองรับแค่ COD / Bank Transfer / การ์ดแบบจำลองเท่านั้น)

---

## 1. ภาพรวม

ปัจจุบันหน้า Checkout มีตัวเลือก payment = `"COD"` / `"transfer"` / `"card"` แต่ `"card"` ยังเป็นเพียง
ตัวเลือกที่ส่งค่าเข้า database เท่านั้น ยังไม่มีการชำระเงินจริง

การเพิ่ม Stripe จะแบ่งเป็น 2 รูปแบบ (เลือกอย่างใดอย่างหนึ่ง หรือทำทั้งคู่):

| รูปแบบ | หน้า Stripe เอง (Hosted Checkout) | ฝังในหน้าเรา (Embedded Elements) |
|--------|-----------------------------------|---------------------------------|
| จุดเปลี่ยนจากหน้า Checkout | เปิดไปยังหน้า Stripe ใหม่ | แสดงฟอร์มบัตรในหน้า Checkout เลย |
| ใช้ `@stripe/react-stripe-js` | ไม่จำเป็น | จำเป็น |
| จำนวนโค้ดที่ต้องเพิ่ม | น้อย | มากกว่า |
| ควบคุมหน้าตา/โลโก้/ธีม | จำกัด (ตั้งค่าผ่าน Stripe Dashboard) | ควบคุมได้ (className, สี, font) |
| เหมาะกับ | ทำไว ใช้ของจริง ปลอดภัยสูง | ต้องการ UX ไม่เด้งออกหน้า |

> โครงสร้างของ middleware/controller/webhook ทั้งสองรูปแบบเหมือนกัน
> ต่างกันแค่ **วิธี redirect** และ **หน้า UI** เท่านั้น

---

## 2. ไฟล์ที่จะเพิ่ม (Backend)

```
backend/src/
├── config/
│   └── stripe.js                  → init Stripe instance
├── controllers/
│   └── stripeController.js        → create-checkout session + webhook handler
├── routes/
│   └── stripeRoute.js             → /api/payments/*
└── middlewares/
    └── stripeWebhook.js           → verify สายเซ็นต์ webhook
```

### dependencies ใหม่

```
backend: stripe
```

### .env.example เพิ่ม

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 3. Backend — ขั้นตอนที่ต้องทำ

### 3.1 server.js

- ต้องมีเส้นทาง `/api/payments/webhook` ที่ใช้ **raw body** (ไม่ผ่าน `express.json()`) เพราะ
  Stripe ต้องการ body ดิบเพื่อตรวจสายเซ็นต์:

```js
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }), stripeWebhookRoute);
app.use(express.json()); // ต้องอยู่ต่อจาก webhook route
app.use('/api/payments', stripeRoute);
```

### 3.2 sort ก่อนสร้าง session — ราคาต้องมาจาก DB ไม่ใช่ client

```js
// stripeController.js (ตัวอย่างหัวใจสำคัญ)
const session = await stripe.checkout.sessions.create({
  mode: 'payment',
  success_url: `${CLIENT_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${CLIENT_URL}/checkout?canceled=true`,
  customer_email: customer.email,
  line_items: orderItems.map((it) => ({
    quantity: it.quantity,
    price_data: {
      currency: 'thb',
      unit_amount: Math.round(it.price * 100), // ฿ → satang
      product_data: { name: it.name, images: [it.image].filter(Boolean) },
    },
  })),
  metadata: { userId: req.user.id },
});
```

### 3.3 Webhook — จุดที่ออเดอร์ถูกสร้างจริง

Stripe เป็น "source of truth": ออเดอร์ + ลด stock **ต้องเกิดที่ webhook**
ไม่ใช่ตอนสร้าง session (กันกรณีลูกค้าเปิดแล้วไม่จ่าย)

```js
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    // - ยืนยัน payment_status === 'paid'
    // - สร้าง Order ด้วยข้อมูลจาก session (metadata.userId + line items จาก Stripe)
    // - ลด stock ทีละ item
  }
  res.json({ received: true });
});
```

> ถ้าต้องการแสดง "pending order" ก่อนจ่ายเงิน อาจสร้างออเดอร์ตอน submit
> แล้วอัปเดตใน webhook แทน — แต่แบบที่แนะนำคือสร้างใน webhook เลย
> แล้วหน้า OrderSuccess ไป query เอาออเดอร์อีกครั้ง

### 3.4 Order model (order.model.js) — field ที่เพิ่ม

```
stripeSessionId : String
paymentStatus   : String  ("pending" | "paid" | "refunded" | "failed")
```

- เพิ่ม enum ค่า `"stripe"` ในฟิลด์ `payment`
- `toOrderJSON()` ใน orderController.js ต้อง return `paymentStatus` และ `stripeSessionId` ด้วย

### 3.5 Endpoints ใหม่

```
POST  /api/payments/create-checkout   # สร้าง Checkout Session (ต้องล็อกอิน)
POST  /api/payments/webhook           # Stripe ส่ง event กลับมา (public)
POST  /api/payments/refund            # คืนเงิน (admin) — optional
```

---

## 4. Backend — รูปแบบ Hosted vs Embedded ต่างกันตรงไหน

| จุด | Hosted Checkout | Embedded Elements |
|-----|-----------------|-------------------|
| `create-checkout` | return `{ url }` แล้วฝั่ง frontend ทำ `window.location = url` | return `{ clientSecret }` แล้วฝั่ง frontend ใช้ `Elements` render ฟอร์ม |
| webhook handler | เหมือนกัน | เหมือนกัน (session ก็ถูก complete เมื่อจ่ายสำเร็จ) |
| success return URL | `success_url` (หน้า Stripe เปิดให้กลับ) | ใช้ `onComplete` ใน Elements หรือ redirect ด้วยตัวเอง |

---

## 5. ไฟล์ที่จะเพิ่ม/แก้ (Frontend — ทั้งสองรูปแบบ)

### เพิ่ม

```
frontend/.env.example  →  VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
frontend/package.json  →  @stripe/stripe-js
                          (+ @stripe/react-stripe-js เฉพาะ Embedded)
frontend/src/pages/PaymentCancel.jsx   → หน้า "การชำระเงินถูกยกเลิก" (optional, hosted)
```

### แก้

```
frontend/src/api.js                    → เพิ่ม createCheckoutSession() / getCheckoutSession()
frontend/src/pages/Checkout.jsx        → เพิ่ม option "Pay with Card" + เรียก create-checkout
frontend/src/pages/OrderSuccess.jsx    → รับ session_id จาก ?session_id= แล้ว fetch ออเดอร์จริง
frontend/src/pages/admin/AdminOrders.jsx → แสดง paymentStatus / วิธีชำระเงิน
frontend/src/pages/Account.jsx         → แสดง paymentStatus ในประวัติออเดอร์
```

### 5.1 หน้า Checkout — Hosted (โค้ดเพิ่มเล็กน้อย)

```js
// ตอนกด Place Order ถ้า form.payment === "card"
const { url } = await api.createCheckoutSession({ items, customer, total });
window.location = url; // ไปหน้า Stripe
// อย่า clearCart() ตรงนี้ — รอ webhook / OrderSuccess ได้ผลลัพธ์ก่อน
```

### 5.2 หน้า Checkout — Embedded Elements (โหมด card ในหน้า)

```jsx
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// 1) submit ฟอร์ม → POST /api/payments/create-checkout → ได้ clientSecret
// 2) render <Elements stripe={stripePromise} options={{ clientSecret }}>
//      <PaymentElement />  ← ฟอร์มบัตรลงในหน้าเราเลย
//      <button onClick={() => stripe.confirmPayment({ elements, redirect: 'if_required' })} />
// 3) หลัง confirm สำเร็จ → clearCart() → navigate("/order-success", { state: { order } })
```

**ข้อดีของ Embedded:**

- ลูกค้าไม่เด้งออกไปนอกเว็บ — UX ต่อเนื่อง
- ควบคุมสไตล์ฟอร์ม (font, color, radius) ให้เข้ากับ Tailwind theme ของเว็บ
- ตรวจ error (billing ผิด, ลิมิตบัตร) ที่หน้าเดียว

**ข้อเสีย:**

- ต้องรอ confirmPayment ฝั่ง client ให้จบ → การันตี stock ได้น้อยกว่า
  (ควรส่ง webhook ไปด้วย — webhook ยังคงเป็นตัวยืนยันสุดท้าย)
- ต้องจัดการ `clientSecret` + หลาย lifecycle state (loading / confirm / error)
- เพิ่ม dependency `@stripe/react-stripe-js` + ขนาด bundle

---

## 6. ขั้นตอนการเทสต์ (Local)

```bash
# 1. ติดตั้ง CLI
npm i -g stripe-cli
stripe login
stripe listen --forward-to localhost:5000/api/payments/webhook
# → จะได้ whsec_... เอาไปใส่ STRIPE_WEBHOOK_SECRET ใน .env

# 2. ใช้ test keys (sk_test_/pk_test_) จาก Stripe Dashboard

# 3. ทดสอบการ์ด
# 4242 4242 4242 4242  → สำเร็จ
# 4000 0000 0000 0002   → decline (ทดสอบกรณีล้มเหลว)
```

---

## 7. สิ่งที่ต้องระวัง

1. **ราคาต้องมาจาก DB เสมอ** — อย่ารับ `total` จากลูกค้ามาเป็นยอดจ่ายโดยตรง
2. **ห้ามเก็บข้อมูลบัตรในฝั่งเรา** — ใช้ Stripe Elements/Checkout เท่านั้น (PCI DSS)
3. **webhook ต้องอยู่ใน URL HTTPS** — ถ้า deploy บน Render/PaaS ต้องเปิด public URL
4. **อย่าลด stock ตอนสร้าง session** — ลดตอน webhook `checkout.session.completed` เท่านั้น
   (ลูกค้าจำนวนมากเปิดหน้าแล้วไม่จ่าย จะทำให้สินค้าขาด stock หลอกๆ)
5. **production keys ต้องเปลี่ยน** — ใช้ `sk_test_` ตอน dev, `sk_live_` + webhook secret ที่ตั้งเอง
6. **currency** — เนื้อหาใช้ ฿ (THB) → `unit_amount` คิดเป็น satang (`฿100.00` = `10000`)
7. **success_url ต้องรองรับตอนลูกค้าปิดหน้า** — ถ้าจ่ายแล้วแต่ redirect ไม่ทัน ให้ OrderSuccess
   สามารถ query ออเดอร์ใหม่ด้วย `session_id` ได้ (ไม่พึ่งแต่ `location.state`)

---

## 8. ตารางเปรียบเทียบเวิร์กโฟลว์สรุป

| ขั้นตอน | Hosted Checkout | Embedded Elements |
|---------|-----------------|-------------------|
| 1. สร้าง session | POST create-checkout → `{ url }` | POST create-checkout → `{ clientSecret }` |
| 2. แสดงฟอร์ม | redirect ไปหน้า Stripe | `<PaymentElement/>` ใน Checkout.jsx |
| 3. จ่ายเงินสำเร็จ | Stripe redirect กลับ `success_url` | `confirmPayment()` แล้ว navigate เอง |
| 4. ยืนยันคำสั่งซื้อ | webhook สร้างออเดอร์ + ลด stock | webhook สร้างออเดอร์ + ลด stock (เหมือนกัน) |
| 5. หน้า OrderSuccess | parse `?session_id=` → fetch ออเดอร์ | ได้ order จาก state โดยตรง |