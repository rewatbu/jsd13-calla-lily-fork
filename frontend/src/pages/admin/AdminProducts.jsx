// ============================================================
// AdminProducts: จัดการสินค้า (CRUD)
// - ฟอร์มด้านบนใช้เพิ่มสินค้าใหม่ หรือแก้ไขสินค้าที่เลือก
// - ตารางด้านล่างแสดงสินค้าทั้งหมด พร้อมปุ่ม Edit / Delete
// ============================================================
import { useState } from "react";
import { useProducts } from "../../context/ProductContext";
import Button from "../../components/Button";

const inputClass =
  "w-full border border-border rounded-lg px-4 py-2 bg-surface text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15";
const labelClass = "block text-sm font-semibold text-foreground mb-1";

// ฟอร์มว่างเปล่า (ค่าเริ่มต้นของสินค้าใหม่)
const blankForm = {
  name: "",
  price: "",
  category: "",
  image: "",
  description: "",
  stock: "",
};

export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [form, setForm] = useState(blankForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null);

  function startAdd() {
    setForm(blankForm);
    setEditingId(null);
    setMessage(null);
  }

  function startEdit(p) {
    setForm({
      name: p.name,
      price: String(p.price),
      category: p.category,
      image: p.image,
      description: p.description,
      stock: String(p.stock),
    });
    setEditingId(p.id);
    setMessage(null);
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  // กดปุ่ม "Add/Submit": แปลงข้อมูลจากฟอร์ม แล้วเพิ่ม/อัปเดตสินค้าไปยัง MongoDB
  // - แปลง price/stock ให้เป็นตัวเลข (ถ้าไม่ใช่ => 0)
  // - category หากเว้นไว้ => "General"
  async function handleSubmit(e) {
    e.preventDefault();
    const data = {
      name: form.name.trim(),
      price: Number(form.price) || 0,
      category: form.category.trim() || "General",
      image: form.image.trim(),
      description: form.description.trim(),
      stock: Number(form.stock) || 0,
    };

    try {
      if (editingId) {
        await updateProduct(editingId, data);
        setMessage({ type: "success", text: "Product updated" });
      } else {
        await addProduct(data);
        setMessage({ type: "success", text: "Product added" });
      }
      setForm(blankForm);
      setEditingId(null);
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to save product" });
    }
  }

  // ลบสินค้า: ยืนยันกับผู้ใช้ก่อน (window.confirm) จึงลบ
  async function handleDelete(p) {
    if (window.confirm(`Delete "${p.name}"?`)) {
      try {
        await deleteProduct(p.id);
        setMessage({ type: "success", text: "Product deleted" });
      } catch (err) {
        setMessage({ type: "error", text: err.message || "Failed to delete product" });
      }
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {message && (
        <p
          className={`rounded-lg px-4 py-3 text-sm font-semibold ${
            message.type === "error"
              ? "bg-danger-soft text-danger"
              : "bg-success-soft text-success-strong"
          }`}
        >
          {message.text}
        </p>
      )}

      {/* Add / edit form */}
      <div className="bg-surface rounded-2xl border border-border shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">
            {editingId ? "Edit Product" : "Add New Product"}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={startAdd}
              className="text-sm font-semibold text-primary hover:underline cursor-pointer"
            >
              Cancel edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="p-name" className={labelClass}>
              Name
            </label>
            <input
              id="p-name"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="p-price" className={labelClass}>
              Price (฿)
            </label>
            <input
              id="p-price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              required
              value={form.price}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="p-category" className={labelClass}>
              Category
            </label>
            <input
              id="p-category"
              name="category"
              required
              value={form.category}
              onChange={handleChange}
              className={inputClass}
              placeholder="e.g. Relaxation, Skin Care"
            />
          </div>
          <div>
            <label htmlFor="p-stock" className={labelClass}>
              Stock
            </label>
            <input
              id="p-stock"
              name="stock"
              type="number"
              min="0"
              required
              value={form.stock}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="p-image" className={labelClass}>
              Image URL
            </label>
            <input
              id="p-image"
              name="image"
              required
              value={form.image}
              onChange={handleChange}
              className={inputClass}
              placeholder="https://…"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="p-description" className={labelClass}>
              Description
            </label>
            <textarea
              id="p-description"
              name="description"
              rows="3"
              required
              value={form.description}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <Button
              name={editingId ? "Save Changes" : "Add Product"}
              type="submit"
            />
          </div>
        </form>
      </div>

      {/* Products table */}
      <div className="bg-surface rounded-2xl border border-border shadow-md p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">
          All Products ({products.length})
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-border">
                <th className="py-2 pr-4 font-semibold">Product</th>
                <th className="py-2 pr-4 font-semibold">Category</th>
                <th className="py-2 pr-4 font-semibold">Price</th>
                <th className="py-2 pr-4 font-semibold">Stock</th>
                <th className="py-2 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-background">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-12 w-12 rounded object-cover"
                      />
                      <span className="font-semibold text-foreground">
                        {p.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">{p.category}</td>
                  <td className="py-3 pr-4 font-semibold text-foreground">
                    ฿{p.price.toFixed(2)}
                  </td>
                  <td className="py-3 pr-4 text-foreground">{p.stock}</td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(p)}
                        className="px-3 py-1 rounded-lg border border-primary text-primary font-semibold text-xs hover:bg-primary/10 transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(p)}
                        className="px-3 py-1 rounded-lg border border-primary bg-primary text-surface font-semibold text-xs hover:bg-primary-hover transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-muted-foreground">
                    No products yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}