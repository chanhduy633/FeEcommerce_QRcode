// src/data/remoteTypes.ts
import type { Product } from "../types/Product";

export interface ProductRemote {
  getAll(): Promise<Product[]>;
  getById(id: string): Promise<Product>;
}


export interface AdminProductRemote extends ProductRemote {
  create(product: Product): Promise<void>;
  update(id: string, product: Product): Promise<void>;
  delete(id: string): Promise<void>;
}
