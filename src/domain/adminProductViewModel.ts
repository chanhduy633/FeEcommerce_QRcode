// src/domain/AdminProductViewModel.ts
import { toast } from "sonner";
import type { Product } from "../types/Product";
import type { AdminProductRemote } from "../data/remoteTypes";
import { adminDependencies} from "../app/adminDependencies";

export class AdminProductViewModel {
  private remote: AdminProductRemote;
  products: Product[] = [];
  loading = false;

  constructor(remote?: AdminProductRemote) {
    this.remote = remote ?? adminDependencies.productRemote;
  }

  async loadProducts() {
    this.loading = true;
    try {
      this.products = await this.remote.getAll();
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải sản phẩm");
    } finally {
      this.loading = false;
    }
  }

  async addProduct(product: Product) {
    try {
      await this.remote.create(product);
      toast.success("Thêm sản phẩm thành công!");
      await this.loadProducts();
    } catch (error) {
      console.error(error);
      toast.error("Không thể thêm sản phẩm");
    }
  }

  async updateProduct(id: string, product: Product) {
    try {
      await this.remote.update(id, product);
      toast.success("Cập nhật sản phẩm thành công!");
      await this.loadProducts();
    } catch (error) {
      console.error(error);
      toast.error("Không thể cập nhật sản phẩm");
    }
  }

  async deleteProduct(id: string) {
    try {
      await this.remote.delete(id);
      this.products = this.products.filter((p) => p.id !== id);
      toast.success("Xóa sản phẩm thành công!");
    } catch (error) {
      console.error(error);
      toast.error("Không thể xóa sản phẩm");
    }
  }
}
