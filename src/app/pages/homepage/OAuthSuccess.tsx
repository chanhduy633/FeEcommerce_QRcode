// src/components/OAuthSuccess.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUseCase } from "../../dependencies";

export default function OAuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userId = params.get("userId");

    if (!token || !userId) {
      navigate("/login");
      return;
    }

    loginUseCase.execute(token, userId)
      .then((success) => {
        if (success) {
          // Dọn URL
          window.history.replaceState({}, document.title, "/");
          navigate("/");
        } else {
          navigate("/login");
        }
      })
      .catch(() => navigate("/login"));
  }, [navigate]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-lg font-semibold">Đang đăng nhập bằng Google...</p>
    </div>
  );
}
