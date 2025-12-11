import { useState, useEffect, useMemo, useRef } from "react";
import type { IProduct } from "../../../../types/Product";
import { AdminProductViewModel } from "../../../viewmodels/adminProductViewModel";
import { toast } from "sonner";

export const useProductManagementViewModel = () => {
  const vmRef = useRef(new AdminProductViewModel());
  const vm = vmRef.current;

  // ====== STATE ======
  const [products, setProducts] = useState<IProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<IProduct | null>(null);
  const [categories, setCategories] = useState([]);
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // ====== LOAD PRODUCTS ======
  const fetchProducts = async () => {
    setLoading(true);
    await vm.loadProducts(); // lấy toàn bộ, giống homepage
    setProducts(vm.products);
    setLoading(false);
  };

  const fetchCategories = async () => {
    const res = await fetch("http://localhost:5317/api/categories");
    const data = await res.json();

    console.log("Categories API:", data);

    // Lấy danh sách categories đúng cấu trúc
    const list = Array.isArray(data.data) ? data.data : [];

    setCategories(list);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Reset về trang 1 khi search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // ====== FILTER ======
  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = currentPage * itemsPerPage;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, currentPage]);

  // ====== HANDLERS ======
  const handleAdd = () => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (product: IProduct) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleSave = async (formData: IProduct) => {
    try {
      if (editingProduct) {
        await vm.updateProduct(editingProduct.id, formData);
        toast.success("Cập nhật sản phẩm thành công");
        console.log("Updated product:", formData);
      } else {
        await vm.addProduct(formData);
        toast.success("Thêm sản phẩm mới thành công");
      }

      setIsDialogOpen(false);
      await vm.loadProducts();
      setProducts(vm.products);
    } catch (err) {
      toast.error("Lưu sản phẩm thất bại");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await vm.deleteProduct(id);
      toast.success("Xóa sản phẩm thành công");

      await vm.loadProducts();
      setProducts(vm.products);
    } catch (err) {
      toast.error("Không thể xóa sản phẩm");
    } finally {
      setDeleteConfirm(null);
    }
  };

  return {
    loading,
    products: paginatedProducts,
    allProducts: products,
    categories,
    // Search
    searchTerm,
    setSearchTerm,

    // Pagination
    currentPage,
    setCurrentPage,
    totalPages,

    // Dialog
    isDialogOpen,
    setIsDialogOpen,

    editingProduct,
    setEditingProduct,

    deleteConfirm,
    setDeleteConfirm,

    // Methods
    handleAdd,
    handleEdit,
    handleSave,
    handleDelete,
  };
};
