import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import CartTotal from "../components/CartTotal";

export default function CartDrawer({ isOpen, onClose }) {
  const {
    products,
    currency,
    cartItems,
    updateQuantity,
    navigate,
    getCartAmount,
  } = useContext(ShopContext);

  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const temp = [];
      for (const productId in cartItems) {
        for (const size in cartItems[productId]) {
          const quantity = cartItems[productId][size];
          if (quantity > 0) {
            temp.push({ productId, size, quantity });
          }
        }
      }
      setCartData(temp);
    }
  }, [cartItems, products]);

  const handleIncrease = (id, size, qty) => updateQuantity(id, size, qty + 1);
  const handleDecrease = (id, size, qty) => {
    if (qty > 1) updateQuantity(id, size, qty - 1);
    else {
      updateQuantity(id, size, 0);
      toast.info("Product removed from cart");
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-transform duration-500 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-gray-500/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Drawer panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartData.length === 0 ? (
            <p className="text-center text-gray-500 py-10">
              Your cart is empty
            </p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {cartData.map((item, index) => {
                const product = products.find(p => p._id === item.productId);
                if (!product) return null;

                const price =
                  typeof product.price === "object"
                    ? product.price.discounted
                    : product.price;
                const originalPrice =
                  typeof product.price === "object"
                    ? product.price.original
                    : null;

                return (
                  <li key={index} className="flex py-4">
                    <img
                      src={product.image[0]}
                      alt={product.name}
                      className="w-20 h-20 rounded-md border object-cover"
                    />
                    <div className="ml-4 flex flex-col justify-between flex-1">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {product.category} / {product.subCategory}
                        </p>
                        <p className="mt-1 text-sm font-medium">
                          {currency}
                          {price}
                          {originalPrice && (
                            <span className="ml-2 line-through text-xs text-gray-400">
                              {currency}
                              {originalPrice}
                            </span>
                          )}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleDecrease(
                                item.productId,
                                item.size,
                                item.quantity
                              )
                            }
                            className="px-2 py-1 border text-gray-700"
                          >
                            −
                          </button>
                          <span className="px-2 text-sm">{item.quantity}</span>
                          <button
                            onClick={() =>
                              handleIncrease(
                                item.productId,
                                item.size,
                                item.quantity
                              )
                            }
                            className="px-2 py-1 border text-gray-700"
                          >
                            +
                          </button>
                        </div>
                        <MdDelete
                          onClick={() =>
                            updateQuantity(item.productId, item.size, 0)
                          }
                          className="text-gray-400 hover:text-red-500 cursor-pointer"
                        />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-6">
          <CartTotal />
          <button
            onClick={() =>
              getCartAmount() > 0
                ? navigate("/placeorder")
                : toast.error("Your cart is empty")
            }
            className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-md"
          >
            Checkout
          </button>
          <button
            onClick={onClose}
            className="w-full mt-2 text-sm text-gray-500 hover:text-gray-700"
          >
            Continue Shopping →
          </button>
        </div>
      </div>
    </div>
  );
}