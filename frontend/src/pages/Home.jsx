// ============================================================
// Home: หน้าแรกของร้าน
// - ส่วน Hero: โปรโมชันแนะนำ + ปุ่มไปซื้อของ
// - ส่วน Featured Products: แสดงสินค้า 3 รายการแรกจากสินค้าทั้งหมด
// ============================================================
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Button from "../components/Button";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";

export default function Home() {
  const { addToCart } = useCart();
  const { products } = useProducts();
  // เลือก 3 สินค้าแรกมาโชว์เป็น "Featured"
  const featured = products.slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <div className="bg-surface rounded-3xl shadow-md overflow-hidden flex flex-col md:flex-row">
          <div className="p-8 md:p-12 flex-1 flex flex-col justify-center">
            <p className="text-sm uppercase tracking-widest text-primary/70 font-semibold mb-3">
              Handmade Bath &amp; Body
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
              Small-batch soaps for slow,{" "}
              <span className="text-primary">calming days</span>
            </h1>
            <p className="mt-4 text-muted-foreground max-w-lg text-lg">
              Naturally crafted bars, mists, and creams inspired by the peace of
              a quiet bath at the end of the day.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/product">
                <Button name="Shop Now" />
              </Link>
              <Link
                to="/product?cat=Relaxation"
                className="inline-flex items-center justify-center min-h-11 px-5 py-3 rounded-lg border-2 border-primary text-primary font-semibold text-[15px] hover:bg-primary/10 transition-colors duration-300"
              >
                Explore Relaxation
              </Link>
            </div>
          </div>
          <div className="md:w-2/5 min-h-56">
            <img
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=800"
              alt="Handmade lavender soap"
            />
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Featured Products</h2>
          <Link
            to="/product"
            className="font-semibold text-primary hover:underline"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={() => addToCart(product)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}