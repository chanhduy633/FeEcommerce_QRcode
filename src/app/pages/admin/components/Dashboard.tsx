import React from 'react';
import { Package } from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Tổng sản phẩm', value: '156', color: 'bg-blue-500' },
    { label: 'Đơn hàng hôm nay', value: '23', color: 'bg-green-500' },
    { label: 'Doanh thu', value: '45.5M', color: 'bg-purple-500' },
    { label: 'Khách hàng', value: '892', color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg shadow">
            <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
              <Package className="text-white" size={24} />
            </div>
            <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;