import Hero from "../components/Hero";
import FeaturedCategories from "../components/FeaturedCategories"; // ✅ new
import CategorySection from "../components/CategorySection";
import LatestCollection from "../components/LatestCollection";
import BestSeller from "../components/BestSeller";
import OurPolicy from "../components/OurPolicy";
import NewsLetterBox from "../components/NewsLetterBox";

function Home() {
  return (
    <div>
      <Hero />
      <CategorySection />
      <FeaturedCategories />   {/* ✅ new modern layout */}
      <LatestCollection />
      <BestSeller />
      <OurPolicy />
      <NewsLetterBox />
    </div>
  );
}

export default Home;