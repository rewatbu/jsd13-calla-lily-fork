// ============================================================
// Dashboard: หน้าแรกของ Admin
// - แสดงสถิติ: รายได้รวม, จำนวนออเดอร์, จำนวนสินค้า, จำนวนลูกค้า
// - และตารางออเดอร์ล่าสุด 5 รายการ
// ============================================================
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../../context/ProductContext";
import { api, sortOrdersNewest } from "../../api";

// สีป้ายสถานะออเดอร์ (ใช้ร่วมกับหน้า Admin Orders)
const statusStyles = {
  Processing: "bg-[#FFE5DE] text-[#9B151D]",
  Shipped: "bg-[#E8BFB5] text-[#7A1016]",
  Delivered: "bg-green-100 text-green-800",
};

// อ่านออเดอร์ทั้งหมดจาก MongoDB (ใช้ใน Dashboard)
function useOrders() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    api
      .getOrders()
      .then((list) => setOrders(sortOrdersNewest(list)))
      .catch(() => setOrders([]));
  }, []);
  return orders;
}

// อ่านรายชื่อผู้ใช้ทั้งหมดจาก MongoDB (สำหรับนับลูกค้า)
function useUsers() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    api
      .getUsers()
      .then(setUsers)
      .catch(() => setUsers([]));
  }, []);
  return users;
}

const cardClass =
  "bg-white rounded-2xl border border-[#E8BFB5] shadow-md p-6";

export default function Dashboard() {
  const { products } = useProducts();
  const orders = useOrders();
  const users = useUsers();

  // รายได้รวม = ผลรวมยอดทั้งหมดของทุกออเดอร์
  const revenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  // นับออเดอร์ที่ยังอยู่ในสถานะ Processing
  const processing = orders.filter(
    (o) => (o.status || "Processing") === "Processing"
  ).length;
  // ออเดอร์ล่าสุด 5 รายการ (ข้อมูลเรียงใหม่ก่อนอยู่เสมอ → slice หน้า)
  const recent = orders.slice(0, 5);

  const stats = [
    { label: "Total Revenue", value: `฿${revenue.toFixed(2)}` },
    { label: "Orders", value: String(orders.length), note: `${processing} processing` },
    { label: "Products", value: String(products.length) },
    { label: "Customers", value: String(users.length) },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className={cardClass}>
            <p className="text-sm font-semibold text-[#9A6A5E]">{s.label}</p>
            <p className="text-2xl font-bold text-[#3A2B25] mt-1">{s.value}</p>
            {s.note && (
              <p className="text-xs text-[#9B151D] mt-1 font-semibold">
                {s.note}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className={cardClass}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#3A2B25]">Recent Orders</h2>
          <Link
            to="/admin/orders"
            className="text-sm font-semibold text-[#9B151D] hover:underline"
          >
            View all →
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="text-[#9A6A5E]">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#9A6A5E] border-b border-[#E8BFB5]">
                  <th className="py-2 pr-4 font-semibold">Order</th>
                  <th className="py-2 pr-4 font-semibold">Customer</th>
                  <th className="py-2 pr-4 font-semibold">Total</th>
                  <th className="py-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((o) => (
                  <tr key={o.id} className="border-b border-[#FFE5DE]">
                    <td className="py-3 pr-4 font-semibold text-[#9B151D]">
                      {o.id}
                    </td>
                    <td className="py-3 pr-4 text-[#3A2B25]">
                      {o.customer?.fullName || "—"}
                    </td>
                    <td className="py-3 pr-4 font-semibold text-[#3A2B25]">
                      ฿{(o.total || 0).toFixed(2)}
                    </td>
                    <td className="py-3">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          statusStyles[o.status] || statusStyles.Processing
                        }`}
                      >
                        {o.status || "Processing"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}