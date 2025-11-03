import React from "react";
import { Edit, Trash2 } from "lucide-react";
import type { IProduct } from "../../../../types/Product";

interface ProductTableProps {
  products: IProduct[];
  onEdit: (product: IProduct) => void;
  onDelete: (product: IProduct) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full table-fixed">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-[180px]">
                Sản phẩm
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-[40px]">
                Danh mục
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-[40px]">
                Giá
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-[20px]">
                Hình ảnh
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-[20px]">
                Đã bán
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-[20px]">
                Tồn kho
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase w-[20px]">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-gray-900">
                      {product.name}
                    </div>
                    <div className="text-sm text-gray-500 line-clamp-2">
                      {product.description}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {product.category}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {parseInt(product.price.toString()).toLocaleString("vi-VN")}₫
                </td>
                <td className="px-6 py-4">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded border"
                    />
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{product.sold}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{product.stock}</td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(product)}
                    className="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(product)}
                    className="text-red-600 hover:text-red-900 cursor-pointer"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
