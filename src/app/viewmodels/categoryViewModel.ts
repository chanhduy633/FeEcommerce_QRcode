import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import type { Category } from "../../types/Category";
import { categoryDependencies } from "../categoryDependencies";
import { dependencies } from "../dependencies";
import type { IProduct } from "../../types/Product";

interface CategoryFormData {
  name: string;
  description: string;
  image: string;
  isActive: boolean;
}

export function useCategoryViewModel() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // UI State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    description: "",
    image: "",
    isActive: true,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState("all");

  // ================================================
  // FETCH DATA
  // ================================================
  const fetchCategories = async () => {
    try {
      const cats = await categoryDependencies.getCategories.execute();
      setCategories(mergeCategoryProductCount(cats, products));
    } catch (err: any) {
      toast.error("Không thể tải danh mục");
      setError(err.message);
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await dependencies.getAllProductsUseCase.execute();
      setProducts(data);
    } catch (err: any) {
      toast.error("Không thể tải sản phẩm");
      setError(err.message);
    }
  };

  // load on mount
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [cats, prods] = await Promise.all([
          categoryDependencies.getCategories.execute(),
          dependencies.getAllProductsUseCase.execute(),
        ]);

        setProducts(prods);
        setCategories(mergeCategoryProductCount(cats, prods));
      } catch {
        toast.error("Không thể tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // ================================================
  // CRUD OPERATIONS + TOAST
  // ================================================
  const createCategory = async () => {
    try {
      setLoading(true);
      await categoryDependencies.createCategory.execute(formData);

      toast.success("Tạo danh mục thành công 🎉");

      await fetchCategories();
      closeModal();
    } catch (err: any) {
      toast.error(err.message || "Lỗi khi thêm danh mục");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async () => {
    if (!currentCategory) return;

    try {
      setLoading(true);
      await categoryDependencies.updateCategory.execute(
        currentCategory._id,
        formData
      );

      toast.success("Cập nhật danh mục thành công");

      await fetchCategories();
      closeModal();
    } catch (err: any) {
      toast.error(err.message || "Lỗi khi cập nhật danh mục");
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const openDeleteModal = (id: string) => {
    setCategoryToDelete(id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setCategoryToDelete(null);
    setShowDeleteModal(false);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    await deleteCategory(categoryToDelete);
    closeDeleteModal();
  };
  const deleteCategory = async (id: string) => {
    try {
      setLoading(true);
      await categoryDependencies.deleteCategory.execute(id);

      toast.success("Xóa danh mục thành công");

      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch (err: any) {
      toast.error(err.message || "Xóa danh mục thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ================================================
  // FORM + UI
  // ================================================
  const mergeCategoryProductCount = (
    categories: Category[],
    products: IProduct[]
  ) => {
    return categories.map((cat) => ({
      ...cat,
      productCount: products.filter((p) => p.category === cat.name).length,
    }));
  };

  const openAddModal = () => {
    setShowModal(true);
    setModalMode("add");
    setCurrentCategory(null);
    setFormData({
      name: "",
      description: "",
      image: "",
      isActive: true,
    });
  };

  const openEditModal = (category: Category) => {
    setShowModal(true);
    setModalMode("edit");
    setCurrentCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      image: category.image || "",
      isActive: category.isActive,
    });
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentCategory(null);
    setFormData({
      name: "",
      description: "",
      image: "",
      isActive: true,
    });
  };

  const updateFormData = (data: Partial<CategoryFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error("Tên danh mục không được để trống");
      throw new Error("Tên danh mục không hợp lệ");
    }

    if (modalMode === "add") await createCategory();
    else await updateCategory();
  };

  // ================================================
  // FILTER PRODUCTS
  // ================================================
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "low" && p.stock > 0 && p.stock < 10) ||
        (stockFilter === "out" && p.stock === 0) ||
        (stockFilter === "good" && p.stock >= 10);

      return matchesSearch && matchesStock;
    });
  }, [products, searchTerm, stockFilter]);

  // ================================================
  // STATS
  // ================================================
  const stats = useMemo(
    () => ({
      totalProducts: products.length,
      lowStock: products.filter((p) => p.stock > 0 && p.stock < 10).length,
      outOfStock: products.filter((p) => p.stock === 0).length,
      totalValue: products.reduce((sum, p) => sum + p.stock * p.price, 0),
    }),
    [products]
  );

  return {
    categories,
    products: filteredProducts,
    allProducts: products,
    loading,
    error,
    stats,

    showModal,
    modalMode,
    currentCategory,
    formData,

    searchTerm,
    setSearchTerm,
    stockFilter,
    setStockFilter,

    fetchCategories,
    fetchProducts,
    createCategory,
    updateCategory,
    showDeleteModal,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
    categoryToDelete,
    openAddModal,
    openEditModal,
    closeModal,
    updateFormData,
    handleSubmit,
  };
}
