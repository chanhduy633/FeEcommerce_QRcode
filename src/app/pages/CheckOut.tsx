import React, { useEffect, useState } from "react";
import { CheckCircle2, CreditCard } from "lucide-react";
import { provinces, districts, wards } from "vietnam-provinces";
import { API_ROUTES } from "../../config/api";
import { toast } from "sonner";

export default function CheckoutPage() {
  const [email, setEmail] = useState("");
  const [saveInfo, setSaveInfo] = useState(true);
  const [full_name, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [discountCode, setDiscountCode] = useState("");
  const [note, setNote] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ❗ Các lỗi input
  const [phoneError, setPhoneError] = useState("");
  const [shippingError, setShippingError] = useState("");

  // ✅ Modal hiển thị sau khi đặt hàng
  const [showModal, setShowModal] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  // Khi component load, kiểm tra user
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        if (userData?.email) setEmail(userData.email);
        if (userData?.full_name) setFullName(userData.full_name);
        if (userData?.email) setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("Không thể đọc user từ localStorage:", error);
    }
  }, []);
  const validateEmail = (email: string) => {
    // Regex cơ bản kiểm tra định dạng email
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) {
      toast.error("Email không hợp lệ");
      return false;
    }
    return true;
  };

  // Validate số điện thoại
  const validatePhone = (value: string) => {
    const digits = value.replace(/\D/g, "");
    const validPrefixes = ["03", "05", "07", "08", "09"];
    const prefix = digits.slice(0, 2);
    if (digits.length !== 10 || !validPrefixes.includes(prefix)) {
      setPhoneError("Số điện thoại không hợp lệ");
      return false;
    }
    setPhoneError("");
    return true;
  };

  // Xử lý checkout
  const handleCheckout = async () => {
    if (!validateEmail(email)) return;
    if (!validatePhone(phone)) return;
    if (!address || !selectedProvince || !selectedDistrict) {
      setShippingError("Vui lòng điền đầy đủ địa chỉ giao hàng");
      return;
    }

    try {
      const guestId = sessionStorage.getItem("guest_user_id");
      console.log("Guest ID:", guestId);
      const checkoutData = localStorage.getItem("checkoutData");
      const cartItems = checkoutData ? JSON.parse(checkoutData).cartItems : [];

      const shippingAddress = {
        name: full_name,
        email,
        phone: phone.replace(/\s/g, ""),
        street: address,
        ward: selectedWard,
        district: districts.find((d) => d.code === selectedDistrict)?.name,
        city: provinces.find((p) => p.code === selectedProvince)?.name,
      };

      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;

      const orderData = {
        userId: user?._id || null,
        guestId: user ? null : guestId,
        shippingAddress,
        notes: note,
        paymentMethod: paymentMethod.toUpperCase(),
        cartItems,
      };

      const res = await fetch(API_ROUTES.ORDER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Đặt hàng thất bại!");

      setOrderNumber(result.data?.orderNumber || result.orderNumber || "N/A");
      setShowModal(true);

      toast.success("Đặt hàng thành công!");
      localStorage.removeItem("checkoutData");
    } catch (err: any) {
      console.error("Checkout error:", err);
      toast.error(err.message || "Có lỗi xảy ra, vui lòng thử lại.");
    }
  };
  const handleFinish = () => {
    setShowModal(false);
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center animate-fadeIn">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2 text-gray-800">
              Đặt hàng thành công!
            </h2>
            <p className="text-gray-600 mb-4">
              Mã đơn hàng của bạn là:
              <span className="font-semibold text-blue-600 ml-1">
                {orderNumber}
              </span>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Bạn có thể xem lại mã đơn hàng trong email đã nhập.
            </p>
            <button
              onClick={handleFinish}
              className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition"
            >
              Hoàn tất
            </button>
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
                placeholder="Vui lòng nhập email đển nhận mã đơn hàng"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isLoggedIn ? "bg-gray-100" : ""
                }`}
                required
              />
              <label className="flex items-center mt-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveInfo}
                  onChange={(e) => setSaveInfo(e.target.checked)}
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
                {/* Tên người nhận */}
                <input
                  type="text"
                  placeholder="Họ và tên người nhận"
                  value={full_name}
                  required
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* Số điện thoại */}
                <input
                  placeholder="Số điện thoại"
                  value={phone}
                  onChange={(e) => {
                    let digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                    if (digits && digits[0] !== "0")
                      digits = "0" + digits.slice(0, 9);
                    const formatted = digits.replace(
                      /(\d{3})(\d{0,3})(\d{0,4})/,
                      (_, g1, g2, g3) => [g1, g2, g3].filter(Boolean).join(" ")
                    );
                    setPhone(formatted);
                    setPhoneError("");
                  }}
                  onBlur={() => validatePhone(phone)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {phoneError && (
                  <p className="text-red-500 text-sm mt-1">{phoneError}</p>
                )}

                {/* Province / District / Ward */}
                <div className="grid grid-cols-3 gap-4">
                  <select
                    value={selectedProvince}
                    onChange={(e) => {
                      setSelectedProvince(e.target.value);
                      setSelectedDistrict("");
                      setSelectedWard("");
                      setShippingError("");
                    }}
                    className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Chọn Tỉnh/Thành phố</option>
                    {provinces.map((p) => (
                      <option key={p.code} value={p.code}>
                        {p.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedDistrict}
                    onChange={(e) => {
                      setSelectedDistrict(e.target.value);
                      setSelectedWard("");
                      setShippingError("");
                    }}
                    disabled={!selectedProvince}
                    className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  >
                    <option value="">Chọn Quận/Huyện</option>
                    {districts
                      .filter((d) => d.province_code === selectedProvince)
                      .map((d) => (
                        <option key={d.code} value={d.code}>
                          {d.name}
                        </option>
                      ))}
                  </select>

                  <select
                    value={selectedWard}
                    onChange={(e) => {
                      setSelectedWard(e.target.value);
                      setShippingError("");
                    }}
                    disabled={!selectedDistrict}
                    className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  >
                    <option value="">Chọn Phường/Xã</option>
                    {wards
                      .filter((w) => w.district_code === selectedDistrict)
                      .map((w) => (
                        <option key={w.code} value={w.name}>
                          {w.name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Địa chỉ cụ thể */}
                <input
                  type="text"
                  placeholder="Số nhà, tên đường"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* Lỗi địa chỉ chung */}
                {shippingError && (
                  <p className="text-red-500 text-sm mt-1">{shippingError}</p>
                )}
              </div>
            </div>
            {/* Customer Note Section */}{" "}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              {" "}
              <h2 className="text-lg font-semibold mb-4">
                {" "}
                Ghi chú cho đơn hàng{" "}
              </h2>{" "}
              <textarea
                placeholder="Ghi chú (ví dụ: Gọi trước khi giao, giao giờ hành chính...)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />{" "}
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
                {/* Card */}
                <div
                  className={`p-4 border-b border-gray-300 cursor-pointer ${
                    paymentMethod === "card"
                      ? "bg-blue-50 border-l-4 border-l-blue-500"
                      : ""
                  }`}
                  onClick={() => setPaymentMethod("card")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "card"}
                        onChange={() => setPaymentMethod("card")}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="ml-3 font-medium">
                        OnePAY - Credit/ATM card/QR
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <CreditCard className="w-6 h-6 text-gray-400" />
                      <div className="text-xs text-gray-500">VISA • • •</div>
                    </div>
                  </div>
                </div>
                {paymentMethod === "card" && (
                  <div className="p-4 bg-gray-50 text-sm text-gray-600 text-center border-b border-gray-300">
                    <div className="flex justify-center mb-3">
                      <CreditCard className="w-16 h-16 text-gray-400" />
                    </div>
                    Sau khi nhấp vào "Thanh toán ngay", bạn sẽ được chuyển hướng
                    đến OnePAY để hoàn tất.
                  </div>
                )}

                {/* COD */}
                <div
                  className={`p-4 cursor-pointer ${
                    paymentMethod === "cod"
                      ? "bg-blue-50 border-l-4 border-l-blue-500"
                      : ""
                  }`}
                  onClick={() => setPaymentMethod("cod")}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="ml-3 font-medium">
                      Thanh toán khi nhận hàng (COD)
                    </span>
                  </div>
                </div>
                {paymentMethod === "cod" && (
                  <div className="p-4 bg-gray-50 text-gray-700 text-sm border-t border-gray-300">
                    <strong>TRẢ TIỀN SAU KHI NHẬN HÀNG:</strong> Nhận hàng →
                    Kiểm tra hàng → Thanh toán.
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-gray-800 text-white py-4 rounded-md font-semibold hover:bg-gray-900 transition-colors cursor-pointer mt-4"
            >
              Thanh toán ngay
            </button>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              {(() => {
                const stored = localStorage.getItem("checkoutData");
                const data = stored ? JSON.parse(stored) : {};
                const cartItems = data.cartItems || [];
                const totalAmount = data.totalAmount || 0;
                const formatPrice = (price: number) =>
                  new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(price);

                return (
                  <>
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
                                {item.product?.name.length > 30
                                  ? item.product.name.slice(0, 50) + "..."
                                  : item.product?.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {formatPrice(item.product?.price)} ×{" "}
                                {item.quantity}
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
                          value={discountCode}
                          onChange={(e) => setDiscountCode(e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
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
                        <span className="text-xs text-gray-500 block mb-1">
                          VND
                        </span>
                        <span className="text-2xl font-bold text-blue-600">
                          {formatPrice(totalAmount)}
                        </span>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
