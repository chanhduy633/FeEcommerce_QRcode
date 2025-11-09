import { useState } from "react";
import { orderDependencies } from "../../app/dependencies";
import type { Order } from "../../types/Order";

export function useOrderViewModel() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Lấy danh sách đơn hàng
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderDependencies.getOrders.execute();
      setOrders(data);
    } catch (err: any) {
      setError(err.message || "Không thể tải đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Lấy chi tiết đơn hàng
  const getOrderDetail = async (orderId: string) => {
    try {
      return await orderDependencies.getDetail.execute(orderId);
    } catch (err: any) {
      throw new Error(err.message || "Không thể lấy chi tiết đơn hàng");
    }
  };

  // 🔹 Cập nhật trạng thái đơn hàng
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await orderDependencies.updateStatus.execute(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err: any) {
      setError(err.message || "Cập nhật trạng thái thất bại");
    }
  };

  return {
    orders,
    loading,
    error,
    fetchOrders,
    getOrderDetail,
    updateOrderStatus,
  };
}
