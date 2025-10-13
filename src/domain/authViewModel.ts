// src/domain/authViewModel.ts
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import type { AuthRemote } from "../data/remotes/authRemote";

export const useAuthViewModel = (remote: AuthRemote) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // ===== Logic xử lý chính =====
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { token, user } = await remote.login(email, password);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      toast.success("Đăng nhập thành công!");

      navigate("/admin/dashboard", { replace: true });
    } catch (err: any) {
      const message =
        err.message || "Không thể kết nối đến máy chủ. Vui lòng thử lại.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // ===== Trả ra các props cho UI =====
  return {
    // state
    email,
    password,
    loading,
    error,

    // actions
    setEmail,
    setPassword,
    handleSubmit,
  };
};
