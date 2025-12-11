import React, { useEffect, useState } from "react";
import {
  Package,
  ShoppingCart,
  DollarSign,
  Users,
  TrendingUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useOrderViewModel } from "../../../viewmodels/useOrderViewModel";
import { useProductManagementViewModel } from "../hooks/useProductManagementViewModel";

const Dashboard: React.FC = () => {
  const { allOrders, fetchOrders } = useOrderViewModel();
  const { allProducts, loading: loadingProducts } =
    useProductManagementViewModel();

  const [stats, setStats] = useState({
    totalProducts: 0,
    todayOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
  });

  const [revenueByMonth, setRevenueByMonth] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (allOrders.length > 0 || allProducts.length > 0) {
      calculateStats();
      calculateAvailableYears();
      calculateMonthlyRevenue();
    }
  }, [allOrders, allProducts]);

  useEffect(() => {
    if (allOrders.length > 0) {
      calculateMonthlyRevenue();
    }
  }, [selectedYear]);

  const calculateStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = allOrders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime();
    }).length;

    const totalRevenue = allOrders
      .filter(
        (order) => order.status === "delivered" || order.status === "confirmed"
      )
      .reduce((sum, order) => sum + order.totalAmount, 0);

    const totalCustomers = new Set(
      allOrders
        .filter((order) => order.shippingAddress?.phone)
        .map((order) => order.shippingAddress?.phone)
    ).size;

    const pendingOrders = allOrders.filter(
      (order) => order.status === "pending"
    ).length;
    const deliveredOrders = allOrders.filter(
      (order) => order.status === "delivered"
    ).length;

    setStats({
      totalProducts: allProducts.length,
      todayOrders,
      totalRevenue,
      totalCustomers,
      pendingOrders,
      deliveredOrders,
    });
  };

  const calculateMonthlyRevenue = () => {
    const monthlyData: { [key: string]: number } = {};

    // Khởi tạo 12 tháng với giá trị 0
    for (let i = 1; i <= 12; i++) {
      const monthKey = `${selectedYear}-${i.toString().padStart(2, "0")}`;
      monthlyData[monthKey] = 0;
    }

    // Tính doanh thu theo tháng
    allOrders
      .filter(
        (order) => order.status === "delivered" || order.status === "confirmed"
      )
      .forEach((order) => {
        const orderDate = new Date(order.createdAt);
        const year = orderDate.getFullYear();
        const month = (orderDate.getMonth() + 1).toString().padStart(2, "0");
        const monthKey = `${year}-${month}`;

        if (year === selectedYear) {
          monthlyData[monthKey] =
            (monthlyData[monthKey] || 0) + order.totalAmount;
        }
      });

    // Chuyển đổi sang array cho chart
    const chartData = Object.keys(monthlyData)
      .sort()
      .map((key) => {
        const [year, month] = key.split("-");
        const monthNames = [
          "T1",
          "T2",
          "T3",
          "T4",
          "T5",
          "T6",
          "T7",
          "T8",
          "T9",
          "T10",
          "T11",
          "T12",
        ];
        return {
          month: monthNames[parseInt(month) - 1],
          revenue: monthlyData[key],
          revenueInMillions: monthlyData[key] / 1000000,
        };
      });

    setRevenueByMonth(chartData);
  };

  const calculateAvailableYears = () => {
    const years = new Set<number>();
    allOrders.forEach((order) => {
      const year = new Date(order.createdAt).getFullYear();
      years.add(year);
    });
    const sortedYears = Array.from(years).sort((a, b) => b - a);
    setAvailableYears(sortedYears);
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const mainStats = [
    {
      label: "Tổng sản phẩm",
      value: stats.totalProducts || "0",
      color: "bg-blue-500",
      icon: Package,
      subtext: "Trong kho",
    },
    {
      label: "Đơn hàng hôm nay",
      value: stats.todayOrders.toString(),
      color: "bg-green-500",
      icon: ShoppingCart,
      subtext: `${stats.pendingOrders} chờ xử lý`,
    },
    {
      label: "Doanh thu",
      value: formatNumber(stats.totalRevenue),
      color: "bg-purple-500",
      icon: DollarSign,
      subtext: formatCurrency(stats.totalRevenue),
    },
    {
      label: "Khách hàng",
      value: stats.totalCustomers.toString(),
      color: "bg-orange-500",
      icon: Users,
      subtext: "Unique customers",
    },
  ];

  const orderStats = [
    {
      label: "Chờ xử lý",
      value: stats.pendingOrders,
      total: allOrders.length,
      color: "bg-yellow-200 text-yellow-800",
    },
    {
      label: "Đã giao",
      value: stats.deliveredOrders,
      total: allOrders.length,
      color: "bg-green-100 text-green-800",
    },
    {
      label: "Tổng đơn hàng",
      value: allOrders.length,
      total: allOrders.length,
      color: "bg-blue-100 text-blue-800",
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{label}</p>
          <p className="text-blue-600">
            {formatCurrency(payload[0].value * 1000000)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <p className="text-gray-600">
          Bảng điều khiển tổng quan về hiệu suất cửa hàng của bạn
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat, idx) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <div
                className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mb-4`}
              >
                <IconComponent className="text-white" size={24} />
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-1">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-gray-600 mb-1">
                {stat.label}
              </div>
              <div className="text-xs text-gray-400">{stat.subtext}</div>
            </div>
          );
        })}
      </div>

      {/* Order Statistics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Thống kê đơn hàng
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {orderStats.map((stat, idx) => (
            <div key={idx} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm text-gray-600">{stat.label}</span>
                <span
                  className={`px-2 py-1 text-xs rounded font-medium ${stat.color}`}
                >
                  {stat.value}
                </span>
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${stat.color
                      .replace("100", "500")
                      .replace("text-", "bg-")}`}
                    style={{
                      width: `${
                        stat.total > 0 ? (stat.value / stat.total) * 100 : 0
                      }%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {stat.total > 0
                    ? ((stat.value / stat.total) * 100).toFixed(1)
                    : 0}
                  % tổng đơn
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="w-full md:w-1/2 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Đơn hàng gần đây
          </h3>
          <div className="space-y-3">
            {allOrders.slice(0, 5).map((order, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <ShoppingCart className="text-blue-600" size={18} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {order.orderNumber}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.shippingAddress?.name || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">
                    {formatCurrency(order.totalAmount)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {allOrders.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              Chưa có đơn hàng nào
            </p>
          )}
        </div>

        <div className="w-full md:w-1/2 bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-blue-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-800">
                Doanh thu theo tháng
              </h3>
            </div>
            {availableYears.length > 0 && (
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 font-medium"
              >
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    Năm {year}
                  </option>
                ))}
              </select>
            )}
          </div>
          {revenueByMonth.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  stroke="#6b7280"
                  style={{ fontSize: "14px" }}
                />
                <YAxis
                  stroke="#6b7280"
                  style={{ fontSize: "14px" }}
                  tickFormatter={(value) => `${value}M`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: "20px" }}
                  formatter={() => "Doanh thu (triệu VNĐ)"}
                />
                <Bar
                  dataKey="revenueInMillions"
                  fill="#28a0f1"
                  radius={[8, 8, 0, 0]}
                  name="Doanh thu"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-8">
              Chưa có dữ liệu doanh thu
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
