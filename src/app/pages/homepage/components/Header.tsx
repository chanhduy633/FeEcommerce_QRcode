import React, { useEffect, useRef, useState } from "react";
import {
  Search,
  ShoppingCart,
  User,
  LogOut,
  ChevronDown,
  X,
  Menu,
  Binoculars,
} from "lucide-react";
import AuthModal from "./AuthModal";
import OrderTrackingModal from "./OrderTrackingModal";
import type { IProduct } from "../../../../types/Product";

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
  cartItemCount?: number;
  onCartClick?: () => void;
  isLoggedIn?: boolean;
  userInfo?: { full_name?: string; email?: string } | null;
  onLoginSuccess?: (userId: string, userData: any) => void;
  onLogout?: () => void;
  isMenuOpen: boolean;
  onMenuToggle: () => void;
  products?: IProduct[];
  onProductSelect?: (product: IProduct) => void;
}

const Header: React.FC<HeaderProps> = ({
  onSearchChange,
  cartItemCount = 0,
  onCartClick,
  isLoggedIn = false,
  userInfo = null,
  onLoginSuccess,
  onLogout,
  isMenuOpen,
  onMenuToggle,
  products = [],
  onProductSelect,
}) => {
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false); // ✅ THÊM
  const searchRef = useRef<HTMLDivElement>(null); // ✅ THÊM
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    // ✅ THÊM
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value); // ✅ cập nhật local state
    setShowSuggestions(value.length > 0);
  };

  const handleProductSelect = (product: IProduct) => {
    const element = document.getElementById(`product-${product.id}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const clearSearch = () => {
    // ✅ THÊM
    onSearchChange("");
    setShowSuggestions(false);
  };

  const formatPrice = (price: number) => {
    // ✅ THÊM
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  // Filter products
  const filteredProducts = products // ✅ THÊM
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 5);
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLoginSuccess = (userId: string, userData: any) => {
    setIsAuthModalOpen(false);
    onLoginSuccess?.(userId, userData);
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    onLogout?.();
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo + Menu button */}
            <div className="flex items-center gap-2">
              <button
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                onClick={onMenuToggle} // ✅ toggle parent state
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <h1 className="text-2xl font-bold text-black cursor-pointer">
                TechStore
              </h1>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 justify-center px-8">
              <div className="relative w-full max-w-xl" ref={searchRef}>
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
                    onFocus={() =>
                      searchTerm.length > 0 && setShowSuggestions(true)
                    }
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                  {/* ✅ THÊM nút clear */}
                  {searchTerm && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>

                {/* ✅ THÊM dropdown - CHỈ hiển thị sản phẩm */}
                {showSuggestions && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-50">
                    {filteredProducts.length > 0 ? (
                      <div>
                        <div className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-50">
                          Sản phẩm gợi ý
                        </div>
                        {filteredProducts.map((product) => (
                          <button
                            key={product.id}
                            onClick={() => handleProductSelect(product)}
                            className="w-full px-4 py-3 hover:bg-gray-50 flex items-center space-x-3 border-b border-gray-50 last:border-b-0"
                          >
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1 text-left">
                              <p className="text-sm text-gray-800 line-clamp-1">
                                {product.name}
                              </p>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-sm font-semibold text-red-600">
                                  {formatPrice(product.price)}
                                </span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="px-4 py-8 text-center text-gray-500">
                        <p className="text-sm">
                          Không tìm thấy sản phẩm cho "{searchTerm}"
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Search Cart + Cart + Avatar */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsOrderTrackingOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <Binoculars size={20} />
                <span className="hidden sm:inline">Tra cứu đơn</span>
              </button>

              <button
                onClick={onCartClick}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition cursor-pointer"
              >
                <ShoppingCart size={20} />

                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
                    {cartItemCount}
                  </span>
                )}
              </button>

              {isLoggedIn && userInfo ? (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="hidden md:flex items-center space-x-2 hover:bg-gray-100 rounded-lg px-3 py-1 cursor-pointer transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center  bg-black/80 text-white font-semibold">
                      {getInitials(userInfo.full_name)}
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-medium text-gray-700">
                        {userInfo.full_name || "User"}
                      </p>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`text-gray-500 transition-transform ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          // Navigate to profile
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2 cursor-pointer"
                      >
                        <User size={16} />
                        <span>Tài khoản của tôi</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 cursor-pointer"
                      >
                        <LogOut size={16} />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center space-x-2 px-4 py-2 border   rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <User size={20} />
                  <span className="hidden sm:inline">Đăng nhập</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      <OrderTrackingModal
        isOpen={isOrderTrackingOpen}
        onClose={() => setIsOrderTrackingOpen(false)}
      />
    </>
  );
};

export default Header;
