
import type { IAuthUserRepository } from "../../../data/repositories/authUserRepository";

export class AuthUserUseCase {
  private authRepo: IAuthUserRepository;

  constructor(authRepo: IAuthUserRepository) {
    this.authRepo = authRepo;
  }

  async login(email: string, password: string) {
    return await this.authRepo.login(email, password);
  }

  async register(userData: { email: string; password: string; full_name: string; phone: string }) {
    return await this.authRepo.register(userData);
  }

  getGoogleOAuthUrl() {
    return this.authRepo.getGoogleOAuthUrl();
  }
}
