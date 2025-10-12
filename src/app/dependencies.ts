import { ProductRemoteV1 } from "../data/remotes/productRemoteV1";
import type { ProductRemote } from "../data/remoteTypes";

class ClientDependencies {
  private static _instance: ClientDependencies;
  productRemote: ProductRemote;

  private constructor() {
    this.productRemote = new ProductRemoteV1();
  }

  static get instance() {
    if (!this._instance) this._instance = new ClientDependencies();
    return this._instance;
  }
}

export const dependencies = ClientDependencies.instance;
