// ============================================================
// Checkout: หน้ายืนยันการสั่งซื้อ (/checkout)
// - กรอกข้อมูลจัดส่ง (ดึงจากโปรไฟล์ผู้ใช้มาอัตโนมัติ) + เลือกวิธีชำระเงิน
// - ส่งคำสั่งซื้อ: ตรวจสอบ stock → บันทึกลง calla-orders
//   → ลด stock สินค้า → ล้างตะกร้า → ไปหน้า Order Success
// ============================================================
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";

const inputClass =
  "w-full border border-[#E8BFB5] rounded-lg px-4 py-3 bg-white text-[#3A2B25] focus:outline-none focus:border-[#9B151D] focus:ring-2 focus:ring-[#9B151D]/15";

const labelClass = "block text-sm font-semibold text-[#3A2B25] mb-1";

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    address: currentUser?.address || "",
    city: currentUser?.city || "",
    zip: currentUser?.zip || "",
    payment: "COD",
  });
  const [error, setError] = useState(null);

  // ต้องล็อกอินก่อนสั่งซื้อ (backend ใช้ JWT ยืนยันตัวตน)
  if (!currentUser) {
    return (
      <div className="max-w-6xl mx-auto p-10 text-center">
        <h1 className="text-3xl font-bold text-[#3A2B25] mb-4">
          Please log in to checkout
        </h1>
        <p className="text-[#9A6A5E] mb-8">
          You need an account to place an order.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/login">
            <Button name="Log In" />
          </Link>
          <Link to="/register">
            <Button name="Register" />
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-10 text-center">
        <h1 className="text-3xl font-bold text-[#3A2B25] mb-4">
          Nothing to check out
        </h1>
        <p className="text-[#9A6A5E] mb-8">
          Your cart is empty. Add some products first.
        </p>
        <Link to="/product">
          <Button name="Browse Products" />
        </Link>
      </div>
    );
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  // ส่งคำสั่งซื้อเมื่อกด "Place Order"
  //  1) ส่งข้อมูลคำสั่งซื้อไปยัง backend เพื่อบันทึกลง MongoDB
  //     (backend ตรวจสอบ stock พร้อมลด stock ให้อัตโนมัติ)
  //  2) ถ้าสำเร็จ => ล้างตะกร้าแล้วไปหน้า order-success พร้อมส่งข้อมูลออเดอร์ต่อ
  //  3) ถ้า stock ไม่พอ => แสดงข้อความข้อผิดพลาดจาก backend
  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

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
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
          zip: form.zip,
        },
        payment: form.payment,
        subtotal: totalPrice,
        shipping: 0,
        discount: 0,
        total: totalPrice,
      });

      clearCart();
      navigate("/order-success", { replace: true, state: { order } });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10">
      <h1 className="text-3xl font-bold text-[#3A2B25] mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {error && (
          <p className="lg:col-span-3 bg-red-100 text-red-800 rounded-xl px-5 py-3 font-semibold">
            {error}
          </p>
        )}
        <div className="lg:col-span-2 bg-white border border-[#E8BFB5] rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-[#3A2B25] mb-5">
            Shipping Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fullName" className={labelClass}>
                Full name
              </label>
              <input
                id="fullName"
                name="fullName"
                required
                value={form.fullName}
                onChange={handleChange}
                className={inputClass}
                placeholder="Suda Wong"
              />
            </div>
            <div>
              <label htmlFor="email" className={labelClass}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className={inputClass}
                placeholder="suda@example.com"
              />
            </div>
            <div>
              <label htmlFor="phone" className={labelClass}>
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                required
                value={form.phone}
                onChange={handleChange}
                className={inputClass}
                placeholder="08x-xxx-xxxx"
              />
            </div>
            <div>
              <label htmlFor="city" className={labelClass}>
                City
              </label>
              <input
                id="city"
                name="city"
                required
                value={form.city}
                onChange={handleChange}
                className={inputClass}
                placeholder="Bangkok"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="address" className={labelClass}>
                Address
              </label>
              <input
                id="address"
                name="address"
                required
                value={form.address}
                onChange={handleChange}
                className={inputClass}
                placeholder="123 Sukhumvit Rd, Wattana"
              />
            </div>
            <div>
              <label htmlFor="zip" className={labelClass}>
                Postal code
              </label>
              <input
                id="zip"
                name="zip"
                required
                value={form.zip}
                onChange={handleChange}
                className={inputClass}
                placeholder="10110"
              />
            </div>
            <div>
              <label htmlFor="payment" className={labelClass}>
                Payment method
              </label>
              <select
                id="payment"
                name="payment"
                value={form.payment}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="COD">Cash on Delivery</option>
                <option value="transfer">Bank Transfer</option>
                <option value="card">Credit / Debit Card</option>
              </select>
            </div>
          </div>
        </div>

        <aside className="bg-white border border-[#E8BFB5] rounded-xl p-6 h-fit shadow-md">
          <h2 className="text-xl font-bold text-[#3A2B25] mb-4">Your Order</h2>
          <ul className="max-h-64 overflow-auto flex flex-col gap-3 mb-4">
            {cart.map((item) => (
              <li key={item.id} className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-12 w-12 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#3A2B25] truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-[#9A6A5E]">
                    ฿{item.price.toFixed(2)} × {item.quantity}
                  </p>
                </div>
                <span className="text-sm font-bold text-[#3A2B25]">
                  ฿{(item.price * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between py-2 text-[#9A6A5E]">
            <span>Subtotal</span>
            <span className="font-semibold text-[#3A2B25]">
              ฿{totalPrice.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between py-2 text-[#9A6A5E]">
            <span>Shipping</span>
            <span className="font-semibold text-green-700">Free</span>
          </div>
          <div className="flex justify-between py-3 border-t border-[#E8BFB5] mt-2">
            <span className="font-bold text-[#3A2B25]">Total</span>
            <span className="font-bold text-[#9B151D]">
              ฿{totalPrice.toFixed(2)}
            </span>
          </div>
          <Button
            name="Place Order"
            type="submit"
            className="w-full mt-5"
          />
          <Link
            to="/cart"
            className="block mt-3 text-center font-semibold text-[#9B151D] hover:underline"
          >
            Back to cart
          </Link>
        </aside>
      </form>
    </div>
  );
}