import React, { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import ProductTable from "../components/ProductTable";
import ProductForm from "../components/ProductForm";
import DeleteDialog from "../components/DeleteDialog";
import type  { Product, ProductFromAPI } from "../types/Product";

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5317/api/products");
        if (!res.ok) throw new Error("Không thể tải sản phẩm");

        const data: ProductFromAPI[] = await res.json();

        const formatted: Product[] = data.map((p) => ({
          id: p._id,
          name: p.name,
          description: p.description || "",
          price: p.price,
          category: p.category || "Khác",
          stock: p.stock,
          sold: p.sold,
          image_url: p.image_url,
        }));

        setProducts(formatted);
      } catch (error) {
        console.error(error);
        toast.error("Lỗi khi tải danh sách sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 🟢 Add new product
  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  // 🟢 Edit product
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

 const handleSaveProduct = async (formData: Product) => {
  const token = localStorage.getItem("token"); // Lấy token đã lưu

  try {
    if (editingProduct) {
      const res = await fetch(
        `http://localhost:5317/api/products/${editingProduct.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // 🟢 Gửi token ở đây
          },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) throw new Error("Cập nhật sản phẩm thất bại");

      const updatedProduct = await res.json();
      setProducts((prev) =>
        prev.map((p) =>
          p.id === updatedProduct._id
            ? { ...updatedProduct, id: updatedProduct._id }
            : p
        )
      );
      toast.success("Cập nhật sản phẩm thành công!");
    } else {
      const res = await fetch("http://localhost:5317/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 🟢 Gửi token
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Thêm sản phẩm thất bại");

      const newProduct = await res.json();
      setProducts((prev) => [...prev, { ...newProduct, id: newProduct._id }]);
      toast.success("Thêm sản phẩm thành công!");
    }
  } catch (error) {
    console.error(error);
    toast.error("Không thể lưu sản phẩm!");
  } finally {
    setIsDialogOpen(false);
  }
};


  const handleDeleteProduct = async (id: string) => {
  const token = localStorage.getItem("token"); // 🟢 Lấy token

  try {
    const res = await fetch(`http://localhost:5317/api/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`, // 🟢 Gửi token
      },
    });

    if (!res.ok) throw new Error("Xóa sản phẩm thất bại");

    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast.success("Xóa sản phẩm thành công!", { duration: 2000 });
  } catch (error) {
    console.error(error);
    toast.error("Không thể xóa sản phẩm!", { duration: 2000 });
  } finally {
    setDeleteConfirm(null);
  }
};


  // 🟢 Filter by search
  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center py-10">Đang tải sản phẩm...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý Sản phẩm</h2>
        <button
          onClick={handleAddProduct}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={20} />
          <span>Thêm sản phẩm</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <ProductTable
        products={filtered}
        onEdit={handleEditProduct}
        onDelete={setDeleteConfirm}
      />

      {/* Form Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
            </h3>
            <ProductForm
              product={editingProduct}
              onSave={handleSaveProduct}
              onCancel={() => setIsDialogOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      <DeleteDialog
        product={deleteConfirm}
        onConfirm={handleDeleteProduct}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
};

export default ProductManagement;
