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
  Processing: "bg-background text-primary",
  Shipped: "bg-border text-primary-hover",
  Delivered: "bg-success-soft text-success-strong",
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
  "bg-surface rounded-2xl border border-border shadow-md p-6";

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
            <p className="text-sm font-semibold text-muted-foreground">{s.label}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
            {s.note && (
              <p className="text-xs text-primary mt-1 font-semibold">
                {s.note}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className={cardClass}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">Recent Orders</h2>
          <Link
            to="/admin/orders"
            className="text-sm font-semibold text-primary hover:underline"
          >
            View all →
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="text-muted-foreground">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b border-border">
                  <th className="py-2 pr-4 font-semibold">Order</th>
                  <th className="py-2 pr-4 font-semibold">Customer</th>
                  <th className="py-2 pr-4 font-semibold">Total</th>
                  <th className="py-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((o) => (
                  <tr key={o.id} className="border-b border-background">
                    <td className="py-3 pr-4 font-semibold text-primary">
                      {o.id}
                    </td>
                    <td className="py-3 pr-4 text-foreground">
                      {o.customer?.fullName || "—"}
                    </td>
                    <td className="py-3 pr-4 font-semibold text-foreground">
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