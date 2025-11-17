export interface OrderItem {
  name: string;
  image?: string;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  name?: string;
  email?: string;
  phone?: string;
  street?: string;
  city?: string;
  district?: string;
  ward?: string;
}

export interface PaymentInfo {
  method: string;
  status: string;
  transactionId?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  userId?: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  paymentMethod?: string;
  payment?: PaymentInfo;
  shippingAddress?: ShippingAddress;
  items?: OrderItem[];
  notes?: string;
}

export interface CreateOrderInput {
  userId?: string | null;
  guestId?: string | null;
  shippingAddress: ShippingAddress;
  notes?: string;
  paymentMethod: string;
  cartItems: {
    productId: string;
    quantity: number;
  }[];
}

export interface CreateOrderResponse {
  data: Order;
}