import type { IUserRepository } from "../../../data/repositories/UserRepository";

export class LoginWithOAuthUseCase {
  private userRepo: IUserRepository; // khai báo field riêng

  constructor(userRepo: IUserRepository) {
    this.userRepo = userRepo; // gán trong constructor
  }

  async execute(token: string, userId: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);

    const user = await this.userRepo.getUserById(userId);
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      return true;
    }
    return false;
  }
}
