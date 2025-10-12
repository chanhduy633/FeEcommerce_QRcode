export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  sold: number;
  image_url?: string;
}

export interface ProductFromAPI {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
  sold: number;
  image_url?: string;
  createdAt?: string;
  updatedAt?: string;
}


