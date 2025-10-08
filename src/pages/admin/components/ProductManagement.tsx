// components/admin/ProductManagement.tsx
import React, { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import ProductTable from "./ProductTable";
import ProductForm from "./ProductForm";
import DeleteDialog from "../components/DeleteDialog";
import type { Product } from "../../../types/Product";
import { useProducts } from "../../../hooks/adminProduct";

const ProductManagement: React.FC = () => {
  const {
    products,
    loading,
    loadProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Product | null>(null);

  // 🔄 Load products khi mount
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // ➕ Add product
  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  // ✏️ Edit product
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  // 💾 Save product
  const handleSaveProduct = async (formData: Product) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
      } else {
        await addProduct(formData);
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Lưu sản phẩm thất bại:", error);
    }
  };

  // 🗑️ Confirm delete
  const handleDeleteClick = (product: Product) => {
    setDeleteConfirm(product);
  };

  // 🔍 Filter
  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center py-10">Đang tải sản phẩm...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý Sản phẩm</h2>
        <button
          onClick={handleAddProduct}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
        >
          <Plus size={20} />
          <span>Thêm sản phẩm</span>
        </button>
      </div>

      {/* Search */}
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

      {/* Table */}
      <ProductTable
        products={filtered}
        onEdit={handleEditProduct}
        onDelete={handleDeleteClick}
      />

      {/* Form Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
            </h3>
            <ProductForm
              product={editingProduct}
              onSave={handleSaveProduct}
              onCancel={() => setIsDialogOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      <DeleteDialog
        product={deleteConfirm}
        onConfirm={(id) => {
          deleteProduct(id);
          setDeleteConfirm(null);
        }}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
};

export default ProductManagement;