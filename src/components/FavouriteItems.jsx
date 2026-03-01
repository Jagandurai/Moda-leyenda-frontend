import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { toast } from "react-toastify";

const FavouriteItems = () => {
  const { favourites, toggleFavourite, currency } = useContext(ShopContext);
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <div className="max-w-screen-lg mx-auto">
        {/* ---------- Header ---------- */}
        <div className="border-b border-gray-300 pb-4 mb-6">
          <div className="flex items-center flex-wrap gap-4">
            <h3 className="text-2xl font-semibold text-slate-900">
              Favourite Products
            </h3>
            <p className="text-sm text-gray-500 ml-auto">
              {favourites?.length || 0} items
            </p>
          </div>
        </div>

        {/* ---------- Empty State ---------- */}
        {(!favourites || favourites.length === 0) && (
          <p className="text-center text-gray-500 mt-10">
            You haven’t added any favourite items yet.
          </p>
        )}

        {/* ---------- Favourite Items List ---------- */}
        {favourites && favourites.length > 0 && (
          <div className="divide-y divide-gray-300 sm:divide-y max-sm:flex max-sm:flex-col max-sm:gap-5">
            {favourites.map((product) => (
              <div
                key={product._id}
                onClick={() => navigate(`/product/${product._id}`)}
                className="
                  grid grid-cols-5 max-md:grid-cols-2 items-start justify-between gap-6 py-6 min-h-[140px] hover:bg-gray-50 transition cursor-pointer
                  max-sm:flex max-sm:flex-col max-sm:gap-4 max-sm:rounded-xl max-sm:border max-sm:p-6 max-sm:shadow-sm max-sm:bg-white
                "
              >
                {/* ---------- Product Info ---------- */}
                <div className="md:col-span-2 flex items-start gap-6 max-sm:gap-3">
                  <div className="rounded-lg shrink-0 max-sm:w-20 max-sm:h-20" style={{ width: '80px', height: '80px' }}>
                    <img
                      src={product.image[0]}
                      alt={product.name}
                    />
                  </div>
                  <div>
                    <h6 className="text-[15px] font-semibold text-slate-900 max-sm:text-base">
                      {product.name}
                    </h6>
                    <p className="text-[14px] text-slate-500 mt-1">
                      {product.subCategory}
                    </p>
                    {product.fewItemsLeft && (
                      <p className="text-xs font-semibold text-pink-500 mt-1">
                        Only Few Items Left!
                      </p>
                    )}
                  </div>
                </div>

                {/* ---------- MOBILE DETAILS STACK ---------- */}
                <div className="flex flex-wrap pt-3 gap-y-3 max-sm:flex-col sm:hidden">
                  {/* Price */}
                  <div className="flex justify-between text-[14px]">
                    <h6 className="font-medium text-slate-500">Price</h6>
                    <div className="text-right">
                      <p className="text-[14px] text-slate-900 font-medium">
                        {currency} {product.price.discounted}
                      </p>
                      {product.price.discountPercent > 0 && (
                        <p className="text-[13px] text-green-600 font-medium">
                          {product.price.discountPercent}% OFF
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="flex justify-between text-[14px] gap-4 items-center">
                    <h6 className="font-medium text-slate-500 ">Availability</h6>
                    <p
                      className={`text-[13px] font-medium inline-block rounded-md py-1.5 px-3 ${
                        product.inStock
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </p>
                  </div>

                  {/* Action */}
                  <div className="flex justify-between items-center text-[14px]">
                    <h6 className="font-medium text-slate-500">Action</h6>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavourite(product._id);
                        toast.info(`${product.name} removed from favourites`);
                      }}
                      className="text-red-500 hover:text-red-600 transition flex items-center gap-1 text-[14px]"
                    >
                      <FaHeart className="text-base" /> Remove
                    </button>
                  </div>
                </div>

                {/* ---------- DESKTOP VIEW ---------- */}
                <div className="hidden sm:block col-span-1">
                  <h6 className="text-[15px] font-medium text-slate-500">
                    Price
                  </h6>
                  <div className="mt-2">
                    <p className="text-[15px] text-slate-900 font-medium">
                      {currency} {product.price.discounted}
                    </p>
                    {product.price.discountPercent > 0 && (
                      <p className="text-[13px] text-green-600 font-medium">
                        {product.price.discountPercent}% OFF
                      </p>
                    )}
                  </div>
                </div>

                <div className="hidden sm:block">
                  <h6 className="text-[15px] font-medium text-slate-500">
                    Availability
                  </h6>
                  <p
                    className={`text-[13px] font-medium mt-2 inline-block rounded-md py-1.5 px-3 ${
                      product.inStock
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </p>
                </div>

                <div className="hidden sm:flex sm:flex-col md:ml-auto gap-2">
                  <h6 className="text-[15px] font-medium text-slate-500">
                    Action
                  </h6>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavourite(product._id);
                      toast.info(`${product.name} removed from favourites`);
                    }}
                    className="text-red-500 mt-2 hover:text-red-600 transition flex items-center gap-1 text-[15px]"
                  >
                    <FaHeart className="text-lg" /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavouriteItems;