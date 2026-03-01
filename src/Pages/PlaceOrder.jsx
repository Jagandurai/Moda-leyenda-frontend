import { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";
import CartTotal from "../components/CartTotal";
import Title from "../components/Title";
import MyAddress from "../components/MyAddress";
import { MdDelete } from "react-icons/md";

function PlaceOrder() {
  const {
    navigate,
    getCartAmount,
    cartItems,
    setCartItems,
    backendURL,
    products,
    updateQuantity,
    delivery_fee,
    currency,
    selectedAddress,
  } = useContext(ShopContext);

  const [placing, setPlacing] = useState(false);

  // ============================ Build Order Items ============================
  const orderItems = [];

  for (const pid in cartItems) {
    for (const size in cartItems[pid]) {
      if (cartItems[pid][size] > 0) {
        const product = products.find((p) => p._id === pid);
        if (product) {
          orderItems.push({
            productId: product._id.toString(), 
            productCode: product.productCode || "",  
            name: product.name,
            image: product.image,
            price:
              typeof product.price === "object"
                ? product.price.discounted
                : product.price,
            size,
            quantity: cartItems[pid][size],
          });
        }
      }
    }
  }

  // ============================ Quantity Handlers ============================
  const handleIncrease = (id, size, qty) => updateQuantity(id, size, qty + 1);

  const handleDecrease = (id, size, qty) => {
    if (qty > 1) updateQuantity(id, size, qty - 1);
    else {
      updateQuantity(id, size, 0);
      toast.info("Product removed from cart");
    }
  };

  const handleDelete = (id, size) => {
    updateQuantity(id, size, 0);
    toast.info("Product removed from cart");
  };

// ============================ Submit Order ============================
const userEmail = localStorage.getItem("userEmail");
const onSubmitHandler = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("accessToken");

  if (!token) {
    toast.error("Please log in first");
    return;
  }

  if (orderItems.length === 0) {
    toast.error("Your cart is empty");
    return;
  }

  if (!selectedAddress) {
    toast.error("Please select a delivery address");
    return;
  }

  try {
    setPlacing(true);

    const orderData = {
      address: { ...selectedAddress, email: userEmail }, // <- add user's email here
      items: orderItems,
      amount: getCartAmount() + delivery_fee,
      shippingCharge: delivery_fee,
    };

    console.log("Sending Order Data:", orderData);

    const response = await axios.post(
      `${backendURL}/api/order/cod`,
      orderData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data?.success) {
      toast.success("Order placed successfully!");
      setCartItems({});
      navigate("/orders");
    } else {
      toast.error(response.data?.message || "Order failed");
    }
  } catch (error) {
    console.error(
      "Order placement error:",
      error.response?.data || error.message
    );
    toast.error(error.response?.data?.message || "Failed to place order");
  } finally {
    setPlacing(false);
  }
};

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
    >
      {/* ================= LEFT SIDE: SHIPPING ADDRESS ================= */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"SHIPPING"} text2={"ADDRESS"} />
        </div>
        <MyAddress />
      </div>

      {/* ================= RIGHT SIDE ================= */}
      <div className="mt-8 flex-1">
        <h3 className="text-base font-medium text-slate-900 mb-6">
          Order Items ({orderItems.length})
        </h3>

        <div className="space-y-4">
          {orderItems.map((item) => (
            <div
              key={item.productId + item.size}
              className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition"
            >
              <div className="w-[80px] h-[80px] rounded-lg flex items-center justify-center bg-gray-100 shrink-0">
                <img
                  src={item.image[0]}
                  alt={item.name}
                  className="rounded-sm"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-slate-900 truncate">
                  {item.name}
                </h4>
                <p className="text-slate-500 text-xs mt-1">Size: {item.size}</p>
                <p className="text-slate-500 text-xs mt-1">
                  Qty: {item.quantity}
                </p>
                <p className="text-slate-900 text-sm font-semibold mt-1">
                  {currency} {item.price}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleDecrease(item.productId, item.size, item.quantity)
                    }
                    className="px-2 py-1 border rounded"
                  >
                    −
                  </button>
                  <span className="px-2 text-sm">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() =>
                      handleIncrease(item.productId, item.size, item.quantity)
                    }
                    className="px-2 py-1 border rounded"
                  >
                    +
                  </button>
                </div>

                <MdDelete
                  onClick={() =>
                    handleDelete(item.productId, item.size)
                  }
                  className="text-gray-400 hover:text-red-500 cursor-pointer"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>

        <div className="w-full text-end mt-10">
          <button
            type="submit"
            disabled={placing}
            className={`bg-black text-white px-16 py-3 text-sm rounded ${
              placing ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-800"
            }`}
          >
            {placing ? "Placing Order..." : "PLACE ORDER"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default PlaceOrder;