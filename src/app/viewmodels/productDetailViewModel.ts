import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import type { IProduct } from "../../types/Product";
import { useHomepageViewModel } from "./homepageViewModel";
import { dependencies } from "../dependencies";
import getSpecificationUsecase from "../../domain/usecases/specification/getSpecificationUsecase";
import type { ISpecification } from "../../types/Specification";

export const useProductDetailViewModel = (productId: string) => {
  // ====== DEPENDENCIES ======
  const { getProductByIdUseCase } = dependencies;

  // ====== SHARED LOGIC FROM HOMEPAGE ======
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

  // ====== LOCAL STATE ======
  const [product, setProduct] = useState<IProduct | null>(null);
  const [specification, setSpecification] = useState<ISpecification | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [favorite, setFavorite] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  // ====== FETCH PRODUCT ======
  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await getProductByIdUseCase.execute(productId);
      // Fetch specification
      try {
        const specData = await getSpecificationUsecase.execute(productId);
        setSpecification(specData);
      } catch (specError) {
        console.log("No specification found for product:", productId);
        setSpecification(null);
      }
      // Normalize product data: map _id → id (handle both formats)
      const rawData = data as any;
      const normalizedProduct: IProduct = {
        ...data,
        id: rawData._id || data.id,
      };

      console.log("📦 Fetched and normalized product:", normalizedProduct);
      setProduct(normalizedProduct);
      setError(null);
    } catch (err: any) {
      const errorMessage = err.message || "Không thể tải sản phẩm";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  // ====== LOADING HELPERS ======
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

  // ====== QUANTITY MANAGEMENT ======
  const handleQuantityChange = (type: "increase" | "decrease") => {
    if (type === "increase" && product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
    if (type === "decrease" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // ====== STOCK VALIDATION ======
  const validateStock = (quantityToAdd: number): boolean => {
    if (!product) return false;

    const cartItems = cart?.items ?? [];
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

  // ====== ADD TO CART ======
  const handleAddToCartClick = async (userId: string) => {
    if (!product) return;

    if (!validateStock(quantity)) return;

    showLoading("Đang thêm vào giỏ hàng...");
    try {
      await handleAddToCart(userId, product, quantity);
      await fetchCart(userId);
      setQuantity(1);
    } catch (error) {
      console.error("❌ Error adding to cart:", error);
      toast.error("Không thể thêm sản phẩm vào giỏ hàng!");
    } finally {
      hideLoading();
    }
  };

  // ====== BUY NOW ======
  const handleBuyNowClick = async (userId: string, onOpenCart: () => void) => {
    if (!product) return;

    if (!validateStock(quantity)) return;

    showLoading("Đang xử lý mua hàng...");
    try {
      await handleAddToCart(userId, product, quantity);
      await fetchCart(userId);
      setQuantity(1);
      onOpenCart();
    } catch (error) {
      console.error("Error buying now:", error);
      toast.error("Không thể mua sản phẩm này!");
    } finally {
      hideLoading();
    }
  };

  // ====== FAVORITE TOGGLE ======
  const toggleFavorite = () => {
    setFavorite(!favorite);
    toast.success(favorite ? "Đã xóa khỏi yêu thích" : "Đã thêm vào yêu thích");
  };

  // ====== RELATED PRODUCTS ======
  const relatedProducts = useMemo(() => {
    if (!product) return [];

    const keywords = [
      ...product.name
        .toLowerCase()
        .split(" ")
        .filter((w) => w.length > 2),
      ...(product.description
        ?.toLowerCase()
        .split(" ")
        .filter((w) => w.length > 2) || []),
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
      .sort((a, b) => b.matchCount - a.matchCount)
      .slice(0, 8);

    return scoredProducts;
  }, [product, allProducts]);

  // ====== IMAGES ======
  const images = useMemo(() => {
    return product?.image_url ? [product.image_url] : [];
  }, [product]);

  // ====== CART ITEM COUNT ======
  const cartItemCount = useMemo(() => {
    return (
      cart?.items?.filter((item) => {
        const product = allProducts.find((p) => p.id === item.productId);
        return product && product.stock > 0;
      }).length ?? 0
    );
  }, [cart, allProducts]);

  // ====== RETURN ======
  return {
    // Product data
    product,
    specification,
    loading,
    error,
    images,

    // UI state
    quantity,
    selectedImage,
    setSelectedImage,
    favorite,
    actionLoading,
    loadingText,
    currentIndex,
    setCurrentIndex,

    // Cart data
    cart,
    cartItemCount,

    // Homepage shared
    allProducts,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchTerm,
    setSearchTerm,

    // Related products
    relatedProducts,

    // Actions
    handleQuantityChange,
    handleAddToCartClick,
    handleBuyNowClick,
    toggleFavorite,
    handleUpdateQuantity,
    handleRemoveItem,
    fetchCart,
  };
};
