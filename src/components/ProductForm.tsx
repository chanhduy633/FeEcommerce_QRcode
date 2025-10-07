import React, { useRef, useState } from "react";
import type { Product } from "../types/Product";
import { Upload, X } from "lucide-react";

interface ProductFormProps {
  product: Product | null;
  onSave: (formData: Product) => void;
  onCancel: () => void;
}

type ProductFormData = Omit<Product, "price" | "stock" | "sold"> & {
  price: string | number;
  stock: string | number;
  sold: string | number;
};

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<ProductFormData>(
    product || {
      id: "",
      name: "",
      price: "",
      category: "",
      stock: "",
      description: "",
      sold: "",
      image_url: "",
    }
  );
  const [previewImage, setPreviewImage] = useState<string>(
    product?.image_url || ""
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Kiểm tra loại file
      if (!file.type.startsWith("image/")) {
        alert("Vui lòng chọn file ảnh!");
        return;
      }

      // Kiểm tra kích thước (max 1MB)
      if (file.size > 1024 * 1024) {
        alert("Kích thước ảnh không được vượt quá 1MB!");
        return;
      }

      // Đọc file và chuyển thành base64
      const reader = new FileReader();
      reader.onloadstart = () => console.log("Đang đọc file...");
      reader.onerror = () => console.error("Lỗi khi đọc file:", reader.error);
      reader.onloadend = () => {
        console.log("Đọc xong file");
        const base64String = reader.result as string;
        console.log("Base64 length:", base64String.length);
        setPreviewImage(base64String);
        setFormData({ ...formData, image_url: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage("");
    setFormData({ ...formData, image_url: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = () => {
    if (
      formData.name &&
      formData.price &&
      formData.category &&
      formData.stock &&
      formData.description
    ) {
      onSave({
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        sold: Number(formData.sold),
      });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tên sản phẩm
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Giá (VNĐ)
          </label>
          <input
            type="number"
            min="0"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Số lượng
          </label>
          <input
            type="number"
            min="0"
            value={formData.stock}
            onChange={(e) =>
              setFormData({ ...formData, stock: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Đã bán (sold)
          </label>
          <input
            type="number"
            min="0"
            value={formData.sold}
            onChange={(e) => setFormData({ ...formData, sold: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Danh mục
          </label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="">Chọn danh mục</option>
            <option value="Điện thoại">Điện thoại</option>
            <option value="Laptop">Laptop</option>
            <option value="Phụ kiện">Phụ kiện</option>
            <option value="Tablet">Tablet</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hình ảnh sản phẩm
          </label>

          {previewImage ? (
            <div className="relative inline-block">
              <img
                src={previewImage}
                alt="Preview"
                className="w-28 h-28 object-cover rounded-lg border-2 border-gray-300"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-28 h-28 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
            >
              <Upload size={20} className="text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Nhấn để tải ảnh lên</p>
              <p className="text-xs text-gray-400 mt-1">
                PNG, JPG, GIF (max 1MB)
              </p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mô tả
        </label>
        <textarea
          rows={3}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
        >
          Hủy
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer "
        >
          {product ? "Cập nhật" : "Thêm mới"}
        </button>
      </div>
    </div>
  );
};

export default ProductForm;
