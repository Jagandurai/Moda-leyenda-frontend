import { Route, Routes } from "react-router-dom";

import Home from "./Pages/Home";
import About from "./Pages/About";
import Collection from "./Pages/Collection";
import Contact from "./Pages/Contact";
import Product from "./Pages/Product";
import PlaceOrder from "./Pages/PlaceOrder";
import Orders from "./Pages/Orders";
import Login from "./Pages/Login";
import Cart from "./Pages/Cart";
import Verify from "./Pages/Verify";
import MyProfile from "./Pages/MyProfile"; // ✅ correct filename & import
import FavouriteItems from "./components/FavouriteItems";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <ToastContainer />
      <Navbar />
      <SearchBar />

      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/favouriteItems" element={<FavouriteItems />} />

        {/* ================= USER ROUTES ================= */}
        <Route path="/myprofile" element={<MyProfile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/placeorder" element={<PlaceOrder />} />
      </Routes>

      <Footer />
    </div>
  );
};

export default App;
