// components/AuthModal.tsx
import React, { useState } from "react";
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  CheckCircle2,
  ShoppingBag,
  Shield,
  Zap,
} from "lucide-react";
import { authUserUseCase } from "../../../dependencies";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (userId: string, userData: any) => void;
}

type AuthMode = "login" | "register";

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    phone: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (mode === "register") {
      if (!formData.full_name) {
        newErrors.full_name = "Họ tên là bắt buộc";
      }
      if (!formData.phone) {
        newErrors.phone = "Số điện thoại là bắt buộc";
      } else if (!/^[0-9]{10}$/.test(formData.phone)) {
        newErrors.phone = "Số điện thoại không hợp lệ";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      let userData;
      if (mode === "login") {
        userData = await authUserUseCase.login(formData.email, formData.password);
      } else {
        userData = await authUserUseCase.register({
          email: formData.email,
          password: formData.password,
          full_name: formData.full_name,
          phone: formData.phone,
        });
      }

      onLoginSuccess(userData.user._id, userData.user);
      onClose();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleGoogleLogin = () => {
    const googleLoginUrl = authUserUseCase.getGoogleOAuthUrl();
    window.open(googleLoginUrl, "_self");
  };

  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setErrors({});
    setFormData({ email: "", password: "", full_name: "", phone: "" });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl relative animate-in zoom-in-95 duration-300 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-gray/20 hover:bg-white/20 rounded-full transition-all cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="flex h-[650px]">
          {/* LEFT SIDE - Branding */}
          <div className="hidden md:flex md:w-2/5  p-12 flex-col justify-between text-gray-700 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-300 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10">
              {/* Logo & Title */}
              <div className="mb-8">
                <h2 className="text-4xl font-bold mb-3">
                  {mode === "login" ? "TechStore xin chào!" : "Tạo tài khoản"}
                </h2>
                <p className="text-gray-400 text-lg">
                  {mode === "login"
                    ? "Đăng nhập để tiếp tục mua sắm"
                    : "Bắt đầu hành trình mua sắm của bạn"}
                </p>
              </div>

              {/* Features */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                    <ShoppingBag size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Mua sắm dễ dàng</h3>
                    <p className="text-gray-400 text-sm">
                      Hàng ngàn sản phẩm công nghệ chính hãng
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Thanh toán an toàn</h3>
                    <p className="text-gray-400 text-sm">
                      Bảo mật thông tin 100%
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                    <Zap size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Giao hàng nhanh</h3>
                    <p className="text-gray-400 text-sm">
                      Miễn phí ship cho đơn trên 500k
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Quote */}
            <div className="relative z-10">
              <p className="text-gray-600 italic text-sm">
                "Trải nghiệm mua sắm tốt nhất dành cho bạn"
              </p>
            </div>
          </div>

          {/* RIGHT SIDE - Form */}
          <div className="w-full max-h-[650px] overflow-y-auto md:w-3/5 p-8 md:p-12 overflow-y-auto">
            <div className="max-w-md mx-auto">
              {/* Mobile Title */}
              <div className="md:hidden text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
                  <span className="text-2xl font-bold text-white">T</span>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {mode === "login" ? "TechStore xin chào!" : "Tạo tài khoản"}
                </h2>
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {mode === "login" ? "Đăng nhập" : "Đăng ký"}
              </h3>
              <p className="text-gray-500 mb-6">
                {mode === "login"
                  ? "Chào mừng bạn quay đến với TechStore!"
                  : "Tạo tài khoản mới để bắt đầu"}
              </p>

              {/* Google Login Button */}
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all group mb-6 cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="font-medium text-gray-700 group-hover:text-gray-900">
                  {mode === "login" ? "Đăng nhập" : "Đăng ký"} với Google
                </span>
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-sm text-gray-500 font-medium">Hoặc</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name - Register Only */}
                {mode === "register" && (
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Họ và tên
                    </label>
                    <div className="relative">
                      <User
                        className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 rounded-xl focus:outline-none focus:bg-white transition-all ${
                          errors.full_name
                            ? "border-red-300 focus:border-red-500"
                            : "border-gray-200 focus:border-blue-500"
                        }`}
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                    {errors.full_name && (
                      <p className="text-red-500 text-xs flex items-center gap-1 ml-1">
                        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                        {errors.full_name}
                      </p>
                    )}
                  </div>
                )}

                {/* Phone - Register Only */}
                {mode === "register" && (
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Số điện thoại
                    </label>
                    <div className="relative">
                      <Phone
                        className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 rounded-xl focus:outline-none focus:bg-white transition-all ${
                          errors.phone
                            ? "border-red-300 focus:border-red-500"
                            : "border-gray-200 focus:border-blue-500"
                        }`}
                        placeholder="0912345678"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-xs flex items-center gap-1 ml-1">
                        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                        {errors.phone}
                      </p>
                    )}
                  </div>
                )}

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Email
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 rounded-xl focus:outline-none focus:bg-white transition-all ${
                        errors.email
                          ? "border-red-300 focus:border-red-500"
                          : "border-gray-200 focus:border-blue-500"
                      }`}
                      placeholder="example@gmail.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs flex items-center gap-1 ml-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full pl-11 pr-12 py-3.5 bg-gray-50 border-2 rounded-xl focus:outline-none focus:bg-white transition-all ${
                        errors.password
                          ? "border-red-300 focus:border-red-500"
                          : "border-gray-200 focus:border-blue-500"
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs flex items-center gap-1 ml-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Forgot Password - Login Only */}
                {mode === "login" && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                    >
                      Quên mật khẩu?
                    </button>
                  </div>
                )}

                {/* Submit Error */}
                {errors.submit && (
                  <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">⚠️</span>
                    <span>{errors.submit}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3.5 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <>
                      <span>
                        {mode === "login" ? "Đăng nhập" : "Tạo tài khoản"}
                      </span>
                      <CheckCircle2
                        className="group-hover:translate-x-1 transition-transform"
                        size={20}
                      />
                    </>
                  )}
                </button>
              </form>

              {/* Switch Mode */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  {mode === "login" ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
                  <button
                    onClick={switchMode}
                    className="text-blue-600 font-semibold hover:text-blue-700 hover:underline cursor-pointer"
                  >
                    {mode === "login" ? "Đăng ký ngay" : "Đăng nhập"}
                  </button>
                </p>
              </div>

              {/* Terms - Register Only */}
              {mode === "register" && (
                <p className="text-xs text-gray-500 text-center mt-4">
                  Bằng việc đăng ký, bạn đồng ý với{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Điều khoản dịch vụ
                  </a>{" "}
                  và{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Chính sách bảo mật
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
