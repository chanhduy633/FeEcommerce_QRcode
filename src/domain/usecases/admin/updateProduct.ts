import type { AdminProductRemote } from "../../../data/remoteTypes";
import type { IProduct } from "../../../types/Product";

export class UpdateProductUseCase {
  private remote: AdminProductRemote;

  constructor(remote: AdminProductRemote) {
    this.remote = remote;
  }

  async execute(id: string, product: IProduct) {
    await this.remote.update(id, product);
  }
}
