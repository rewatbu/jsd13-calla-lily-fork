// ============================================================
// CartContext: จัดการตะกร้าสินค้า
// - ข้อมูลถูกบันทึกใน localStorage (key: calla-cart) แบบอัตโนมัติ
// - cart คือ array ของสินค้า โดยแต่ละตัวมีช่อง quantity (จำนวน)
// ============================================================
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const CART_KEY = "calla-cart";

// อ่านตะกร้าจาก localStorage ครั้งแรก (ถ้าเสียหาย/ไม่มีให้เริ่มว่าง)
function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Provider ของตะกร้า: ทุกครั้งที่ cart เปลี่ยนจะ auto-save ลง localStorage
export function CartProvider({ children }) {
  const [cart, setCart] = useState(loadCart);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  // เพิ่มสินค้าลงตะกร้า: ถ้ามีอยู่แล้วให้บวกจำนวน quantity เพิ่ม
  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });
  };

  // ลบสินค้าออกจากตะกร้าโดยใช้ id
  const removeFromCart = (id) =>
    setCart((prev) => prev.filter((item) => item.id !== id));

  // เพิ่มจำนวนสินค้า +1 ในตะกร้า
  const increaseQty = (id) =>
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );

  // ลดจำนวนสินค้า -1 แต่ไม่ต่ำกว่า 1
  const decreaseQty = (id) =>
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );

  // ล้างตะกร้าทั้งหมด (ใช้หลังสั่งซื้อสำเร็จ)
  const clearCart = () => setCart([]);

  // จำนวนสินค้ารวม (นับทุกชิ้นตาม quantity)
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  // ราคารวมทั้งตะกร้า = ผลรวมของ price × quantity
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,
        itemCount,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Hook สำหรับเรียกใช้ context ตะกร้า เช่น const { cart, addToCart } = useCart()
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}