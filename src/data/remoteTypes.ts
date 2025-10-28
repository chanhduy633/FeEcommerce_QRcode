// src/data/remoteTypes.ts
import type { Cart } from "../types/Cart";
import type { IProduct } from "../types/Product";

export interface ProductRemote {
  getAll(): Promise<IProduct[]>;
  getById(id: string): Promise<IProduct>;
}


export interface AdminProductRemote extends ProductRemote {
  create(product: IProduct): Promise<void>;
  update(id: string, product: IProduct): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface CartRemote {
  getCart(userId: string): unknown;
  getByUserId(userId: string): Promise<Cart>;
  addItem(userId: string, productId: string, quantity: number): Promise<Cart>;
  updateItem(userId: string, productId: string, quantity: number): Promise<Cart>;
  removeItem(userId: string, productId: string): Promise<Cart>;
  clear(userId: string): Promise<void>;
}
