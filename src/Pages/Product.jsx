import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import RelatedProducts from "../components/RelatedProducts";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { toast } from "react-toastify";
import CartDrawer from "../components/CartDrawer";

const Product = () => {
  const { productId } = useParams();

  const {
    products,
    currency,
    cartItems,
    addToCart,
    updateQuantity,
    favourites,
    toggleFavourite,
  } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isCartOpen, setIsCartOpen] = useState(false);

  /* --------------------------------------------------
     LOAD PRODUCT + SYNC CART STATE
  -------------------------------------------------- */
  useEffect(() => {
    const product = products.find((item) => item._id === productId);
    if (!product) return;

    setProductData(product);
    setImage(product.image[0]);

    const productCart = cartItems[product._id];
    if (productCart) {
      const sizesInCart = Object.keys(productCart);
      if (sizesInCart.length) {
        const cartSize = sizesInCart[0];
        setSize(cartSize);
        setQuantity(productCart[cartSize]);
        return;
      }
    }

    setSize("");
    setQuantity(1);
  }, [productId, products, cartItems]);

  if (!productData) return null;

  /* --------------------------------------------------
     DERIVED STATE
  -------------------------------------------------- */

  const isLiked = favourites.some((fav) => fav._id === productData._id);

  const quantityInCart = size
    ? cartItems[productData._id]?.[size] || 0
    : 0;

  const isOutOfStock =
    productData.availability === "out-of-stock" ||
    productData.inStock === false;

  // ==================== DYNAMIC DISCOUNT CALCULATION ====================
  let discountPercent = 0;
  if (
    productData.price?.original &&
    productData.price?.discounted &&
    productData.price.original > productData.price.discounted
  ) {
    discountPercent = Math.round(
      ((productData.price.original - productData.price.discounted) /
        productData.price.original) *
        100
    );
  }
  // =====================================================================

  /* --------------------------------------------------
     HANDLERS
  -------------------------------------------------- */

  const handleFavouriteClick = async () => {
    const success = await toggleFavourite(productData._id);
    if (!success) return;

    isLiked
      ? toast.info(`${productData.name} removed from favourites`)
      : toast.success(`${productData.name} added to favourites`);
  };

  const handleCartClick = async () => {
    if (isOutOfStock) {
      toast.error("This product is currently out of stock");
      return;
    }

    if (!size) {
      toast.error("Please select a size");
      return;
    }

    if (quantityInCart > 0) {
      const success = await updateQuantity(productData._id, size, 0);
      if (!success) return;

      toast.info(`${productData.name} removed from cart`);
      setSize("");
      setQuantity(1);
    } else {
      const success = await addToCart(productData._id, size, quantity);
      if (!success) return;

      toast.success(`${productData.name} added to cart`);
      setIsCartOpen(true);
    }
  };

  const handleQuantityChange = (val) => {
    setQuantity((prev) => Math.max(1, prev + val));
  };

  /* --------------------------------------------------
     UI
  -------------------------------------------------- */

  return (
    <div className="border-t-2 pt-10">
      <div className="flex gap-12 flex-col sm:flex-row">

        {/* IMAGES */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:w-[18.7%]">
            {productData.image.map((item, index) => (
              <img
                key={index}
                onClick={() => setImage(item)}
                src={item}
                className="w-[24%] sm:w-full sm:mb-3 cursor-pointer"
                alt={productData.name}
              />
            ))}
          </div>

          <div className="w-full sm:w-[80%] relative">

            {/* ❤️ Favourite Button */}
            <button
              onClick={handleFavouriteClick}
              className="absolute top-3 right-3 z-50 bg-white p-2 rounded-full shadow-lg hover:scale-110 transition"
            >
              {isLiked ? (
                <FaHeart className="text-red-500 text-xl" />
              ) : (
                <FaRegHeart className="text-gray-500 text-xl" />
              )}
            </button>

            {/* Main Image */}
            <img
              className={`w-full transition pointer-events-none ${
                isOutOfStock ? "opacity-60" : ""
              }`}
              src={image}
              alt={productData.name}
            />

            {/* Badge Logic */}
            {isOutOfStock ? (
              <span className="absolute top-3 left-3 z-20 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded">
                Out of Stock
              </span>
            ) : productData.bestseller ? (
              <span className="absolute top-3 left-3 z-20 bg-yellow-400 text-black text-xs font-semibold px-2 py-1 rounded">
                TOP SELLING
              </span>
            ) : null}
          </div>
        </div>

        {/* DETAILS */}
        <div className="flex-1">
          <p className="text-2xl font-medium flex items-center gap-2">
            {productData.name}
            {!isOutOfStock && productData.fewItemsLeft && (
              <span className="text-pink-500 text-sm font-semibold">
                Only Few Items Left..
              </span>
            )}
          </p>

          {/* ==================== PRICE SECTION ==================== */}
          <p className="mt-4 text-3xl font-medium">
            {currency} {productData.price.discounted}

            {discountPercent > 0 && (
              <span className="text-gray-800 text-xl line-through ml-2">
                {currency}{productData.price.original}
              </span>
            )}

            {discountPercent > 0 && (
              <span className="text-green-500 text-xl ml-2">
                {discountPercent}% offer
              </span>
            )}
          </p>
          {/* ======================================================== */}

          <div className="mt-4 text-sm">
            <p><strong>Category:</strong> {productData.category}</p>
            <p><strong>Subcategory:</strong> {productData.subCategory}</p>
          </div>

          {/* Sizes */}
          <div className="flex gap-2 my-4">
            {productData.sizes.map((item) => (
              <button
                key={item}
                disabled={isOutOfStock}
                onClick={() => !isOutOfStock && setSize(item)}
                className={`border px-4 py-2 transition ${
                  isOutOfStock
                    ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                    : size === item
                    ? "border-orange-500 bg-orange-100"
                    : "border-gray-300 hover:border-gray-500"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Quantity */}
          {!isOutOfStock && size && quantityInCart === 0 && (
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="px-3 py-1 bg-gray-200"
              >
                −
              </button>
              <span className="px-4 py-1 border">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="px-3 py-1 bg-gray-200"
              >
                +
              </button>
            </div>
          )}

          {/* Cart / Notify */}
          {isOutOfStock ? (
            <button
              onClick={() =>
                toast.info("You will be notified when back in stock")
              }
              className="px-8 py-3 bg-gray-600 text-white"
            >
              NOTIFY ME
            </button>
          ) : (
            <button
              onClick={handleCartClick}
              className={`px-8 py-3 text-white ${
                quantityInCart > 0 ? "bg-red-600" : "bg-black"
              }`}
            >
              {quantityInCart > 0 ? "REMOVE FROM CART" : "ADD TO CART"}
            </button>
          )}

          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
          />

          {productData.description && (
            <div className="mt-6 border-t pt-4">
              <h3 className="text-lg font-medium mb-2">
                Product Description
              </h3>
              <p>{productData.description}</p>
            </div>
          )}
        </div>
      </div>

      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
        currentProductId={productData._id}
      />
    </div>
  );
};

export default Product;