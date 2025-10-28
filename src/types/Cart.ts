// ========== Item trong giỏ hàng ==========
export interface CartItem {
  price: number;
  productId: string; // ID của sản phẩm (ObjectId dạng string)
  quantity: number;
  addedAt?: string; // Ngày thêm vào giỏ (tự sinh từ MongoDB)

  // Nếu backend populate product, có thể có thêm thông tin:
  product?: {
    _id: string;
    name: string;
    price: number;
    image?: string;
  };
}

// ========== Toàn bộ giỏ hàng ==========
export interface Cart {
  _id?: string;
  userId: string;
  items: CartItem[];
  createdAt?: string;
  updatedAt?: string;
}
