// src/pages/admin/components/ProductManagement.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import ProductTable from "./ProductTable";
import ProductForm from "./ProductForm";
import DeleteDialog from "./DeleteDialog";
import type { Product } from "../../../types/Product";
import { AdminProductViewModel } from "../../../domain/adminProductViewModel";

const vm = new AdminProductViewModel();

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      await vm.loadProducts();
      setProducts(vm.products);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const handleAdd = () => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleSave = async (formData: Product) => {
    if (editingProduct) await vm.updateProduct(editingProduct.id, formData);
    else await vm.addProduct(formData);
    setIsDialogOpen(false);
    await vm.loadProducts();
    setProducts(vm.products);
  };

  const handleDelete = async (id: string) => {
    await vm.deleteProduct(id);
    setProducts(vm.products);
    setDeleteConfirm(null);
  };

  if (loading) return <div className="text-center py-10">Đang tải sản phẩm...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý Sản phẩm</h2>
        <button
          onClick={handleAdd}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={20} />
          <span>Thêm sản phẩm</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <ProductTable products={filteredProducts} onEdit={handleEdit} onDelete={setDeleteConfirm} />

      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
            </h3>
            <ProductForm
              product={editingProduct}
              onSave={handleSave}
              onCancel={() => setIsDialogOpen(false)}
            />
          </div>
        </div>
      )}

      <DeleteDialog
        product={deleteConfirm}
        onConfirm={(id) => handleDelete(id)}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
};

export default ProductManagement;
