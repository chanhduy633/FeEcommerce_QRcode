import type { ICartRepository } from "../../../data/repositories/cartRepository";
import type { Cart } from "../../../types/Cart";

export class UpdateCartItem {
  private repo: ICartRepository;

  constructor(repo: ICartRepository) {
    this.repo = repo;
  }

  execute(userId: string, productId: string, quantity: number): Promise<Cart> {
    return this.repo.updateCartItem(userId, productId, quantity);
  }
}
