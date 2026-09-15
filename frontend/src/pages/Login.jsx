// ============================================================
// Login: หน้าเข้าสู่ระบบ (/login)
// - รับ email + password แล้วเรียก login() จาก AuthContext
// - สำเร็จ => ไปหน้า /account, ล้มเหลว => แสดงข้อความผิดพลาด
// ============================================================
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";

const inputClass =
  "w-full border border-[#E8BFB5] rounded-lg px-4 py-3 bg-white text-[#3A2B25] focus:outline-none focus:border-[#9B151D] focus:ring-2 focus:ring-[#9B151D]/15";
const labelClass = "block text-sm font-semibold text-[#3A2B25] mb-1";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  // อัปเดต state ตาม input ที่เปลี่ยน (name ของ input = ชื่อ field)
  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  // กดปุ่มล็อกอิน: เรียก login(); ถ้า error ให้แสดง, ผ่านก็ไปหน้า Account
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const result = await login(form.email, form.password);
    if (result.error) {
      setError(result.error);
      return;
    }
    navigate("/account");
  }

  return (
    <div className="max-w-md mx-auto p-6 md:p-10">
      <div className="bg-white rounded-2xl border border-[#E8BFB5] p-8 shadow-md">
        <h1 className="text-2xl font-bold text-[#3A2B25] mb-1">Welcome back</h1>
        <p className="text-[#9A6A5E] mb-6">Log in to your account</p>

        {error && (
          <p className="bg-[#FFE5DE] text-[#9B151D] rounded-lg px-4 py-3 mb-5 text-sm font-semibold">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              placeholder="suda@example.com"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="password" className={labelClass}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={inputClass}
            />
          </div>
          <Button name="Log In" type="submit" className="w-full mt-2" />
        </form>

        <p className="mt-5 text-center text-sm text-[#9A6A5E]">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-[#9B151D] hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}