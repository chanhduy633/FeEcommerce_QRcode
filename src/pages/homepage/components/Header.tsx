import React from "react";
import { Search, ShoppingCart } from "lucide-react";

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
  cartItemCount?: number;
  onCartClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  searchTerm,
  onSearchChange,
  cartItemCount = 0,
  onCartClick,
}) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center py-4">
          {/* Left: Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600 cursor-pointer">
              TechStore
            </h1>
          </div>

          {/* Center: Search - chiếm hết không gian trống */}
          <div className="hidden md:flex flex-1 justify-center px-8">
            <div className="relative w-full max-w-xl">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Right: Cart + Avatar */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onCartClick}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <ShoppingCart size={20} />
              <span className="hidden sm:inline">Giỏ hàng</span>
              {cartItemCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              A
            </div>
          </div>
        </div>

       
      </div>
    </header>
  );
};

export default Header;
