import { API_ROUTES } from "../../config/api";
import type { IProduct, IProductFromAPI } from "../../types/Product";
import type { ProductRemote } from "../remoteTypes";

export interface AdminProductRemote extends ProductRemote {
  create(product: IProduct): Promise<void>;
  update(id: string, product: IProduct): Promise<void>;
  delete(id: string): Promise<void>;
}

export class AdminProductRemoteV1 implements AdminProductRemote {
  private getToken() {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token chưa tồn tại, vui lòng đăng nhập lại");
    return token;
  }

  private format(p: IProductFromAPI): IProduct {
    return {
      id: p._id,
      name: p.name,
      description: p.description || "",
      price: p.price,
      category: p.category || "Khác",
      stock: p.stock,
      sold: p.sold,
      image_url: p.image_url,
    };
  }

  async getAll(): Promise<IProduct[]> {
    const res = await fetch(API_ROUTES.PRODUCTS);
    if (!res.ok) throw new Error("Không thể tải danh sách sản phẩm");
    const json = await res.json();
    return (json.data ?? []).map(this.format);
  }

  async getById(id: string): Promise<IProduct> {
    const res = await fetch(`${API_ROUTES.PRODUCTS}/${id}`);
    if (!res.ok) throw new Error("Không thể tải chi tiết sản phẩm");
    const json = await res.json();
    return this.format(json.data);
  }

  async create(product: IProduct): Promise<void> {
    const res = await fetch(API_ROUTES.PRODUCTS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.getToken()}`,
      },
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error("Không thể tạo sản phẩm");
  }

  async update(id: string, product: IProduct): Promise<void> {
    const res = await fetch(`${API_ROUTES.PRODUCTS}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.getToken()}`,
      },
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error("Không thể cập nhật sản phẩm");
  }

  async delete(id: string): Promise<void> {
    const res = await fetch(`${API_ROUTES.PRODUCTS}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
    if (!res.ok) throw new Error("Không thể xóa sản phẩm");
  }
}
