/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext.jsx";
import { assets } from "../assets/assets.js";
import Title from "../components/Title.jsx";
import ProductItem from "../components/ProductItem.jsx";
import { useLocation } from "react-router-dom";
import axios from "axios";

function Collection() {
  const { products, search } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);

  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [subCategoryFilter, setSubCategoryFilter] = useState([]);
  const [typeFilter, setTypeFilter] = useState([]);
  const [sizeFilter, setSizeFilter] = useState([]);
  const [filterProducts, setFilterProducts] = useState([]);
  const [sortType, setSortType] = useState("relavant");

  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const itemsPerPage = 15;

  const location = useLocation();

  const searchQuery = new URLSearchParams(location.search).get("search") || "";

  /* ---------------- FETCH CATEGORIES FROM BACKEND ---------------- */
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/category/public-list`);
      if (res.data.success) setCategories(res.data.categories || []);
    } catch (err) {
      console.error("Fetch Categories Error: ", err);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* ---------------- HANDLE URL QUERY PARAMETERS ---------------- */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryFromURL = params.get("category");
    const subCategoryFromURL = params.get("subCategory");
    const typeFromURL = params.get("type");

    if (typeFromURL) {
      setTypeFilter([typeFromURL]);
      setCategoryFilter([]);
      setSubCategoryFilter([]);
    } else if (subCategoryFromURL) {
      setCategoryFilter([]);
      setSubCategoryFilter([subCategoryFromURL]);
      setTypeFilter([]);
    } else if (categoryFromURL) {
      setCategoryFilter([categoryFromURL]);
      setSubCategoryFilter([]);
      setTypeFilter([]);
    } else {
      setCategoryFilter([]);
      setSubCategoryFilter([]);
      setTypeFilter([]);
    }
  }, [location.search]);

  /* ---------------- TOGGLE FILTERS ---------------- */
  const toggleCategory = (c) => {
    if (categoryFilter.includes(c)) {
      setCategoryFilter([]);
      setSubCategoryFilter([]);
      setTypeFilter([]);
    } else {
      setCategoryFilter([c]);
      setSubCategoryFilter([]);
      setTypeFilter([]);
    }
  };

  const toggleSubCategory = (s) => {
    if (subCategoryFilter.includes(s)) setSubCategoryFilter([]);
    else setSubCategoryFilter([s]);
    setTypeFilter([]);
  };

  const toggleType = (t) => {
    setTypeFilter((prev) =>
      prev.includes(t) ? prev.filter((i) => i !== t) : [...prev, t]
    );
  };

  const toggleSize = (s) => {
    setSizeFilter((prev) =>
      prev.includes(s) ? prev.filter((i) => i !== s) : [...prev, s]
    );
  };

  /* ---------------- APPLY FILTER ---------------- */
  const applyFilter = () => {
    let filtered = [...products];

    if (categoryFilter.length > 0) {
      filtered = filtered.filter((item) => categoryFilter.includes(item.category));
    }

    if (subCategoryFilter.length > 0) {
      filtered = filtered.filter((item) => subCategoryFilter.includes(item.subCategory));
    }

    if (typeFilter.length > 0) {
      filtered = filtered.filter((item) =>
        typeFilter.some(
          (t) => item.type && t.toLowerCase().trim() === item.type.toLowerCase().trim()
        )
      );
    }

    if (sizeFilter.length > 0) {
      filtered = filtered.filter((item) =>
        item.sizes?.some((sz) => sizeFilter.includes(sz))
      );
    }

    if (search.trim() !== "") {
      const normalize = (text) =>
        text?.toLowerCase().replace(/[-&]/g, "").replace(/\s+/g, "").replace(/s$/, "");
      const searchTerm = normalize(search);

      filtered = filtered.filter((item) => {
        const fieldsToSearch = [
          item.name,
          item.category,
          item.subCategory,
          item.type,
          ...(item.sizes || []),
        ];
        return fieldsToSearch.some((field) => normalize(field)?.includes(searchTerm));
      });
    }

    setFilterProducts(filtered);
    setCurrentPage(1); // Reset to first page when filter applied
  };

  /* ---------------- SORT PRODUCTS ---------------- */
  const sortProduct = () => {
    let filteredCopy = [...filterProducts];
    switch (sortType) {
      case "low-high":
        setFilterProducts(filteredCopy.sort((a, b) => a.price.discounted - b.price.discounted));
        break;
      case "high-low":
        setFilterProducts(filteredCopy.sort((a, b) => b.price.discounted - a.price.discounted));
        break;
      default:
        applyFilter();
        break;
    }
  };

  useEffect(() => {
    applyFilter();
  }, [categoryFilter, subCategoryFilter, typeFilter, sizeFilter, products, search]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  const sizes = ["S", "M", "L", "XL", "XXL"];
  const categoriesList = categories.map((c) => c.name);

  /* ---------------- PAGINATION ---------------- */
  const totalPages = Math.ceil(filterProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filterProducts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex flex-col sm:flex-row gap-6 pt-10 border-t">
      {/* LEFT FILTER PANEL */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2 font-semibold"
        >
          FILTERS
          <img
            className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
            src={assets.dropdown_icon}
            alt=""
          />
        </p>

        <div className={`border border-gray-300 p-5 mt-6 rounded-lg shadow-sm ${showFilter ? "" : "hidden"} sm:block`}>
          {/* Category Filter */}
          <div className="mb-6">
            <p className="text-sm font-medium mb-2">Category</p>
            <div className="ml-3 flex flex-col gap-3 text-sm font-light text-gray-700">
              {categoriesList.map((c) => (
                <button
                  key={c}
                  onClick={() => toggleCategory(c)}
                  className={`flex items-center gap-2 p-2 rounded-lg w-full text-left hover:bg-blue-50 transition-colors font-medium ${
                    categoryFilter.includes(c) ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Subcategory & Type Filters */}
          {categories
            .filter((c) => categoryFilter.includes(c.name))
            .map((c) => (
              <div key={c._id} className="mb-6">
                <p className="text-sm font-medium mb-3">{c.name} Categories</p>
                <div className="ml-3 flex flex-col gap-3 text-sm font-light text-gray-700">
                  {c.subCategories?.map((sub) => (
                    <div key={sub._id}>
                      <label className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors">
                        <input
                          type="checkbox"
                          value={sub.name}
                          checked={subCategoryFilter.includes(sub.name)}
                          onChange={() => toggleSubCategory(sub.name)}
                          className="w-3 h-3"
                        />
                        {sub.name}
                      </label>

                      {/* Types under subcategory */}
                      {subCategoryFilter.includes(sub.name) && (
                        <div className="ml-5 mt-1 flex flex-col gap-2">
                          {sub.types?.map((type) => (
                            <label key={type._id || type.name} className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors">
                              <input
                                type="checkbox"
                                value={type.name}
                                checked={typeFilter.includes(type.name)}
                                onChange={() => toggleType(type.name)}
                                className="w-3 h-3"
                              />
                              {type.name}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

          {/* Size Filter */}
          <div className="mb-6">
            <p className="text-sm font-medium mb-2">Sizes</p>
            <div className="flex gap-3 flex-wrap">
              {sizes.map((sz) => (
                <label
                  key={sz}
                  className={`border px-3 py-1 rounded cursor-pointer ${
                    sizeFilter.includes(sz) ? "bg-blue-500 text-white" : "bg-gray-100"
                  }`}
                >
                  <input
                    type="checkbox"
                    value={sz}
                    checked={sizeFilter.includes(sz)}
                    onChange={() => toggleSize(sz)}
                    className="hidden"
                  />
                  {sz}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Products */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1={"ALL"} text2={"COLLECTIONS"} />
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border-2 border-gray-300 text-sm px-2 rounded"
          >
            <option value="relavant">Sort by : Relevant</option>
            <option value="low-high">Sort by : Low to High</option>
            <option value="high-low">Sort by : High to Low</option>
          </select>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {currentProducts.map((item) => {
            const isOutOfStock = !item.inStock;
            const showFewItems = item.fewItemsLeft && item.inStock;
            let discountPercent = 0;

            if (item.price?.original && item.price?.discounted && item.price.original > item.price.discounted) {
              discountPercent = Math.round(((item.price.original - item.price.discounted) / item.price.original) * 100);
            }

            return (
              <ProductItem
                key={item._id}
                id={item._id}
                name={item.name}
                image={item.image}
                price={item.price}
                discountPercent={discountPercent}
                bestseller={item.bestseller}
                inStock={!isOutOfStock}
                outOfStock={isOutOfStock}
                fewItemsLeft={showFewItems}
              />
            );
          })}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
              <span className="font-medium">{Math.min(startIndex + itemsPerPage, filterProducts.length)}</span> of{" "}
              <span className="font-medium">{filterProducts.length}</span> results
            </p>
            <nav className="isolate inline-flex -space-x-px rounded-md">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 hover:bg-gray-100"
              >
                <span className="sr-only">Previous</span>
                &#8249;
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`relative px-4 py-2 text-sm font-semibold ${
                    currentPage === i + 1 ? "bg-blue-700 text-white" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 hover:bg-gray-100"
              >
                <span className="sr-only">Next</span>
                &#8250;
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Collection;