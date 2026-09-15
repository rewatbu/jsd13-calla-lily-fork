// ============================================================
// Register: หน้าสมัครสมาชิก (/register)
// - กรอกข้อมูลส่วนตัว + ตั้งรหัสผ่าน (ต้อง 8-14 ตัว และพิมพ์ยืนยันซ้ำ)
// - ตรวจสอบซ้ำก่อน (รหัสไม่ตรง / รหัสอ่อน) แล้วเรียก register()
// - สำเร็จ => เข้าสู่ระบบและพาไปหน้า /account
// ============================================================
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useAuth, validatePassword } from "../context/AuthContext";

const inputClass =
  "w-full border border-[#E8BFB5] rounded-lg px-4 py-3 bg-white text-[#3A2B25] focus:outline-none focus:border-[#9B151D] focus:ring-2 focus:ring-[#9B151D]/15";
const labelClass = "block text-sm font-semibold text-[#3A2B25] mb-1";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  // ส่งฟอร์มสมัครสมาชิก
  //  1) ตรวจรหัสยืนยันตรงกัน 2) ตรวจความยาวรหัสผ่าน
  //  3) เรียก register(); ถ้า email ซ้ำ => แสดง error
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }

    const pwError = validatePassword(form.password);
    if (pwError) {
      setError(pwError);
      return;
    }

    const result = await register({
      name: form.name,
      email: form.email,
      phone: form.phone,
      address: form.address,
      city: form.city,
      zip: form.zip,
      password: form.password,
    });

    if (result.error) {
      setError(result.error);
      return;
    }
    navigate("/account");
  }

  return (
    <div className="max-w-lg mx-auto p-6 md:p-10">
      <div className="bg-white rounded-2xl border border-[#E8BFB5] p-8 shadow-md">
        <h1 className="text-2xl font-bold text-[#3A2B25] mb-1">
          Create your account
        </h1>
        <p className="text-[#9A6A5E] mb-6">
          Register to track orders and check out faster
        </p>

        {error && (
          <p className="bg-[#FFE5DE] text-[#9B151D] rounded-lg px-4 py-3 mb-5 text-sm font-semibold">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label htmlFor="name" className={labelClass}>
              Full name
            </label>
            <input
              id="name"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Suda Wong"
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
              onChange={handleChange}
              placeholder="suda@example.com"
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
              onChange={handleChange}
              placeholder="081-234-5678"
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
              onChange={handleChange}
              placeholder="123 Sukhumvit Rd, Wattana"
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
              onChange={handleChange}
              placeholder="Bangkok"
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
              onChange={handleChange}
              placeholder="10110"
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
          <div>
            <label htmlFor="confirm" className={labelClass}>
              Confirm password
            </label>
            <input
              id="confirm"
              name="confirm"
              type="password"
              required
              value={form.confirm}
              onChange={handleChange}
              placeholder="••••••••"
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <Button name="Create Account" type="submit" className="w-full mt-2" />
          </div>
        </form>

        <p className="mt-5 text-center text-sm text-[#9A6A5E]">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-[#9B151D] hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}