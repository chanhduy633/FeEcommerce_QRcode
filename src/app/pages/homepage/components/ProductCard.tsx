import React, { useState } from "react";
import { ShoppingCart, Star, Heart, Eye, Loader2, Package } from "lucide-react";
import type { IProduct } from "../../../../types/Product";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [favorite, setFavorite] = useState(false);

  const showLoading = (text: string) => {
    setLoading(true);
    setLoadingText(text);
    setTimeout(() => setLoading(false), 1000);
  };

  const handleAddToCart = () => {
    showLoading("Đang thêm vào giỏ hàng...");
    onAddToCart(product);
  };

  const handleBuyNow = () => {
    showLoading("Đang xử lý mua hàng...");
    onBuyNow(product);
  };

  const toggleFavorite = () => setFavorite(!favorite);

  const formatPrice = (price: number) =>
    price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  return (
    <>
      <div
        className="group bg-white border border-gray-200 rounded-xl overflow-hidden 
        hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      >
        {/* Product Image */}
        <div
          className="relative aspect-square overflow-hidden bg-gray-100 cursor-pointer"
          onClick={() => navigate(`/product/${product.id}`)}
        >
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <Package size={48} className="text-gray-400" />
            </div>
          )}

          {/* Stock badges */}
          {product.stock < 10 && product.stock > 0 && (
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-orange-500 text-white">
              Còn {product.stock}
            </div>
          )}

          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold text-lg">HẾT HÀNG</span>
            </div>
          )}

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <button
              onClick={toggleFavorite}
              className={`p-2 rounded-full shadow-lg transition  ${
                favorite
                  ? "bg-red-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 "
              }`}
            >
              <Heart size={18} fill={favorite ? "currentColor" : "none"} />
            </button>
            <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition ">
              <Eye size={18} />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-1">
            {product.description}
          </p>

          {/* Rating & Sold */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  fill={i < 4 ? "#FFC107" : "none"}
                  className="text-yellow-400"
                />
              ))}
            </div>
            <span className="text-xs text-gray-600">
              Đã bán {product.sold ?? 0}
            </span>
          </div>

          {/* Price */}
          <div className="mb-4">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-black">
                {formatPrice(product.price)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="flex-1 py-2.5 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Mua ngay
            </button>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="px-4 py-2.5 border-2 border-black rounded-lg hover:bg-gray-100 transition cursor-pointer disabled:border-gray-300 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white px-6 py-5 rounded-2xl shadow-lg flex flex-col items-center space-y-3">
            <Loader2 className="animate-spin text-black" size={40} />
            <p className="text-gray-700 font-medium">{loadingText}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
