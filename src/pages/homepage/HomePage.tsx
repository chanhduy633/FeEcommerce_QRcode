import React from "react";
import { toast } from "sonner";
import { useHomepageViewModel } from "../../domain/homepageViewModel";
import Header from "./components/Header";
import SidebarHome from "./components/SidebarHome";
import FilterPanel from "./components/FilterPanel";
import Pagination from "../admin/components/Pagination";
import ProductCard from "./components/ProductCard";
import Footer from "./components/Footer";
import { Package } from "lucide-react";

const Homepage = () => {
  const {
    loading,
    error,
    products,
    totalPages,
    currentPage,
    setCurrentPage,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchTerm,
    setSearchTerm,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    showFilters,
    setShowFilters,
  } = useHomepageViewModel();

  // Define a Product type if not already imported
  type Product = {
    id: string | number;
    name: string;
    price: number;
    // add other fields as needed
  };

  const handleBuyNow = (p: Product) =>
    toast.success(`Mua ngay: ${p.name}`, {
      description: `Giá: ${p.price.toLocaleString("vi-VN")}₫`,
    });

  const handleAddToCart = (p: Product) =>
    toast.success(`Đã thêm "${p.name}" vào giỏ hàng!`);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        cartItemCount={0}
      />

      <div className="flex">
        <SidebarHome
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[70vh]">
          <FilterPanel
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            sortBy={sortBy}
            onSortChange={setSortBy}
            totalProducts={products.length}
          />

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
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
