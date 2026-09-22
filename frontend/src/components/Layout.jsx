// ============================================================
// Layout: โครงหน้าเว็บทุกหน้า
// - รวม Navbar (ด้านบน) + พื้นที่ของแต่ละหน้า (Outlet) + Footer
// - พื้นหลังใช้ token `background` ของธีม Calla Lily
// ============================================================
import { Outlet} from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AIChat from "./AIChat";
export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-background">
        <Outlet />
      </main>
      <Footer/>
      <AIChat />
    </div>
  );
}
