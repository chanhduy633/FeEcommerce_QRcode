// src/app/viewmodels/authViewModel.ts
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import type { AuthUseCase } from "../../domain/usecases/authUseCase";

export const useAuthViewModel = (authUseCase: AuthUseCase) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await authUseCase.login(email, password);
      const token = res.data.token;
      const user = res.data.user;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      toast.success("Đăng nhập thành công!");

      navigate("/admin/dashboard", { replace: true });
    } catch (err: unknown) {
      let message = "Không thể kết nối đến máy chủ. Vui lòng thử lại.";
      if (err instanceof Error && err.message) {
        message = err.message;
      }
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    password,
    loading,
    error,
    setEmail,
    setPassword,
    handleSubmit,
  };
};
