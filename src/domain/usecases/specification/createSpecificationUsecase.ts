// createSpecificationUsecase.ts
import specificationRemote from "../../../data/remotes/specificationRemote";
import type { ICreateSpecificationRequest, ISpecification } from "../../../types/Specification";

class CreateSpecificationUsecase {
  async execute(data: ICreateSpecificationRequest): Promise<ISpecification> {
    console.log("🚀 CreateSpecificationUsecase - data:", data);
    return await specificationRemote.create(data);
  }
}

export default new CreateSpecificationUsecase();