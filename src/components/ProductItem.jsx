/* eslint-disable no-unused-vars */
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { toast } from "react-toastify";

const ProductItem = ({
  id,
  name,
  image,
  price,
  discountPercent = 0, // ✅ NEW: dynamic discount
  bestseller,
  fewItemsLeft,
  inStock,        // ✅ NEW
  outOfStock      // ✅ NEW (optional if you're passing this)
}) => {
  const { currency, favourites, toggleFavourite } = useContext(ShopContext);

  const isLiked = favourites.some((fav) => fav._id === id);

  const handleFavouriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const success = await toggleFavourite(id);
    if (!success) return;

    if (isLiked) {
      toast.info(`${name} removed from your favourite list`);
    } else {
      toast.success(`${name} added to your favourite list`);
    }
  };

  // ✅ Priority Logic
  const isOutOfStockFinal = inStock === false || outOfStock === true;
  const showFewItemsFinal = !isOutOfStockFinal && fewItemsLeft;

  return (
    <div className="relative text-gray-700 cursor-pointer">

      {/* 🔴 OUT OF STOCK (Highest Priority) */}
      {isOutOfStockFinal && (
        <span className="absolute top-2 left-2 z-10 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
          OUT OF STOCK
        </span>
      )}

      {/* 🟡 Bestseller (Only if in stock) */}
      {bestseller && !isOutOfStockFinal && (
        <span className="absolute top-2 left-2 z-10 bg-yellow-400 text-black text-xs font-semibold px-2 py-1 rounded">
          TOP SELLING
        </span>
      )}

      {/* ❤️ Favourite Button */}
      <button
        onClick={handleFavouriteClick}
        className="absolute top-2 right-2 z-10 bg-white p-2 rounded-full shadow"
      >
        {isLiked ? (
          <FaHeart className="text-red-500 text-lg" />
        ) : (
          <FaRegHeart className="text-gray-500 text-lg" />
        )}
      </button>

      <Link to={`/product/${id}`}>
        <div className="w-full h-60 sm:h-64 md:h-72 lg:h-80 overflow-hidden relative">
          <img
            className={`w-full h-full hover:scale-110 transition ease-in-out ${
              isOutOfStockFinal ? "opacity-50" : ""
            }`}
            src={image[0]}
            alt={name}
            style={{ objectFit: "cover" }}
          />
        </div>

        {/* Name + Few Items */}
        <p className="pt-3 pb-1 text-sm flex items-center gap-2">
          <span>{name}</span>

          {showFewItemsFinal && (
            <span className="text-pink-500 text-xs font-semibold">
              Only Few Items Left..
            </span>
          )}
        </p>

        {/* Price */}
        <p className="text-sm font-medium">
          {currency}{price.discounted}{" "}
          
          {discountPercent > 0 && (
            <span className="text-gray-800 text-xs line-through ml-2">
              {currency}{price.original}
            </span>
          )}

          {discountPercent > 0 && (
            <span className="text-green-500 text-xs ml-1">
              {discountPercent}% offer
            </span>
          )}
        </p>
      </Link>
    </div>
  );
};

export default ProductItem;