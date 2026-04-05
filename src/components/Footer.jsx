import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full py-14 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          {/* Logo */}
          <Link to="/" className="flex justify-center">
            <img src={assets.logo} className="max-w-40 h-auto" alt="logo" />
          </Link>

          {/* Brand description */}
          <p className="text-black-500 text-60 mt-4">
            Moda Leyenda is an innovative online store offering a curated selection of fashion, electronics, and home essentials. Our mission is to make shopping seamless, fun, and reliable for everyone.
          </p>

          {/* Admin Contact */}
          <p className="text-sm text-black-400 mt-1">
            Phone: +91 63623 50435 | Email: modaleyendaa@gmail.com
          </p>

          {/* Navigation Links */}
          <ul className="text-lg flex flex-col gap-7 md:flex-row md:gap-12 py-16 mb-10 border-b border-gray-200 justify-center">
            <li>
              <Link to="/" className="text-gray-800 hover:text-gray-900">
                Home
              </Link>
            </li>
            <li>
              <Link to="/Collection" className="text-gray-800 hover:text-gray-900">
                Collection
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-gray-800 hover:text-gray-900">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-gray-800 hover:text-gray-900">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-gray-800 hover:text-gray-900">
                Support
              </Link>
            </li>
          </ul>

          {/* Social Icons */}
          <div className="flex space-x-10 justify-center items-center mb-14">
            {/* Instagram */}
            <a href="#" className="text-gray-900 hover:text-indigo-600 transition-all duration-500">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.75 2A5.75 5.75 0 002 7.75v8.5A5.75 5.75 0 007.75 22h8.5A5.75 5.75 0 0022 16.25v-8.5A5.75 5.75 0 0016.25 2h-8.5zM12 7.75a4.25 4.25 0 110 8.5 4.25 4.25 0 010-8.5zm5.5-.75a1 1 0 110 2 1 1 0 010-2z"/>
              </svg>
            </a>
            {/* Facebook */}
            <a href="#" className="text-gray-900 hover:text-indigo-600 transition-all duration-500">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12a10 10 0 10-11.63 9.87v-6.98h-2.21V12h2.21V9.66c0-2.18 1.3-3.39 3.3-3.39.95 0 1.94.17 1.94.17v2.14h-1.1c-1.09 0-1.43.68-1.43 1.38V12h2.43l-.39 2.89h-2.04v6.98A10 10 0 0022 12z"/>
              </svg>
            </a>
            {/* Twitter */}
            <a href="#" className="text-gray-900 hover:text-indigo-600 transition-all duration-500">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 001.88-2.38c-.83.5-1.75.86-2.73 1.05A4.28 4.28 0 0015.5 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.11.99-3.56-.18-6.73-1.88-8.85-4.47-.37.63-.58 1.37-.58 2.16 0 1.49.76 2.81 1.91 3.58-.7-.02-1.36-.21-1.94-.53v.05c0 2.08 1.48 3.82 3.44 4.21-.36.1-.73.16-1.12.16-.27 0-.53-.03-.78-.08.53 1.65 2.06 2.85 3.87 2.88A8.61 8.61 0 012 19.54 12.15 12.15 0 008.29 21c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.32 8.32 0 0022.46 6z"/>
              </svg>
            </a>
          </div>

          {/* Copyright and heart */}
          <div className="text-center">
            <span className="text-lg text-black block">
              © {new Date().getFullYear()} Moda Leyenda. All rights reserved.
            </span>
            <span className="text-sm text-gray-500 block mt-1">
              Designed & Developed by Jagan{" "}
              <span className="inline-block text-red-500 animate-pulse">❤️</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
