const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5317";
const VERSION = "v1";
export const API_ROUTES = {
  UPLOAD: `${API_BASE_URL}/api/upload`,
  PRODUCTS: `${API_BASE_URL}/api/${VERSION}/products`,
  LOGIN_ADMIN: `${API_BASE_URL}/api/auth/admin/login`,
  LOGIN_USER: `${API_BASE_URL}/api/auth/user/login`,
  USERS: (userId: string) => `${API_BASE_URL}/api/users/${userId}`,
  CART: `${API_BASE_URL}/api/cart`,
  // Thêm các endpoint khác ở đây
  REGISTER: `${API_BASE_URL}/api/auth/user/register`,
  GOOGLE_OAUTH: `${API_BASE_URL}/api/auth/oauth/google`,
};

export default API_BASE_URL;
