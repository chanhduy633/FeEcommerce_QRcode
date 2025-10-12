import React, { useState, useMemo, useEffect } from "react";
import { Search, Package } from "lucide-react";
import { toast } from "sonner";
import Header from "./components/Header";
import FilterPanel from "./components/FilterPanel";
import ProductCard from "./components/ProductCard";
import Pagination from "../admin/components/Pagination";
import SidebarHome from "./components/SidebarHome";
import Footer from "./components/Footer";
import { ProductViewModel } from "../../domain/productViewmodel";
import type { Product } from "../../types/Product";

const vm = new ProductViewModel();

const Homepage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    vm.getAllProducts()
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);
  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map((p) => p.category)));

    return ["Tất cả", ...unique];
  }, [products]);

  // States
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000000]);
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 8;

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = products;

    if (selectedCategory !== "Tất cả") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (searchTerm) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    switch (sortBy) {
      case "price-asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "popular":
        result = [...result].sort((a, b) => b.sold - a.sold);
        break;
      case "name":
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [products, selectedCategory, searchTerm, priceRange, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const handleBuyNow = (product: Product) => {
    toast.success(`Mua ngay: ${product.name}`, {
      description: `Giá: ${product.price.toLocaleString("vi-VN")}₫`,
    });
  };

  const handleAddToCart = (product: Product) => {
    toast.success(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePriceRangeChange = (range: [number, number]) => {
    setPriceRange(range);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  if (loading) return <div>Đang tải sản phẩm...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        categories={categories}
        cartItemCount={0}
      />
      <div className="flex">
        <SidebarHome
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Mobile Search */}
          <div className="md:hidden mb-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Filter Panel */}
          <FilterPanel
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
            priceRange={priceRange}
            onPriceRangeChange={handlePriceRangeChange}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            totalProducts={filteredProducts.length}
          />

          {/* Products Grid */}
          {paginatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onBuyNow={handleBuyNow}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Package size={64} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm</p>
            </div>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Homepage;
