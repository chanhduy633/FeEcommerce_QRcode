import React, { useEffect, useState } from "react";
import {
  ShoppingCart,
  Heart,
  Star,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Package,
  Minus,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CartSidebar from "./components/CartSideBar";
import TrustBadges from "./components/TrustBadges";
import { getGuestId } from "../../../utils/guestId";
import type { IProduct } from "../../../types/Product";
import { useHomepageViewModel } from "../../viewmodels/homepageViewModel";

const ProductDetail = () => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [favorite, setFavorite] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const id = window.location.pathname.split("/").pop() || "1";

  const {
    cart,
    allProducts,
    fetchCart,
    handleAddToCart,
    handleUpdateQuantity,
    handleRemoveItem,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchTerm,
    setSearchTerm,
  } = useHomepageViewModel();

  // Lấy user từ localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchCart(parsedUser._id);
    } else {
      fetchCart(getGuestId());
    }
  }, []);

  const userId = user?._id || getGuestId();

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5317/api/v1/products/${id}`);
        if (!res.ok) throw new Error("Không thể tải sản phẩm");
        const result = await res.json();
        
        // ✅ Normalize product data: map _id → id để đồng nhất với Homepage
        const productData = {
          ...result.data,
          id: result.data._id || result.data.id, // Ưu tiên _id nếu có
        };
        
        console.log("📦 Fetched and normalized product:", productData);
        setProduct(productData);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Lỗi không xác định");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const formatPrice = (price: number) =>
    price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const handleQuantityChange = (type: "increase" | "decrease") => {
    if (type === "increase" && product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
    if (type === "decrease" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const showLoading = (text: string) => {
    setActionLoading(true);
    setLoadingText(text);
  };

  const hideLoading = () => {
    setTimeout(() => {
      setActionLoading(false);
      setLoadingText("");
    }, 800);
  };

  // ✅ Helper: Validate stock trước khi thêm
  const validateStock = (quantityToAdd: number): boolean => {
    if (!product) return false;

    const cartItems = cart?.items ?? [];
    
    // Tìm sản phẩm trong giỏ bằng productId (quan trọng!)
    const existingItem = cartItems.find(
      (item) => item.productId === product.id
    );
    
    const currentQuantity = existingItem?.quantity ?? 0;
    const newTotal = currentQuantity + quantityToAdd;

    if (newTotal > product.stock) {
      const remaining = Math.max(product.stock - currentQuantity, 0);
      if (remaining === 0) {
        toast.error("Sản phẩm đã đạt giới hạn trong giỏ hàng!");
      } else {
        toast.error(`Chỉ có thể thêm tối đa ${remaining} sản phẩm nữa!`);
      }
      return false;
    }

    return true;
  };

  // ✅ Thêm vào giỏ hàng với validation
  const handleAddToCartClick = async () => {
    if (!product) return;

    // Validate stock trước
    if (!validateStock(quantity)) {
      return;
    }

    showLoading("Đang thêm vào giỏ hàng...");

    try {
     
      // Gọi handleAddToCart từ viewModel (đã xử lý logic thêm)
      await handleAddToCart(userId, product, quantity);
      
      // Đồng bộ lại giỏ hàng
      await fetchCart(userId);
      
      // Reset quantity về 1
      setQuantity(1);
      
      toast.success(`Đã thêm ${product.name} vào giỏ hàng!`);
    } catch (error) {
      console.error("❌ Error adding to cart:", error);
      toast.error("Không thể thêm sản phẩm vào giỏ hàng!");
    } finally {
      hideLoading();
    }
  };

  // ✅ Mua ngay = Thêm vào giỏ + Mở sidebar
  const handleBuyNowClick = async () => {
    if (!product) return;

    // Validate stock trước
    if (!validateStock(quantity)) {
      return;
    }

    showLoading("Đang xử lý mua hàng...");

    try {
      // Thêm vào giỏ
      await handleAddToCart(userId, product, quantity);
      
      // Đồng bộ giỏ hàng
      await fetchCart(userId);
      
      // Reset quantity
      setQuantity(1);
      
      // Mở cart sidebar
      setIsCartOpen(true);
      
      toast.success("Sản phẩm đã được thêm vào giỏ hàng!");
    } catch (error) {
      console.error("Error buying now:", error);
      toast.error("Không thể mua sản phẩm này!");
    } finally {
      hideLoading();
    }
  };

  const toggleFavorite = () => {
    setFavorite(!favorite);
    toast.success(favorite ? "Đã xóa khỏi yêu thích" : "Đã thêm vào yêu thích");
  };

  const handleLoginSuccess = (userId: string, userData: any) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    toast.success("Đăng nhập thành công!");
    fetchCart(userData._id);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.info("Đã đăng xuất.");
    fetchCart(getGuestId());
  };

  const handleProductSelect = (product: IProduct) => {
    navigate(`/product/${product.id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getRelatedProducts = (
    product: IProduct,
    allProducts: IProduct[],
    maxResults = 8
  ) => {
    if (!product) return [];

    const keywords = [
      ...product.name
        .toLowerCase()
        .split(" ")
        .filter((w) => w.length > 2),
      ...(product.description
        ? product.description
            .toLowerCase()
            .split(" ")
            .filter((w) => w.length > 2)
        : []),
    ];

    const scoredProducts = allProducts
      .filter((p) => p.id !== product.id)
      .map((p) => {
        const nameWords = p.name.toLowerCase().split(" ");
        const descriptionWords = p.description?.toLowerCase().split(" ") || [];

        const matchCount = keywords.filter(
          (kw) => nameWords.includes(kw) || descriptionWords.includes(kw)
        ).length;

        return { ...p, matchCount };
      })
      .filter((p) => p.matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount);

    return scoredProducts.slice(0, maxResults);
  };

  const relatedProducts = product
    ? getRelatedProducts(product, allProducts, 8)
    : [];
  const images = product?.image_url ? [product.image_url] : [];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4 text-black" size={48} />
          <p className="text-gray-600 font-medium">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Có lỗi xảy ra
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 font-medium cursor-pointer"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // No product
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package size={64} className="text-gray-400 mb-4 mx-auto" />
          <p className="text-gray-600 font-medium">Không tìm thấy sản phẩm</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 font-medium cursor-pointer"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  // ✅ Tính cart item count (chỉ sản phẩm còn hàng)
  const cartItemCount =
    cart?.items?.filter((item) => {
      const product = allProducts.find((p) => p.id === item.productId);
      return product && product.stock > 0;
    }).length ?? 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        isMenuOpen={false}
        onMenuToggle={() => {}}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        cartItemCount={cartItemCount}
        onCartClick={() => setIsCartOpen(true)}
        isLoggedIn={!!user}
        userInfo={user}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
        products={allProducts}
        onProductSelect={handleProductSelect}
      />

      <TrustBadges />

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-black transition font-medium cursor-pointer"
        >
          <ChevronLeft size={20} />
          <span className="ml-1">Quay lại</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4 relative group">
              {images.length > 0 ? (
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-96 object-contain"
                />
              ) : (
                <div className="w-full h-96 bg-gray-100 flex items-center justify-center">
                  <Package size={64} className="text-gray-400" />
                </div>
              )}

              {/* Stock Badge */}
              {product.stock < 10 && product.stock > 0 && (
                <div className="absolute top-6 left-6 px-3 py-1 rounded-full text-xs font-semibold bg-orange-500 text-white">
                  Còn {product.stock}
                </div>
              )}

              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
                  <span className="text-white font-bold text-2xl">
                    HẾT HÀNG
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`bg-white border-2 rounded-lg p-2 cursor-pointer transition ${
                      selectedImage === index
                        ? "border-black"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-20 object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {product.name}
            </h1>

            {/* Rating & Sold */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    fill={i < 4 ? "#FFC107" : "none"}
                    className="text-yellow-400"
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                Đã bán {product.sold ?? 0}
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <span className="text-4xl font-bold text-black">
                {formatPrice(product.price)}
              </span>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Số lượng
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-200 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange("decrease")}
                    disabled={quantity <= 1}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="px-6 py-2 border-x-2 border-gray-200 font-semibold min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange("increase")}
                    disabled={product.stock === 0 || quantity >= product.stock}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  Còn {product.stock} sản phẩm
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={handleBuyNowClick}
                disabled={product.stock === 0 || actionLoading}
                className="flex-1 bg-black text-white py-3 cursor-pointer rounded-lg font-semibold hover:bg-gray-800 transition flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={20} />
                Mua ngay
              </button>
              <button
                onClick={handleAddToCartClick}
                disabled={product.stock === 0 || actionLoading}
                className="px-6 border-2 border-black cursor-pointer text-black rounded-lg hover:bg-gray-100 transition font-semibold disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                Thêm vào giỏ
              </button>
              <button
                onClick={toggleFavorite}
                className={`px-4 py-3 rounded-lg cursor-pointer border-2 transition ${
                  favorite
                    ? "bg-red-600 border-red-600 text-white"
                    : "border-black hover:bg-gray-100"
                }`}
              >
                <Heart size={20} fill={favorite ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Description */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-bold text-gray-900 mb-3 text-lg">
                Mô tả sản phẩm
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description ||
                  "Chưa có mô tả chi tiết cho sản phẩm này."}
              </p>
            </div>
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-12">
          <h3 className="font-bold text-gray-900 mb-4 text-lg">
            Thông số kỹ thuật
          </h3>
          <table className="w-full text-sm text-gray-700 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <tbody>
              <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-semibold bg-gray-50 w-1/3 text-gray-800">
                  Kích thước
                </td>
                <td className="px-4 py-3 bg-white">20 x 15 x 10 cm</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-semibold bg-gray-50 text-gray-800">
                  Trọng lượng
                </td>
                <td className="px-4 py-3 bg-white">500g</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-semibold bg-gray-50 text-gray-800">
                  Chất liệu
                </td>
                <td className="px-4 py-3 bg-white">Nhựa ABS + Kim loại</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-semibold bg-gray-50 text-gray-800">
                  Màu sắc
                </td>
                <td className="px-4 py-3 bg-white">Đen / Trắng / Xám</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-semibold bg-gray-50 text-gray-800">
                  Dung lượng
                </td>
                <td className="px-4 py-3 bg-white">64GB</td>
              </tr>
              <tr className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-semibold bg-gray-50 text-gray-800">
                  Bảo hành
                </td>
                <td className="px-4 py-3 bg-white">12 tháng</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Sản phẩm liên quan
            </h2>

            <div className="relative">
              {/* Navigation Buttons */}
              {relatedProducts.length > 4 && (
                <>
                  <button
                    onClick={() =>
                      setCurrentIndex((prev) =>
                        prev === 0 ? relatedProducts.length - 1 : prev - 1
                      )
                    }
                    className="absolute cursor-pointer left-0 top-1/2 -translate-y-1/2 bg-white border border-gray-200 shadow-lg rounded-full p-2 z-10 hover:bg-gray-100 transition"
                  >
                    <ChevronLeft size={24} />
                  </button>

                  <button
                    onClick={() =>
                      setCurrentIndex((prev) =>
                        prev === relatedProducts.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute cursor-pointer right-0 top-1/2 -translate-y-1/2 bg-white border border-gray-200 shadow-lg rounded-full p-2 z-10 hover:bg-gray-100 transition"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              {/* Products Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedProducts
                  .slice(currentIndex, currentIndex + 4)
                  .map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleProductSelect(item)}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition cursor-pointer group"
                    >
                      <div className="relative aspect-square overflow-hidden bg-gray-100">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package size={32} className="text-gray-400" />
                          </div>
                        )}

                        {item.stock < 10 && item.stock > 0 && (
                          <div className="absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-semibold bg-orange-500 text-white">
                            Còn {item.stock}
                          </div>
                        )}
                      </div>

                      <div className="p-3">
                        <h3 className="font-bold text-gray-900 mb-1 text-sm line-clamp-2">
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, j) => (
                            <Star
                              key={j}
                              size={12}
                              fill={j < 4 ? "#FFC107" : "none"}
                              className="text-yellow-400"
                            />
                          ))}
                        </div>
                        <p className="text-black font-bold text-base">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart?.items ?? []}
        userId={userId}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />

      {/* Action Loading Overlay */}
      {actionLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white px-6 py-5 rounded-2xl shadow-lg flex flex-col items-center space-y-3">
            <Loader2 className="animate-spin text-black" size={40} />
            <p className="text-gray-700 font-medium">{loadingText}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;