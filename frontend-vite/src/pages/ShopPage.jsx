import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { X } from 'lucide-react';

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [selectedCats, setSelectedCats] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sort, setSort] = useState('');
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('/api/products');
        const productList = Array.isArray(data) ? data : data.products || [];

        setProducts(productList);
        setFiltered(productList);
        setCategories([...new Set(productList.map((p) => p.category))]);
        setBrands([...new Set(productList.map((p) => p.brand))]);
      } catch (err) {
        console.error('Error fetching products:', err);
        setProducts([]);
        setFiltered([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let temp = [...products];

    if (selectedCats.length > 0) {
      temp = temp.filter((p) => selectedCats.includes(p.category));
    }
    if (selectedBrands.length > 0) {
      temp = temp.filter((p) => selectedBrands.includes(p.brand));
    }

    temp = temp.filter((p) => p.price <= maxPrice);

    switch (sort) {
      case 'price-low':
        temp.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        temp.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        temp.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        temp.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }

    setFiltered(temp);
  }, [selectedCats, selectedBrands, maxPrice, sort, products]);

  const toggleFilter = (type, value) => {
    if (type === 'category') {
      setSelectedCats((prev) =>
        prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
      );
    } else {
      setSelectedBrands((prev) =>
        prev.includes(value) ? prev.filter((b) => b !== value) : [...prev, value]
      );
    }
  };

  const removeFilter = (type, value) => {
    toggleFilter(type, value);
  };

  const resetFilters = () => {
    setSelectedCats([]);
    setSelectedBrands([]);
    setMaxPrice(10000);
    setSort('');
  };

  return (
    <section className="px-4 md:px-8 py-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        {/* SIDEBAR */}
        <aside className="md:w-1/4 space-y-6">
          {/* CATEGORY FILTER */}
          <div className="bg-white dark:bg-background-darkSecondary rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold text-primary mb-3">Categories</h3>
            {categories.map((cat) => (
              <label key={cat} className="flex items-center gap-2 text-sm mb-2">
                <input
                  type="checkbox"
                  checked={selectedCats.includes(cat)}
                  onChange={() => toggleFilter('category', cat)}
                  className="accent-primary"
                />
                <span className="capitalize">{cat}</span>
              </label>
            ))}
          </div>

          {/* BRAND FILTER */}
          <div className="bg-white dark:bg-background-darkSecondary rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold text-primary mb-3">Brands</h3>
            {brands.map((brand) => (
              <label key={brand} className="flex items-center gap-2 text-sm mb-2">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleFilter('brand', brand)}
                  className="accent-primary"
                />
                <span className="capitalize">{brand}</span>
              </label>
            ))}
          </div>

          {/* PRICE FILTER */}
          <div className="bg-white dark:bg-background-darkSecondary rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold text-primary mb-3">Max Price</h3>
            <input
              type="range"
              min="100"
              max="10000"
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <p className="text-sm mt-1">
              Up to: <strong>KSh {maxPrice.toLocaleString()}</strong>
            </p>
          </div>

          <button
            onClick={resetFilters}
            className="w-full py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Reset Filters
          </button>
        </aside>

        {/* MAIN GRID */}
        <main className="flex-1">
          {/* FILTER CHIPS */}
          {(selectedCats.length > 0 || selectedBrands.length > 0) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedCats.map((cat) => (
                <span
                  key={cat}
                  className="flex items-center gap-1 bg-primary text-white text-xs px-3 py-1 rounded-full"
                >
                  {cat}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => removeFilter('category', cat)} />
                </span>
              ))}
              {selectedBrands.map((brand) => (
                <span
                  key={brand}
                  className="flex items-center gap-1 bg-primary text-white text-xs px-3 py-1 rounded-full"
                >
                  {brand}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => removeFilter('brand', brand)} />
                </span>
              ))}
            </div>
          )}

          {/* SORTING */}
          <div className="flex justify-end mb-4">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-sm px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-background-darkSecondary dark:text-white"
            >
              <option value="">Sort by</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-asc">Name: A-Z</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          {/* PRODUCT GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-60 bg-gray-100 dark:bg-background-darkSecondary rounded animate-pulse"
                ></div>
              ))
            ) : filtered.length === 0 ? (
              <p className="col-span-full text-center text-gray-500 dark:text-text-darkSecondary">
                No products match your filters.
              </p>
            ) : (
              filtered.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            )}
          </div>
        </main>
      </div>
    </section>
  );
};

export default ShopPage;
