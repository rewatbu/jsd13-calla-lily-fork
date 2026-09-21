// ============================================================
// PaymentSuccess: หน้าหลังชำระเงินด้วย Stripe สำเร็จ (/payment-success)
// - Stripe redirect กลับมาพร้อม ?session_id=...
// - หน้านี้ส่ง session_id กลับไปยัง backend เพื่อยืนยันว่า
//   ชำระเงินจริงแล้ว (backend ตรวจกับ Stripe) → สร้างออเดอร์
// - สำเร็จ => ล้างตะกร้า + ไปหน้า order-success
// ============================================================
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Button from "../components/Button";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { cart, totalPrice, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!sessionId || done) return;

    async function confirm() {
      try {
        const order = await api.createOrder({
          userId: currentUser?.id || null,
          items: cart.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          customer: {
            fullName: currentUser?.name || "",
            email: currentUser?.email || "",
            phone: currentUser?.phone || "",
            address: currentUser?.address || "",
            city: currentUser?.city || "",
            zip: currentUser?.zip || "",
          },
          subtotal: totalPrice,
          shipping: 0,
          discount: 0,
          total: totalPrice,
          sessionId,
        });
        clearCart();
        setDone(true);
        navigate("/order-success", { replace: true, state: { order } });
      } catch (err) {
        setError(err.message);
      }
    }
    confirm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, done]);

  if (!sessionId) {
    return (
      <div className="max-w-6xl mx-auto p-10 text-center">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          No payment found
        </h1>
        <p className="text-muted-foreground mb-8">
          We couldn't find your payment. Please try checking out again.
        </p>
        <Link to="/checkout">
          <Button name="Back to Checkout" />
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-10 text-center">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Payment not confirmed
        </h1>
        <p className="text-muted-foreground mb-8">{error}</p>
        <Link to="/checkout">
          <Button name="Back to Checkout" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-10 text-center">
      <h1 className="text-3xl font-bold text-foreground mb-4">
        Processing your payment...
      </h1>
      <p className="text-muted-foreground">
        Please wait while we confirm your order.
      </p>
    </div>
  );
}