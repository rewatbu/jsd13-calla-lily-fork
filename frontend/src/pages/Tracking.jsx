// ============================================================
// Tracking: หน้าเช็คสถานะสินค้า (/tracking)
// - ค้นหาด้วยเลขคำสั่งซื้อ (CL-xxxxxx) หรือ email ที่สั่ง
// - แสดงขั้นตอน Processing → Shipped → Delivered (มาจาก status
//   ที่แอดมินอัปเดตในหน้า Admin)
// ============================================================
import { Fragment, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Button from "../components/Button";
import { api } from "../api";

// ลำดับสถานะทั้งหมด + แปลงชื่อสถานะเป็นดัชนี (0,1,2)
const STEPS = ["Processing", "Shipped", "Delivered"];
const STEP_INDEX = { Processing: 0, Shipped: 1, Delivered: 2 };

const inputClass =
  "flex-1 border border-border rounded-lg px-4 py-3 bg-surface text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15";

export default function Tracking() {
  const [searchParams, setSearchParams] = useSearchParams();
  const orderId = searchParams.get("id") ?? "";
  const [query, setQuery] = useState(orderId);
  const [result, setResult] = useState({ key: "", order: null, notFound: false });

  // ค้นหาออเดอร์จาก MongoDB ด้วยเลขคำสั่งซื้อหรือ email (backend: /api/orders/track)
  useEffect(() => {
    let active = true;
    if (!orderId) return undefined;
    api
      .trackOrder(orderId)
      .then((o) => {
        if (active) setResult({ key: orderId, order: o, notFound: false });
      })
      .catch(() => {
        if (active) setResult({ key: orderId, order: null, notFound: true });
      });
    return () => {
      active = false;
    };
  }, [orderId]);

  // แสดงผลเฉพาะผลลัพธ์ของ query ปัจจุบัน (กันข้อมูลเก่าตกค้าง)
  const order = result.key === orderId ? result.order : null;
  const notFound = result.key === orderId && result.notFound;

  // อ่านลำดับขั้นปัจจุบันของออเดอร์ (เช่น Shipped => 1)
  const currentStep = order ? STEP_INDEX[order.status] ?? 0 : 0;

  // กดปุ่ม Track: ใส่ค่าที่พิมพ์ลงใน URL เป็น ?id=...
  function handleTrack(e) {
    e.preventDefault();
    const q = query.trim();
    if (q) setSearchParams({ id: q });
  }

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-10">
      <h1 className="text-3xl font-bold text-foreground mb-2">Track Order</h1>
      <p className="text-muted-foreground mb-6">
        Enter your order ID (e.g. CL-123456) or the email you ordered with.
      </p>

      <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Order ID or email"
          className={inputClass}
        />
        <Button name="Track" type="submit" />
      </form>

      {notFound && (
        <div className="bg-surface rounded-2xl border border-border p-8 text-center shadow-md">
          <p className="font-semibold text-foreground">Order not found</p>
          <p className="text-muted-foreground mt-1 text-sm">
            We couldn't find &quot;{orderId}&quot;. Check the ID on your receipt
            or in My Account.
          </p>
        </div>
      )}

      {!order && !notFound && (
        <div className="bg-surface rounded-2xl border border-border p-8 text-center shadow-md">
          <p className="text-muted-foreground">
            Your order status will appear here. You can find your order ID in{" "}
            <Link
              to="/account"
              className="font-semibold text-primary hover:underline"
            >
              My Account
            </Link>
            .
          </p>
        </div>
      )}

      {order && (
        <>
          <div className="bg-surface rounded-2xl border border-border p-6 shadow-md mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <p className="font-bold text-foreground">
                  Order ID:{" "}
                  <span className="text-primary">{order.id}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <span className="text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full bg-background text-primary w-fit">
                {order.status || "Processing"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              {STEPS.map((step, i) => (
                <Fragment key={step}>
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${
                        i <= currentStep
                          ? "bg-primary text-surface"
                          : "bg-surface border-2 border-border text-muted-foreground"
                      }`}
                    >
                      {i < currentStep ? "✓" : i + 1}
                    </div>
                    <span
                      className={`text-sm font-semibold ${
                        i <= currentStep ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 mb-6 rounded ${
                        i < currentStep ? "bg-primary" : "bg-border"
                      }`}
                    />
                  )}
                </Fragment>
              ))}
            </div>
          </div>

          <div className="bg-surface rounded-2xl border border-border p-6 shadow-md">
            <h2 className="text-lg font-bold text-foreground mb-4">
              Order summary
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
                    <p className="text-sm font-semibold text-foreground truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ฿{item.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-foreground">
                    ฿{(item.price * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between pt-3 mt-4 border-t border-border font-bold text-foreground">
              <span>Total</span>
              <span className="text-primary">฿{order.total.toFixed(2)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}