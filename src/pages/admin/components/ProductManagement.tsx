import React from "react";
import { Plus, Search } from "lucide-react";
import ProductTable from "./ProductTable";
import ProductForm from "./ProductForm";
import DeleteDialog from "./DeleteDialog";
import { useProductManagementViewModel } from "../../../domain/useProductManagementViewModel";

const ProductManagement: React.FC = () => {
  const {
    loading,
    products,
    searchTerm,
    setSearchTerm,
    isDialogOpen,
    setIsDialogOpen,
    editingProduct,
    deleteConfirm,
    setDeleteConfirm,
    handleAdd,
    handleEdit,
    handleSave,
    handleDelete,
  } = useProductManagementViewModel();

  if (loading) return <div className="text-center py-10">Đang tải sản phẩm...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý Sản phẩm</h2>
        <button
          onClick={handleAdd}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition"
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

      <ProductTable products={products} onEdit={handleEdit} onDelete={setDeleteConfirm} />

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
