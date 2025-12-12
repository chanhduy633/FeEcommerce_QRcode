import specificationRepository from "../../../data/repositories/specificationRepository";
import type { ISpecification } from "../../../types/Specification";

class GetSpecificationUseCase {
  async execute(productId: string): Promise<ISpecification> {
    if (!productId) {
      throw new Error("Product ID là bắt buộc");
    }

    return await specificationRepository.getByProductId(productId);
  }
}

export default new GetSpecificationUseCase();
