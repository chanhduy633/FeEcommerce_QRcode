import React from 'react';
import { LayoutDashboard, Package,  X } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Quản lý Sản phẩm', icon: Package },
  ];

  return (
    <>
      {/* Overlay cho mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden text-white hover:text-gray-300 cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>
        <nav className="p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-slate-800'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;