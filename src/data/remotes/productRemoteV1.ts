import type { ProductRemote } from "../remoteTypes";
import type { Product } from "../../types/Product";
import { API_ROUTES } from "../../config/api";

export class ProductRemoteV1 implements ProductRemote {
  async getAll(): Promise<Product[]> {
    const res = await fetch(API_ROUTES.PRODUCTS);
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
  }

  async getById(id: string): Promise<Product> {
    const res = await fetch(`${API_ROUTES.PRODUCTS}/${id}`);
    return res.json();
  }

  async create(product: Product): Promise<void> {
    await fetch(API_ROUTES.PRODUCTS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
  }
}
