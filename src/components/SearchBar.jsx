import { useContext, useEffect, useState, useRef } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { useLocation, useNavigate } from "react-router-dom";

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
  const [visible, setVisible] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // Allow search only on Home + Collection
  useEffect(() => {
    const allowedRoutes =
      location.pathname === "/" ||
      location.pathname.includes("collection");

    setVisible(allowedRoutes && showSearch);
  }, [location.pathname, showSearch]);

  // Focus input when search becomes visible
  useEffect(() => {
    if (visible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [visible]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // Enter key → navigate
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && search.trim() !== "") {
      navigate(`/collection?search=${search}`);
    }
  };

  return showSearch && visible ? (
    <div className="border-t border-b bg-gray-50 text-center">
      <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2">
        <input
          ref={inputRef}
          value={search}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          className="flex-1 outline-none bg-inherit text-sm"
          type="text"
          placeholder="Search"
        />
        <img
          onClick={() => {
            setShowSearch(false);  // close the search bar
            setSearch("");          // clear the search input
          }}
          className="w-4 cursor-pointer"
          src={assets.cross_icon}
          alt="Close search"
        />
      </div>
    </div>
  ) : null;
};

export default SearchBar;