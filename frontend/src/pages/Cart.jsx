// ============================================================
// Cart: หน้ากระดาษ/ตะกร้าสินค้า (/cart)
// - แสดงสินค้าที่มีในตะกร้า (CartItem) พร้อมปรับจำนวน/ลบได้
// - สรุปยอด Subtotal + Shipping (ฟรี) + Total และปุ่มไปชำระเงิน
// ============================================================
import { Link } from "react-router-dom";
import CartItem from "../components/CartItem";
import Button from "../components/Button";
import { useCart } from "../context/CartContext";

// ค่าจัดส่ง (0 = ฟรี)
const SHIPPING = 0;

export default function Cart() {
  const {
    cart,
    removeFromCart,
    increaseQty,
    decreaseQty,
    itemCount,
    totalPrice,
  } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-10 text-center">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Your cart is empty
        </h1>
        <p className="text-muted-foreground mb-8">
          Browse our handmade collection and find something you love.
        </p>
        <Link to="/product">
          <Button name="Browse Products" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10">
      <h1 className="text-3xl font-bold text-foreground mb-2">
        Shopping Cart
      </h1>
      <p className="text-muted-foreground mb-8">
        {itemCount} item{itemCount !== 1 ? "s" : ""} in your cart
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-4">
          {cart.map((item) => (
            <CartItem
              key={item.id}
              id={item.id}
              name={item.name}
              price={item.price}
              image={item.image}
              quantity={item.quantity}
              onIncrease={() => increaseQty(item.id)}
              onDecrease={() => decreaseQty(item.id)}
              onRemove={() => removeFromCart(item.id)}
            />
          ))}
        </div>


          {/* ส่วนนี้คือ order summary */}
        <aside className="bg-surface border border-border rounded-xl p-6 h-fit shadow-md">
          <h2 className="text-xl font-bold text-foreground mb-4">Summary</h2>
          <div className="flex justify-between py-2 text-muted-foreground">
            <span>Subtotal</span>
            <span className="font-semibold text-foreground">
              ฿{totalPrice.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between py-2 text-muted-foreground">
            <span>Shipping</span>
            <span className="font-semibold text-success">
              {SHIPPING === 0 ? "Free" : `฿${SHIPPING.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between py-3 border-t border-border mt-2">
            <span className="font-bold text-foreground">Total</span>
            <span className="font-bold text-primary">
              ฿{(totalPrice + SHIPPING).toFixed(2)}
            </span>
          </div>
          <Link to="/checkout" className="block mt-5">
            <Button name="Proceed to Checkout" className="w-full" />
          </Link>
          <Link
            to="/product"
            className="block mt-3 text-center font-semibold text-primary hover:underline"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}