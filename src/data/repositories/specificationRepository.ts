import type { ICreateSpecificationRequest, ISpecification, IUpdateSpecificationRequest } from "../../types/Specification";
import specificationRemote from "../remotes/specificationRemote";

class SpecificationRepository {
  async create(data: ICreateSpecificationRequest): Promise<ISpecification> {
    return await specificationRemote.create(data);
  }

  async getByProductId(productId: string): Promise<ISpecification> {
    return await specificationRemote.getByProductId(productId);
  }

  async update(productId: string, data: IUpdateSpecificationRequest): Promise<ISpecification> {
    return await specificationRemote.update(productId, data);
  }

}

export default new SpecificationRepository();
