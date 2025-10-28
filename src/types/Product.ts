export interface IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  sold: number;
  image_url?: string;
}

export interface IProductFromAPI {
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


