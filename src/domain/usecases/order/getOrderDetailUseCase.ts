import { OrderRepository } from "../../../data/repositories/orderRepository";

export class GetOrderDetailUseCase {
  private orderRepo: OrderRepository;

  constructor(orderRepo: OrderRepository) {
    this.orderRepo = orderRepo;
  }

  async execute(orderId: string) {
    return await this.orderRepo.getOrderById(orderId);
  }
}
