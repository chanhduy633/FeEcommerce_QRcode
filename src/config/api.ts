const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5317";
const VERSION = "v1";
export const API_ROUTES = {
  UPLOAD: `${API_BASE_URL}/api/upload`,
  PRODUCTS: `${API_BASE_URL}/api/${VERSION}/products`,
  LOGIN : `${API_BASE_URL}/api/auth/admin/login`,
  CART: `${API_BASE_URL}/api/cart`,
  // Thêm các endpoint khác ở đây
};

export default API_BASE_URL;
