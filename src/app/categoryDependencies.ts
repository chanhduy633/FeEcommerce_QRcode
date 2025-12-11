// ==================== DEPENDENCY INJECTION ====================
// app/dependencies/categoryDependencies.ts

// import { productRemote } from "../data/remotes/productRemoteV1";
// import { ProductRepository } from "../data/repositories/productRepository";
import { CategoryRemote } from "../data/remotes/categoryRemote";
import { CategoryRepository } from "../data/repositories/categoryRepository";
import { CreateCategoryUseCase } from "../domain/usecases/category/createCategoryUseCase";
import { DeleteCategoryUseCase } from "../domain/usecases/category/deleteCategoryUseCase";
import { GetCategoriesUseCase } from "../domain/usecases/category/getCategoriesUseCase";
import { UpdateCategoryUseCase } from "../domain/usecases/category/updateCategoryUseCase";
// import { GetAllProductsUseCase } from "../domain/usecases/getAllProducts";


const categoryRemote = new CategoryRemote();
const categoryRepository = new CategoryRepository(categoryRemote);

// const productRemote = new productRemote();
// const productRepository = new ProductRepository(productRemote);

export const categoryDependencies = {
  getCategories: new GetCategoriesUseCase(categoryRepository),
  createCategory: new CreateCategoryUseCase(categoryRepository),
  updateCategory: new UpdateCategoryUseCase(categoryRepository),
  deleteCategory: new DeleteCategoryUseCase(categoryRepository),
//   getProducts: new GetAllProductsUseCase(productRepository),
};