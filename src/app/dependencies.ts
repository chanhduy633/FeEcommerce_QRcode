// src/app/dependencies.ts

// ===== Product Layer =====
import { ProductRepository } from "../data/repositories/productRepository";

// ===== Cart Layer =====
import { CartRemoteV1 } from "../data/remotes/cartRemote";
import { CartRepository } from "../data/repositories/cartRepository";
import { GetAllProductsUseCase } from "../domain/usecases/getAllProducts";
import { GetCart } from "../domain/usecases/cart/getCart";
import { AddToCart } from "../domain/usecases/cart/addToCart";
import { UpdateCartItem } from "../domain/usecases/cart/updateCartItem";
import { RemoveCartItem } from "../domain/usecases/cart/removeCartItem";
import { GetProductByIdUseCase } from "../domain/usecases/home/GetProductById";

// ============================================================
// 🧩 Remote
// ============================================================
const cartRemote = new CartRemoteV1();

// ============================================================
// 🧱 Repository
// ============================================================
const cartRepository = new CartRepository(cartRemote);
const productRepository = new ProductRepository();

// ============================================================
// 🧠 Use Cases
// ============================================================
const getAllProductsUseCase = new GetAllProductsUseCase(productRepository);
const getProductByIdUseCase = new GetProductByIdUseCase(productRepository);
const getCartUseCase = new GetCart(cartRepository);
const addToCartUseCase = new AddToCart(cartRepository);
const updateCartItemUseCase = new UpdateCartItem(cartRepository);
const removeCartItemUseCase = new RemoveCartItem(cartRepository);

// ============================================================
// 📦 Export dependencies
// ============================================================
export const dependencies = {
  // Product
  productRepository,
  getAllProductsUseCase,
  getProductByIdUseCase,

  // Cart
  cartRepository,
  getCartUseCase,
  addToCartUseCase,
  updateCartItemUseCase,
  removeCartItemUseCase,
};
