import React from 'react';
import type { Product } from "../types/Product";


interface DeleteDialogProps {
  product: Product | null;
  onConfirm: (id: string) => void;
  onCancel: () => void;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({ product, onConfirm, onCancel }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-semibold mb-2">Xác nhận xóa</h3>
        <p className="text-gray-600 mb-6">
          Bạn có chắc chắn muốn xóa sản phẩm "{product.name}"?
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            Hủy
          </button>
          <button
            onClick={() => onConfirm(product.id)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDialog;