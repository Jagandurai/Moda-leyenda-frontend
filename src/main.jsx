import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import ShopContextWrapper from "./context/ShopContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import "flowbite"; // ✅ Add this line here

// ================= GLOBAL AXIOS CONFIG =================
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL; // Use env for backend URL

// Interceptor to attach JWT token from localStorage
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // JWT stored after login
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log("⚠️ Axios: no token found");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ShopContextWrapper>
        <App />
      </ShopContextWrapper>
    </GoogleOAuthProvider>
  </BrowserRouter>
);