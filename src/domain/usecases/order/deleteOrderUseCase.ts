import { OrderRepository } from "../../../data/repositories/orderRepository";

export class DeleteOrderUseCase {
  private repository: OrderRepository;

  constructor(repository: OrderRepository) {
    this.repository = repository;
  }

  async execute(orderId: string): Promise<any> {
    return await this.repository.deleteOrder(orderId);
  }
}