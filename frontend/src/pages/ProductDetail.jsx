// ============================================================
// ProductDetail: หน้ารายละเอียดสินค้า (/product/:id)
// - แสดงรูป, ราคา, รายละเอียด, จำนวนคงเหลือ
// - เลือกจำนวนได้ด้วยปุ่ม −/+ หรือพิมพ์ตัวเลขเอง (จำกัดไม่เกิน stock)
// - มีสินค้าแนะนำหมวดหมู่เดียวกัน (Related Products)
// ============================================================
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Button from "../components/Button";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useProducts();
  const product = products.find((p) => p.id === id);
  const { addToCart } = useCart();

  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto p-10 text-center">
        <p className="text-xl font-bold text-primary">Product not found</p>
        <Link to="/product" className="mt-4 inline-block font-semibold text-primary hover:underline">
          ← Back to products
        </Link>
      </div>
    );
  }

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  // เพิ่มสินค้าลงตะกร้า: บังคับจำนวนให้อยู่ในช่วง 1..stock
  // ก่อนเรียก addToCart แล้วรีเซ็ตเป็น 1 พร้อมแสดงข้อความ "เพิ่มแล้ว"
  function handleAddToCart() {
    const max = Math.max(1, product.stock);
    const q = Math.min(Math.max(1, Math.floor(qty) || 1), max);
    addToCart(product, q);
    setAdded(true);
    setQty(1);
  }

  // รับค่าตอนพิมพ์จำนวนในช่อง input
  // - พิมพ์ลบ/ว่าง => เก็บค่าว่างไว้ก่อน (แก้ตอน blur)
  // - ตัวเลข => จำกัดให้อยู่ในช่วง 1..stock โดยอัตโนมัติ
  function handleQtyChange(e) {
    const raw = e.target.value;
    if (raw === "") {
      setQty("");
      return;
    }
    const n = Math.floor(Number(raw));
    if (Number.isNaN(n)) return;
    const max = Math.max(1, product.stock);
    setQty(Math.min(Math.max(1, n), max));
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10">
      <button
        onClick={() => navigate(-1)}
        className="font-semibold text-primary hover:underline mb-6 cursor-pointer"
      >
        ← Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <img
            className="w-full aspect-square object-cover rounded-2xl shadow-md"
            src={product.image}
            alt={product.name}
          />
        </div>

        <div className="flex flex-col">
          <span className="text-sm uppercase tracking-widest text-primary/70 font-semibold">
            {product.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mt-2 leading-tight">
            {product.name}
          </h1>
          <p className="text-2xl font-bold text-primary mt-3">
            ฿{product.price.toFixed(2)}
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          <p className="mt-4 text-sm">
            {product.stock > 0 ? (
              <span className="text-success font-semibold">
                ● In stock ({product.stock} left)
              </span>
            ) : (
              <span className="text-primary font-semibold">● Out of stock</span>
            )}
          </p>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center h-11 border border-border bg-background rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() =>
                  setQty((q) => Math.max(1, (Math.floor(Number(q)) || 1) - 1))
                }
                className="w-11 h-11 text-lg font-bold text-primary hover:bg-primary hover:text-surface disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
              >
                −
              </button>
              <input
                type="number"
                min={1}
                max={product.stock}
                value={qty}
                onChange={handleQtyChange}
                onBlur={() => {
                  if (qty === "") setQty(1);
                }}
                aria-label="Quantity"
                className="w-16 text-center font-bold text-foreground bg-transparent focus:outline-none"
              />
              <button
                type="button"
                onClick={() =>
                  setQty((q) =>
                    Math.min(
                      Math.max(1, Math.floor(Number(q)) || 1) + 1,
                      Math.max(1, product.stock)
                    )
                  )
                }
                className="w-11 h-11 text-lg font-bold text-primary hover:bg-primary hover:text-surface transition-colors duration-200"
              >
                +
              </button>
            </div>
            <Button
              name="Add to Cart"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            />
          </div>

          {added && (
            <p className="mt-3 font-semibold text-success">
              ✓ Added to your cart
            </p>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            You may also like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onAddToCart={() => addToCart(p)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}