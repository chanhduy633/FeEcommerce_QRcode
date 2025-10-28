// src/domain/usecases/RemoveCartItemUseCase.ts
import type { ICartRepository } from "../../../data/repositories/cartRepository";
import type { Cart } from "../../../types/Cart";

export class RemoveCartItem {
  private repo: ICartRepository;

  constructor(repo: ICartRepository) {
    this.repo = repo;
  }

  execute(userId: string, productId: string): Promise<Cart> {
    return this.repo.removeCartItem(userId, productId);
  }
}
