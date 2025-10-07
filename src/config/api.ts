const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5317";

export const API_ROUTES = {
  UPLOAD: `${API_BASE_URL}/api/upload`,
  PRODUCTS: `${API_BASE_URL}/api/products`,
  // Thêm các endpoint khác ở đây
};

export default API_BASE_URL;
