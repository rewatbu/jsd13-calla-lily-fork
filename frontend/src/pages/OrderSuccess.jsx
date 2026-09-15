// ============================================================
// OrderSuccess: หน้าแสดงผลหลังสั่งซื้อสำเร็จ (/order-success)
// - รับข้อมูลออเดอร์จาก location.state (ส่งมาจากหน้า Checkout)
// - แสดงเลขคำสั่งซื้อ, วันที่ และสรุปรายการสินค้า
// ============================================================
import { Link, useLocation } from "react-router-dom";
import Button from "../components/Button";

export default function OrderSuccess() {
  const location = useLocation();
  // อ่านออเดอร์ที่เพิ่งสั่ง (ถ้าไม่มี => แสดง "No order found")
  const order = location.state?.order;

  if (!order) {
    return (
      <div className="max-w-6xl mx-auto p-10 text-center">
        <h1 className="text-3xl font-bold text-[#3A2B25] mb-4">
          No order found
        </h1>
        <p className="text-[#9A6A5E] mb-8">
          Track your latest orders by checking out again, or browse the shop.
        </p>
        <Link to="/product">
          <Button name="Browse Products" />
        </Link>
      </div>
    );
  }

  // ฟอร์แมตวันที่ + นับจำนวนรายการสินค้าทั้งหมด
  const date = new Date(order.date);
  const totalItems = order.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-10">
      <div className="bg-white border border-[#E8BFB5] rounded-2xl p-8 shadow-md text-center">
        <div className="mx-auto h-16 w-16 rounded-full bg-[#FFE5DE] flex items-center justify-center text-3xl text-[#9B151D] font-bold">
          ✓
        </div>
        <h1 className="text-3xl font-bold text-[#3A2B25] mt-4">
          Order confirmed!
        </h1>
        <p className="text-[#9A6A5E] mt-2">
          Thank you, <span className="font-semibold text-[#3A2B25]">{order.customer.fullName}</span>.
          We're preparing your order.
        </p>

        <div className="bg-[#FFE5DE] rounded-xl p-4 mt-6 flex flex-col sm:flex-row justify-between gap-3">
          <p className="font-semibold text-[#3A2B25]">
            Order ID: <span className="text-[#9B151D]">{order.id}</span>
          </p>
          <p className="font-semibold text-[#3A2B25]">
            {date.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="bg-white border border-[#E8BFB5] rounded-2xl p-6 mt-6 shadow-md">
        <h2 className="text-lg font-bold text-[#3A2B25] mb-4">
          Order summary ({totalItems} item{totalItems !== 1 ? "s" : ""})
        </h2>
        <ul className="flex flex-col gap-3">
          {order.items.map((item) => (
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
        <div className="flex justify-between py-2 mt-4 border-t border-[#E8BFB5] text-[#9A6A5E]">
          <span>Shipping</span>
          <span className="font-semibold text-green-700">Free</span>
        </div>
        <div className="flex justify-between pt-2 font-bold text-[#3A2B25]">
          <span>Total</span>
          <span className="text-[#9B151D]">฿{order.total.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link to="/product">
          <Button name="Continue Shopping" />
        </Link>
      </div>
    </div>
  );
}