// src/domain/AdminProductViewModel.ts
import type { IProduct } from "../../types/Product";
import { adminDependencies} from "../adminDependencies";
import type { GetAllProductsUseCase } from "../../domain/usecases/getAllProducts";
import type { CreateProductUseCase } from "../../domain/usecases/admin/createProduct";
import type { UpdateProductUseCase } from "../../domain/usecases/admin/updateProduct";
import type { DeleteProductUseCase } from "../../domain/usecases/admin/deleteProduct";

export class AdminProductViewModel {
  products: IProduct[] = [];
  loading = false;

  private getAllProductsUC: GetAllProductsUseCase;
  private createProductUC: CreateProductUseCase;
  private updateProductUC: UpdateProductUseCase;
  private deleteProductUC: DeleteProductUseCase;

  constructor(
    getAllProductsUC = adminDependencies.getAllProductsUseCase,
    createProductUC = adminDependencies.createProductUseCase,
    updateProductUC = adminDependencies.updateProductUseCase,
    deleteProductUC = adminDependencies.deleteProductUseCase
  ) {
    this.getAllProductsUC = getAllProductsUC;
    this.createProductUC = createProductUC;
    this.updateProductUC = updateProductUC;
    this.deleteProductUC = deleteProductUC;
  }

  async loadProducts() {
    this.loading = true;
    this.products = await this.getAllProductsUC.execute();
    this.loading = false;
  }

  async addProduct(product: IProduct) {
    await this.createProductUC.execute(product);
    await this.loadProducts();
  }

  async updateProduct(id: string, product: IProduct) {
    await this.updateProductUC.execute(id, product);
    await this.loadProducts();
  }

  async deleteProduct(id: string) {
    await this.deleteProductUC.execute(id);
    await this.loadProducts();
  }
}

