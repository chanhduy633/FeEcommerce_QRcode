// src/domain/usecases/GetCart.ts
import type { ICartRepository } from "../../../data/repositories/cartRepository";
import type { Cart } from "../../../types/Cart";

export class GetCart {
  private repo: ICartRepository;

  constructor(repo: ICartRepository) {
    this.repo = repo;
  }

  execute(userId: string): Promise<Cart> {
    return this.repo.getCart(userId);
  }
}
