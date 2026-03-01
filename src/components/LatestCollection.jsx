import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext.jsx";
import Title from "./Title.jsx";
import ProductItem from "./ProductItem.jsx";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    // Sort products by creation date (newest first) or reverse if no timestamp
    const sortedProducts = [...products].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    // Take first 10 latest products
    setLatestProducts(sortedProducts.slice(0, 10));
  }, [products]);

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl ">
        <Title text1={"LATEST"} text2={"COLLECTIONS"} />
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed tracking-wide">
              Discover our newest arrivals curated just for you. Explore the latest trends, 
              exclusive designs, and must-have pieces for every occasion.
            </p>
          </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {latestProducts.map((item) => {
          const isOutOfStock =
            item.availability === "out-of-stock" || item.inStock === false;

          const showFewItems = !isOutOfStock && item.fewItemsLeft;

          // Calculate dynamic discount percent
          const discountPercent =
            item.price.original && item.price.original > 0
              ? Math.round(
                  ((item.price.original - item.price.discounted) /
                    item.price.original) *
                    100
                )
              : 0;

          return (
            <ProductItem
              key={item._id}
              id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
              discountPercent={discountPercent} // ✅ dynamic
              bestseller={!isOutOfStock && item.bestseller} // ✅ only if in stock
              fewItemsLeft={showFewItems} // ✅ only if in stock
              inStock={!isOutOfStock}
              outOfStock={isOutOfStock}
            />
          );
        })}
      </div>
    </div>
  );
};

export default LatestCollection;

// bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-lg transition-all duration-300