import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import FavouriteItems from "../components/FavouriteItems";
import MyAddress from "../components/MyAddress";
import Orders from "../Pages/Orders.jsx"; // ✅ import Orders here
import { ShopContext } from "../context/ShopContext.jsx";

const countryCodes = [
  { code: "+91", label: "India (+91)" },
  { code: "+1", label: "USA (+1)" },
  { code: "+44", label: "UK (+44)" },
  { code: "+61", label: "Australia (+61)" },
];

const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

const MyProfile = () => {
  const navigate = useNavigate();
  const { accessToken, setAccessToken, setCartItems } = useContext(ShopContext);

  const [activeTab, setActiveTab] = useState("favourites");
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    gender: "male",
    countryCode: "+91",
    phone: "",
    avatarUrl: "",
    file: null,
  });

  /* ================= FETCH PROFILE ================= */
  const fetchProfile = async () => {
    try {
      if (!accessToken) return;

      const res = await axios.get(`${API}/api/user/profile`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.data?.user) {
        toast.error("Failed to fetch profile.");
        return;
      }

      const profile = res.data.user;
      setUser(profile);
      setFormData({
        name: profile.name || "",
        gender: profile.gender || "male",
        countryCode: profile.countryCode || "+91",
        phone: profile.phone || "",
        avatarUrl: profile.avatar || "",
        file: null,
      });
    } catch (error) {
      console.error("Fetch profile error:", error);
      toast.error("Failed to fetch profile.");
      if (error.response?.status === 401) handleLogout();
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [accessToken]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    if (!isEditing) return;
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (!isEditing) return;
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        avatarUrl: URL.createObjectURL(file),
        file,
      });
    }
  };

  /* ================= VALIDATION ================= */
  const validateProfile = () => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return false;
    }
    if (!formData.phone.trim()) {
      toast.error("Phone number is required");
      return false;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error("Phone number must be 10 digits");
      return false;
    }
    return true;
  };

  /* ================= SAVE PROFILE ================= */
  const handleSave = async () => {
    if (!validateProfile()) return;

    try {
      if (!accessToken) return toast.error("Not logged in");

      const data = new FormData();
      data.append("name", formData.name);
      data.append("gender", formData.gender);
      data.append("phone", formData.phone);
      data.append("countryCode", formData.countryCode);
      if (formData.file) data.append("avatar", formData.file);

      const res = await axios.put(`${API}/api/user/profile`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        setUser(res.data.user);
        setFormData((prev) => ({
          ...prev,
          avatarUrl: res.data.user.avatar || prev.avatarUrl,
          file: null,
        }));
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      } else {
        toast.error(res.data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save profile");
    }
  };

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    navigate("/login");
    setTimeout(() => {
      localStorage.removeItem("accessToken");
      setAccessToken("");
      setCartItems({});
      toast.success("Logged out successfully!");
    }, 0);
  };

  if (!user) return <div className="p-4 text-center">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* ================= LEFT PROFILE CARD ================= */}
        <div className="w-full lg:w-1/3 bg-white rounded-xl shadow overflow-hidden">
          <div className="bg-blue-600 px-6 py-4">
            <h2 className="text-white text-lg font-semibold">My Account</h2>
            <p className="text-blue-100 text-sm">Manage profile & preferences</p>
          </div>

          <div className="p-6 flex flex-col items-center text-center">
            {/* IMAGE */}
            <img
              src={formData.avatarUrl || "/default-avatar.png"}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover mb-3"
            />

            {isEditing && (
              <label className="text-sm text-blue-600 cursor-pointer mb-4">
                Change Profile Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}

            {/* NAME */}
            {!isEditing ? (
              <h2 className="text-lg font-semibold">{user.name}</h2>
            ) : (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="border rounded-md px-4 py-3 w-full mb-3 text-base"
                placeholder="Name"
              />
            )}

            {/* GENDER */}
            {!isEditing ? (
              <p className="text-sm text-gray-600 capitalize mb-2">
                Gender: {user.gender}
              </p>
            ) : (
              <div className="flex gap-4 mb-4">
                {["male", "female", "other"].map((g) => (
                  <label key={g} className="flex items-center gap-1 text-sm">
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={formData.gender === g}
                      onChange={handleChange}
                    />
                    {g}
                  </label>
                ))}
              </div>
            )}

            {/* PHONE */}
            {!isEditing ? (
              <p className="text-gray-600 text-sm mb-4">
                {user.countryCode} {user.phone}
              </p>
            ) : (
              <div className="flex gap-2 w-full mb-4">
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  className="border rounded-md px-2 py-2 text-sm"
                >
                  {countryCodes.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="border rounded-md px-4 py-3 w-full text-base"
                  placeholder="10-digit mobile number"
                />
              </div>
            )}

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6 w-full">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-md text-base hover:bg-green-700 transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: user.name || "",
                        gender: user.gender || "male",
                        countryCode: user.countryCode || "+91",
                        phone: user.phone || "",
                        avatarUrl: user.avatar || "",
                        file: null,
                      });
                    }}
                    className="flex-1 px-4 py-3 bg-gray-400 text-white rounded-md text-base hover:bg-gray-500 transition"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-md text-base hover:bg-blue-700 transition"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 px-4 py-3 bg-red-500 text-white rounded-md text-base hover:bg-red-600 transition"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>

          {/* MENU */}
          <div className="border-t bg-gray-50 px-6 py-3">
            <h3 className="text-sm font-semibold text-blue-700">Account Menu</h3>
          </div>

          <div>
            {[
              { key: "favourites", label: "Favourite Products" },
              { key: "myorders", label: "My Orders" }, // ✅ Orders toggle added
              { key: "address", label: "Shipping Address" },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`w-full text-left px-6 py-3 border-l-4 transition ${
                  activeTab === item.key
                    ? "border-blue-600 bg-blue-50 text-blue-600 font-medium"
                    : "border-transparent hover:bg-gray-100"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* ================= RIGHT CONTENT ================= */}
        <div className="w-full lg:w-2/3 bg-white rounded-xl p-1 sm:p-1">
          {activeTab === "favourites" && <FavouriteItems />}
          {activeTab === "myorders" && <Orders />} {/* ✅ Added Orders component */}
          {activeTab === "address" && <MyAddress />}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;