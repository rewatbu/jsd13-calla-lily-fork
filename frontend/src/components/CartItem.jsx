// ============================================================
// CartItem: แสดงสินค้า 1 ชิ้นในหน้า Cart
// - props: name, price, image, quantity และฟังก์ชัน
//   onIncrease/onDecrease (เปลี่ยนจำนวน) + onRemove (ลบออก)
// ============================================================
const CartItem = ({
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
    <article className="flex items-center gap-5 w-full p-5 bg-white border border-[#E8BFB5] rounded-2xl shadow-[0_1px_3px_rgba(155,21,29,0.12)] hover:border-[#E8BFB5] hover:shadow-[0_6px_18px_rgba(155,21,29,0.18)] transition-all duration-150">
      <div className="h-[100px] w-[100px] flex-shrink-0 bg-[#FFE5DE] rounded-xl overflow-hidden">
        <img className="w-full h-full object-cover" src={image} alt={name} />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="mb-1.5 text-[17px] font-semibold text-[#3A2B25] truncate">
          {name}
        </h3>
        <p className="mb-4 text-sm text-[#9A6A5E]">฿{price.toFixed(2)}</p>

        <div className="flex items-center gap-4">
          <div className="flex items-center h-9 bg-[#FFE5DE] border border-[#E8BFB5] rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={onDecrease}
              disabled={quantity <= 1}
              className="w-9 h-9 bg-transparent text-[#9B151D] text-lg font-semibold cursor-pointer transition-colors duration-150 hover:bg-[#9B151D] hover:text-white disabled:text-[#9A6A5E] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            >
              −
            </button>
            <span className="min-w-[38px] text-center text-sm font-semibold text-[#3A2B25]">
              {quantity}
            </span>
            <button
              type="button"
              onClick={onIncrease}
              className="w-9 h-9 bg-transparent text-[#9B151D] text-lg font-semibold cursor-pointer transition-colors duration-150 hover:bg-[#9B151D] hover:text-white"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={onRemove}
            className="py-1 bg-transparent text-[#9A6A5E] text-sm cursor-pointer transition-colors duration-150 hover:text-[#9B151D]"
          >
            Remove
          </button>
        </div>
      </div>

      <p className="m-0 text-[17px] font-bold text-[#9B151D] whitespace-nowrap">
        ฿{itemTotal.toFixed(2)}
      </p>
    </article>
  );
};

export default CartItem;