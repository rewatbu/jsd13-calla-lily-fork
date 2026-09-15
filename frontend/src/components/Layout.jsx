// ============================================================
// Layout: โครงหน้าเว็บทุกหน้า
// - รวม Navbar (ด้านบน) + พื้นที่ของแต่ละหน้า (Outlet) + Footer
// - พื้นหลังเป็นสีครีมอ่อน #FFE5DE ตามธีม Calla Lily
// ============================================================
import { Outlet} from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-[#FFE5DE]">
        <Outlet />
      </main>
      <Footer/>
    </div>
  );
}