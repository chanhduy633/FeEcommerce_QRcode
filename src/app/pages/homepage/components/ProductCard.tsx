import React, { useState } from "react";
import { Package, Star, Loader2 } from "lucide-react";
import type { IProduct } from "../../../../types/Product";

interface ProductCardProps {
  product: IProduct;
  onBuyNow: (product: IProduct) => void;
  onAddToCart: (product: IProduct) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onBuyNow,
  onAddToCart,
}) => {
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");

  const showLoading = (text: string) => {
    setLoading(true);
    setLoadingText(text);
    setTimeout(() => setLoading(false), 1000); // 1.5s delay
  };

  const handleAddToCart = () => {
    showLoading("Đang thêm vào giỏ hàng...");
    onAddToCart(product);
  };

  const handleBuyNow = () => {
    showLoading("Đang xử lý mua hàng...");
    onBuyNow(product);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
        <div className="relative aspect-square">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover cursor-pointer"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <Package size={48} className="text-gray-400" />
            </div>
          )}

          {/* Stock Badge */}
          {product.stock < 10 && product.stock > 0 && (
            <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
              Còn {product.stock}
            </div>
          )}

          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white font-semibold">Hết hàng</span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 h-12">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 mb-3 line-clamp-2 h-10">
            {product.description}
          </p>

          {/* Rating and Sold */}
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="currentColor" />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              Đã bán {product.sold}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold text-blue-600">
              {product.price.toLocaleString("vi-VN")}₫
            </span>
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Thêm vào giỏ
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Mua ngay
            </button>
          </div>
        </div>
      </div>

      {/* 🔹 Loading Modal Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white px-6 py-5 rounded-2xl shadow-lg flex flex-col items-center space-y-3">
            <Loader2 className="animate-spin text-blue-600" size={40} />
            <p className="text-gray-700 font-medium">{loadingText}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
