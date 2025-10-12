import { dependencies } from "../app/dependencies";
import type { Product } from "../types/Product";

export class ProductViewModel {
  private remote = dependencies.productRemote;

  async getAllProducts(): Promise<Product[]> {
    return this.remote.getAll();
  }

  async getProductById(id: string): Promise<Product> {
    return this.remote.getById(id);
  }

}
 