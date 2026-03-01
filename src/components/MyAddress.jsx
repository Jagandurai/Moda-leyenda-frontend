import { useEffect, useState, useContext } from "react";
import { MdDeleteOutline } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";

export default function MyAddress() {
  const { selectedAddress, setSelectedAddress } =
    useContext(ShopContext);

  const [showForm, setShowForm] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: "",
    phone: "",
    pincode: "",
    locality: "",
    address: "",
    city: "",
    state: "",
    landmark: "",
    altPhone: "",
    type: "Home",
  });

  const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

  /* ================= FETCH ================= */
  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/addresses");
      const data = res.data.addresses || [];
      setAddresses(data);

      if (data.length > 0) {
        const current = data.find((a) => a.isCurrent);
        setSelectedAddress(current || data[0]);
      } else {
        setSelectedAddress(null);
      }
    } catch {
      toast.error("Failed to fetch addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  /* ================= FORM ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  };


const validateForm = () => {
  const required = ["name", "phone", "pincode", "locality", "address", "city", "state"];
  let valid = true;
  let newErrors = {};

  required.forEach((field) => {
    if (!form[field]?.trim()) {
      newErrors[field] = true;
      valid = false;
    }
  });

  // ✅ Main Phone Validation (10 digits)
  if (!/^\d{10}$/.test(form.phone)) {
    toast.error("Phone number must be exactly 10 digits");
    newErrors.phone = true;
    valid = false;
  }

  // ✅ Pincode Validation (6 digits)
  if (!/^\d{6}$/.test(form.pincode)) {
    toast.error("Pincode must be exactly 6 digits");
    newErrors.pincode = true;
    valid = false;
  }

  // ✅ Alternate Phone Validation (only if entered)
  if (form.altPhone && !/^\d{10}$/.test(form.altPhone)) {
    toast.error("Alternate phone number must be exactly 10 digits");
    newErrors.altPhone = true;
    valid = false;
  }

  if (!valid) toast.error("Please fill all required fields correctly");

  setErrors(newErrors);
  return valid;
};


  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      await api.post("/api/addresses", form);
      toast.success("Address saved successfully!");
      setShowForm(false);
      setForm({
        name: "",
        phone: "",
        pincode: "",
        locality: "",
        address: "",
        city: "",
        state: "",
        landmark: "",
        altPhone: "",
        type: "Home",
      });
      fetchAddresses();
    } catch {
      toast.error("Failed to save address");
    }
  };

  /* ================= SET CURRENT ================= */
  const setCurrentAddress = async (id) => {
    try {
      await api.patch(`/api/addresses/${id}/current`);
      fetchAddresses();
    } catch {
      toast.error("Failed to set current address");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/addresses/${id}`);

      if (selectedAddress?._id === id) {
        setSelectedAddress(null);
      }

      toast.success("Address deleted");
      fetchAddresses();
    } catch {
      toast.error("Failed to delete address");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-4">

      {/* ================= ADDRESS LIST ================= */}
      {!showForm && (
        <>
          <button
            onClick={() => setShowForm(true)}
            className="text-blue-600 font-semibold mb-4 border border-blue-600 px-4 py-2 rounded hover:bg-blue-50"
          >
            + ADD A NEW ADDRESS
          </button>

          {loading ? (
            <p>Loading addresses...</p>
          ) : (
            <div className="space-y-4">
              {addresses.map((addr) => {
                const isSelected =
                  selectedAddress?._id === addr._id;

                return (
                  <label
                    key={addr._id}
                    className={`flex gap-4 border p-4 rounded cursor-pointer ${
                      isSelected
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      checked={isSelected}
                      onChange={() => {
                        setSelectedAddress(addr);
                        setCurrentAddress(addr._id);
                      }}
                    />

                    <div className="flex-1">
                      <p className="font-semibold">
                        {addr.name} - {addr.phone}
                      </p>
                      <p className="text-sm">
                        {addr.address}, {addr.city}, {addr.state} -{" "}
                        {addr.pincode}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(addr._id);
                      }}
                      className="text-red-500"
                    >
                      <MdDeleteOutline size={22} />
                    </button>
                  </label>
                );
              })}

              {addresses.length === 0 && (
                <p>No address found. Please add one.</p>
              )}
            </div>
          )}
        </>
      )}

      {/* ================= ADD ADDRESS FORM ================= */}
      {showForm && (
        <div className="border p-6 rounded mt-4">
          <h2 className="font-semibold mb-4">ADD A NEW ADDRESS</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {["name", "phone", "pincode", "locality"].map((field) => (
              <input
                key={field}
                name={field}
                value={form[field]}
                onChange={handleChange}
                placeholder={field}
                className="border p-2 rounded"
              />
            ))}
          </div>

          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Full address"
            className="border p-2 rounded w-full mt-3"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            {["city", "state", "landmark", "altPhone"].map((field) => (
              <input
                key={field}
                name={field}
                value={form[field]}
                onChange={handleChange}
                placeholder={field}
                className="border p-2 rounded"
              />
            ))}
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={handleSave}
              className="bg-blue-600 text-white px-6 py-2 rounded"
            >
              SAVE
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="border px-6 py-2 rounded"
            >
              CANCEL
            </button>
          </div>
        </div>
      )}
    </div>
  );
}