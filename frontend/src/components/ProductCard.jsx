import { Link } from "react-router-dom";
import Button from "./Button";

// สร้าง ProductCard ให้แสดงสินค้า 1 ชิ้น
// รับ props: product, onAddToCart
export default function ProductCard({ product, onAddToCart }) {
  const { id, name, price, image, category } = product;

  return (
    <article className="border border-border rounded-lg overflow-hidden shadow-md bg-surface flex flex-col hover:shadow-lg transition-shadow duration-300">
      <Link to={`/product/${id}`} className="block">
        <img
          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
          src={image}
          alt={name}
        />
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs uppercase tracking-wide text-primary/70 font-semibold">
          {category}
        </span>
        <Link to={`/product/${id}`}>
          <h2 className="font-semibold text-xl text-foreground hover:text-primary transition-colors duration-300 leading-snug">
            {name}
          </h2>
        </Link>
        <p className="text-primary font-bold mt-1">฿{price.toFixed(2)}</p>
        <div className="mt-auto pt-3">
          <Button name="Add to Cart" onClick={onAddToCart} />
        </div>
      </div>
    </article>
  );
}