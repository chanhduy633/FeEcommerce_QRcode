import { useState, useEffect, useMemo, useRef } from "react";
import type { IProduct } from "../../../../types/Product";
import { AdminProductViewModel } from "../../../viewmodels/adminProductViewModel";

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

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // ====== LOAD PRODUCTS ======
  const fetchProducts = async () => {
    setLoading(true);
    await vm.loadProducts();   // lấy toàn bộ, giống homepage
    setProducts(vm.products);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
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
    if (editingProduct) {
      await vm.updateProduct(editingProduct.id, formData);
    } else {
      await vm.addProduct(formData);
    }

    setIsDialogOpen(false);
    await fetchProducts();
  };

  const handleDelete = async (id: string) => {
    await vm.deleteProduct(id);
    await fetchProducts();
    setDeleteConfirm(null);
  };

  return {
    loading,
    products: paginatedProducts,
    allProducts: products,

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
