import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import productsRoute from './routes/productsRoute.js';
import usersRoute from './routes/userRoute.js';
import ordersRoute from './routes/orderRoute.js';
import paymentsRoute from './routes/paymentRoute.js';

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// อนุญาตเฉพาะ origin ที่ระบุใน CORS_ORIGIN (คั่นด้วยจุลภาค) เช่น
// CORS_ORIGIN=https://calla-lily.vercel.app,http://localhost:5173
// ถ้าไม่ได้ตั้งค่าไว้ (เช่น ตอน dev) จะเปิดให้ทุก origin ชั่วคราว
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((s) => s.trim())
  : null;
if (!allowedOrigins) {
  console.warn('CORS_ORIGIN not set — allowing all origins (dev only)');
}

// ปฏิเสธ origin ที่ไม่ได้รับอนุญาตด้วย 403 (อ่านง่ายกว่า error 500 เริ่มต้น)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins && !allowedOrigins.includes(origin)) {
    res.status(403).json({ message: 'Origin not allowed by CORS' });
    return;
  }
  next();
});
app.use(cors({ origin: allowedOrigins || true }));
app.use(express.json());

app.use('/api/products', productsRoute);
app.use('/api/users', usersRoute);
app.use('/api/orders', ordersRoute);
app.use('/api/payments', paymentsRoute);

app.get('/', (req, res) => {
  res.json({ message: 'Calla Lilly API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}😀`);
});