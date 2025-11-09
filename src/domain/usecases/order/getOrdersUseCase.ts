import { OrderRepository } from "../../../data/repositories/orderRepository";

export class GetOrdersUseCase {
  private orderRepo: OrderRepository;

  constructor(orderRepo: OrderRepository) {
    this.orderRepo = orderRepo;
  }

  async execute() {
    return await this.orderRepo.getOrders();
  }
}
