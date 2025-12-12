import React, { useState } from "react";
import { Menu, LogOut } from "lucide-react";
import Dashboard from "./components/Dashboard";
import ProductManagement from "./components/ProductManagement";
import Sidebar from "./components/Sidebar";
import { useNavigate } from "react-router-dom";
import OrderManagement from "./components/OrderManagement";
import CategoryManagement from "./components/CategoryManagement";
import SpecificationManagement from "./components/SpecificationManagement";

const DashboardAdmin: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user"); // hoặc remove token nếu bạn dùng token
    navigate("/login"); // chuyển về trang login
  };
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">
              {{
                dashboard: "Tổng quan",
                products: "Quản lý Sản phẩm",
                specification: "Quản lý Thông số",
                categories: "Quản lý Danh mục",
                orders: "Quản lý Đơn hàng",
              }[activeTab] || "Admin Dashboard"}
            </h1>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 focus:outline-none cursor-pointer"
              >
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-semibold">
                  A
                </div>
                {/* <ChevronDown
                  size={18}
                  className={`transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                /> */}
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    <LogOut size={16} className="mr-2" />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === "dashboard" && <Dashboard />}
          {activeTab === "products" && <ProductManagement />}
          {activeTab === "specification" && <SpecificationManagement />}
          {activeTab === "categories" && <CategoryManagement />}
          {activeTab === "orders" && <OrderManagement />}
        </main>
      </div>
    </div>
  );
};

export default DashboardAdmin;
