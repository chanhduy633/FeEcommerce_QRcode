import React from "react";
import {
  Search,
  Plus,
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Edit2,
  Trash2,
  X,
  Tag,
} from "lucide-react";
import type { IProduct } from "../../../../types/Product";
import { useCategoryViewModel } from "../../../viewmodels/categoryViewModel";

const CategoryManagement = () => {
  const vm = useCategoryViewModel();

  const getStockStatus = (product: IProduct) => {
    if (product.stock === 0)
      return { text: "Hết hàng", class: "bg-red-100 text-red-700" };
    if (product.stock > 0 && product.stock < 10)
      return { text: "Sắp hết hàng", class: "bg-yellow-100 text-yellow-700" };
    return { text: "Còn hàng", class: "bg-green-100 text-green-700" };
  };

  if (vm.loading && vm.categories.length === 0 && vm.allProducts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-gray-600">
              Quản lý danh mục sản phẩm và theo dõi tồn kho
            </p>
          </div>
          <button
            onClick={vm.openAddModal}
            className="flex items-center space-x-2 px-4 py-2 bg-black/80 text-white rounded-lg hover:bg-black/65 cursor-pointer transition"
          >
            <Plus className="w-5 h-5" />
            Thêm danh mục
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Tổng sản phẩm"
            value={vm.stats.totalProducts}
            icon={<Package className="w-10 h-10 text-blue-500" />}
          />
          <StatCard
            title="Hết hàng"
            value={vm.stats.outOfStock}
            valueClass="text-red-600"
            icon={<TrendingDown className="w-10 h-10 text-red-500" />}
          />
          <StatCard
            title="Sắp hết hàng"
            value={vm.stats.lowStock}
            valueClass="text-yellow-600"
            icon={<AlertTriangle className="w-10 h-10 text-yellow-500" />}
          />
          <StatCard
            title="Giá trị kho"
            value={`${(vm.stats.totalValue / 1e9).toFixed(1)}B`}
            valueClass="text-green-600"
            icon={<TrendingUp className="w-10 h-10 text-green-500" />}
          />
        </div>

        {/* Categories Table */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              Danh sách danh mục
            </h2>
          </div>

          <div className="overflow-x-auto">
            {vm.categories.length === 0 ? (
              <div className="text-center py-12">
                <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Chưa có danh mục nào</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tên danh mục
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Slug
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mô tả
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số sản phẩm
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {vm.categories.map((category) => (
                    <tr key={category._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {category.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {category.slug}
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate text-sm text-gray-500">
                        {category.description || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {category.productCount || 0}
                        
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${
                            category.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {category.isActive ? "Hoạt động" : "Tạm ẩn"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => vm.openEditModal(category)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => vm.openDeleteModal(category._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Products Inventory Filter */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Tồn kho sản phẩm
            </h2>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={vm.searchTerm}
                  onChange={(e) => vm.setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={vm.stockFilter}
                onChange={(e) => vm.setStockFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả</option>
                <option value="good">Còn hàng</option>
                <option value="low">Sắp hết hàng</option>
                <option value="out">Hết hàng</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            {vm.products.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Không tìm thấy sản phẩm nào</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sản phẩm
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Danh mục
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giá
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tồn kho
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Đã bán
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {vm.products.map((product) => {
                    const status = getStockStatus(product);
                    return (
                      <tr key={product._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-normal break-words">
                          <div className="flex items-center">
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-10 h-10 rounded object-cover"
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium  text-gray-800">
                                {product.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {product.price.toLocaleString("vi-VN")}đ
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.stock}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.sold}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${status.class}`}
                          >
                            {status.text}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Modal */}
        {vm.showModal && (
          <CategoryModal
            mode={vm.modalMode}
            formData={vm.formData}
            onChange={vm.updateFormData}
            onClose={vm.closeModal}
            onSubmit={vm.handleSubmit}
          />
        )}

        {vm.showDeleteModal && (
          <DeleteConfirmModal
            onClose={vm.closeDeleteModal}
            onConfirm={vm.confirmDelete}
          />
        )}
      </div>
    </div>
  );
};

// ============ Helper Components ============

const StatCard = ({
  title,
  value,
  valueClass = "text-gray-900",
  icon,
}: {
  title: string;
  value: number | string;
  valueClass?: string;
  icon: React.ReactNode;
}) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className={`text-2xl font-bold ${valueClass}`}>{value}</p>
      </div>
      {icon}
    </div>
  </div>
);

interface CategoryModalProps {
  mode: "add" | "edit";
  formData: {
    name: string;
    description: string;
    image: string;
    isActive: boolean;
  };
  onChange: (data: Partial<typeof formData>) => void;
  onClose: () => void;
  onSubmit: () => Promise<void>;
}

const CategoryModal = ({
  mode,
  formData,
  onChange,
  onClose,
  onSubmit,
}: CategoryModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            {mode === "add" ? "Thêm danh mục mới" : "Chỉnh sửa danh mục"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên danh mục *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => onChange({ name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập tên danh mục"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => onChange({ description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập mô tả"
              rows={3}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => onChange({ isActive: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
              Kích hoạt danh mục
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              onClick={onSubmit}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {mode === "add" ? "Thêm" : "Cập nhật"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
const DeleteConfirmModal = ({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: () => void;
}) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 max-w-sm w-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Bạn có chắc muốn xóa?
      </h3>
      <p className="text-gray-600 mb-6">
        Thao tác này không thể hoàn tác. Danh mục và dữ liệu liên quan sẽ bị xóa
        vĩnh viễn.
      </p>

      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Hủy
        </button>

        <button
          onClick={onConfirm}
          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Xóa
        </button>
      </div>
    </div>
  </div>
);

export default CategoryManagement;
