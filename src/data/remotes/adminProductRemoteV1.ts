import { API_ROUTES } from "../../config/api";
import type { Product, ProductFromAPI } from "../../types/Product";
import type { AdminProductRemote } from "../remoteTypes";

export class AdminProductRemoteV1 implements AdminProductRemote {
  private getToken() {
    return localStorage.getItem("token");
  }

  private format(p: ProductFromAPI): Product {
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

  async getAll(): Promise<Product[]> {
    const res = await fetch(API_ROUTES.PRODUCTS);
    if (!res.ok) throw new Error("Không thể tải danh sách sản phẩm");

    const data: ProductFromAPI[] = await res.json();
    return data.map(this.format);
  }

  async getById(id: string): Promise<Product> {
    const res = await fetch(`${API_ROUTES.PRODUCTS}/${id}`);
    if (!res.ok) throw new Error("Không thể tải chi tiết sản phẩm");

    const p: ProductFromAPI = await res.json();
    return this.format(p);
  }

  async create(product: Product): Promise<void> {
    const token = this.getToken();
    const res = await fetch(API_ROUTES.PRODUCTS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Create error:", errorText);
      throw new Error("Không thể tạo sản phẩm");
    }
    // No return value needed for void
  }

  async update(id: string, product: Product): Promise<void> {
    const token = this.getToken();
    const res = await fetch(`${API_ROUTES.PRODUCTS}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Update error:", errorText);
      throw new Error("Không thể cập nhật sản phẩm");
    }
    // No return value needed for void
  }

  async delete(id: string): Promise<void> {
    const token = this.getToken();
    const res = await fetch(`${API_ROUTES.PRODUCTS}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Delete error:", errorText);
      throw new Error("Không thể xóa sản phẩm");
    }
  }
}
