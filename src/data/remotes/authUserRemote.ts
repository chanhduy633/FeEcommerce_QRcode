// src/remote/AuthUserRemote.ts

import { API_ROUTES } from "../../config/api";

export interface IAuthUserRemote {
  login(email: string, password: string): Promise<any>;
  register(userData: { email: string; password: string; full_name: string; phone: string }): Promise<any>;
  getGoogleOAuthUrl(): string;
}

export class AuthUserRemote implements IAuthUserRemote {
  async login(email: string, password: string) {
    const res = await fetch(API_ROUTES.LOGIN_USER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Đăng nhập thất bại");
    return data.data;
  }

  async register(userData: { email: string; password: string; full_name: string; phone: string }) {
    const res = await fetch(API_ROUTES.REGISTER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Đăng ký thất bại");
    return data.data;
  }

  getGoogleOAuthUrl() {
    return API_ROUTES.GOOGLE_OAUTH;
  }
}
