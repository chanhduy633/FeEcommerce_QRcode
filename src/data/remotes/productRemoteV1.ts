import axios from "axios";
import type { IProduct } from "../../types/Product";
import { API_ROUTES } from "../../config/api";


export const productRemote = {
  async getAll(): Promise<IProduct[]> {
    const res = await axios.get(API_ROUTES.PRODUCTS);
    return res.data.data;
  },

  async getById(id: string): Promise<IProduct> {
    const res = await axios.get(`${API_ROUTES.PRODUCTS}/${id}`);
    return res.data.data;
  },
};
