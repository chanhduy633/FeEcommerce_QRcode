import { productRemote } from "../remotes/productRemoteV1";
import type { IProduct } from "../../types/Product";


export interface IProductRepository {
  getAll(): Promise<IProduct[]>;
  getById(id: string): Promise<IProduct>;
}


export class ProductRepository implements IProductRepository {
  async getAll(): Promise<IProduct[]> {
    return await productRemote.getAll();
  }

  async getById(id: string): Promise<IProduct> {
    return await productRemote.getById(id);
  }
}
