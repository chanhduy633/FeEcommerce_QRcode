import { AdminProductRemoteV1 } from "../data/remotes/adminProductRemoteV1";
import { CreateProductUseCase } from "../domain/usecases/admin/createProduct";
import { DeleteProductUseCase } from "../domain/usecases/admin/deleteProduct";
import { UpdateProductUseCase } from "../domain/usecases/admin/updateProduct";
import { GetAllProductsUseCase } from "../domain/usecases/getAllProducts";

const productRemote = new AdminProductRemoteV1();

// Inject remote vào từng UseCase
const getAllProductsUseCase = new GetAllProductsUseCase(productRemote);
const createProductUseCase = new CreateProductUseCase(productRemote);
const updateProductUseCase = new UpdateProductUseCase(productRemote);
const deleteProductUseCase = new DeleteProductUseCase(productRemote);

export const adminDependencies = {
  productRemote,
  getAllProductsUseCase,
  createProductUseCase,
  updateProductUseCase,
  deleteProductUseCase,
};
