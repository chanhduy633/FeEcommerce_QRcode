import React, { useEffect, useState } from "react";
import { Eye, X, Package, CreditCard, User } from "lucide-react";
import { toast } from "sonner";
import type { Order } from "../../../../types/Order";
import { useOrderViewModel } from "../../../viewmodels/useOrderViewModel";

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "Chờ xử lý", color: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-800" },
  shipped: { label: "Đang giao", color: "bg-purple-100 text-purple-800" },
  delivered: { label: "Đã giao", color: "bg-green-100 text-green-800" },
  cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-800" },
};

const paymentLabels: Record<string, string> = {
  COD: "Thanh toán khi nhận hàng",
  BANK: "Chuyển khoản ngân hàng",
  SEPAY: "SePay",
};

function formatCurrency(amount: number) {
  return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}
function formatDate(date: string) {
  return new Date(date).toLocaleString("vi-VN", { hour12: false });
}

export default function OrderManagement() {
  const viewModel = useOrderViewModel();
  const {
    orders,
    loading,
    error,
    fetchOrders,
    getOrderDetail,
    updateOrderStatus,
  } = viewModel;

  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const openDetail = async (order: Order) => {
    try {
      const detail = await getOrderDetail(order._id);
      setSelectedOrder(detail);
      setShowModal(true);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        Đang tải danh sách đơn hàng...
      </div>
    );

  if (error)
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        {error}
      </div>
    );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Quản lý đơn hàng</h1>

      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                "Mã đơn",
                "Khách hàng",
                "Tổng tiền",
                "Phương thức",
                "Ngày tạo",
                "Trạng thái",
                "Hành động",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((o) => (
              <tr key={o._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-800">
                  {o.orderNumber}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  <div>{o.shippingAddress?.name || "—"}</div>
                  <div className="text-xs text-gray-500">
                    {o.shippingAddress?.phone || "Không có SĐT"}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">
                  {formatCurrency(o.totalAmount)}
                </td>
                <td className="px-4 py-3 text-sm">
                  {paymentLabels[o.paymentMethod || "COD"]}
                </td>
                <td className="px-4 py-3 text-sm">{formatDate(o.createdAt)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 text-xs rounded font-medium ${
                      statusConfig[o.status]?.color || "bg-gray-100"
                    }`}
                  >
                    {statusConfig[o.status]?.label || o.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right flex items-center gap-2 justify-end">
                  <button
                    onClick={() => openDetail(o)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Xem chi tiết"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <select
                    value={o.status}
                    onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                    className="text-sm border rounded px-2 py-1 focus:ring-blue-500 focus:outline-none cursor-pointer"
                  >
                    {Object.keys(statusConfig).map((s) => (
                      <option key={s} value={s}>
                        {statusConfig[s].label}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            Không có đơn hàng nào.
          </div>
        )}
      </div>

      {/* Modal chi tiết */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full overflow-y-auto max-h-[90vh]">
            {/* Header */}
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Eye className="text-blue-600" />
                Chi tiết đơn hàng
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <X size={22} />
              </button>
            </div>

            {/* Nội dung */}
            <div className="p-6 space-y-6">
              {/* Thông tin chung */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <p className="text-sm text-gray-600">Mã đơn hàng</p>
                    <p className="font-semibold text-gray-800 text-lg">
                      {selectedOrder.orderNumber}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Ngày tạo: {formatDate(selectedOrder.createdAt)}
                    </p>
                  </div>

                  {/* Trạng thái được làm đẹp hơn */}
                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-medium text-sm ${
                      statusConfig[selectedOrder.status]?.color
                    }`}
                  >
                    <Package className="w-4 h-4" />
                    <span>{statusConfig[selectedOrder.status]?.label}</span>
                  </div>
                </div>
              </div>

              {/* Người nhận */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-2">
                  <User className="text-blue-600" size={18} />
                  Người nhận
                </h3>
                <p>
                  <strong>Tên:</strong> {selectedOrder.shippingAddress?.name}
                </p>
                <p>
                  <strong>SĐT:</strong> {selectedOrder.shippingAddress?.phone}
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  {selectedOrder.shippingAddress?.email || "Không có"}
                </p>
                <p>
                  <strong>Địa chỉ:</strong>{" "}
                  {[
                    selectedOrder.shippingAddress?.street,
                    selectedOrder.shippingAddress?.ward,
                    selectedOrder.shippingAddress?.district,
                    selectedOrder.shippingAddress?.city,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
                {selectedOrder.notes && (
                  <p className="mt-2 italic text-gray-600">
                    <strong>Ghi chú:</strong> {selectedOrder.notes}
                  </p>
                )}
              </div>

              {/* Sản phẩm */}
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
                    <Package className="text-blue-600" size={18} />
                    Sản phẩm
                  </h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-4 p-2 border rounded-lg"
                      >
                        <img
                          src={item.image || "/no-image.png"}
                          className="w-16 h-16 object-cover rounded"
                          alt={item.name}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            SL: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-700">
                            {formatCurrency(item.price)}
                          </p>
                          <p className="text-xs text-gray-500">
                            Tổng: {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Thanh toán */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="text-blue-600" size={18} />
                    <span className="font-semibold text-gray-800">
                      Thanh toán
                    </span>
                  </div>
                  <span className="text-gray-700">
                    {paymentLabels[selectedOrder.paymentMethod || "COD"]}
                  </span>
                </div>
                <div className="mt-3 border-t pt-3 flex justify-between items-center">
                  <span className="font-semibold text-gray-800">
                    Tổng tiền:
                  </span>
                  <span className="text-xl font-bold text-red-600">
                    {formatCurrency(selectedOrder.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t px-6 py-4 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
