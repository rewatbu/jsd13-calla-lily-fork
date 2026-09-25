// ============================================================
// ProductContext: จัดการข้อมูลสินค้าทั้งหมด (CRUD)
// - ดึงสินค้าจาก MongoDB ผ่าน API (backend: /api/products)
// - ใช้ร่วมกับหน้า Home, Products, ProductDetail และหน้า Admin
// - ฟังก์ชัน: addProduct, updateProduct, deleteProduct
// ============================================================
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api";

const ProductContext = createContext(null);

// Provider สินค้า: โหลดสินค้าจาก MongoDB เมื่อเริ่มแอป
export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // the state to show "Loading..." while waiting the fetched products, not yet set it in useEffect

  useEffect(() => {
    api
      .getProducts()
      .then(setProducts)
      .catch(() => setProducts([]));
  }, []);

  // เพิ่มสินค้าใหม่: ให้ MongoDB สร้าง _id เอง แล้วต่อท้ายลิสต์
  async function addProduct(data) {
    const product = await api.createProduct(data);
    setProducts((prev) => [...prev, product]);
    return product;
  }

  // แก้ไขสินค้าตาม id (เช่น ลด stock หลังขาย, แก้ราคา)
  async function updateProduct(id, data) {
    const product = await api.updateProduct(id, data);
    setProducts((prev) => prev.map((p) => (p.id === id ? product : p)));
    return product;
  }

  // ลบสินค้าตาม id (ใช้ในหน้า Admin)
  async function deleteProduct(id) {
    await api.deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <ProductContext.Provider
      value={{ products, addProduct, updateProduct, deleteProduct }}
    >
      {children}
    </ProductContext.Provider>
  );
}

// Hook สำหรับเรียกใช้สินค้า เช่น const { products } = useProducts()
export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts must be used within a ProductProvider");
  return ctx;
}