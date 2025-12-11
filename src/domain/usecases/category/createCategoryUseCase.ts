import type { Category } from "../../../types/Category";
import type { CategoryRepository } from "../../../data/repositories/categoryRepository";

// domain/usecases/category/CreateCategoryUseCase.ts
export class CreateCategoryUseCase {
  private categoryRepo: CategoryRepository;

  constructor(categoryRepo: CategoryRepository) {
    this.categoryRepo = categoryRepo;
  }

  async execute(data: Omit<Category, '_id'>): Promise<Category> {
    // Business validation
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('Tên danh mục không được để trống');
    }
    
    if (data.name.length < 2) {
      throw new Error('Tên danh mục phải có ít nhất 2 ký tự');
    }

    return await this.categoryRepo.createCategory(data);
  }
}