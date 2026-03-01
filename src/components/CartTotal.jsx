import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount } =
    useContext(ShopContext);

  const subTotal = Number(getCartAmount()) || 0;
  const shipping = Number(delivery_fee) || 0;
  const total = subTotal > 0 ? subTotal + shipping : 0;

  return (
    <div className="w-full">
      <div className="text-2xl">
        <Title text1="CART" text2="TOTALS" />
      </div>

      <div className="flex flex-col gap-2 mt-4 text-sm">
        <div className="flex justify-between">
          <p>Subtotal</p>
          <p>{currency} {subTotal.toFixed(2)}</p>
        </div>

        <hr />

        <div className="flex justify-between">
          <p>Shipping Fee</p>
          <p>{currency} {shipping.toFixed(2)}</p>
        </div>

        <hr />

        <div className="flex justify-between font-medium text-base">
          <p>Total Amount</p>
          <p>{currency} {total.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
