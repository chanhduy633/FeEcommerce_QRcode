import type { CategoryRepository } from "../../../data/repositories/categoryRepository";
export class DeleteCategoryUseCase {
  private categoryRepo: CategoryRepository;

  constructor(categoryRepo: CategoryRepository) {
    this.categoryRepo = categoryRepo;
  }

  async execute(id: string): Promise<void> {
    return await this.categoryRepo.deleteCategory(id);
  }
}
