// ============================================================
// Products: หน้ารายการสินค้าทั้งหมด
// - ค้นหาชื่อสินค้า, กรองตามหมวดหมู่, เรียงลำดับ (ชื่อ/ราคา)
// - แสดง 9 ชิ้นต่อหน้า (Pagination) โดยเก็บหน้าปัจจุบันใน URL (?page=)
// ============================================================
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";

// จำนวนสินค้าต่อหน้า
const PAGE_SIZE = 9;

const selectClass =
  "border border-[#E8BFB5] rounded-lg px-4 py-2 bg-white text-[#3A2B25] focus:outline-none focus:border-[#9B151D]";

const pageBtnClass =
  "px-5 py-2 rounded-lg border border-[#E8BFB5] bg-white text-[#9B151D] font-semibold hover:bg-[#9B151D] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-300";

export default function Product() {
  const { addToCart } = useCart();
  const { products } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(searchParams.get("cat") ?? "all");
  const [sort, setSort] = useState("default");

  // ดึงรายชื่อหมวดหมู่ทั้งหมดจากสินค้า (ไม่เอาซ้ำ)
  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category))],
    [products]
  );

  // คัดกรอง + เรียงลำดับสินค้าตาม search/category/sort
  const filtered = useMemo(() => {
    let list = products;

    if (category !== "all") {
      list = list.filter((p) => p.category === category);
    }

    const query = search.trim().toLowerCase();
    if (query) {
      list = list.filter((p) => p.name.toLowerCase().includes(query));
    }

    const next = [...list];
    if (sort === "az") next.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "za") next.sort((a, b) => b.name.localeCompare(a.name));
    if (sort === "low-high") next.sort((a, b) => a.price - b.price);
    if (sort === "high-low") next.sort((a, b) => b.price - a.price);

    return next;
  }, [search, category, sort, products]);

  // คำนวณจำนวนหน้าทั้งหมด และคลี่สินค้าของหน้าที่เลือกออกมา
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(
    Math.max(1, Number(searchParams.get("page")) || 1),
    pageCount
  );
  const currentItems = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // ลบ ?page= ออกจาก URL => กลับไปหน้าที่ 1 (ใช้เมื่อค้นหา/กรองใหม่)
  function resetToFirstPage() {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        params.delete("page");
        return params;
      },
      { replace: true }
    );
  }

  // ไปยังหน้าที่ต้องการ พร้อมกันจำกัดให้อยู่ในช่วง 1..pageCount
  function goToPage(nextPage) {
    const clamped = Math.min(Math.max(1, nextPage), pageCount);
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        params.set("page", String(clamped));
        return params;
      },
      { replace: true }
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10">
      <h1 className="text-3xl font-bold text-[#3A2B25] mb-2">All Products</h1>
      <p className="text-[#9A6A5E] mb-6">
        {filtered.length} item{filtered.length !== 1 ? "s" : ""}
        {category !== "all" && ` in ${category}`}
      </p>

      {/* แถบเครื่องมือ: ค้นหา, หมวดหมู่, เรียงลำดับ */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            resetToFirstPage();
          }}
          className="border border-[#E8BFB5] rounded-lg px-4 py-2 flex-1 bg-white focus:outline-none focus:border-[#9B151D]"
        />

        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            resetToFirstPage();
          }}
          className={selectClass}
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            resetToFirstPage();
          }}
          className={selectClass}
        >
          <option value="default">Sort by</option>
          <option value="az">Name A-Z</option>
          <option value="za">Name Z-A</option>
          <option value="low-high">Price: Low to High</option>
          <option value="high-low">Price: High to Low</option>
        </select>
      </div>

      {/* Grid สินค้าที่ผ่านการกรองแล้ว */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentItems.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={() => addToCart(product)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#E8BFB5] p-10 text-center">
          <p className="text-lg font-semibold text-[#3A2B25]">
            No products found
          </p>
          <p className="text-[#9A6A5E] mt-1">
            Try a different search term or category.
          </p>
        </div>
      )}

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            type="button"
            className={pageBtnClass}
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
          >
            ← Previous
          </button>
          <span className="font-semibold text-[#3A2B25]">
            Page {page} of {pageCount}
          </span>
          <button
            type="button"
            className={pageBtnClass}
            onClick={() => goToPage(page + 1)}
            disabled={page >= pageCount}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}