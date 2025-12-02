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
  // Hàm format số thành dạng có khoảng trắng: 10000000 → 10 000 000
  const formatNumberWithSpaces = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // Hàm xóa khoảng trắng khi parse: "10 000 000" → 10000000
  const parseFormattedNumber = (str: string): number => {
    const cleaned = str.replace(/\s/g, "");
    return Number(cleaned) || 0;
  };

  // State để lưu giá trị hiển thị (có format)
  const [minDisplay, setMinDisplay] = React.useState(
    formatNumberWithSpaces(priceRange[0])
  );
  const [maxDisplay, setMaxDisplay] = React.useState(
    formatNumberWithSpaces(priceRange[1])
  );

  // Sync với priceRange từ props
  React.useEffect(() => {
    setMinDisplay(formatNumberWithSpaces(priceRange[0]));
    setMaxDisplay(formatNumberWithSpaces(priceRange[1]));
  }, [priceRange]);

  const handleMinChange = (value: string) => {
    setMinDisplay(value);
    const numValue = parseFormattedNumber(value);
    onPriceRangeChange([numValue, priceRange[1]]);
  };

  const handleMaxChange = (value: string) => {
    setMaxDisplay(value);
    const numValue = parseFormattedNumber(value);
    onPriceRangeChange([priceRange[0], numValue]);
  };

  const handleMinBlur = () => {
    setMinDisplay(formatNumberWithSpaces(priceRange[0]));
  };

  const handleMaxBlur = () => {
    setMaxDisplay(formatNumberWithSpaces(priceRange[1]));
  };

  return (
    <div className="mb-6">
      {/* Filter Controls - All in One Row */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-lg shadow-sm">
        {/* Bộ lọc button */}
        <button
          onClick={onToggleFilters}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
        >
          <Filter size={18} />
          <span className="text-sm font-medium">Bộ lọc</span>
          <ChevronDown
            size={14}
            className={`transform transition-transform ${
              showFilters ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Lọc theo giá - Inline */}
        {showFilters && (
          <>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Từ"
                value={minDisplay}
                onChange={(e) => handleMinChange(e.target.value)}
                onBlur={handleMinBlur}
                className="w-28 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-400">-</span>
              <input
                type="text"
                placeholder="Đến"
                value={maxDisplay}
                onChange={(e) => handleMaxChange(e.target.value)}
                onBlur={handleMaxBlur}
                className="w-28 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Quick filter buttons */}
            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={() => onPriceRangeChange([0, 500000])}
                className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer whitespace-nowrap"
              >
                &lt; 500K
              </button>
              <button
                onClick={() => onPriceRangeChange([500000, 1000000])}
                className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer whitespace-nowrap"
              >
                500K-1M
              </button>
              <button
                onClick={() => onPriceRangeChange([1000000, 5000000])}
                className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer whitespace-nowrap"
              >
                1M-5M
              </button>
              <button
                onClick={() => onPriceRangeChange([5000000, 100000000])}
                className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer whitespace-nowrap"
              >
                &gt; 5M
              </button>
            </div>

            <button
              onClick={() => onPriceRangeChange([0, 100000000])}
              className="text-blue-600 hover:text-blue-700 text-xs cursor-pointer font-medium"
            >
              Đặt lại
            </button>
          </>
        )}

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Số sản phẩm */}
        <span className="text-sm text-gray-600">
          {formatNumberWithSpaces(totalProducts)} sản phẩm
        </span>

        {/* Sắp xếp */}
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option value="default">Mặc định</option>
          <option value="popular">Bán chạy nhất</option>
          <option value="price-asc">Giá thấp đến cao</option>
          <option value="price-desc">Giá cao đến thấp</option>
          <option value="name">Tên A-Z</option>
        </select>
      </div>
    </div>
  );
};

export default FilterPanel;