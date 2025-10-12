import { AdminProductRemoteV1 } from "../data/remotes/adminProductRemoteV1";
import type { AdminProductRemote } from "../data/remoteTypes";

class AdminDependencies {
  private static _instance: AdminDependencies;
  productRemote: AdminProductRemote;

  private constructor() {
    this.productRemote = new AdminProductRemoteV1();
  }

  static get instance() {
    if (!this._instance) this._instance = new AdminDependencies();
    return this._instance;
  }
}

export const adminDependencies = AdminDependencies.instance;
