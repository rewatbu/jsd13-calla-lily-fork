// ============================================================
// AdminOrders: จัดการออเดอร์
// - แสดงออเดอร์ทั้งหมด พร้อมกรอกกรอก select เพื่อเปลี่ยนสถานะ
//   (Processing → Shipped → Delivered) และบันทึกลง localStorage
//   ทันที ทำให้หน้า Tracking ของลูกค้าเปลี่ยนตาม
// ============================================================
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, sortOrdersNewest } from "../../api";

// สีป้ายสถานะตามขั้นตอนการจัดส่ง
const statusStyles = {
  Processing: "bg-background text-primary",
  Shipped: "bg-border text-primary-hover",
  Delivered: "bg-success-soft text-success-strong",
};

const STATUSES = ["Processing", "Shipped", "Delivered"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  // โหลดออเดอร์ทั้งหมดจาก MongoDB (backend: /api/orders)
  useEffect(() => {
    api
      .getOrders()
      .then((list) => setOrders(sortOrdersNewest(list)))
      .catch(() => setOrders([]));
  }, []);

  // เปลี่ยนสถานะของออเดอร์ตาม id แล้วบันทึกลง MongoDB (backend)
  async function updateStatus(id, status) {
    try {
      const updated = await api.updateOrderStatus(id, status);
      setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
    } catch {
      const list = await api.getOrders().catch(() => []);
      setOrders(sortOrdersNewest(list));
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-surface rounded-2xl border border-border shadow-md p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">
          All Orders ({orders.length})
        </h2>
        {orders.length === 0 ? (
          <p className="text-muted-foreground">No orders placed yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => {
              const items = order.items.reduce((s, i) => s + i.quantity, 0);
              const date = new Date(order.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });

              return (
                <article
                  key={order.id}
                  className="border border-background rounded-xl p-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">
                        <span className="text-primary">{order.id}</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.customer?.fullName || "—"} ·{" "}
                        {order.customer?.email || "—"} · {date}
                      </p>
                      <p className="text-sm font-semibold text-foreground mt-1">
                        ฿{(order.total || 0).toFixed(2)} · {items} item
                        {items !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          statusStyles[order.status] || statusStyles.Processing
                        }`}
                      >
                        {order.status || "Processing"}
                      </span>
                      <select
                        value={order.status || "Processing"}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="border border-border rounded-lg px-3 py-1.5 text-sm bg-surface text-foreground focus:outline-none focus:border-primary"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <Link
                        to={`/tracking?id=${order.id}`}
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        Track →
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}