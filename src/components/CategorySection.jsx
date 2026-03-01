import React from "react";
import { useNavigate } from "react-router-dom";
import Title from "./Title.jsx";

const CategorySection = () => {
  const navigate = useNavigate();

  // ✅ Your category data with real images
  const categories = [
    {
      name: "Men",
      key: "Men",
      type: "category",
      img: "https://images.unsplash.com/photo-1602488283247-29bf1f5b148a?q=80&w=686&auto=format&fit=crop",
    },
    {
      name: "Women",
      key: "Women",
      type: "category",
      img: "https://i.pinimg.com/736x/cf/cc/17/cfcc17e1efb465f63d586d48011d0f60.jpg",
    },
    {
      name: "Kids",
      key: "Kids",
      type: "category",
      img: "https://i.pinimg.com/1200x/19/b9/90/19b9901e1cf7de790345dda4358bdecc.jpg",
    },
    {
      name: "Topwear",
      key: "Topwear",
      type: "subCategory",
      img: "https://rukminim2.flixcart.com/image/368/490/xif0q/shirt/2/9/v/xxl-brepoie04-dimmy-original-imahhz6afdwe7gcq.jpeg",
    },
    {
      name: "Bottomwear",
      key: "Bottomwear",
      type: "subCategory",
      img: "https://i.pinimg.com/1200x/b3/19/76/b31976456d9fd265fdcb8129d94d59e0.jpg",
    },
    {
      name: "Sportswear",
      key: "Sportswear",
      type: "subCategory",
      img: "https://i.pinimg.com/1200x/6b/d5/78/6bd5787f5a9e30673fbff5834135c382.jpg",
    },
  ];

  // ✅ Handle navigation by type
  const handleClick = (item) => {
    if (item.type === "category")
      navigate(`/collection?category=${item.key}`);
    else if (item.type === "subCategory")
      navigate(`/collection?subCategory=${item.key}`);
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 lg:mb-16">
        <div className="text-2xl sm:text-3xl lg:text-4xl">
          <Title text1={"SHOP"} text2={"BY CATEGORY"} />
          </div>
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed tracking-wide">
                Discover premium styles for Men, Women, Kids — all in one place.
              </p>
            </div>
          </div>

      {/* Category Grid */}
      <div className="max-w-screen-xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 sm:gap-8 lg:gap-10">
        {categories.map((item) => (
          <div
            key={item.key}
            onClick={() => handleClick(item)}
            className="flex flex-col items-center text-center group cursor-pointer transition-transform duration-300 hover:scale-105"
          >
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full overflow-hidden border border-yellow-200 bg-gray-50 shadow-sm group-hover:shadow-md transition-all duration-300">
              <img
                src={item.img}
                alt={item.name}
                className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-300"
              />
            </div>
            <p className="mt-3 text-sm sm:text-base font-semibold text-gray-800">
              {item.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;