// ============================================================
// Footer: ส่วนท้ายเว็บสีแดง จัดเรียงลิงก์เป็น 3 คอลัมน์
// (Shop / Account / Contact)
// ============================================================
import { Link } from "react-router-dom";

const linkClass =
  "text-[#E8BFB5] hover:text-white transition-colors duration-300";

export default function Footer() {
  return (
    <footer className="flex flex-col w-full h-52 overflow-hidden bg-[#9B151D] text-white">
      <div className="container-top flex flex-row justify-between flex-1">
        <div className="flex flex-col p-5">
          <h3 className="font-semibold mb-2">Shop</h3>
          <Link to="/product" className={linkClass}>
            All Products
          </Link>
          <Link to="/product?cat=Relaxation" className={linkClass}>
            Relaxation
          </Link>
          <Link to="/product?cat=Energizing" className={linkClass}>
            Energizing
          </Link>
          <Link to="/product?cat=Moisturizing" className={linkClass}>
            Moisturizing
          </Link>
        </div>
        <div className="flex flex-col p-5">
          <h3 className="font-semibold mb-2">Account</h3>
          <Link to="/account" className={linkClass}>
            My Account
          </Link>
          <Link to="/cart" className={linkClass}>
            My Cart
          </Link>
          <Link to="/checkout" className={linkClass}>
            Checkout
          </Link>
          <Link to="/tracking" className={linkClass}>
            Track Order
          </Link>
        </div>
        <div className="flex flex-col p-5">
          <h3 className="font-semibold mb-2">Contact Us</h3>
          <p className="text-[#E8BFB5]">Email: hello@callalily.com</p>
          <p className="text-[#E8BFB5]">Phone: 02-123-4567</p>
          <p className="text-[#E8BFB5]">Bangkok, Thailand</p>
        </div>
      </div>
      <div className="container-butom mt-auto self-center m-4">
        <p>&copy; 2026 Calla Lily. All rights reserved.</p>
      </div>
    </footer>
  );
}