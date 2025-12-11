// data/remotes/categoryRemote.ts
import { API_ROUTES } from "../../config/api";
import type { Category } from "../../types/Category";

export class CategoryRemote {
  async getAll(): Promise<Category[]> {
    const res = await fetch(API_ROUTES.CATEGORIES);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Không thể tải danh sách danh mục");
    return data.data;
  }

  async create(categoryData: Omit<Category, '_id'>): Promise<Category> {
    const res = await fetch(API_ROUTES.CATEGORIES, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(categoryData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Lỗi khi tạo danh mục");
    return data.data;
  }

  async update(id: string, categoryData: Partial<Category>): Promise<Category> {
    const res = await fetch(`${API_ROUTES.CATEGORIES}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(categoryData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Cập nhật danh mục thất bại");
    return data.data;
  }

  async delete(id: string): Promise<void> {
    const res = await fetch(`${API_ROUTES.CATEGORIES}/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Không thể xóa danh mục");
  }
}
