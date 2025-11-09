import React, { useState } from "react";
import {
  X,
  Package,
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
  CreditCard,
  MessageCircle,
  XCircle,
  CheckCircle,
  Clock,
  Truck,
} from "lucide-react";
import { API_ROUTES } from "../../../../config/api";
import { toast } from "sonner";

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface ShippingAddress {
  name?: string;
  email?: string;
  phone?: string;
  street?: string;
  city?: string;
  district?: string;
  ward?: string;
}

interface OrderData {
  orderNumber: string;
  status: string;
  createdAt: string;
  totalAmount: number;
  paymentMethod: string;
  shippingAddress?: ShippingAddress;
  items: OrderItem[];
}

const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({ isOpen, onClose }) => {
  const [orderNumber, setOrderNumber] = useState("");
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { label: string; color: string; icon: any }> = {
      pending: { label: "Chờ xác nhận", color: "text-yellow-600 bg-yellow-50", icon: Clock },
      confirmed: { label: "Đã xác nhận", color: "text-blue-600 bg-blue-50", icon: Package },
      shipped: { label: "Đang giao", color: "text-purple-600 bg-purple-50", icon: Truck },
      delivered: { label: "Đã giao", color: "text-green-600 bg-green-50", icon: CheckCircle },
      cancelled: { label: "Đã hủy", color: "text-red-600 bg-red-50", icon: XCircle },
    };
    return statusMap[status] || statusMap.pending;
  };

  const handleSearch = async () => {
    if (!orderNumber.trim()) {
      setError("Vui lòng nhập mã đơn hàng");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setOrderData(null);

      const res = await fetch(`${API_ROUTES.ORDER}/track/${orderNumber}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Không tìm thấy đơn hàng.");
        return;
      }

      setOrderData(data.data);
    } catch (err) {
      console.error(err);
      setError("Không thể kết nối máy chủ.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleCancelOrder = async () => {
    if (!orderData) return;

    try {
      const res = await fetch(`${API_ROUTES.ORDER}/${orderNumber}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Hủy đơn hàng thành công!");
        setShowCancelConfirm(false);
        setOrderData({ ...orderData, status: "cancelled" });
      } else {
        toast.error(data.message || "Không thể hủy đơn hàng.");
      }
    } catch (err) {
      toast.error("Lỗi kết nối máy chủ!");
    }
  };

  const handleClose = () => {
    setOrderNumber("");
    setOrderData(null);
    setError("");
    setShowCancelConfirm(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
            <Package className="text-blue-600" />
            Tra cứu đơn hàng
          </h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {/* Nội dung */}
        <div className="p-6">
          {/* Form tra cứu */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nhập mã đơn hàng
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="VD: ORD-2025-001"
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {isLoading ? "Đang tìm..." : "Tra cứu"}
              </button>
            </div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>

          {/* Chi tiết đơn */}
          {orderData && (
            <div className="space-y-6">
              {/* Trạng thái */}
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <p className="text-sm text-gray-600">Mã đơn hàng</p>
                    <p className="text-lg font-bold">{orderData.orderNumber}</p>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-full flex items-center gap-2 ${getStatusInfo(orderData.status).color}`}
                  >
                    {React.createElement(getStatusInfo(orderData.status).icon, { size: 18 })}
                    <span>{getStatusInfo(orderData.status).label}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} />
                  <span>Đặt hàng lúc: {formatDate(orderData.createdAt)}</span>
                </div>
              </div>

              {/* Thông tin người nhận */}
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="text-blue-600" /> Thông tin người nhận
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <p>
                    <strong>Họ tên:</strong> {orderData.shippingAddress?.name || "—"}
                  </p>
                  <p>
                    <strong>SĐT:</strong> {orderData.shippingAddress?.phone || "—"}
                  </p>
                  <p>
                    <strong>Email:</strong> {orderData.shippingAddress?.email || "—"}
                  </p>
                  <p>
                    <strong>Địa chỉ:</strong>{" "}
                    {[
                      orderData.shippingAddress?.street,
                      orderData.shippingAddress?.ward,
                      orderData.shippingAddress?.district,
                      orderData.shippingAddress?.city,
                    ]
                      .filter(Boolean)
                      .join(", ") || "—"}
                  </p>
                </div>
              </div>

              {/* Danh sách sản phẩm */}
              {orderData.items?.length > 0 && (
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Package className="text-blue-600" /> Sản phẩm ({orderData.items.length})
                  </h3>
                  <div className="space-y-3">
                    {orderData.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <img
                          src={item.image || "/no-image.png"}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg border"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-blue-600">{formatPrice(item.price)}</p>
                          <p className="text-sm text-gray-500">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Thanh toán */}
              <div className="bg-white border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <CreditCard className="text-blue-600" />
                    <span className="font-semibold">Phương thức thanh toán</span>
                  </div>
                  <span>
                    {orderData.paymentMethod === "COD"
                      ? "Thanh toán khi nhận hàng"
                      : orderData.paymentMethod}
                  </span>
                </div>
                <div className="border-t pt-4 flex justify-between items-center">
                  <span className="text-lg font-semibold">Tổng thanh toán</span>
                  <span className="text-2xl font-bold text-red-600">
                    {formatPrice(orderData.totalAmount)}
                  </span>
                </div>
              </div>

              {/* Hành động */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => alert("Liên hệ CSKH")}
                  className="flex items-center gap-2 px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
                >
                  <MessageCircle size={18} /> Liên hệ
                </button>
                {orderData.status !== "cancelled" && orderData.status !== "delivered" && (
                  <button
                    onClick={() => setShowCancelConfirm(true)}
                    className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <XCircle size={18} /> Hủy đơn hàng
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Xác nhận hủy */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <XCircle className="text-red-600" /> Xác nhận hủy đơn hàng
            </h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc muốn hủy đơn <b>{orderData?.orderNumber}</b>? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Không
              </button>
              <button
                onClick={handleCancelOrder}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Xác nhận hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTrackingModal;
