// ============================================================
// AuthContext: จัดการระบบบัญชีผู้ใช้ (สมัคร/เข้าสู่ระบบ/ออกจากระบบ)
// - ข้อมูลผู้ใช้ถูกจัดเก็บใน MongoDB (คอลเลกชัน users) ผ่าน API
//   และเก็บผู้ใช้ที่ล็อกอินอยู่ไว้ใน localStorage (calla-current-user)
// - มีฟังก์ชัน: login, register, logout, updateProfile,
//   changePassword และ validatePassword
// - บทบาท (role): "user" = ผู้ใช้ทั่วไป, "admin" = ผู้ดูแลระบบ
// ============================================================
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api";

const CURRENT_KEY = "calla-current-user";
const TOKEN_KEY = "calla-token";

// ดึงผู้ใช้ที่เข้าสู่ระบบอยู่ (จาก localStorage) ถ้าไม่มีให้คืน null
function loadCurrent() {
  try {
    const raw = localStorage.getItem(CURRENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ดึง JWT จาก localStorage (ถ้าไม่มีให้คืน null)
function loadToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

const AuthContext = createContext(null);

// Provider หลักของระบบ auth: เก็บ user + JWT ไว้ใน state
// - useEffect ทำหน้าที่บันทึกผู้ใช้ปัจจุบันและ token ลง localStorage อัตโนมัติ
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(loadCurrent);
  const [token, setToken] = useState(loadToken);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(CURRENT_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(CURRENT_KEY);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      if (token) localStorage.setItem(TOKEN_KEY, token);
      else localStorage.removeItem(TOKEN_KEY);
    } catch {
      // ignore storage errors
    }
  }, [token]);

  // เมื่อ API ตอบ 401 (token หมดอายุ/ไม่ถูกต้อง) => ออกจากระบบอัตโนมัติ
  useEffect(() => {
    const onUnauthorized = () => {
      setToken(null);
      setCurrentUser(null);
    };
    window.addEventListener("calla:unauthorized", onUnauthorized);
    return () => window.removeEventListener("calla:unauthorized", onUnauthorized);
  }, []);

  // เข้าสู่ระบบ: ส่ง email + password ไปตรวจสอบกับ MongoDB (backend)
  // - สำเร็จ => เก็บ JWT + ข้อมูลผู้ใช้ (เป็น currentUser)
  // - ล้มเหลว => คืน { error }
  async function login(email, password) {
    const result = await api.login(email, password);
    if (result.error) return result;
    setToken(result.token);
    setCurrentUser(result.user);
    return result;
  }

  // สมัครสมาชิกใหม่: ให้ MongoDB ตรวจสอบ email ซ้ำ และสร้างผู้ใช้
  // - role เป็น "user" เสมอ (ผู้ดูแลระบบสร้างจาก seed หรือ DB โดยตรง)
  async function register({ name, email, phone, address, city, zip, password }) {
    const result = await api.register({ name, email, phone, address, city, zip, password });
    if (result.error) return result;
    setToken(result.token);
    setCurrentUser(result.user);
    return result;
  }

  // ออกจากระบบ: ล้าง currentUser + token (รองรับด้วย useEffect ด้านบน)
  function logout() {
    setToken(null);
    setCurrentUser(null);
  }

  // แก้ไขโปรไฟล์ (ชื่อ/อีเมล/เบอร์/ที่อยู่/เมือง/รหัสไปรษณีย์)
  async function updateProfile({ name, email, phone, address, city, zip }) {
    if (!currentUser) return { error: "You must be logged in" };
    const result = await api.updateProfile(currentUser.id, { name, email, phone, address, city, zip });
    if (result.error) return result;
    setCurrentUser(result.user);
    return result;
  }

  // เปลี่ยนรหัสผ่าน: บันทึกลง MongoDB ผ่าน backend
  async function changePassword(currentPassword, newPassword) {
    if (!currentUser) return { error: "You must be logged in" };
    const pwError = validatePassword(newPassword);
    if (pwError) return { error: pwError };
    return api.changePassword(currentUser.id, currentPassword, newPassword);
  }

  return (
    <AuthContext.Provider
      value={{ currentUser, login, register, logout, updateProfile, changePassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ตรวจสอบความแข็งแรงของรหัสผ่าน: ต้องยาว 8-14 ตัวอักษร
// - ผ่าน => คืน null, ไม่ผ่าน => คืนข้อความแสดงข้อผิดพลาด
export function validatePassword(password) {
  if (!password || password.length < 8 || password.length > 14) {
    return "Password must be 8-14 characters";
  }
  return null;
}

// Hook สำหรับเรียกใช้ context จากหน้า/คอมโพเนนต์ต่างๆ
// เช่น const { login, currentUser } = useAuth()
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}