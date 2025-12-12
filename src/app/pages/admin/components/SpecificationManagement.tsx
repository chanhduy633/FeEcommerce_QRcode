import React, { useEffect } from "react";
import { Search, Save, Image } from "lucide-react";
import { useSpecificationViewModel } from "../../../viewmodels/specificationViewmodel";

const SpecificationManagement = () => {
  const {
    filteredProducts,
    selectedProduct,
    formData,
    searchTerm,
    setSearchTerm,
    isSaving,
    hasChanges,
    loadProducts,
    selectProduct,
    handleInputChange,
    save,
  } = useSpecificationViewModel();

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Quản lý Thông số Kỹ thuật Sản phẩm
        </h1>

        <div className="grid grid-cols-12 gap-6">
          {/* Danh sách sản phẩm */}
          <div className="col-span-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => selectProduct(product)}
                  className={`p-4 cursor-pointer transition-colors border-b border-gray-100 hover:bg-gray-50 ${
                    selectedProduct?.id === product.id
                      ? "bg-blue-50 border-l-4 border-l-black"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Image className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 capitalize">
                        {product.category}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form thông số kỹ thuật */}
          <div className="col-span-8">
            {selectedProduct ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 max-w-[300px] truncate block">
                      {selectedProduct.name}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Chỉnh sửa thông số kỹ thuật
                    </p>
                  </div>
                  <button
                    onClick={save}
                    disabled={!hasChanges || isSaving}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium cursor-pointer transition-colors ${
                      hasChanges && !isSaving
                        ? "bg-black/80 text-white hover:bg-black/45"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <Save className="w-5 h-5" />
                    {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                  </button>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-250px)]">
                  {/* Thông tin chung */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Thông tin chung
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        {
                          label: "Thương hiệu",
                          field: "brand",
                          placeholder: "VD: Apple, Samsung",
                        },
                        {
                          label: "Model",
                          field: "model",
                          placeholder: "VD: iPhone 15 Pro Max",
                        },
                        {
                          label: "Năm ra mắt",
                          field: "releaseYear",
                          placeholder: "",
                        },
                        {
                          label: "Bảo hành",
                          field: "warranty",
                          placeholder: "VD: 12 tháng",
                        },
                        {
                          label: "Xuất xứ",
                          field: "origin",
                          placeholder: "VD: Trung Quốc",
                        },
                        {
                          label: "Màu sắc",
                          field: "color",
                          placeholder: "VD: Titan Xanh",
                        },
                        {
                          label: "Chất liệu",
                          field: "material",
                          placeholder: "VD: Khung titan, mặt kính",
                          colSpan: 2,
                        },
                      ].map(({ label, field, placeholder, colSpan }) => (
                        <div key={field} className={`col-span-${colSpan || 1}`}>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {label}
                          </label>
                          <input
                            type={field === "releaseYear" ? "number" : "text"}
                            value={(formData as any)[field]}
                            onChange={(e) =>
                              handleInputChange(
                                field as keyof typeof formData,
                                field === "releaseYear"
                                  ? parseInt(e.target.value)
                                  : e.target.value
                              )
                            }
                            placeholder={placeholder}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Thông báo thay đổi */}
                  {hasChanges && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-800">
                        ⚠️ Bạn có thay đổi chưa được lưu. Nhớ nhấn "Lưu thay
                        đổi" để cập nhật.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Image className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">Chọn một sản phẩm</p>
                  <p className="text-sm mt-1">
                    Chọn sản phẩm từ danh sách bên trái để chỉnh sửa thông số kỹ
                    thuật
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecificationManagement;
