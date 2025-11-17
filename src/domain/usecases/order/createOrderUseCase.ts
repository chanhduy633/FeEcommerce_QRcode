import type { OrderRepository } from "../../../data/repositories/orderRepository";
import type { Order } from "../../../types/Order";

export class CreateOrderUseCase {
   private orderRepo: OrderRepository;
  
    constructor(orderRepo: OrderRepository) {
      this.orderRepo = orderRepo;
    }
  

  async execute(order: Order): Promise<Order> {
    return await this.orderRepo.createOrder(order);
  }
}
