import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useHomepageViewModel } from "../../viewmodels/homepageViewModel";
import Header from "./components/Header";
import SidebarHome from "./components/SidebarHome";
import FilterPanel from "./components/FilterPanel";
import Pagination from "../admin/components/Pagination";
import ProductCard from "./components/ProductCard";
import Footer from "./components/Footer";
import { Package } from "lucide-react";
import CartSidebar from "./components/CartSideBar";
import { getGuestId } from "../../../utils/guestId";
import TrustBadges from "./components/TrustBadges";
import type { IProduct } from "../../../types/Product";
import { useNavigate } from "react-router";
import FloatingContactButtons from "./components/FloatingContactButtons";
import Banner from "./components/Bannner";
import AIChatbox from "./components/AIChatbox";

const Homepage = () => {
  const [user, setUser] = useState<any>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const {
    loading,
    error,
    products,
    allProducts,
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
    handleBuyNow,
    handleUpdateQuantity,
    handleRemoveItem,
  } = useHomepageViewModel();
  const navigate = useNavigate();
  // 🧩 Khôi phục user khi reload
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchCart(parsedUser._id); // Load giỏ hàng thật
    } else {
      fetchCart(getGuestId()); // Nếu không có user → giỏ hàng khách
    }
  }, []);

  const userId = user?._id || getGuestId();

  const handleLoginSuccess = (userId: string, userData: any) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    toast.success("Đăng nhập thành công!");
    fetchCart(userData._id);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.info("Đã đăng xuất.");
    fetchCart(getGuestId());
  };
  const handleProductSelect = (product: IProduct) => {
  navigate(`/product/${product.id}`);
};
  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        isMenuOpen={isMenuOpen}
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        cartItemCount={
          cart?.items?.filter((item) => {
            const product = allProducts.find((p) => p.id === item.productId);
            return product && product.stock > 0;
          }).length ?? 0
        }
        onCartClick={() => setIsCartOpen(true)}
        isLoggedIn={!!user}
        userInfo={user}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
        products={allProducts} // ✅ THÊM - truyền products từ viewModel
        onProductSelect={handleProductSelect} // ✅ THÊM
      />
      <TrustBadges />
      <div className="flex">
        <SidebarHome
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          isMenuOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
        />

        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[70vh]">
          <FilterPanel
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            sortBy={sortBy}
            onSortChange={setSortBy}
            totalProducts={allProducts.length}
          />

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onBuyNow={async () => {
                    await handleBuyNow(userId, p);
                    setIsCartOpen(true);
                  }}
                  onAddToCart={() => handleAddToCart(userId, p)}
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
        <Banner />
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
      <FloatingContactButtons />
      <AIChatbox />
      
    </div>
  );
};

export default Homepage;
