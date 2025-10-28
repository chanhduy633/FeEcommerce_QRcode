import { useState, useEffect, useMemo, useRef } from "react";
import type { IProduct } from "../../../types/Product";
import { AdminProductViewModel } from "../../../app/viewmodels/adminProductViewModel";

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

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      await vm.loadProducts();
      setProducts(vm.products);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // ====== FILTER ======
  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

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
    if (editingProduct) await vm.updateProduct(editingProduct.id, formData);
    else await vm.addProduct(formData);
    setIsDialogOpen(false);
    await vm.loadProducts();
    setProducts(vm.products);
  };

  const handleDelete = async (id: string) => {
    await vm.deleteProduct(id);
    await vm.loadProducts();
    setProducts(vm.products);
    setDeleteConfirm(null);
  };

  // ====== EXPORT ======
  return {
    loading,
    products: filteredProducts,
    searchTerm,
    setSearchTerm,
    isDialogOpen,
    setIsDialogOpen,
    editingProduct,
    setEditingProduct,
    deleteConfirm,
    setDeleteConfirm,
    handleAdd,
    handleEdit,
    handleSave,
    handleDelete,
  };
};
