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
import { GetProductByIdUseCase } from "../domain/usecases/home/getProductById";
import { UploadRemote } from "../data/remotes/uploadRemote";
import { UploadRepository } from "../data/repositories/uploadRepository";
import { UploadImageUseCase } from "../domain/usecases/admin/uploadImageUseCase";
import { RemoteUserRepository } from "../data/repositories/UserRepository";
import { LoginWithOAuthUseCase } from "../domain/usecases/home/loginWithOAuthUseCase";
import { AuthUserRemote } from "../data/remotes/authUserRemote";
import { AuthUserRepository } from "../data/repositories/authUserRepository";
import { AuthUserUseCase } from "../domain/usecases/home/authUserUseCase";

const uploadRemote = new UploadRemote();
const uploadRepo = new UploadRepository(uploadRemote);

export const uploadDependencies = {
  uploadImage: new UploadImageUseCase(uploadRepo),
};



const authUserRemote = new AuthUserRemote();
const authUserRepository = new AuthUserRepository(authUserRemote);
export const authUserUseCase = new AuthUserUseCase(authUserRepository);


export const userRepo = new RemoteUserRepository();
export const loginUseCase = new LoginWithOAuthUseCase(userRepo);

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
