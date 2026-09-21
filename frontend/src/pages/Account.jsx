// ============================================================
// Account: หน้า "My Account" (/account)
// - ถ้ายังไม่ล็อกอิน => แสดงปุ่ม Log In / Register
// - ถ้าล็อกอินแล้ว => แสดงโปรไฟล์, ที่อยู่, เปลี่ยนรหัสผ่าน,
//   และประวัติออเดอร์ของบัญชีนี้
// ============================================================
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import { api, sortOrdersNewest } from "../api";

// สีสไตล์ของแต่ละสถานะออเดอร์ (ใช้แสดงป้ายในประวัติออเดอร์)
const statusStyles = {
  Processing: "bg-background text-primary",
  Shipped: "bg-border text-primary-hover",
  Delivered: "bg-success-soft text-success-strong",
};

const inputClass =
  "w-full border border-border rounded-lg px-4 py-3 bg-surface text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15";
const labelClass = "block text-sm font-semibold text-foreground mb-1";

export default function Account() {
  const { currentUser, logout, updateProfile, changePassword } = useAuth();
  const navigate = useNavigate();

  const [editingProfile, setEditingProfile] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
  });
  const [profileMsg, setProfileMsg] = useState(null);
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwMsg, setPwMsg] = useState(null);
  const [orders, setOrders] = useState([]);

  // โหลดประวัติออเดอร์ของบัญชีนี้จาก MongoDB (backend: /api/orders/mine)
  useEffect(() => {
    if (!currentUser) return;
    api
      .getMyOrders()
      .then((list) => setOrders(sortOrdersNewest(list)))
      .catch(() => setOrders([]));
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto p-10 text-center">
        <h1 className="text-3xl font-bold text-foreground mb-4">My Account</h1>
        <p className="text-muted-foreground mb-8">
          Log in to view your profile and order history.
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

  // ตัวย่อชื่อ (ชื่อย่อ 2 ตัวแรก) ไว้แสดงเป็นรูปวงกลมโปรไฟล์
  const initials = currentUser.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const memberSince = new Date(currentUser.memberSince).toLocaleDateString(
    "en-GB",
    {
      month: "long",
      year: "numeric",
    }
  );

  // เริ่มแก้โปรไฟล์: โหลดข้อมูลปัจจุบันลงฟอร์ม แล้วเปิดโหมดแก้ไข
  function startEditProfile() {
    setForm({
      name: currentUser.name,
      email: currentUser.email,
      phone: currentUser.phone,
      address: currentUser.address,
      city: currentUser.city,
      zip: currentUser.zip,
    });
    setProfileMsg(null);
    setEditingProfile(true);
  }

  // ยกเลิกการแก้ไข (ปิดฟอร์มโดยไม่บันทึก)
  function cancelEditProfile() {
    setProfileMsg(null);
    setEditingProfile(false);
  }

  // บันทึกโปรไฟล์: เรียก updateProfile(); แสดงผลสำเร็จ/ผิดพลาด
  async function saveProfile(e) {
    e.preventDefault();
    const result = await updateProfile(form);
    if (result.error) {
      setProfileMsg({ type: "error", text: result.error });
      return;
    }
    setProfileMsg({ type: "success", text: "Profile updated" });
    setEditingProfile(false);
  }

  function handlePwChange(e) {
    setPwForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  // บันทึกรหัสผ่านใหม่: ตรวจรหัสยืนยันตรงกันก่อน แล้วเรียก changePassword()
  async function savePassword(e) {
    e.preventDefault();
    setPwMsg(null);

    if (pwForm.next !== pwForm.confirm) {
      setPwMsg({ type: "error", text: "Passwords do not match" });
      return;
    }
    const result = await changePassword(pwForm.current, pwForm.next);
    if (result.error) {
      setPwMsg({ type: "error", text: result.error });
      return;
    }
    setPwMsg({ type: "success", text: "Password changed" });
    setPwForm({ current: "", next: "", confirm: "" });
  }

  const msgClass = (msg) =>
    `rounded-lg px-4 py-3 mb-4 text-sm font-semibold ${
      msg.type === "success"
        ? "bg-success-soft text-success-strong"
        : "bg-background text-primary"
    }`;

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">My Account</h1>
        <button
          type="button"
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="font-semibold text-primary hover:underline cursor-pointer"
        >
          Logout
        </button>
      </div>

      {/* Profile card */}
      <div className="bg-surface rounded-2xl border border-border p-6 shadow-md flex flex-col sm:flex-row sm:items-center gap-6">
        <div className="h-20 w-20 rounded-full bg-primary text-surface flex items-center justify-center text-2xl font-bold flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-foreground">{currentUser.name}</h2>
          <p className="text-muted-foreground">{currentUser.email}</p>
          <p className="text-muted-foreground">{currentUser.phone}</p>
        </div>
        <div className="sm:text-right">
          <p className="text-sm text-muted-foreground">Member since</p>
          <p className="font-semibold text-foreground">{memberSince}</p>
          <span className="inline-block mt-1 text-xs font-semibold uppercase tracking-wide bg-background text-primary px-3 py-1 rounded-full">
            {currentUser.role}
          </span>
        </div>
      </div>

      {/* Contact & Shipping Address */}
      <div className="bg-surface rounded-2xl border border-border p-6 shadow-md mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-foreground">
            Contact &amp; Shipping Address
          </h3>
          {!editingProfile && (
            <button
              type="button"
              onClick={startEditProfile}
              className="text-sm font-semibold text-primary hover:underline cursor-pointer"
            >
              Edit
            </button>
          )}
        </div>

        {profileMsg && <p className={msgClass(profileMsg)}>{profileMsg.text}</p>}

        {editingProfile ? (
          <form onSubmit={saveProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className={labelClass}>
                Full name
              </label>
              <input
                id="name"
                name="name"
                required
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className={inputClass}
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
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                className={inputClass}
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
                onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                className={inputClass}
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
                onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
                className={inputClass}
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
                onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
                className={inputClass}
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
                onChange={(e) => setForm((prev) => ({ ...prev, zip: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <Button name="Save Changes" type="submit" />
              <button
                type="button"
                onClick={cancelEditProfile}
                className="inline-flex items-center justify-center min-h-11 px-5 py-3 rounded-xl border-2 border-primary text-primary font-semibold hover:bg-primary/10 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="text-muted-foreground">
            <p className="font-medium text-foreground">
              {currentUser.name} · {currentUser.email}
            </p>
            <p>{currentUser.phone}</p>
            <p className="mt-2">{currentUser.address}</p>
            <p>
              {currentUser.city} {currentUser.zip}, Thailand
            </p>
          </div>
        )}
      </div>

      {/* Change Password */}
      <div className="bg-surface rounded-2xl border border-border p-6 shadow-md mt-6">
        <h3 className="font-bold text-foreground mb-4">Change Password</h3>
        <p className="text-sm text-muted-foreground -mt-2 mb-4">
          Password must be 8-14 characters.
        </p>

        {pwMsg && <p className={msgClass(pwMsg)}>{pwMsg.text}</p>}

        <form onSubmit={savePassword} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="pw-current" className={labelClass}>
              Current password
            </label>
            <input
              id="pw-current"
              name="current"
              type="password"
              required
              value={pwForm.current}
              onChange={handlePwChange}
              placeholder="••••••••"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="pw-next" className={labelClass}>
              New password
            </label>
            <input
              id="pw-next"
              name="next"
              type="password"
              required
              value={pwForm.next}
              onChange={handlePwChange}
              placeholder="8-14 characters"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="pw-confirm" className={labelClass}>
              Confirm new password
            </label>
            <input
              id="pw-confirm"
              name="confirm"
              type="password"
              required
              value={pwForm.confirm}
              onChange={handlePwChange}
              placeholder="••••••••"
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-3 mt-1">
            <Button name="Update Password" type="submit" />
          </div>
        </form>
      </div>

      {/* Order history */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Order History
        </h2>
        {orders.length === 0 ? (
          <div className="bg-surface rounded-2xl border border-border p-10 text-center">
            <p className="font-semibold text-foreground mb-6">No orders yet</p>
            <Link to="/product">
              <Button name="Start Shopping" />
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col gap-4">
            {orders.map((order) => {
              const items = order.items.reduce((sum, i) => sum + i.quantity, 0);
              const date = new Date(order.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });
              const status = statusStyles[order.status] || statusStyles.Processing;

              return (
                <li
                  key={order.id}
                  className="bg-surface rounded-2xl border border-border p-6 shadow-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                      <p className="font-semibold text-foreground">
                        Order ID:{" "}
                        <span className="text-primary">{order.id}</span>
                      </p>
                      <p className="text-sm text-muted-foreground">{date}</p>
                      <Link
                        to={`/tracking?id=${order.id}`}
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        Track →
                      </Link>
                    </div>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full w-fit ${status}`}
                    >
                      {order.status || "Processing"}
                    </span>
                  </div>

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
                    <span>
                      {items} item{items !== 1 ? "s" : ""}
                    </span>
                    <span className="text-primary">
                      ฿{order.total.toFixed(2)}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}