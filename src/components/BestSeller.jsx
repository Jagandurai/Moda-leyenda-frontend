import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext.jsx";
import Title from "./Title.jsx";
import ProductItem from "./ProductItem.jsx";

const BestSeller = () => {
  const { products } = useContext(ShopContext);

  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    // Filter products with bestseller = true
    const bestProduct = products.filter((item) => item.bestseller);
    // Show only 5 products
    setBestSeller(bestProduct.slice(0, 5));
  }, [products]);

  return (
    <div className="my-10">
      <div className="text-center text-3xl py-8">
        <Title text1={"TOP"} text2={"SELLING"} />
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed tracking-wide">
             Discover our top trending products loved by customers for their style, quality, and uniqueness.
            </p>
          </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {bestSeller.map((item, index) => {
          // Determine if out of stock
          const isOutOfStock = item.inStock === false || item.availability === "out-of-stock";
          // Show few items only if in stock
          const showFewItems = item.fewItemsLeft && !isOutOfStock;

          return (
            <ProductItem
              key={index}
              id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
              bestseller={!isOutOfStock && item.bestseller} // hide badge if out of stock
              fewItemsLeft={showFewItems}
              inStock={!isOutOfStock}
              outOfStock={isOutOfStock}
            />
          );
        })}
      </div>
    </div>
  );
};

export default BestSeller;