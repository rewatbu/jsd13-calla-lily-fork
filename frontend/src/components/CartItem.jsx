// ============================================================
// CartItem: แสดงสินค้า 1 ชิ้นในหน้า Cart
// - props: name, price, image, quantity และฟังก์ชัน
//   onIncrease/onDecrease (เปลี่ยนจำนวน) + onRemove (ลบออก)
// ============================================================
import { Link } from "react-router-dom";

const CartItem = ({
  id,
  name,
  price,
  image,
  quantity,
  onIncrease,
  onDecrease,
  onRemove,
}) => {
  // ราคารวมของสินค้าชิ้นนี้ = ราคาต่อชิ้น × จำนวน
  const itemTotal = price * quantity;

  return (
    <article className="flex items-center gap-5 w-full p-5 bg-surface border border-border rounded-2xl shadow-brand-sm hover:border-border hover:shadow-brand-md transition-all duration-150">
      <div className="h-[100px] w-[100px] flex-shrink-0 bg-background rounded-xl overflow-hidden">
        <Link to={`/product/${id}`}>
        <img className="w-full h-full object-cover" src={image} alt={name} />
        </Link>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="mb-1.5 text-[17px] font-semibold text-foreground truncate">
          {name}
        </h3>
        <p className="mb-4 text-sm text-muted-foreground">฿{price.toFixed(2)}</p>

        <div className="flex items-center gap-4">
          <div className="flex items-center h-9 bg-background border border-border rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={onDecrease}
              disabled={quantity <= 1}
              className="w-9 h-9 bg-transparent text-primary text-lg font-semibold cursor-pointer transition-colors duration-150 hover:bg-primary hover:text-surface disabled:text-muted-foreground disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            >
              −
            </button>
            <span className="min-w-[38px] text-center text-sm font-semibold text-foreground">
              {quantity}
            </span>
            <button
              type="button"
              onClick={onIncrease}
              className="w-9 h-9 bg-transparent text-primary text-lg font-semibold cursor-pointer transition-colors duration-150 hover:bg-primary hover:text-surface"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={onRemove}
            className="py-1 bg-transparent text-muted-foreground text-sm cursor-pointer transition-colors duration-150 hover:text-primary"
          >
            Remove
          </button>
        </div>
      </div>

      <p className="m-0 text-[17px] font-bold text-primary whitespace-nowrap">
        ฿{itemTotal.toFixed(2)}
      </p>
    </article>
  );
};

export default CartItem;