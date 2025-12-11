import type { Category } from "../../../types/Category";
import type { CategoryRepository } from "../../../data/repositories/categoryRepository";

export class GetCategoriesUseCase {
  private categoryRepo: CategoryRepository;

  constructor(categoryRepo: CategoryRepository) {
    this.categoryRepo = categoryRepo;
  }

  async execute(): Promise<Category[]> {
    return await this.categoryRepo.getCategories();
  }
}
