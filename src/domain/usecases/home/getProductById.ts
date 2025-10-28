import type { IProductRepository } from "../../../data/repositories/productRepository";
import type { IProduct } from "../../../types/Product";

export class GetProductByIdUseCase {
  private repo: IProductRepository;

  constructor(repo: IProductRepository) {
    this.repo = repo;
  }

  async execute(id: string): Promise<IProduct> {
    return this.repo.getById(id);
  }
}
