import { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets.js";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext.jsx";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import axios from "axios";
import { toast } from "react-toastify";
import CartDrawer from "../components/CartDrawer.jsx";
import FavouriteItems from "../components/FavouriteItems";
import { FaHeart } from "react-icons/fa";

const Navbar = () => {
  const [userAvatar, setUserAvatar] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [visible, setVisible] = useState(false); 

  const location = useLocation();
  const navigate = useNavigate();

  const {
    showSearch,
    setShowSearch,
    getCartCount,
    accessToken,
    setAccessToken,
    setCartItems,
    favourites,
  } = useContext(ShopContext);

  const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

  // Show search icon only on Home + Collection
  const showSearchIcon =
    location.pathname === "/" || location.pathname === "/collection";

  // Fetch user profile avatar
  const fetchUserProfile = async () => {
    if (!accessToken) return;
    try {
      const res = await axios.get(`${API}/api/user/profile`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.data?.user?.avatar) setUserAvatar(res.data.user.avatar);
    } catch (err) {
      console.error("Failed to fetch profile in navbar:", err);
    }
  };

  useEffect(() => {
    if (!accessToken) return;
    fetchUserProfile();
    const interval = setInterval(fetchUserProfile, 5000);
    return () => clearInterval(interval);
  }, [accessToken]);

  // Auto close search when changing page
  useEffect(() => {
    setShowSearch(false);
  }, [location.pathname]);

  const handleLogout = () => {
    toast.success("Logged out successfully!");
    setTimeout(() => {
      localStorage.removeItem("accessToken");
      setAccessToken("");
      setCartItems({});
      navigate("/login");
    }, 800);
  };

  return (
    <div className="sticky top-0 z-50 bg-white flex items-center justify-between py-4 px-2 sm:px-4">

      {/* Logo */}
      <Link to="/">
        <img src={assets.logo} className="w-24" alt="Logo" />
      </Link>

      {/* Desktop Menu */}
      <ul className="hidden sm:flex gap-6 text-base font-semibold text-gray-800 items-center">
        <NavLink
          to="/"
          className="px-2 py-1 transition-colors duration-200 hover:text-blue-500"
        >
          HOME
        </NavLink>
        <NavLink
          to="/collection"
          className="px-2 py-1 transition-colors duration-200 hover:text-blue-500"
        >
          COLLECTION
        </NavLink>
        <NavLink
          to="/about"
          className="px-2 py-1 transition-colors duration-200 hover:text-blue-500"
        >
          ABOUT
        </NavLink>
        <NavLink
          to="/contact"
          className="px-2 py-1 transition-colors duration-200 hover:text-blue-500"
        >
          CONTACT
        </NavLink>
      </ul>
      {/* Right Section */}
      <div className="flex items-center gap-4 sm:gap-6">

        {/* 🔎 Search (Home + Collection) */}
        {showSearchIcon && (
          <img
            onClick={() => setShowSearch((prev) => !prev)}
            src={assets.search_icon}  // always magnifying glass
            className="w-5 cursor-pointer"
            alt="Search"
          />
        )}

        {/* Profile Dropdown */}
        {accessToken ? (
          <Menu as="div" className="relative">
            <MenuButton className="flex items-center">
              <img
                src={userAvatar || assets.profile_icon}
                alt="Profile"
                className="w-7 h-7 rounded-full object-cover cursor-pointer"
              />
            </MenuButton>
            <MenuItems className="absolute right-0 mt-2 w-44 bg-white rounded-md shadow-lg ring-1 ring-black/5 focus:outline-none">
              <div className="py-1">
                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={() => navigate("/myprofile")}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      My Profile
                    </button>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      Logout
                    </button>
                  )}
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
        ) : (
          <img
            onClick={() => navigate("/login")}
            src={assets.profile_icon}
            className="w-5 cursor-pointer"
            alt="Login"
          />
        )}

                {/* Favourite Heart (like cart) */}
        <button
          onClick={() => navigate("/FavouriteItems")}
          className="relative"
        >
          <img
            src={assets.heart} 
            className="w-6 cursor-pointer"
            alt="Favourites"
          />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            {favourites?.length || 0}
          </p>
        </button>
        
        {/* Cart */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative"
        >
          <img src={assets.cart_icon} className="w-5" alt="Cart" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            {getCartCount()}
          </p>
        </button>

        {/* Mobile Menu Icon */}
        <img
          onClick={() => setVisible(true)}
          className="w-5 cursor-pointer sm:hidden"
          src={assets.menu_icon}
          alt="Menu"
        />
      </div>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      {/* Mobile Side Menu */}
      <div
        className={`fixed top-0 right-0 h-screen bg-white transition-all z-50 ${
          visible ? "w-full sm:w-64" : "w-0"
        } overflow-y-auto`}
      >
        <div className="flex flex-col text-gray-600 h-full">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-4 cursor-pointer border-b"
          >
            <img
              className="h-4 rotate-180"
              src={assets.dropdown_icon}
              alt=""
            />
            <p>Back</p>
          </div>

          <nav className="flex flex-col flex-grow">
            <NavLink onClick={() => setVisible(false)} className="py-4 pl-6 border-b" to="/">
              HOME
            </NavLink>
            <NavLink onClick={() => setVisible(false)} className="py-4 pl-6 border-b" to="/collection">
              COLLECTION
            </NavLink>
            <NavLink onClick={() => setVisible(false)} className="py-4 pl-6 border-b" to="/about">
              ABOUT
            </NavLink>
            <NavLink onClick={() => setVisible(false)} className="py-4 pl-6 border-b" to="/contact">
              CONTACT
            </NavLink>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Navbar;