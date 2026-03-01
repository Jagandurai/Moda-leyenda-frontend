import { useContext, useEffect, useState, useMemo } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Orders() {
  const { backendURL, accessToken, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [cancelingOrderId, setCancelingOrderId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const navigate = useNavigate();

  const loadOrderData = async () => {
    if (!accessToken) return;

    try {
      const response = await axios.post(
        `${backendURL}/api/order/userorders`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (response.data.success) {
        let formattedOrders = [];

        response.data.orders
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .forEach((order) => {
            order.items.forEach((item) => {
              const unitPrice =
                item?.price?.discounted ??
                item?.price ??
                item?.productId?.price?.discounted ??
                item?.productId?.price ??
                0;

              const quantity = item.quantity || 1;
              const itemTotal = unitPrice * quantity;
              const deliveryCharge = order.shippingCharge || 0;
              const grandTotal = order.amount;

              formattedOrders.push({
                ...item,
                status: order.status,
                date: order.createdAt,
                orderId: order.orderNumber || "N/A",
                orderDbId: order._id,
                size: item.size || "N/A",
                quantity,
                unitPrice,
                itemTotal,
                deliveryCharge,
                grandTotal,
              });
            });
          });

        setOrderData(formattedOrders);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [accessToken]);

  const cancelOrder = async (orderId) => {
    if (!accessToken || cancelingOrderId) return;

    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );
    if (!confirmCancel) return;

    try {
      setCancelingOrderId(orderId);

      const response = await axios.post(
        `${backendURL}/api/order/cancel`,
        { orderId },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (response.data.success) {
        toast.success("Order cancelled successfully!");
        await loadOrderData();
      }
    } catch (error) {
      toast.error("Error cancelling order.");
    } finally {
      setCancelingOrderId(null);
    }
  };

  const getStatusClasses = (status) => {
    switch (status?.toLowerCase()) {
      case "order placed":
        return "bg-yellow-100 text-yellow-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredOrders = useMemo(() => {
    if (filterStatus === "all") return orderData;
    return orderData.filter(
      (item) => item.status?.toLowerCase() === filterStatus
    );
  }, [orderData, filterStatus]);

  return (
    <div className="bg-black-50 min-h-screen py-6 px-3 sm:px-6">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b pb-4 mb-6">
          <Title text1={"ORDER"} text2={"HISTORY"} />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border px-6 py-4 rounded-lg text-sm bg-white shadow-sm focus:ring-2 focus:ring-black outline-none"
          >
            <option value="all">All Orders</option>
            <option value="order placed">Placed</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {filteredOrders.map((item, index) => {
          const isExpanded = expandedId === index;

          return (
            <div
              key={index}
              onClick={() => setExpandedId(isExpanded ? null : index)}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition mb-5 cursor-pointer"
            >
              {/* MAIN CARD */}
              <div className="p-4 sm:p-6">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                  {/* LEFT - PRODUCT */}
                  <div
                    className="flex gap-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (item.productId?._id) {
                        navigate(`/product/${item.productId._id}`);
                      }
                    }}
                  >
                    <img
                      src={item?.productId?.image?.[0] || "/placeholder.png"}
                      alt="Product"
                      className="w-20 h-24 object-cover rounded-lg border"
                    />

                    <div>
                      <h3 className="font-semibold text-black-800 text-sm sm:text-base">
                        {item.name || item.productId?.name}
                      </h3>

                      <p className="text-xs text-black-500 mt-1">
                        Size: {item.size} • Qty: {item.quantity}
                      </p>

                      <p className="text-xs mt-1">
                        <span className="text-black-500">Order ID: </span>
                        <span className="text-green-500 font-bold">
                          #{item.orderId}
                        </span>
                      </p>

                      <p className="text-xs text-black-400">
                        Date : {item.date
                          ? new Date(item.date).toLocaleDateString()
                          : ""}
                      </p>
                    </div>
                  </div>

                  {/* CENTER STATUS */}
                  <div className="flex justify-start sm:justify-center">
                    <span
                      className={`${getStatusClasses(
                        item.status
                      )} text-xs font-semibold px-4 py-1 rounded-full capitalize`}
                    >
                      {item.status}
                    </span>
                  </div>

                  {/* RIGHT TOTAL */}
                  <div className="text-left sm:text-right">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Total
                    </p>
                    <p className="text-lg sm:text-xl font-bold text-gray-900">
                      {currency} {item.grandTotal}
                    </p>
                  </div>
                </div>

                {/* EXPANDED SECTION */}
                {isExpanded && (
                  <div
                    className="mt-6 border-t pt-5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border text-sm">

                      <p className="font-semibold text-gray-700 mb-4 uppercase tracking-wide text-xs">
                        Price Breakdown
                      </p>

                      <div className="flex justify-between mb-2 text-gray-600">
                        <span>Item Rate</span>
                        <span>{currency} {item.unitPrice}</span>
                      </div>

                      <div className="flex justify-between mb-2 text-gray-600">
                        <span>Quantity</span>
                        <span>{item.quantity}</span>
                      </div>

                      <div className="flex justify-between mb-2 text-gray-600">
                        <span>Subtotal</span>
                        <span>{currency} {item.itemTotal}</span>
                      </div>

                      <div className="flex justify-between mb-3 text-gray-600">
                        <span>Delivery Charge</span>
                        <span>{currency} {item.deliveryCharge}</span>
                      </div>

                      <div className="flex justify-between border-t pt-3 font-bold text-gray-900">
                        <span>Grand Total</span>
                        <span>{currency} {item.grandTotal}</span>
                      </div>
                    </div>

                    {item.status?.toLowerCase() !== "delivered" &&
                      item.status?.toLowerCase() !== "cancelled" && (
                        <div className="mt-4 text-right">
                          <button
                            onClick={() => cancelOrder(item.orderDbId)}
                            disabled={cancelingOrderId === item.orderDbId}
                            className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50 text-sm"
                          >
                            {cancelingOrderId === item.orderDbId
                              ? "Cancelling..."
                              : "Cancel Order"}
                          </button>
                        </div>
                      )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Orders;