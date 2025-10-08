// hooks/useProducts.ts
import { useState, useEffect } from "react";
import type { ProductService } from "../services/productService";
import { RestProductService } from "../services/productService";
import type { Product } from "../types/Product";

// Factory: có thể thay đổi service (mock, real, cached...)
const createProductService = (): ProductService => {
  return new RestProductService(); // hoặc MockProductService trong test
};

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const service = createProductService(); // ← DI ở đây

    const load = async () => {
      try {
        setLoading(true);
        const data = await service.getProducts();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { products, loading, error };
};