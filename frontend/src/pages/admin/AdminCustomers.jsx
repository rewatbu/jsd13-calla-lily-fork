// ============================================================
// AdminCustomers: ตารางลูกค้าทั้งหมด (อ่านจาก MongoDB ผ่าน /api/users)
// - แสดง ชื่อ, อีเมล, เบอร์, บทบาท (user/admin) และวันที่สมัคร
// ============================================================
import { useEffect, useState } from "react";
import { api } from "../../api";

export default function AdminCustomers() {
  const [users, setUsers] = useState([]);

  // โหลดรายชื่อผู้ใช้ทั้งหมดจาก MongoDB (backend: /api/users)
  useEffect(() => {
    api
      .getUsers()
      .then(setUsers)
      .catch(() => setUsers([]));
  }, []);

  return (
    <div className="bg-surface rounded-2xl border border-border shadow-md p-6">
      <h2 className="text-lg font-bold text-foreground mb-4">
        All Customers ({users.length})
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted-foreground border-b border-border">
              <th className="py-2 pr-4 font-semibold">Name</th>
              <th className="py-2 pr-4 font-semibold">Email</th>
              <th className="py-2 pr-4 font-semibold">Phone</th>
              <th className="py-2 pr-4 font-semibold">Role</th>
              <th className="py-2 font-semibold">Member since</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const date = new Date(u.memberSince).toLocaleDateString("en-GB", {
                month: "short",
                year: "numeric",
              });
              const isAdmin = u.role === "admin";
              return (
                <tr key={u.id} className="border-b border-background">
                  <td className="py-3 pr-4 font-semibold text-foreground">
                    {u.name}
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">{u.email}</td>
                  <td className="py-3 pr-4 text-foreground">{u.phone}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide ${
                        isAdmin
                          ? "bg-primary text-surface"
                          : "bg-background text-primary"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 text-muted-foreground">{date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}