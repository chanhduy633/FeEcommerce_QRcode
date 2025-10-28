import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useHomepageViewModel } from "../../app/viewmodels/homepageViewModel";
import Header from "./components/Header";
import SidebarHome from "./components/SidebarHome";
import FilterPanel from "./components/FilterPanel";
import Pagination from "../admin/components/Pagination";
import ProductCard from "./components/ProductCard";
import Footer from "./components/Footer";
import { Package } from "lucide-react";
import CartSidebar from "./components/CartSideBar";

const Homepage = () => {
  const userId = "68e32edd1285249e635ad98b"; // temp user id
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
    cart,
    fetchCart,
    handleAddToCart,
    handleUpdateQuantity,
    handleRemoveItem,
    getProductById,
  } = useHomepageViewModel();

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    fetchCart(userId);
  }, []);

  const handleBuyNow = (product: any) => {
    toast.success(`Mua ngay: ${product.name}`, {
      description: `Giá: ${product.price.toLocaleString("vi-VN")}₫`,
    });
  };

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
        cartItemCount={cart?.items?.length ?? 0}
        onCartClick={() => setIsCartOpen(true)}
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
                  onBuyNow={() => handleBuyNow(p)}
                  onAddToCart={() => {
                    handleAddToCart(userId, p);
                  }}
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

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart?.items ?? []}
        userId={userId}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
};

export default Homepage;
