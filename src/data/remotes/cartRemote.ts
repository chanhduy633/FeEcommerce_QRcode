// src/domain/remotes/cartRemote.ts
import type { Cart } from "../../types/Cart";
import { API_ROUTES } from "../../config/api";

export interface CartRemote {
  getCart(userId: string): Promise<Cart>;
  addToCart(userId: string, productId: string, quantity: number): Promise<Cart>;
  updateCartItem(userId: string, productId: string, quantity: number): Promise<Cart>;
  removeCartItem(userId: string, productId: string): Promise<Cart>;
  clearCart(userId: string): Promise<void>;
}

export class CartRemoteV1 implements CartRemote {
  private getToken() {
    return localStorage.getItem("token") || null;
  }

  private getHeaders(isJson = true) {
    const headers: Record<string, string> = {};
    const token = this.getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
    if (isJson) headers["Content-Type"] = "application/json";
    return headers;
  }

  async getCart(userId: string): Promise<Cart> {
    const res = await fetch(`${API_ROUTES.CART}/${userId}`, {
      headers: this.getHeaders(false),
    });
    if (!res.ok) throw new Error("Không thể tải giỏ hàng");
    const data = await res.json();
    return data.data;
  }

  async addToCart(userId: string, productId: string, quantity: number): Promise<Cart> {
    const res = await fetch(`${API_ROUTES.CART}`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ userId, productId, quantity }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.message || "Không thể thêm sản phẩm");
    }

    const data = await res.json();
    return data.data;
  }

  async updateCartItem(userId: string, productId: string, quantity: number): Promise<Cart> {
    const res = await fetch(`${API_ROUTES.CART}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify({ userId, productId, quantity }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.message || "Không thể cập nhật sản phẩm");
    }

    const data = await res.json();
    return data.data;
  }

  async removeCartItem(userId: string, productId: string): Promise<Cart> {
    const res = await fetch(`${API_ROUTES.CART}`, {
      method: "DELETE",
      headers: this.getHeaders(),
      body: JSON.stringify({ userId, productId }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.message || "Không thể xóa sản phẩm");
    }

    const data = await res.json();
    return data.data;
  }

  async clearCart(userId: string): Promise<void> {
    const res = await fetch(`${API_ROUTES.CART}/${userId}/clear`, {
      method: "DELETE",
      headers: this.getHeaders(false),
    });
    if (!res.ok) throw new Error("Không thể xóa toàn bộ giỏ hàng");
  }
}
