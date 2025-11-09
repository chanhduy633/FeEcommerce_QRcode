import React from "react";
import { ShoppingCart, X, Plus, Minus, Trash2 } from "lucide-react";
import type { CartItem } from "../../../../types/Cart";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom"; // 🟢 thêm dòng này

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  userId: string;
  onUpdateQuantity: (
    userId: string,
    productId: string,
    quantity: number
  ) => void;
  onRemoveItem: (userId: string, productId: string) => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({
  isOpen,
  onClose,
  cartItems,
  userId,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  const navigate = useNavigate(); // 🟢 khởi tạo điều hướng

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const totalAmount = cartItems.reduce((sum, item) => {
    const price = item.product?.price ?? item.price ?? 0;
    return sum + price * (item.quantity ?? 0);
  }, 0);

  // 🟢 Hàm xử lý chuyển đến trang thanh toán
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Giỏ hàng trống!");
      return;
    }
    onClose(); // đóng sidebar trước
    localStorage.setItem("checkoutData", JSON.stringify({ cartItems, totalAmount }));
    navigate("/checkout", { state: { cartItems, totalAmount } }); // truyền dữ liệu sang trang thanh toán
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="text-blue-600" size={24} />
              <h2 className="text-xl font-bold text-gray-800">Giỏ hàng</h2>
              <span className="bg-blue-100 text-blue-600 text-sm px-2 py-1 rounded-full">
                {cartItems.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full cursor-pointer"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>

          {/* Cart items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <ShoppingCart size={64} className="mb-4" />
                <p>Giỏ hàng trống</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => {
                  const id = item.product?._id ?? item.productId;
                  const name = item.product?.name ?? "Sản phẩm";
                  const image = item.product?.image ?? "/placeholder.png";

                  const price = item.product?.price ?? item.price ?? 0;
                  const quantity = item.quantity ?? 1;
                  const totalPrice = price * quantity;
                  const stock = item.product?.stock ?? Infinity;

                  const handleIncrease = () => {
                    if (quantity < stock) {
                      onUpdateQuantity(userId, id, quantity + 1);
                    } else {
                      toast.error(`Chỉ còn ${stock} sản phẩm trong kho`);
                    }
                  };

                  const handleDecrease = () => {
                    if (quantity > 1) {
                      onUpdateQuantity(userId, id, quantity - 1);
                    }
                  };
                  return (
                    <div
                      key={id}
                      className="flex gap-3 bg-gray-50 rounded-lg p-3"
                    >
                      <img
                        src={image}
                        alt={name}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 text-sm truncate mb-1">
                          {name}
                        </h3>
                        <p className="text-blue-600 font-bold text-sm mb-2">
                          {formatPrice(price)}
                        </p>
                        <p className="text-gray-500 text-sm mb-2">
                          Tổng: {formatPrice(totalPrice)}
                        </p>
                        <div className="flex items-center justify-between">
                          {/* Quantity control */}
                          <div className="flex items-center space-x-2 bg-white rounded-lg border">
                            <button
                              onClick={handleDecrease}
                              className="p-1 hover:bg-gray-100 rounded-l-lg cursor-pointer"
                            >
                              <Minus size={16} className="text-gray-600" />
                            </button>
                            <span className="px-3 font-semibold text-sm">
                              {quantity}
                            </span>
                            <button
                              onClick={handleIncrease}
                              className="p-1 hover:bg-gray-100 rounded-r-lg cursor-pointer"
                            >
                              <Plus size={16} className="text-gray-600" />
                            </button>
                          </div>

                          {/* Remove item */}
                          <button
                            onClick={() => onRemoveItem(userId, id)}
                            className="p-1 hover:bg-red-50 rounded cursor-pointer"
                          >
                            <Trash2 size={18} className="text-red-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t p-4 space-y-4 bg-gray-50">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-700">
                  Tổng cộng:
                </span>
                <span className="text-2xl font-bold text-blue-600">
                  {formatPrice(totalAmount)}
                </span>
              </div>
              {/* 🟢 Nút thanh toán */}
              <button
                onClick={handleCheckout}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 cursor-pointer"
              >
                Thanh toán
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
