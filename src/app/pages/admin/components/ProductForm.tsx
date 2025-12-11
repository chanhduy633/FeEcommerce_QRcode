import React, { useRef, useState } from "react";
import type { IProduct } from "../../../../types/Product";
import { Upload, X } from "lucide-react";
import type { UploadImageUseCase } from "../../../../domain/usecases/admin/uploadImageUseCase";

interface ProductFormProps {
  product: IProduct | null;
  onSave: (formData: IProduct) => void;
  onCancel: () => void;
  uploadImageUseCase: UploadImageUseCase; // DI UseCase
  categories: { _id: string; name: string }[];
}

type ProductFormData = Omit<IProduct, "price" | "stock" | "sold"> & {
  price: string | number;
  stock: string | number;
  sold: string | number;
};

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSave,
  onCancel,
  uploadImageUseCase,
  categories,
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Chọn file và tạo preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) return alert("Chọn file ảnh hợp lệ");
    if (file.size > 5 * 1024 * 1024) return alert("Ảnh quá lớn (max 5MB)");

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.price ||
      !formData.category ||
      !formData.stock ||
      !formData.description
    ) {
      return alert("Vui lòng điền đầy đủ thông tin");
    }

    setIsUploading(true);

    try {
      let imageUrl = formData.image_url;

      if (selectedFile) {
        imageUrl = await uploadImageUseCase.execute(selectedFile);
      }

      onSave({
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        sold: Number(formData.sold),
        image_url: imageUrl,
      });
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra khi upload ảnh");
    } finally {
      setIsUploading(false);
    }
  };
  const handleRemoveImage = () => {
    setPreviewImage("");
    setSelectedFile(null);
    setFormData({ ...formData, image_url: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      {/* Tên sản phẩm */}
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

      {/* Giá và Số lượng */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Giá (VNĐ)
          </label>
          <input
            type="number"
            min={0}
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
            min={0}
            value={formData.stock}
            onChange={(e) =>
              setFormData({ ...formData, stock: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Danh mục */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Đã bán (sold)
          </label>
          <input
            type="number"
            min={0}
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

            {categories.map((c) => (
              <option key={c._id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ảnh sản phẩm */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hình ảnh sản phẩm
        </label>
        {previewImage ? (
          <div className="relative inline-block">
            <img
              src={previewImage}
              alt="preview"
              className="w-28 h-28 object-cover rounded-lg border-2 border-gray-300"
            />
            <button
              onClick={handleRemoveImage}
              disabled={isUploading}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 disabled:opacity-50"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className="w-28 h-28 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
          >
            <Upload size={20} className="text-gray-400 mb-2" />
            <p className="text-xs text-gray-500">Tải ảnh lên</p>
            <p className="text-xs text-gray-400 mt-1">Max 5MB</p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          disabled={isUploading}
          className="hidden"
        />
      </div>

      {/* Mô tả */}
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

      {/* Buttons */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          onClick={onCancel}
          disabled={isUploading}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
        >
          Hủy
        </button>
        <button
          onClick={handleSubmit}
          disabled={isUploading}
          className="px-4 py-2 bg-black/80 text-white rounded-lg hover:bg-black/65 transition-colors cursor-pointer disabled:opacity-50"
        >
          {isUploading ? "Đang xử lý..." : product ? "Cập nhật" : "Thêm mới"}
        </button>
      </div>
    </div>
  );
};

export default ProductForm;
