import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Dashboard from './components/Dashboard';
import ProductManagement from './components/ProductManagement';
import Sidebar from './components/Sidebar';

const DashboardAdmin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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
              {activeTab === 'dashboard' ? 'Dashboard' : 'Quản lý Sản phẩm'}
            </h1>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'products' && <ProductManagement />}
        </main>
      </div>
    </div>
  );
};

export default DashboardAdmin;