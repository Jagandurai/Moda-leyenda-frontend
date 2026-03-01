/* eslint-disable no-unused-vars */
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextWrapper = ({ children }) => {
  const currency = "₹ ";
  const delivery_fee = 10;
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [favourites, setFavourites] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const navigate = useNavigate();

  /* ================= LOAD TOKEN ================= */
    useEffect(() => {
      const token = localStorage.getItem("accessToken");
      if (token) setAccessToken(token);
    }, []);

  /* ================= RESET STATE ON LOGOUT ================= */
    useEffect(() => {
      if (!accessToken) {
        setCartItems({});
        setFavourites([]);
        setAddresses([]);
        setSelectedAddress(null);
      }
    }, [accessToken]);

    const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    setAccessToken("");
    setRefreshToken("");

    // Reset all user state
    setCartItems({});
    setFavourites([]);
    setAddresses([]);
    setSelectedAddress(null);

    toast.info("Logged out successfully");
    navigate("/login");
  };

  /* ================= ADDRESS ================= */

    const fetchAddresses = async () => {
    if (!accessToken) return;

    try {
      const res = await axios.get(`${backendURL}/api/addresses`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const data = Array.isArray(res.data)
        ? res.data
        : res.data.addresses || [];

      setAddresses(data);

      // ✅ FIX: Ensure selectedAddress still exists in new list
      if (data.length === 0) {
        setSelectedAddress(null);
      } else {
        setSelectedAddress((prev) => {
          const exists = data.find((addr) => addr._id === prev?._id);
          return exists || data[0];
        });
      }

    } catch {
      setAddresses([]);
      setSelectedAddress(null); // ✅ Also clear on error
    }
  };

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/product/list`);
        if (res.data.success) setProducts(res.data.products || []);
      } catch (err) {
        toast.error("Failed to load products");
      }
    };

    fetchProducts();
  }, []);

  /* ================= FETCH USER CART (SOURCE OF TRUTH) ================= */
  const fetchUserCart = async () => {
    if (!accessToken) return;

    try {
      const res = await axios.post(
        `${backendURL}/api/cart/get`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (res.data.success) {
        const backendCart = res.data.cartData || {};

        // ✅ REMOVE CART ITEMS WHOSE PRODUCTS WERE DELETED BY ADMIN
        const validProductIds = new Set(products.map(p => p._id));
        const cleanedCart = {};

        for (const pid in backendCart) {
          if (!validProductIds.has(pid)) continue;
          cleanedCart[pid] = backendCart[pid];
        }

        setCartItems(cleanedCart);
      }
    } catch (err) {
      setCartItems({});
    }
  };

  /* ================= FETCH CART ON LOGIN ================= */
  useEffect(() => {
    if (accessToken) {
      fetchUserCart();
    }
  }, [accessToken]);


  /* ================= FETCH ADDRESSES ON LOGIN ================= */
  useEffect(() => {
    if (accessToken) {
      fetchAddresses();
    }
  }, [accessToken]);


  /* ================= 🔥 RE-SYNC CART WHEN PRODUCTS CHANGE ================= */
  useEffect(() => {
    if (accessToken && products.length) {
      fetchUserCart();
    }
  }, [products]);

  /* ================= FETCH FAVOURITES ================= */
  useEffect(() => {
    if (!accessToken) return;

    const fetchFavourites = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/favourites/get`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (res.data.success) {
          setFavourites(res.data.favourites || []);
        }
      } catch {
        setFavourites([]);
      }
    };

    fetchFavourites();
  }, [accessToken]);

  /* ================= TOGGLE FAVOURITE ================= */
  const toggleFavourite = async (productId) => {
    if (!accessToken) {
      toast.error("Please login to continue");
      navigate("/login");
      return false;
    }

    try {
      const res = await axios.post(
        `${backendURL}/api/favourites/toggle`,
        { productId },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (res.data.success) {
        setFavourites(res.data.favourites || []);
        return true;
      }
    } catch {
      toast.error("Failed to update favourite");
    }

    return false;
  };


/* ================= ADD TO CART (QUANTITY FIXED) ================= */
const addToCart = async (itemId, size, quantity = 1) => {
  if (!accessToken) {
    toast.error("Please login to continue");
    navigate("/login");
    return false;
  }

  if (!size) {
    toast.error("Select product size");
    return false;
  }

  const cartData = structuredClone(cartItems);

  if (cartData[itemId]) {
    if (cartData[itemId][size]) {
      // ✅ Add selected quantity
      cartData[itemId][size] += quantity;
    } else {
      cartData[itemId][size] = quantity;
    }
  } else {
    cartData[itemId] = {};
    cartData[itemId][size] = quantity;
  }

  setCartItems(cartData);

  try {
    await axios.post(
      `${backendURL}/api/cart/add`,
      { itemId, size, quantity }, // ✅ Send actual quantity
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return true;
  } catch (err) {
    console.error("Add to cart error:", err);
    toast.error("Failed to add to cart");
    return false;
  }
};

  /* ================= UPDATE CART ================= */
  const updateQuantity = async (itemId, size, quantity) => {
    if (!accessToken) {
      toast.error("Please login to continue");
      navigate("/login");
      return false;
    }

    const cartData = structuredClone(cartItems);

    if (quantity <= 0) {
      delete cartData[itemId]?.[size];
      if (Object.keys(cartData[itemId] || {}).length === 0) {
        delete cartData[itemId];
      }
    } else {
      if (!cartData[itemId]) cartData[itemId] = {};
      cartData[itemId][size] = quantity;
    }

    setCartItems(cartData);

    try {
      await axios.post(
        `${backendURL}/api/cart/update`,
        { itemId, size, quantity },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      return true;
    } catch {
      toast.error("Failed to update cart");
      return false;
    }
  };

  /* ================= CART COUNT ================= */
  const getCartCount = () => {
    let total = 0;
    for (const pid in cartItems) {
      for (const sz in cartItems[pid]) {
        total += cartItems[pid][sz];
      }
    }
    return total;
  };

  /* ================= CART AMOUNT ================= */
  const getCartAmount = () => {
    let totalAmount = 0;

    if (!products.length) return 0;

    for (const productId in cartItems) {
      const product = products.find(
        p => String(p._id) === String(productId)
      );
      if (!product) continue;

      const price = product.price?.discounted || 0;

      for (const size in cartItems[productId]) {
        totalAmount += price * cartItems[productId][size];
      }
    }

    return totalAmount;
  };

  /* ================= CONTEXT ================= */
  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    updateQuantity,
    getCartCount,
    getCartAmount,
    favourites,
    toggleFavourite,
    accessToken,
    setAccessToken,
    refreshToken,
    setRefreshToken,
    logout,
    navigate,
    backendURL,
    addresses,
    selectedAddress,
    setSelectedAddress,
    fetchAddresses,
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextWrapper;
