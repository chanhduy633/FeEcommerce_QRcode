// src/domain/authRemote.ts
import { API_ROUTES } from "../../config/api";


export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export class AuthRemote {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(API_ROUTES.LOGIN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Đăng nhập thất bại. Vui lòng thử lại.");
    }

    return data;
  }
}
