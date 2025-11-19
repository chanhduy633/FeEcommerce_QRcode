import { useState, useEffect, useRef } from "react";
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

  const cancelPollingRef = useRef<(() => void) | null>(null);
  const currentTotalAmountRef = useRef(0);
  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      if (cancelPollingRef.current) {
        cancelPollingRef.current();
      }
    };
  }, []);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        if (userData?.email) setEmail(userData.email);
        if (userData?.full_name) setFullName(userData.full_name);
        setIsLoggedIn(Boolean(userData?.email));
      }

      const checkoutDataRaw = localStorage.getItem("checkoutData");
      if (checkoutDataRaw) {
        const checkoutData = JSON.parse(checkoutDataRaw);
        const cartItemsLocal = checkoutData.cartItems || [];

        // ✅ Tính toán totalAmountLocal với kiểm tra giá trị hợp lệ
        const totalAmountLocal = cartItemsLocal.reduce(
          (sum: number, item: any) => {
            const price = item.price || 0;
            const quantity = item.quantity || 0;
            const itemTotal = Number(price) * Number(quantity);
            return sum + (isNaN(itemTotal) ? 0 : itemTotal);
          },
          0
        );

        setCartItems(cartItemsLocal);
        setTotalAmount(totalAmountLocal); // ✅ Cập nhật state.totalAmount
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
    if (
      !validateEmail(email) ||
      !validatePhone(phone) ||
      !validateShippingAddress()
    )
      return;
    if (cartItems.length === 0) return toast.error("Giỏ hàng trống");

    setIsLoading(true);
    try {
      const orderData = buildOrderData("COD");
      console.log("Order data for COD:", orderData);
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
  if (
    !validateEmail(email) ||
    !validatePhone(phone) ||
    !validateShippingAddress()
  )
    return;
  if (cartItems.length === 0) return toast.error("Giỏ hàng trống");

  setIsLoading(true);

  try {
    // ✅ 1. Lấy lại dữ liệu từ localStorage để đảm bảo chính xác
    const checkoutDataRaw = localStorage.getItem("checkoutData");
    if (!checkoutDataRaw) {
      toast.error("Không tìm thấy giỏ hàng");
      return;
    }

    const checkoutData = JSON.parse(checkoutDataRaw);
    const cartItemsLocal = checkoutData.cartItems || [];

    // ✅ LẤY TRỰC TIẾP totalAmount từ checkoutData
    const totalAmountLocal = checkoutData.totalAmount || 0;

    console.log("✅ Checkout QR - totalAmountLocal:", totalAmountLocal); // ✅ Debug log

    if (cartItemsLocal.length === 0) {
      toast.error("Giỏ hàng trống");
      return;
    }

    if (totalAmountLocal <= 0) {
      toast.error("Tổng tiền không hợp lệ");
      return;
    }

    // ✅ 2. Tạo mã đơn hàng tạm
    const tempOrderNumber = `ORD-${Date.now()}`;
    setOrderNumber(tempOrderNumber);

    // ✅ 3. Cập nhật lại state (tùy chọn)
    setCartItems(cartItemsLocal);
    setTotalAmount(totalAmountLocal); // Đồng bộ lại UI

    // ✅ 4. Tạo order data với totalAmountLocal
    const orderData = buildOrderData("BANK_TRANSFER");
    console.log("Order data for QR payment:", orderData);
    orderData.totalAmount = totalAmountLocal; // ✅ Ghi đè để chắc chắn

    setPendingOrderData(orderData);

    // ✅ 5. Hiển thị modal QR
    setShowQrModal(true);

    // ✅ 6. Bắt đầu polling với totalAmountLocal (không dùng state)
    startPaymentPolling(tempOrderNumber, totalAmountLocal, orderData);
  } catch (err: any) {
    console.error("Checkout QR error:", err);
    toast.error(err?.message || "Có lỗi xảy ra, vui lòng thử lại.");
  } finally {
    setIsLoading(false);
  }
};
  // ✅ Bắt đầu polling thanh toán → Tạo order khi đã thanh toán
  const startPaymentPolling = async (
    orderNum: string,
    amount: number,
    orderData: Order
  ) => {
    // Cancel polling cũ nếu có
    if (cancelPollingRef.current) {
      cancelPollingRef.current();
    }

    setIsCheckingPayment(true);

    const onSuccess = async () => {
      console.log("✅ Thanh toán thành công! Đang lưu đơn hàng...");

      try {
        // ✅ Tạo order trên backend SAU KHI đã nhận tiền
        const result = await createOrderUseCase.execute(orderData);
        const finalOrderNumber = result.data.orderNumber || orderNum;

        setOrderNumber(finalOrderNumber);
        setShowQrModal(false);
        setShowModal(true);

        // Xóa giỏ hàng
        localStorage.removeItem("checkoutData");
        setCartItems([]);
        setTotalAmount(0);
        setPendingOrderData(null);

        // ✅ Cập nhật lại ref sau khi xóa giỏ hàng
        currentTotalAmountRef.current = 0;

        toast.success("Thanh toán thành công! Đơn hàng đã được xác nhận.");
      } catch (err: any) {
        console.error("Error saving order after payment:", err);
        toast.error(
          "Đã nhận tiền nhưng lỗi lưu đơn hàng. Vui lòng liên hệ CSKH."
        );
      } finally {
        setIsCheckingPayment(false);
      }
    };

    const onTimeout = () => {
      console.log("⏱️ Hết thời gian chờ thanh toán");
      setIsCheckingPayment(false);
      toast.error(
        "Chưa nhận được thanh toán. Vui lòng thử lại hoặc liên hệ hỗ trợ."
      );
    };

    // Bắt đầu polling
    const cancelFn = await pollPaymentFromBackend(
      orderNum,
      amount, // ✅ Dùng `amount` đã được truyền vào
      onSuccess,
      onTimeout
    );

    cancelPollingRef.current = cancelFn;
  };

  // ✅ FIX: Polling gọi backend API để check thanh toán
  const pollPaymentFromBackend = async (
    orderNum: string,
    amount: number, // ✅ Nhận `amount` từ tham số
    onSuccess: () => void,
    onTimeout: () => void
  ): Promise<() => void> => {
    let retries = 0;
    const MAX_RETRIES = 40; // 2 phút (40 x 3s)
    const INTERVAL = 3000; // 3 giây

    const checkPayment = async () => {
      retries++;

      try {
        // ✅ Gửi `amount` được truyền vào từ tham số, không dùng `state.totalAmount`
        const response = await fetch(
          `http://localhost:5317/api/payment/check-sepay`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderNumber: orderNum,
              totalAmount: amount, // ✅ Dùng `amount` tham số
            }),
          }
        );

        const data = await response.json();

        if (data.success && data.isPaid) {
          clearInterval(intervalId);
          onSuccess();
          return;
        }

        if (retries >= MAX_RETRIES) {
          clearInterval(intervalId);
          onTimeout();
          return;
        }
      } catch (error) {
        console.error("Error checking payment:", error);
        if (retries >= MAX_RETRIES) {
          clearInterval(intervalId);
          onTimeout();
        }
      }
    };

    // Kiểm tra ngay lập tức
    await checkPayment();

    const intervalId: number = window.setInterval(checkPayment, INTERVAL);

    // Return function để cancel polling
    return () => clearInterval(intervalId);
  };
  const handleCloseQr = () => {
    // Cancel polling khi đóng modal
    if (cancelPollingRef.current) {
      cancelPollingRef.current();
    }
    setShowQrModal(false);
    setIsCheckingPayment(false);
  };

  const handleFinish = () => {
    setShowModal(false);
    window.location.href = "/";
  };

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
