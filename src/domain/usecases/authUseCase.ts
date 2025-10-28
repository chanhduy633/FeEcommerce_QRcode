// src/domain/authUseCase.ts

import type { LoginResponse } from "../../data/remotes/authRemote";
import type { IAuthRepository } from "../../data/repositories/authRepository";

export class AuthUseCase {
  private repository: IAuthRepository;

  constructor(repository: IAuthRepository) {
    this.repository = repository;
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    // Tại đây có thể validate input trước khi gọi repository
    if (!email || !password) {
      throw new Error("Email và mật khẩu là bắt buộc");
    }

    const response = await this.repository.login(email, password);

    if (!response.data.success) {
      throw new Error(response.message || "Đăng nhập thất bại");
    }

    return response;
  }
}
