// ============================================================
// AdminLayout: โครงหน้า Admin ทั้งหมด (แอบว่างเป็น guard)
// - ตรวจว่า currentUser เป็น admin หรือไม่; ไม่ใช่ => ย้ายไป /login
// - ซ้าย: เมนู sidebar (Dashboard, Products, Orders, Customers)
//   ขวา: เนื้อหาของแต่ละหน้าย่อย (Outlet)
// ============================================================
import { NavLink, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// รายการเมนูใน sidebar ของ Admin
const navItems = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/customers", label: "Customers" },
];

export default function AdminLayout() {
  const { currentUser } = useAuth();

  // ตรวจสิทธิ์: ถ้าไม่ได้ล็อกอินเป็น admin ให้ redirect ไปหน้า Login
  if (!currentUser || currentUser.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10">
      <h1 className="text-3xl font-bold text-foreground mb-6">
        Admin Panel
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 items-start">
        <nav className="flex md:flex-col gap-2 flex-wrap">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl font-semibold text-sm transition-colors duration-200 ${
                  isActive
                    ? "bg-primary text-surface"
                    : "bg-surface text-primary border border-border hover:bg-primary/10"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <Outlet />
      </div>
    </div>
  );
}