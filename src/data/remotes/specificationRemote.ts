import axios from "axios";
import type { ICreateSpecificationRequest, ISpecification, IUpdateSpecificationRequest } from "../../types/Specification";
import { API_ROUTES } from "../../config/api";


class SpecificationRemote {
  async create(data: ICreateSpecificationRequest): Promise<ISpecification> {
    const response = await axios.post(`${API_ROUTES.SPECIFICATION}`, data);
    return response.data.data;
  }

  async getByProductId(productId: string): Promise<ISpecification> {
    const response = await axios.get(`${API_ROUTES.SPECIFICATION}/${productId}`);
    return response.data.data;
  }

  async update(productId: string, data: IUpdateSpecificationRequest): Promise<ISpecification> {
    const response = await axios.put(`${API_ROUTES.SPECIFICATION}/${productId}`, data);
    return response.data.data;
  }

}

export default new SpecificationRemote();