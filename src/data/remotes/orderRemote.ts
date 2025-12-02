import { API_ROUTES } from "../../config/api";
import type { Order } from "../../types/Order";

export class OrderRemote {
  async getAll(): Promise<any[]> {
    const res = await fetch(API_ROUTES.ORDER);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Không thể tải danh sách đơn hàng");
    return data.data;
  }

  async updateStatus(orderId: string, status: string): Promise<any> {
    const res = await fetch(`${API_ROUTES.ORDER}/${orderId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Cập nhật trạng thái thất bại");
    return data.data;
  }

  async getById(orderId: string): Promise<any> {
    const res = await fetch(`${API_ROUTES.ORDER}/${orderId}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Không thể lấy chi tiết đơn hàng");
    return data.data;
  }

  async createOrder(order: Order): Promise<any> {
    const response = await fetch(API_ROUTES.ORDER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Lỗi khi tạo đơn hàng");
    return data;
  }
  
  async deleteOrder(orderId: string): Promise<any> {
  const res = await fetch(`${API_ROUTES.ORDER}/${orderId}`, {
    method: "DELETE",
  });
  
  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.message || "Không thể xóa đơn hàng");
  }
  
  return data.data;
}
}
