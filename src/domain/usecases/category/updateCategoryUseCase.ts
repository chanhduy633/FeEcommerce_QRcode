import type { CategoryRepository } from "../../../data/repositories/categoryRepository";
import type { Category } from "../../../types/Category";

export class UpdateCategoryUseCase {
  private categoryRepo: CategoryRepository;

  constructor(categoryRepo: CategoryRepository) {
    this.categoryRepo = categoryRepo;
  }

  async execute(id: string, data: Partial<Category>): Promise<Category> {
    if (data.name !== undefined && data.name.trim().length === 0) {
      throw new Error('Tên danh mục không được để trống');
    }

    return await this.categoryRepo.updateCategory(id, data);
  }
}
