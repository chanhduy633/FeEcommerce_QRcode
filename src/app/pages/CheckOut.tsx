import React from "react";
import { CheckCircle2, CreditCard, Loader2, Wallet } from "lucide-react";
import { useCheckoutViewModel } from "../viewmodels/checkoutViewModel";

export default function CheckoutPage() {
  const viewModel = useCheckoutViewModel();
  const { state, provinces, districts, wards } = viewModel;

  // Helper function for formatting price
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  // Get checkout data from localStorage
  const getCheckoutData = () => {
    const stored = localStorage.getItem("checkoutData");
    const data = stored ? JSON.parse(stored) : {};
    return {
      cartItems: data.cartItems || [],
      totalAmount: data.totalAmount || 0,
    };
  };

  const { cartItems, totalAmount } = getCheckoutData();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ SUCCESS MODAL */}
      {state.showModal && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center animate-fadeIn">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2 text-gray-800">
              Đặt hàng thành công!
            </h2>
            <p className="text-gray-600 mb-4">
              Mã đơn hàng của bạn là:
              <span className="font-semibold text-blue-600 ml-1">
                {state.orderNumber}
              </span>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Bạn có thể xem lại mã đơn hàng trong email đã nhập.
            </p>
            <button
              onClick={viewModel.handleFinish}
              className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition cursor-pointer"
            >
              Hoàn tất
            </button>
          </div>
        </div>
      )}
     {/* ✅ QR PAYMENT MODAL - CHỈ HIỂN THỊ QR VÀ LOADING */}
      {state.showQrModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
            <h2 className="text-2xl font-semibold mb-2 text-gray-800">
              Quét mã QR để thanh toán
            </h2>
            <p className="text-gray-600 mb-4 text-sm">
              Sử dụng ứng dụng ngân hàng để quét mã và thanh toán đơn hàng.
            </p>
            
            {/* QR CODE - SEPAY BIDV */}
            <div className="relative">
              <img 
                src={`https://qr.sepay.vn/img?acc=96247DUYBIDV&bank=BIDV&amount=${totalAmount}&des=${state.orderNumber}`}
                alt="QR thanh toán"
                className="w-64 h-64 mx-auto rounded-lg border-2 border-gray-200 shadow-sm"
              />
              
            </div>

            {/* Thông tin thanh toán */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Số tiền:</span>
                <span className="font-bold text-blue-600">
                  {formatPrice(totalAmount)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Mã giao dịch:</span>
                <span className="font-mono text-gray-800">
                  {state.orderNumber}
                </span>
              </div>
            </div>

            {/* Status Message */}
            <div className="mt-6 flex items-center justify-center gap-2">
              {state.isCheckingPayment ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                  <span className="text-sm text-blue-600 font-medium">
                    Đang kiểm tra thanh toán tự động...
                  </span>
                </>
              ) : (
                <span className="text-sm text-gray-500">
                  Quét mã QR để thanh toán
                </span>
              )}
            </div>

            {/* Nút Hủy */}
            <button
            onClick={() => viewModel.handleCloseQr()}
             className="mt-6 text-gray-600 hover:text-gray-800 text-sm font-medium transition">
              Hủy thanh toán
            </button>

            {/* Hướng dẫn */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-left">
                <strong>Lưu ý:</strong> Sau khi thanh toán thành công, đơn hàng sẽ được xác nhận tự động trong vòng vài giây.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-6">
            {/* Contact Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Thông tin liên hệ</h2>
              <input
                type="email"
                placeholder="Vui lòng nhập email để nhận mã đơn hàng"
                value={state.email}
                onChange={(e) => viewModel.setEmail(e.target.value)}
                className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  state.isLoggedIn ? "bg-gray-100" : ""
                }`}
                required
              />
              <label className="flex items-center mt-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={state.saveInfo}
                  onChange={(e) => viewModel.setSaveInfo(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Gửi cho tôi tin tức về ưu đãi qua email
                </span>
              </label>
            </div>

            {/* Delivery Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Địa chỉ giao hàng</h2>
              <div className="space-y-4">
                {/* Full Name */}
                <input
                  type="text"
                  placeholder="Họ và tên người nhận"
                  value={state.full_name}
                  required
                  onChange={(e) => viewModel.setFullName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* Phone */}
                <div>
                  <input
                    placeholder="Số điện thoại"
                    value={state.phone}
                    onChange={(e) =>
                      viewModel.handlePhoneChange(e.target.value)
                    }
                    onBlur={() => viewModel.validatePhone(state.phone)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {state.phoneError && (
                    <p className="text-red-500 text-sm mt-1">
                      {state.phoneError}
                    </p>
                  )}
                </div>

                {/* Province / District / Ward */}
                <div className="grid grid-cols-3 gap-4">
                  <select
                    value={state.selectedProvince}
                    onChange={(e) =>
                      viewModel.handleProvinceChange(e.target.value)
                    }
                    className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="">Chọn Tỉnh/Thành phố</option>
                    {provinces.map((p) => (
                      <option key={p.code} value={p.code}>
                        {p.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={state.selectedDistrict}
                    onChange={(e) =>
                      viewModel.handleDistrictChange(e.target.value)
                    }
                    disabled={!state.selectedProvince}
                    className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  >
                    <option value="">Chọn Quận/Huyện</option>
                    {districts
                      .filter((d) => d.province_code === state.selectedProvince)
                      .map((d) => (
                        <option key={d.code} value={d.code}>
                          {d.name}
                        </option>
                      ))}
                  </select>

                  <select
                    value={state.selectedWard}
                    onChange={(e) => viewModel.handleWardChange(e.target.value)}
                    disabled={!state.selectedDistrict}
                    className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  >
                    <option value="">Chọn Phường/Xã</option>
                    {wards
                      .filter((w) => w.district_code === state.selectedDistrict)
                      .map((w) => (
                        <option key={w.code} value={w.name}>
                          {w.name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Street Address */}
                <div>
                  <input
                    type="text"
                    placeholder="Số nhà, tên đường"
                    value={state.address}
                    onChange={(e) => viewModel.setAddress(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {state.shippingError && (
                    <p className="text-red-500 text-sm mt-1">
                      {state.shippingError}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Customer Note Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">
                Ghi chú cho đơn hàng
              </h2>
              <textarea
                placeholder="Ghi chú (ví dụ: Gọi trước khi giao, giao giờ hành chính...)"
                value={state.note}
                onChange={(e) => viewModel.setNote(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Shipping & Payment Sections */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">
                Phương thức vận chuyển
              </h2>
              <div className="border border-blue-500 rounded-md p-4 bg-blue-50">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="shipping"
                      defaultChecked
                      className="w-4 h-4 text-blue-600"
                    />
                    <div className="ml-3">
                      <div className="font-medium text-sm">
                        Free ship toàn quốc
                      </div>
                      <div className="text-xs text-gray-600">
                        Tracking number provided
                      </div>
                    </div>
                  </div>
                  <span className="font-semibold">MIỄN PHÍ</span>
                </div>
              </div>

              <h2 className="text-lg font-semibold mt-6 mb-2">Thanh toán</h2>
              <p className="text-sm text-gray-600 mb-4">
                Toàn bộ các giao dịch được bảo mật và mã hóa.
              </p>

              <div className="border border-gray-300 rounded-md overflow-hidden">
                {/* Card Payment */}
                <div
                  className={`p-4 border-b border-gray-300 cursor-pointer ${
                    state.paymentMethod === "card"
                      ? "bg-blue-50 border-l-4 border-l-blue-500"
                      : ""
                  }`}
                  onClick={() => viewModel.setPaymentMethod("card")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="payment"
                        checked={state.paymentMethod === "card"}
                        onChange={() => viewModel.setPaymentMethod("card")}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="ml-3 font-medium">SePay - Ví điện tử & Thẻ ngân hàng</span>
                    </div>
                    <div className="flex gap-2">
                      <CreditCard className="w-6 h-6 text-gray-400" />
                      <div className="text-xs text-gray-500">VISA • • •</div>
                    </div>
                  </div>
                </div>
                {state.paymentMethod === "card" && (
                  <div className="p-4 bg-gray-50 text-sm text-gray-600 border-b border-gray-300">
                    <div className="flex items-start gap-3">
                      <Wallet className="w-12 h-12 text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="font-medium mb-2">Thanh toán an toàn với SePay</p>
                        <ul className="text-xs space-y-1 text-gray-600">
                          <li>• Hỗ trợ: Ví điện tử, ATM, Visa, MasterCard</li>
                          <li>• Bảo mật: Mã hóa SSL 256-bit</li>
                          <li>• Nhanh chóng: Xác nhận thanh toán tức thì</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* COD Payment */}
                <div
                  className={`p-4 cursor-pointer ${
                    state.paymentMethod === "cod"
                      ? "bg-blue-50 border-l-4 border-l-blue-500"
                      : ""
                  }`}
                  onClick={() => viewModel.setPaymentMethod("cod")}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      checked={state.paymentMethod === "cod"}
                      onChange={() => viewModel.setPaymentMethod("cod")}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="ml-3 font-medium">
                      Thanh toán khi nhận hàng (COD)
                    </span>
                  </div>
                </div>
                {state.paymentMethod === "cod" && (
                  <div className="p-4 bg-gray-50 text-gray-700 text-sm border-t border-gray-300">
                    <strong>TRẢ TIỀN SAU KHI NHẬN HÀNG:</strong> Nhận hàng →
                    Kiểm tra hàng → Thanh toán.
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={
                state.paymentMethod === "cod"
                  ? viewModel.handleCheckoutCOD
                  : viewModel.handleCheckoutQR
              }
              disabled={state.isLoading}
              className="w-full bg-gray-800 text-white py-4 rounded-md font-semibold hover:bg-gray-900 transition-colors cursor-pointer mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {state.isLoading
                ? "Đang xử lý..."
                : state.paymentMethod === "cod"
                ? "Đặt hàng"
                : "Thanh toán ngay"}
            </button>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                {cartItems.length > 0 ? (
                  cartItems.map((item: any) => (
                    <div
                      key={item.productId}
                      className="flex gap-4 pb-4 border-b last:border-0"
                    >
                      <div className="relative">
                        <img
                          src={item.product?.image || "/placeholder.png"}
                          alt={item.product?.name}
                          className="w-20 h-20 rounded-md object-cover"
                        />
                        <span className="absolute -top-2 -right-2 bg-gray-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium mb-1 text-sm">
                          {item.product?.name.length > 50
                            ? item.product.name.slice(0, 50) + "..."
                            : item.product?.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {formatPrice(item.product?.price)} × {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">
                          {formatPrice(
                            (item.product?.price || 0) * item.quantity
                          )}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm text-center">
                    Giỏ hàng trống
                  </p>
                )}
              </div>

              {/* Discount */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Mã giảm giá hoặc thẻ quà tặng"
                    value={state.discountCode}
                    onChange={(e) => viewModel.setDiscountCode(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors cursor-pointer">
                    Áp dụng
                  </button>
                </div>
              </div>

              {/* Price summary */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tổng phụ</span>
                  <span className="font-medium">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Vận chuyển</span>
                  <span className="font-medium">MIỄN PHÍ</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                <span className="text-lg font-semibold">Tổng</span>
                <div className="text-right">
                  <span className="text-xs text-gray-500 block mb-1">VND</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
