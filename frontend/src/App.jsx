// ============================================================
// App.jsx: จุดรวมทุกหน้าของเว็บ
// - สร้าง Router โดยทุกหน้าใส่ใน Layout (Navbar + Footer ร่วมกัน)
// - หน้า Admin ทั้ง 4 อยู่ใต้ AdminLayout ซึ่งทำหน้าที่ตรวจสิทธิ์ admin
// - ลำดับ Provider: Auth > Cart > Product (ทุก Context ครอบทั้งแอป)
// ============================================================
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { ProductProvider } from "./context/ProductContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Product from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import PaymentSuccess from "./pages/PaymentSuccess";
import Account from "./pages/Account";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Tracking from "./pages/Tracking";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCustomers from "./pages/admin/AdminCustomers";

// กำหนดโครงเส้นทาง (เส้นทางทั้งหมดภายใต้ Layout หลัก)
// - / = Home, /product, /product/:id, /cart, /checkout,
//   /order-success, /account, /login, /register, /tracking
// - /admin, /admin/products, /admin/orders, /admin/customers
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <p className="text-lg font-bold text-primary">Page not found</p>
      </div>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: "product", element: <Product /> },
      { path: "product/:id", element: <ProductDetail /> },
      { path: "cart", element: <Cart /> },
      { path: "checkout", element: <Checkout /> },
      { path: "payment-success", element: <PaymentSuccess /> },
      { path: "order-success", element: <OrderSuccess /> },
      { path: "account", element: <Account /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "tracking", element: <Tracking /> },
      {
        path: "admin",
        element: <AdminLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "products", element: <AdminProducts /> },
          { path: "orders", element: <AdminOrders /> },
          { path: "customers", element: <AdminCustomers /> },
        ],
      },
    ],
  },
]);

// Root component
// ============================================================
// ต้องใช้ Provider ครอบ RouterProvider ทำไม?
// - Context ทำหน้าที่เก็บ state ร่วม (ตะกร้า, บัญชี, สินค้า)
//   และเปิดให้ทุกหน้าที่อยู่ภายในเรียกใช้ได้ผ่าน Hook
//   เช่น useCart(), useAuth(), useProducts()
// - RouterProvider คือตัววาดทุกหน้าของเว็บ ดังนั้นถ้าใส่ไว้
//   ด้านนอก จะไม่มีหน้าไหนเข้าถึงข้อมูลได้เลย
//
// แต่ละ Provider มาจากฟีเจอร์ที่เพิ่มเข้ามา:
//   AuthProvider   => ระบบล็อกอิน/สมัคร/บัญชี, การตรวจสิทธิ์ admin
//   CartProvider   => ตะกร้า, จำนวน/ราคารวม, เพิ่ม-ลด-ลบสินค้า
//   ProductProvider=> สินค้าที่แอดมินแก้ไขได้ + แชร์กับหน้าร้าน
//
// ในตอนแรกที่เว็บมีแค่หน้า Product หน้าละ ไม่มี state ร่วม
// จึงมีเพียง <RouterProvider router={router} /> เท่านั้น
// ============================================================
export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ProductProvider>
          <RouterProvider router={router} />
        </ProductProvider>
      </CartProvider>
    </AuthProvider>
  );
}