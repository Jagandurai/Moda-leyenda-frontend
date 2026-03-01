/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const RelatedProducts = ({ category, subCategory, currentProductId }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (!products.length) return;

    const filteredProducts = products
      .filter((item) => item._id !== currentProductId)
      .filter((item) => item.category === category)
      .filter((item) => item.subCategory === subCategory)
      .sort((a, b) => {
        const aOut =
          a.availability === "out-of-stock" || a.inStock === false;
        const bOut =
          b.availability === "out-of-stock" || b.inStock === false;

        if (aOut && !bOut) return 1;
        if (!aOut && bOut) return -1;

        if (!aOut && !bOut) {
          return (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0);
        }

        return 0;
      })
      .slice(0, 5);

    setRelated(filteredProducts);
  }, [products, category, subCategory, currentProductId]);

  if (!related.length) return null;

  return (
    <div className="my-24">
      <div className="text-center text-3xl py-2">
        <Title text1="RELATED" text2="PRODUCTS" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {related.map((item) => {
          const isOutOfStock =
            item.availability === "out-of-stock" ||
            item.inStock === false;

          // ✅ DYNAMIC DISCOUNT CALCULATION
          let discountPercent = 0;

          if (
            item.price?.original &&
            item.price?.discounted &&
            item.price.original > item.price.discounted
          ) {
            discountPercent = Math.round(
              ((item.price.original - item.price.discounted) /
                item.price.original) *
                100
            );
          }

          return (
            <ProductItem
              key={item._id}
              id={item._id}
              name={item.name}
              image={item.image}
              price={{
                ...item.price,
                discountPercent, // ✅ Override with dynamic value
              }}
              bestseller={!isOutOfStock && item.bestseller}
              fewItemsLeft={!isOutOfStock && item.fewItemsLeft}
              availability={item.availability}
              inStock={item.inStock}
            />
          );
        })}
      </div>
    </div>
  );
};

export default RelatedProducts;