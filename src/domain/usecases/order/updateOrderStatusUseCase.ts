import { OrderRepository } from "../../../data/repositories/orderRepository";

export class UpdateOrderStatusUseCase {
  private orderRepo: OrderRepository;

  constructor(orderRepo: OrderRepository) {
    this.orderRepo = orderRepo;
  }

  async execute(orderId: string, status: string) {
    return await this.orderRepo.updateOrderStatus(orderId, status);
  }
}
