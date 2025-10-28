import type { AdminProductRemote } from "../../../data/remoteTypes";

export class DeleteProductUseCase {
  private remote: AdminProductRemote;

  constructor(remote: AdminProductRemote) {
    this.remote = remote;
  }

  async execute(id: string) {
    await this.remote.delete(id);
  }
}
