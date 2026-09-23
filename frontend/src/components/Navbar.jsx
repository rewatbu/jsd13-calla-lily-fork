// ============================================================
// Navbar: แถบเมนูด้านบน (ติดอยู่ด้านบนเสมอ)
// - ซ้าย: โลโก้ + Home + Product + About (+ Admin ถ้าเป็นแอดมิน)
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

  return (
    <div className="flex w-full h-16 bg-surface justify-between items-center sticky top-0 z-50 shadow-md">
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
        <Link to="/about" className={navLinkClass}>
          About
        </Link>
        {currentUser?.role === "admin" && (
          <Link to="/admin" className={navLinkClass}>
            Admin
          </Link>
        )}
      </div>
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
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
        </Link>
        <Link
          to="/cart"
          aria-label="Shopping cart"
          className="relative mr-3 sm:mr-6 h-11 w-11 flex items-center justify-center rounded-lg text-primary hover:bg-primary/10 transition-colors duration-300"
        >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
          />
        </svg>
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-primary text-surface text-xs font-bold flex items-center justify-center">
            {itemCount}
          </span>
        )}
        </Link>
      </div>
    </div>
  );
}