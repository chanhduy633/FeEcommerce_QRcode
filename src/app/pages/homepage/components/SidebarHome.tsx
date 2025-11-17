import React from "react";

interface SidebarProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  isMenuOpen?: boolean;
  onClose?: () => void;
}

const SidebarHome: React.FC<SidebarProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  isMenuOpen = false,
  onClose,
}) => {
  return (
    <>
      {/* Backdrop mobile */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      <aside
        className={`
          fixed lg:sticky top-[64px] left-0 h-[calc(100vh-64px)]
          w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto
          transition-transform duration-300 z-40
          ${isMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="p-4">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Danh mục</h2>
          <nav>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category}>
                  <button
                    onClick={() => {
                      onCategoryChange(category);
                      onClose?.();
                    }}
                    className={`w-full text-left px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                      selectedCategory === category
                        ? "bg-black text-white"
                        : "hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default SidebarHome;
