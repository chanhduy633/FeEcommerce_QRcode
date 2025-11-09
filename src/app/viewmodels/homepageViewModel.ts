import { useState, useEffect, useMemo } from "react";
import type { IProduct } from "../../types/Product";
import type { Cart } from "../../types/Cart";
import { toast } from "sonner";
import { dependencies } from "../dependencies";

export const useHomepageViewModel = () => {
  // 🧩 Lấy UseCases từ dependency injection
  const {
    getAllProductsUseCase,
    getProductByIdUseCase,
    getCartUseCase,
    addToCartUseCase,
    updateCartItemUseCase,
    removeCartItemUseCase,
  } = dependencies;

  // ====== UI State ======
  const [products, setProducts] = useState<IProduct[]>([]);
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([
    0, 100_000_000,
  ]);
  const [sortBy, setSortBy] = useState("default");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // ====== PRODUCTS ======
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProductsUseCase.execute();
      setProducts(data);
    } catch (err: any) {
      setError(err.message ?? "Không thể tải sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const getProductById = async (id: string) => {
    try {
      return await getProductByIdUseCase.execute(id);
    } catch {
      toast.error("Không thể tải thông tin sản phẩm!");
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm, priceRange, sortBy]);

  // ====== CART ======
  const fetchCart = async (userId: string) => {
    try {
      const data = await getCartUseCase.execute(userId);
      setCart(data);
    } catch {
      toast.error("Không thể tải giỏ hàng!");
    }
  };

  const handleAddToCart = async (
    userId: string,
    product: IProduct,
    quantityToAdd = 1
  ) => {
    try {
      // Lấy số lượng sản phẩm hiện có trong giỏ
      const cartItems = cart?.items ?? []; // nếu cart null thì coi như rỗng
      const existingItem = cartItems.find(
        (item) =>
          item.product?._id === product.id || item.productId === product.id
      );
      const currentQuantity = existingItem?.quantity ?? 0;

      const maxStock = product.stock ?? Infinity;

      const remaining = Math.max(maxStock - currentQuantity, 0);

      if (quantityToAdd > remaining) {
        toast.error(`Chỉ còn ${remaining} sản phẩm trong kho`);
        return;
      }
      // Nếu hợp lệ, thêm vào giỏ
      const updated = await addToCartUseCase.execute(
        userId,
        product.id,
        quantityToAdd
      );
      setCart(updated);
      toast.success(`Đã thêm ${product.name} vào giỏ hàng!`);
    } catch {
      toast.error("Không thể thêm sản phẩm!");
    }
  };

  const handleBuyNow = async (
    userId: string,
    product: IProduct,
    quantity = 1
  ) => {
    try {
      // Thêm sản phẩm vào giỏ hàng
      await handleAddToCart(userId, product, quantity);
    } catch {
      toast.error("Không thể mua ngay sản phẩm này!");
    }
  };

  const handleUpdateQuantity = async (
    userId: string,
    productId: string,
    quantity: number
  ) => {
    try {
      const updated = await updateCartItemUseCase.execute(
        userId,
        productId,
        quantity
      );
      setCart(updated);
    } catch {
      toast.error("Không thể cập nhật số lượng!");
    }
  };

  const handleRemoveItem = async (userId: string, productId: string) => {
    try {
      const updated = await removeCartItemUseCase.execute(userId, productId);
      setCart(updated);
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng!");
    } catch {
      toast.error("Không thể xóa sản phẩm!");
    }
  };

  // ====== FILTER + SORT ======
  const categories = useMemo(
    () => ["Tất cả", ...Array.from(new Set(products.map((p) => p.category)))],
    [products]
  );

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== "Tất cả") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (searchTerm) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "popular":
        result.sort((a, b) => b.sold - a.sold);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [products, selectedCategory, searchTerm, priceRange, sortBy]);

  // ====== PAGINATION ======
  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ====== RETURN ======
  return {
    loading,
    error,
    products: paginatedProducts,
    totalPages,
    currentPage,
    setCurrentPage,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchTerm,
    setSearchTerm,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    showFilters,
    setShowFilters,
    cart,
    fetchCart,
    handleAddToCart,
    handleBuyNow,
    handleUpdateQuantity,
    handleRemoveItem,
    getProductById,
  };
};
