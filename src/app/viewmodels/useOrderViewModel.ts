import { useState, useEffect, useMemo } from "react";
import { orderDependencies } from "../../app/dependencies";
import type { Order } from "../../types/Order";

export function useOrderViewModel() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ====== UI State ======
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date-desc");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ====== FETCH ORDERS ======
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

  useEffect(() => {
    fetchOrders();
  }, []);

  // ====== FILTER & SORT ======
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // filter status
    if (statusFilter !== "all") {
      result = result.filter((o) => o.status === statusFilter);
    }

    // filter payment
    if (paymentFilter !== "all") {
      result = result.filter(
        (o) => (o.payment?.method || "COD") === paymentFilter
      );
    }

    // search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(term) 
      );
    }

    // sort
    switch (sortBy) {
      case "date-asc":
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case "date-desc":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "amount-asc":
        result.sort((a, b) => a.totalAmount - b.totalAmount);
        break;
      case "amount-desc":
        result.sort((a, b) => b.totalAmount - a.totalAmount);
        break;
    }

    return result;
  }, [orders, statusFilter, paymentFilter, searchTerm, sortBy]);

  // ====== PAGINATION ======
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = currentPage * itemsPerPage;
    return filteredOrders.slice(start, end);
  }, [filteredOrders, currentPage]);

  // ====== CRUD ======
  const getOrderDetail = async (orderId: string) => {
    try {
      return await orderDependencies.getDetail.execute(orderId);
    } catch (err: any) {
      throw new Error(err.message || "Không thể lấy chi tiết đơn hàng");
    }
  };

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

  const deleteOrder = async (orderId: string) => {
    try {
      await orderDependencies.deleteOrder.execute(orderId);
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
      return true;
    } catch (err: any) {
      setError(err.message || "Xóa đơn hàng thất bại");
      throw err;
    }
  };

  return {
    loading,
    error,
    orders: paginatedOrders,
    allOrders: orders,
    totalPages,
    currentPage,
    setCurrentPage,

    // Filters & Sort
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    paymentFilter,
    setPaymentFilter,
    sortBy,
    setSortBy,

    // CRUD
    fetchOrders,
    getOrderDetail,
    updateOrderStatus,
    deleteOrder,
  };
}
