import { useState, useMemo } from "react";
import { toast } from "sonner"; // ⬅️ thêm toast
import type { IProduct } from "../../types/Product";
import type {
  ICreateSpecificationRequest,
  IUpdateSpecificationRequest,
} from "../../types/Specification";
import createSpecificationUsecase from "../../domain/usecases/specification/createSpecificationUsecase";
import getSpecificationUsecase from "../../domain/usecases/specification/getSpecificationUsecase";
import updateSpecificationUsecase from "../../domain/usecases/specification/updateSpecificationUsecase";
import { dependencies } from "../dependencies";

interface SpecificationFormData {
  brand: string;
  model: string;
  releaseYear: number;
  warranty: string;
  origin: string;
  color: string;
  material: string;
}

export const useSpecificationViewModel = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [selectedProductHasSpec, setSelectedProductHasSpec] = useState(false);

  const [formData, setFormData] = useState<SpecificationFormData>({
    brand: "",
    model: "",
    releaseYear: new Date().getFullYear(),
    warranty: "",
    origin: "",
    color: "",
    material: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ================= Load products =================
  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dependencies.getAllProductsUseCase.execute();
      setProducts(data);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ================= Select product =================
  const selectProduct = async (product: IProduct) => {
   

    setSelectedProduct(product);
    setLoading(true);
    setError(null);

    try {
      const spec: any = await getSpecificationUsecase.execute(product.id);

      if (spec) {
        setFormData({
          brand: spec.brand || "",
          model: spec.model || "",
          releaseYear: spec.releaseYear || new Date().getFullYear(),
          warranty: spec.warranty || "",
          origin: spec.origin || "",
          color: spec.color || "",
          material: spec.material || "",
        });
        setSelectedProductHasSpec(true);
      } else {
        setFormData({
          brand: "",
          model: product.name,
          releaseYear: new Date().getFullYear(),
          warranty: "",
          origin: "",
          color: "",
          material: "",
        });
        setSelectedProductHasSpec(false);
      }
    } catch {
      setFormData({
        brand: "",
        model: product.name,
        releaseYear: new Date().getFullYear(),
        warranty: "",
        origin: "",
        color: "",
        material: "",
      });
      setSelectedProductHasSpec(false);
    } finally {
      setLoading(false);
      setHasChanges(false);
    }
  };

  // ================= Input handler =================
  const handleInputChange = (field: keyof SpecificationFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  // ================= Save (Create / Update) =================
  const save = async () => {
    if (!selectedProduct) return;

    setLoading(true);
    setIsSaving(true);
    setError(null);

    const payload: ICreateSpecificationRequest | IUpdateSpecificationRequest = {
      brand: formData.brand,
      model: formData.model,
      releaseYear: formData.releaseYear,
      warranty: formData.warranty,
      origin: formData.origin,
      color: formData.color,
      material: formData.material,
    };

    const createPayload = {
      product: selectedProduct.id,
      ...payload,
    };

    try {
      if (selectedProductHasSpec) {
        await updateSpecificationUsecase.execute(selectedProduct.id, payload);
      } else {
        await createSpecificationUsecase.execute(createPayload);
        setSelectedProductHasSpec(true);
      }

      setHasChanges(false);
      toast.success("Lưu thành công!");

      await selectProduct(selectedProduct);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      toast.error("Lưu thất bại: " + message);
    } finally {
      setLoading(false);
      setIsSaving(false);
    }
  };

  const filteredProducts = useMemo(
    () => products.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [products, searchTerm]
  );

  return {
    products,
    filteredProducts,
    selectedProduct,
    formData,
    searchTerm,
    setSearchTerm,
    hasChanges,
    loading,
    isSaving,
    error,

    loadProducts,
    selectProduct,
    handleInputChange,
    save,
  };
};
