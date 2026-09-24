// ============================================================
// Navbar: แถบเมนูด้านบน (ติดอยู่ด้านบนเสมอ)
// - ซ้าย: โลโก้ + Home + Product (+ Admin ถ้าเป็นแอดมิน)
// - ขวา: คำทักทาย Logout, ไอคอนบัญชี, ตะกร้าพร้อมจำนวนสินค้า
// ============================================================
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { itemCount } = useCart();
  const { currentUser, logout } = useAuth();

  const navLinkClass =
    "px-3 sm:px-6 h-full flex items-center font-semibold text-primary hover:bg-primary/10 transition-colors duration-300";

  // 
  return (
  <div className="relative flex w-full h-18 bg-surface justify-between items-center sticky top-0 z-50 shadow-md">
    {/* Left */}
    <div className="flex items-center h-full">
      <Link
        to="/"
        className="p-4 font-bold text-lg tracking-wide text-primary"
      >
        Calla Lily
      </Link>

      <Link to="/" className={navLinkClass}>
        Home
      </Link>

      <Link to="/product" className={navLinkClass}>
        Product
      </Link>

      {currentUser?.role === "admin" && (
        <Link to="/admin" className={navLinkClass}>
          Admin
        </Link>
      )}
    </div>

    {/* Centered logo */}
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <img
        src="/logo-calla-lily2.png"
        alt="logo"
        className="h-16 w-16 object-cover rounded"
      />
    </div>

    {/* Right */}
    <div className="flex items-center h-full">
      {currentUser && (
        <>
          <span className="hidden sm:inline text-sm font-semibold text-primary mr-2">
            Hi, {currentUser.name.split(" ")[0]}
          </span>

          <button
            type="button"
            onClick={logout}
            className="h-11 px-3 flex items-center rounded-lg text-sm font-semibold text-primary hover:bg-primary/10 transition-colors duration-300 cursor-pointer"
          >
            Logout
          </button>
        </>
      )}

      <Link
        to={currentUser ? "/account" : "/login"}
        aria-label="My Account"
        className="h-11 w-11 flex items-center justify-center rounded-lg text-primary hover:bg-primary/10 transition-colors duration-300"
      >
        {/* account SVG */}
      </Link>

      <Link
        to="/cart"
        aria-label="Shopping cart"
        className="relative mr-3 sm:mr-6 h-11 w-11 flex items-center justify-center rounded-lg text-primary hover:bg-primary/10 transition-colors duration-300"
      >
        {/* cart SVG */}
      </Link>
    </div>
  </div>
);

}