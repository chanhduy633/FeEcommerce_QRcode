import type { AdminProductRemote } from "../../../data/remoteTypes";
import type { IProduct } from "../../../types/Product";

export class CreateProductUseCase {
  private remote: AdminProductRemote;

  constructor(remote: AdminProductRemote) {
    this.remote = remote;
  }

  async execute(product: IProduct) {
    await this.remote.create(product);
  }
}

