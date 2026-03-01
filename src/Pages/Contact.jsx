import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsLetterBox from "../components/NewsLetterBox";

function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/api/contact/send", formData);

      if (res.data.success) {
        toast.success("Message sent successfully!");
        setFormData({ firstName: "", lastName: "", email: "", phone: "", message: "" });
      } else {
        toast.error(res.data.message || "Failed to send message");
      }
    } catch (error) {
      toast.error("Error sending message. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-gray-800">
      {/* ---------- Page Title ---------- */}
      <div className="text-2xl text-center pt-10 border-t border-gray-300">
        <Title text1={"CONTACT"} text2={"US"} />
      </div>

      {/* ---------- Contact Section (Image + Form) ---------- */}
      <div className="flex flex-col lg:flex-row justify-center items-start gap-6 px-4 py-10">
        {/* ---------- Left: Image ---------- */}
        <div className="flex justify-center w-full lg:w-1/2">
          <img
            src={assets.contact_img}
            alt="Contact"
            className="w-full max-w-[400px] rounded-md"
          />
        </div>

        {/* ---------- Right: Contact Info + Form ---------- */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          {/* Contact Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm text-gray-700">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-800
                             placeholder-gray-400 focus:border-black focus:ring-1 focus:ring-black"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm text-gray-700">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-800
                             placeholder-gray-400 focus:border-black focus:ring-1 focus:ring-black"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-800
                           placeholder-gray-400 focus:border-black focus:ring-1 focus:ring-black"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm text-gray-700">
                Mobile Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+91-1234567890"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-800
                           placeholder-gray-400 focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm text-gray-700">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                placeholder="Write your message here..."
                value={formData.message}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-800
                           placeholder-gray-400 focus:border-black focus:ring-1 focus:ring-black"
                required
              ></textarea>
            </div>

            {/* ---------- Centered Black Button ---------- */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-black text-white px-6 py-2 font-500"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ---------- Newsletter ---------- */}
      <NewsLetterBox />
    </div>
  );
}

export default Contact;