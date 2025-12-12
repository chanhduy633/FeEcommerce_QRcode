// updateSpecificationUsecase.ts
import specificationRemote from "../../../data/remotes/specificationRemote";
import type { IUpdateSpecificationRequest, ISpecification } from "../../../types/Specification";

class UpdateSpecificationUsecase {
  async execute(productId: string, data: IUpdateSpecificationRequest): Promise<ISpecification> {
    console.log("🔄 UpdateSpecificationUsecase - productId:", productId, "data:", data);
    return await specificationRemote.update(productId, data);
  }
}

export default new UpdateSpecificationUsecase();