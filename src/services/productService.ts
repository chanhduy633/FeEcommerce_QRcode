import { API_ROUTES } from '../config/api';
import type { Product } from '../types/Product';

export interface ProductService {
  getProducts(): Promise<Product[]>;
}

// Triển khai thật
export class RestProductService implements ProductService {
  async getProducts(): Promise<Product[]> {
    const res = await fetch(API_ROUTES.PRODUCTS);
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  }
}