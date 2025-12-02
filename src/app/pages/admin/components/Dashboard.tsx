import React, { useEffect, useState } from 'react';
import { Package, ShoppingCart, DollarSign, Users, TrendingUp } from 'lucide-react';
import { useOrderViewModel } from '../../../viewmodels/useOrderViewModel';
import { useProductManagementViewModel } from '../hooks/useProductManagementViewModel';

// Import ProductService (giả sử bạn có service này)
// import { productService } from '../services/productService';

const Dashboard: React.FC = () => {
  const { allOrders, fetchOrders } = useOrderViewModel();
  const { allProducts, loading: loadingProducts } = useProductManagementViewModel();

  const [stats, setStats] = useState({
    totalProducts: 0,
    todayOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (allOrders.length > 0 || allProducts.length > 0) {
      calculateStats();
    }
  }, [allOrders, allProducts]);

  const calculateStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = allOrders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime();
    }).length;

    const totalRevenue = allOrders
      .filter((order) => order.status === "delivered" || order.status === "confirmed")
      .reduce((sum, order) => sum + order.totalAmount, 0);

    const totalCustomers = new Set(
      allOrders
        .filter((order) => order.shippingAddress?.phone)
        .map((order) => order.shippingAddress?.phone)
    ).size;

    const pendingOrders = allOrders.filter((order) => order.status === "pending").length;
    const deliveredOrders = allOrders.filter((order) => order.status === "delivered").length;

    setStats({
      totalProducts: allProducts.length,
      todayOrders,
      totalRevenue,
      totalCustomers,
      pendingOrders,
      deliveredOrders,
    });
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const mainStats = [
    { 
      label: 'Tổng sản phẩm', 
      value: stats.totalProducts || '0', 
      color: 'bg-blue-500',
      icon: Package,
      subtext: 'Trong kho'
    },
    { 
      label: 'Đơn hàng hôm nay', 
      value: stats.todayOrders.toString(), 
      color: 'bg-green-500',
      icon: ShoppingCart,
      subtext: `${stats.pendingOrders} chờ xử lý`
    },
    { 
      label: 'Doanh thu', 
      value: formatNumber(stats.totalRevenue), 
      color: 'bg-purple-500',
      icon: DollarSign,
      subtext: formatCurrency(stats.totalRevenue)
    },
    { 
      label: 'Khách hàng', 
      value: stats.totalCustomers.toString(), 
      color: 'bg-orange-500',
      icon: Users,
      subtext: 'Unique customers'
    },
  ];

  const orderStats = [
    {
      label: 'Chờ xử lý',
      value: stats.pendingOrders,
      total: allOrders.length,
      color: 'bg-yellow-200 text-yellow-800'
    },
    {
      label: 'Đã giao',
      value: stats.deliveredOrders,
      total: allOrders.length,
      color: 'bg-green-100 text-green-800'
    },
    {
      label: 'Tổng đơn hàng',
      value: allOrders.length,
      total: allOrders.length,
      color: 'bg-blue-100 text-blue-800'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Thống kê</h2>
        
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat, idx) => {
          const IconComponent = stat.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
                <IconComponent className="text-white" size={24} />
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</div>
              <div className="text-sm font-medium text-gray-600 mb-1">{stat.label}</div>
              <div className="text-xs text-gray-400">{stat.subtext}</div>
            </div>
          );
        })}
      </div>

      {/* Order Statistics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Thống kê đơn hàng</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {orderStats.map((stat, idx) => (
            <div key={idx} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm text-gray-600">{stat.label}</span>
                <span className={`px-2 py-1 text-xs rounded font-medium ${stat.color}`}>
                  {stat.value}
                </span>
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${stat.color.replace('100', '500').replace('text-', 'bg-')}`}
                    style={{ width: `${stat.total > 0 ? (stat.value / stat.total) * 100 : 0}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {stat.total > 0 ? ((stat.value / stat.total) * 100).toFixed(1) : 0}% tổng đơn
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Đơn hàng gần đây</h3>
        <div className="space-y-3">
          {allOrders.slice(0, 5).map((order, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <ShoppingCart className="text-blue-600" size={18} />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{order.orderNumber}</p>
                  <p className="text-sm text-gray-500">{order.shippingAddress?.name || 'N/A'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-800">
                  {formatCurrency(order.totalAmount)}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>
          ))}
        </div>
        {allOrders.length === 0 && (
          <p className="text-center text-gray-500 py-4">Chưa có đơn hàng nào</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;