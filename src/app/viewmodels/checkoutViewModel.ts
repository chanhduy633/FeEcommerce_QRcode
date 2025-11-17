import { useState, useEffect } from "react";
import { toast } from "sonner";
import { provinces, districts, wards } from "vietnam-provinces";
import { createOrderUseCase } from "../orderDependencies";
import type { Order } from "../../types/Order";

export const useCheckoutViewModel = () => {
  // ---------- Form state ----------
  const [email, setEmail] = useState("");
  const [saveInfo, setSaveInfo] = useState(true);
  const [full_name, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card">("card");
  const [discountCode, setDiscountCode] = useState("");
  const [note, setNote] = useState("");

  // ---------- UI state ----------
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [shippingError, setShippingError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);

  // ---------- Cart state ----------
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [pendingOrderData, setPendingOrderData] = useState<Order | null>(null);

  // ---------- Load user + cart ----------
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        if (userData?.email) setEmail(userData.email);
        if (userData?.full_name) setFullName(userData.full_name);
        setIsLoggedIn(Boolean(userData?.email));
      }

      const checkoutData = localStorage.getItem("checkoutData");
      if (checkoutData) {
        const data = JSON.parse(checkoutData);
        setCartItems(data.cartItems || []);
        setTotalAmount(
          (data.cartItems || []).reduce(
            (sum: number, item: any) => sum + item.price * item.quantity,
            0
          )
        );
      }
    } catch (err) {
      console.error("Không thể đọc user/cart từ localStorage:", err);
    }
  }, []);
  

  // ---------- Validation ----------
  const validateEmail = (emailValue: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(emailValue)) {
      toast.error("Email không hợp lệ");
      return false;
    }
    return true;
  };

  const validatePhone = (phoneValue: string) => {
    const digits = phoneValue.replace(/\D/g, "");
    const validPrefixes = ["03", "05", "07", "08", "09"];
    const prefix = digits.slice(0, 2);
    if (digits.length !== 10 || !validPrefixes.includes(prefix)) {
      setPhoneError("Số điện thoại không hợp lệ");
      return false;
    }
    setPhoneError("");
    return true;
  };

  const validateShippingAddress = () => {
    if (!address || !selectedProvince || !selectedDistrict) {
      setShippingError("Vui lòng điền đầy đủ địa chỉ giao hàng");
      return false;
    }
    setShippingError("");
    return true;
  };

  // ---------- Input handlers ----------
  const handlePhoneChange = (value: string) => {
    let digits = value.replace(/\D/g, "").slice(0, 10);
    if (digits && digits[0] !== "0") digits = "0" + digits.slice(0, 9);
    const formatted = digits.replace(
      /(\d{3})(\d{0,3})(\d{0,4})/,
      (_, g1, g2, g3) => [g1, g2, g3].filter(Boolean).join(" ")
    );
    setPhone(formatted);
    setPhoneError("");
  };

  const handleProvinceChange = (code: string) => {
    setSelectedProvince(code);
    setSelectedDistrict("");
    setSelectedWard("");
    setShippingError("");
  };
  const handleDistrictChange = (code: string) => {
    setSelectedDistrict(code);
    setSelectedWard("");
    setShippingError("");
  };
  const handleWardChange = (name: string) => {
    setSelectedWard(name);
    setShippingError("");
  };

  // ---------- Common: tạo order ----------
  const buildOrderData = (method: "COD" | "BANK_TRANSFER"): Order => {
    const guestId = sessionStorage.getItem("guest_user_id");
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    const shippingAddress = {
      name: full_name,
      email,
      phone: phone.replace(/\s/g, ""),
      street: address,
      ward: selectedWard,
      district: districts.find((d) => d.code === selectedDistrict)?.name || "",
      city: provinces.find((p) => p.code === selectedProvince)?.name || "",
    };

    return {
      _id: "",
      orderNumber: "",
      userId: user?._id || guestId || "",
      totalAmount,
      status: "PENDING",
      createdAt: new Date().toISOString(),
      paymentMethod: method,
      payment: { method, status: "PENDING" },
      shippingAddress,
      items: cartItems.map((item: any) => ({
        name: item.name,
        image: item.image,
        quantity: item.quantity,
        price: item.price,
      })),
      notes: note,
    };
  };

  // ---------- COD checkout ----------
  const handleCheckoutCOD = async () => {
    if (!validateEmail(email) || !validatePhone(phone) || !validateShippingAddress()) return;
    if (cartItems.length === 0) return toast.error("Giỏ hàng trống");

    setIsLoading(true);
    try {
      const orderData = buildOrderData("COD");
      const result = await createOrderUseCase.execute(orderData);
      const newOrderNumber = result.data.orderNumber || "N/A";

      setOrderNumber(newOrderNumber);
      setShowModal(true);
      toast.success("Đặt hàng thành công!");
      localStorage.removeItem("checkoutData");
      setCartItems([]);
      setTotalAmount(0);
    } catch (err: any) {
      console.error("Checkout COD error:", err);
      toast.error(err?.message || "Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  // ---------- QR checkout ----------
 const handleCheckoutQR = async () => {
  if (!validateEmail(email) || !validatePhone(phone) || !validateShippingAddress()) return;
  if (cartItems.length === 0) return toast.error("Giỏ hàng trống");

  // Không tạo đơn hàng ở đây — chỉ lưu dữ liệu tạm và mở QR modal
  const orderData = buildOrderData("BANK_TRANSFER");
  setPendingOrderData(orderData);
  setShowQrModal(true);
};

  // ---------- Confirm QR Payment ----------
const handleConfirmPayment = async () => {
  if (!pendingOrderData) return;
  setIsCheckingPayment(true);

  try {
    // Giả lập chờ người dùng thanh toán
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // ✅ Chỉ tạo đơn hàng khi xác nhận thanh toán
    const result = await createOrderUseCase.execute(pendingOrderData);
    const newOrderNumber = result.data.orderNumber || "N/A";

    setOrderNumber(newOrderNumber);
    setPendingOrderData(null);
    setShowQrModal(false);
    setShowModal(true);

    // Xóa dữ liệu checkout + giỏ hàng
    localStorage.removeItem("checkoutData");
    setCartItems([]);
    setTotalAmount(0);

    toast.success("Thanh toán thành công!");
  } catch (err: any) {
    console.error("Confirm payment error:", err);
    toast.error("Chưa nhận được thanh toán. Vui lòng thử lại.");
  } finally {
    setIsCheckingPayment(false);
  }
};


  const handleFinish = () => {
    setShowModal(false);
    window.location.href = "/";
  };
  const handleCloseQr = () => setShowQrModal(false);

  return {
    state: {
      email,
      saveInfo,
      full_name,
      address,
      selectedProvince,
      selectedDistrict,
      selectedWard,
      phone,
      paymentMethod,
      discountCode,
      note,
      isLoggedIn,
      phoneError,
      shippingError,
      showModal,
      showQrModal,
      orderNumber,
      isLoading,
      isCheckingPayment,
      cartItems,
      totalAmount,
      pendingOrderData,
    },
    setEmail,
    setSaveInfo,
    setFullName,
    setAddress,
    setPaymentMethod,
    setDiscountCode,
    setNote,
    setCartItems,
    setTotalAmount,
    setPendingOrderData,
    handlePhoneChange,
    handleProvinceChange,
    handleDistrictChange,
    handleWardChange,
    handleCheckoutCOD,
    handleCheckoutQR,
    handleConfirmPayment,
    handleFinish,
    handleCloseQr,
    validatePhone,
    validateEmail,
    validateShippingAddress,
    provinces,
    districts,
    wards,
  };
};
