import type { IUploadRepository } from "../../../data/repositories/uploadRepository";

export class UploadImageUseCase {
  private uploadRepository: IUploadRepository;

  constructor(uploadRepository: IUploadRepository) {
    this.uploadRepository = uploadRepository;
  }

  async execute(file: File): Promise<string> {
    return await this.uploadRepository.upload(file);
  }
}
