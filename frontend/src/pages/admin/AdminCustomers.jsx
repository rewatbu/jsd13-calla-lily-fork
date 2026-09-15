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
    <div className="bg-white rounded-2xl border border-[#E8BFB5] shadow-md p-6">
      <h2 className="text-lg font-bold text-[#3A2B25] mb-4">
        All Customers ({users.length})
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[#9A6A5E] border-b border-[#E8BFB5]">
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
                <tr key={u.id} className="border-b border-[#FFE5DE]">
                  <td className="py-3 pr-4 font-semibold text-[#3A2B25]">
                    {u.name}
                  </td>
                  <td className="py-3 pr-4 text-[#9A6A5E]">{u.email}</td>
                  <td className="py-3 pr-4 text-[#3A2B25]">{u.phone}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide ${
                        isAdmin
                          ? "bg-[#9B151D] text-white"
                          : "bg-[#FFE5DE] text-[#9B151D]"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 text-[#9A6A5E]">{date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}