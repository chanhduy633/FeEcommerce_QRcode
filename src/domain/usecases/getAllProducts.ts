import type { IProductRepository } from "../../data/repositories/productRepository";
import type { IProduct, IProductFromAPI } from "../../types/Product";

export class GetAllProductsUseCase {
  private repository: IProductRepository;

  constructor(repository: IProductRepository) {
    this.repository = repository;
  }

  async execute(): Promise<IProduct[]> {
    const products =
      (await this.repository.getAll()) as unknown as IProductFromAPI[];

    const mapped = products.map((p) => ({
      id: p._id,
      name: p.name,
      description: p.description ?? "",
      price: p.price,
      category: p.category,
      stock: p.stock,
      sold: p.sold,
      image_url: p.image_url,
    }));


    return mapped;
  }
}
