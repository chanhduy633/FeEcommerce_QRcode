import type { IProduct } from "../../types/Product";
import type { AdminProductRemote } from "../remotes/adminProductRemoteV1";

export interface IAdminProductRepository {
  getAll(): Promise<IProduct[]>;
  getById(id: string): Promise<IProduct>;
  create(product: IProduct): Promise<void>;
  update(id: string, product: IProduct): Promise<void>;
  delete(id: string): Promise<void>;
}


export class AdminProductRepository implements IAdminProductRepository {
  private remote: AdminProductRemote;

  constructor(remote: AdminProductRemote) {
    this.remote = remote;
  }

  async getAll(): Promise<IProduct[]> {
    return await this.remote.getAll();
  }

  async getById(id: string): Promise<IProduct> {
    return await this.remote.getById(id);
  }

  async create(product: IProduct): Promise<void> {
    await this.remote.create(product);
  }

  async update(id: string, product: IProduct): Promise<void> {
    await this.remote.update(id, product);
  }

  async delete(id: string): Promise<void> {
  if (!id) {
    console.error("Product id không hợp lệ:", id);
    throw new Error("Không thể xóa sản phẩm: id không tồn tại");
  }
  await this.remote.delete(id);
}

}
