import { OrderRemote } from "../remotes/orderRemote";

export class OrderRepository {
  private remote: OrderRemote;

  constructor(remote: OrderRemote) {
    this.remote = remote;
  }
  async getOrders() {
    return await this.remote.getAll();
  }

  async updateOrderStatus(orderId: string, status: string) {
    return await this.remote.updateStatus(orderId, status);
  }

  async getOrderById(orderId: string) {
    return await this.remote.getById(orderId);
  }
}
