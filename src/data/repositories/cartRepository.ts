import type { Cart } from "../../types/Cart";
import type { CartRemote } from "../remotes/cartRemote";

export interface ICartRepository {
  getCart(userId: string): Promise<Cart>;
  addToCart(userId: string, productId: string, quantity: number): Promise<Cart>;
  updateCartItem(userId: string, productId: string, quantity: number): Promise<Cart>;
  removeCartItem(userId: string, productId: string): Promise<Cart>;
}

export class CartRepository implements ICartRepository {
  private remote: CartRemote;

  constructor(remote: CartRemote) {
    this.remote = remote;
  }

  getCart(userId: string): Promise<Cart> {
    return this.remote.getCart(userId);
  }

  addToCart(userId: string, productId: string, quantity: number): Promise<Cart> {
    return this.remote.addToCart(userId, productId, quantity);
  }

  updateCartItem(userId: string, productId: string, quantity: number): Promise<Cart> {
    return this.remote.updateCartItem(userId, productId, quantity);
  }

  removeCartItem(userId: string, productId: string): Promise<Cart> {
    return this.remote.removeCartItem(userId, productId);
  }
}
