import type { Category } from "../../types/Category";
import { CategoryRemote } from "../remotes/categoryRemote";

export class CategoryRepository {
  private remote: CategoryRemote;

  constructor(remote: CategoryRemote) {
    this.remote = remote;
  }

  async getCategories(): Promise<Category[]> {
    return await this.remote.getAll();
  }

  async createCategory(data: Omit<Category, '_id'>): Promise<Category> {
    return await this.remote.create(data);
  }

  async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    return await this.remote.update(id, data);
  }

  async deleteCategory(id: string): Promise<void> {
    return await this.remote.delete(id);
  }
}