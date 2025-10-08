import type { ProductFromAPI } from './../types/Product';
// hooks/useProducts.ts
import { useState, useCallback } from "react";
import { API_ROUTES } from "../config/api";
import { toast } from "sonner";
import type { Product } from "../types/Product";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔁 Load products
  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(API_ROUTES.PRODUCTS);
      if (!res.ok) throw new Error("Không thể tải sản phẩm");

      const data: ProductFromAPI[] = await res.json();
      const formatted: Product[] = data.map((p) => ({
        id: p._id,
        name: p.name,
        description: p.description || "",
        price: p.price,
        category: p.category || "Khác",
        stock: p.stock,
        sold: p.sold,
        image_url: p.image_url,
      }));
      setProducts(formatted);
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  }, []);

  // ➕ Add product
  const addProduct = useCallback(async (formData: Product) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(API_ROUTES.PRODUCTS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Thêm sản phẩm thất bại");

      const newProduct: ProductFromAPI = await res.json();
      const formatted: Product = {
        id: newProduct._id,
        name: newProduct.name,
        description: newProduct.description || "",
        price: newProduct.price,
        category: newProduct.category || "Khác",
        stock: newProduct.stock,
        sold: newProduct.sold,
        image_url: newProduct.image_url,
      };

      setProducts((prev) => [...prev, formatted]);
      toast.success("Thêm sản phẩm thành công!");
      return formatted;
    } catch (error) {
      console.error(error);
      toast.error("Không thể lưu sản phẩm!");
      throw error;
    }
  }, []);

  // ✏️ Update product
  const updateProduct = useCallback(async (id: string, formData: Product) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_ROUTES.PRODUCTS}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Cập nhật sản phẩm thất bại");

      const updated: ProductFromAPI = await res.json();
      const formatted: Product = {
        id: updated._id,
        name: updated.name,
        description: updated.description || "",
        price: updated.price,
        category: updated.category || "Khác",
        stock: updated.stock,
        sold: updated.sold,
        image_url: updated.image_url,
      };

      setProducts((prev) => prev.map((p) => (p.id === id ? formatted : p)));
      toast.success("Cập nhật sản phẩm thành công!");
      return formatted;
    } catch (error) {
      console.error(error);
      toast.error("Không thể lưu sản phẩm!");
      throw error;
    }
  }, []);

  // 🗑️ Delete product
  const deleteProduct = useCallback(async (id: string) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_ROUTES.PRODUCTS}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Xóa sản phẩm thất bại");

      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Xóa sản phẩm thành công!", { duration: 2000 });
    } catch (error) {
      console.error(error);
      toast.error("Không thể xóa sản phẩm!", { duration: 2000 });
      throw error;
    }
  }, []);

  return {
    products,
    loading,
    loadProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};