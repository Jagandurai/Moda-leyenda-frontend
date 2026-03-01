import React from "react";
import { useNavigate } from "react-router-dom";
import Title from "./Title.jsx";

const featuredCategories = [
  {
    name: "T Shirts",
    subtext: "186 Pieces",
    img: "https://images.unsplash.com/photo-1562135291-7728cc647783?q=80&w=1460&auto=format&fit=crop",
    large: true,
  },
  {
    name: "Hoodies",
    subtext: "Timepieces",
    img: "https://plus.unsplash.com/premium_photo-1673356301396-e88063a02921?q=80&w=687&auto=format&fit=crop",
  },
  {
    name: "Pants",
    subtext: "147 Pieces",
    img: "https://images.unsplash.com/photo-1714143136385-c449be6760f6?q=80&w=880&auto=format&fit=crop",
  },
  {
    name: "Jackets",
    subtext: "158 Pieces",
    img: "https://images.unsplash.com/photo-1706765779494-2705542ebe74?q=80&w=1051&auto=format&fit=crop",
    wide: true,
  },
];

const FeaturedCategories = () => {
  const navigate = useNavigate();

  const handleClick = (name) => {
    // Pass type filter in URL
    navigate(`/collection?type=${encodeURIComponent(name)}`);
  };

  return (
    <section className="my-12 px-4 sm:px-6 lg:px-10">
      {/* ----- Section Header ----- */}
      <div className="text-center mb-20 text-3xl">
        <Title text1={"FEATURE"} text2={"COLLECTIONS"} />
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed tracking-wide">
            Explore our cfeature collections showcasing the best in style and design.
            </p>
          </div>
      </div>

      <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Left Large Card */}
        <div
          onClick={() => handleClick(featuredCategories[0].name)}
          className="lg:col-span-2 relative overflow-hidden rounded-2xl group cursor-pointer h-[300px] sm:h-[400px]"
        >
          <img
            src={featuredCategories[0].img}
            alt={featuredCategories[0].name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
            <div>
              <h3 className="text-white text-xl sm:text-2xl font-semibold">
                {featuredCategories[0].name}
              </h3>
              <p className="text-gray-200 text-sm sm:text-base">
                {featuredCategories[0].subtext}
              </p>
            </div>
            <div className="mt-3 flex justify-between items-center text-white text-sm sm:text-base">
              <span></span>
              <span className="flex items-center gap-1 hover:underline">
                Explore collection →
              </span>
            </div>
          </div>
        </div>

        {/* Right Side Grid */}
        <div className="grid grid-cols-2 grid-rows-2 gap-4 sm:gap-6">
          {featuredCategories.slice(1).map((cat, index) => (
            <div
              key={index}
              onClick={() => handleClick(cat.name)}
              className={`relative overflow-hidden rounded-2xl group cursor-pointer ${
                cat.wide ? "col-span-2" : ""
              } h-[140px] sm:h-[190px]`}
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4 sm:p-6">
                <div>
                  <h3 className="text-white text-base sm:text-lg font-semibold">
                    {cat.name}
                  </h3>
                  <p className="text-gray-200 text-xs sm:text-sm">
                    {cat.subtext}
                  </p>
                </div>
                {cat.wide && (
                  <div className="mt-3 flex justify-between items-center text-white text-xs sm:text-sm">
                    <span></span>
                    <span className="flex items-center gap-1 hover:underline">
                      Explore collection →
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturedCategories;