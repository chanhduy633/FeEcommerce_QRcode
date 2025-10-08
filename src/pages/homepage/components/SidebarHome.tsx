import React from "react";

interface SidebarProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const SidebarHome: React.FC<SidebarProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <aside className="w-80 bg-white border-r border-gray-200 top-16 left-0 h-[calc(100vh-64px)] sticky">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Danh mục</h2>
        <nav>
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category}>
                <button
                  onClick={() => onCategoryChange(category)}
                  className={`w-full text-left px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
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
  );
};

export default SidebarHome;