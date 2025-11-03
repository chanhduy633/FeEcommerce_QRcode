import React from "react";
import { Filter, ChevronDown } from "lucide-react";

interface FilterPanelProps {
  showFilters: boolean;
  onToggleFilters: () => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  totalProducts: number;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  showFilters,
  onToggleFilters,
  priceRange,
  onPriceRangeChange,
  sortBy,
  onSortChange,
  totalProducts,
}) => {
  return (
    <div>
      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <button
          onClick={onToggleFilters}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
        >
          <Filter size={20} />
          <span>Bộ lọc</span>
          <ChevronDown
            size={16}
            className={`transform transition-transform ${
              showFilters ? "rotate-180" : ""
            }`}
          />
        </button>

        <div className="flex items-center space-x-4">
          <span className="text-gray-600">{totalProducts} sản phẩm</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="default">Mặc định</option>
            <option value="popular">Bán chạy nhất</option>
            <option value="price-asc">Giá thấp đến cao</option>
            <option value="price-desc">Giá cao đến thấp</option>
            <option value="name">Tên A-Z</option>
          </select>
        </div>
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="font-semibold mb-4">Lọc theo giá</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <input
                type="number"
                placeholder="Từ"
                min="0"
                value={priceRange[0]}
                onChange={(e) =>
                  onPriceRangeChange([Number(e.target.value), priceRange[1]])
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Đến"
                min="0"
                value={priceRange[1]}
                onChange={(e) =>
                  onPriceRangeChange([priceRange[0], Number(e.target.value)])
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => onPriceRangeChange([0, 100000000])}
              className="text-blue-600 hover:text-blue-700 text-sm cursor-pointer"
            >
              Đặt lại
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
