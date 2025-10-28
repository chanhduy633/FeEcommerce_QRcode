// src/domain/authRepository.ts

import type { AuthRemote, LoginResponse } from "../remotes/authRemote";

export interface IAuthRepository {
  login(email: string, password: string): Promise<LoginResponse>;
}

export class AuthRepository implements IAuthRepository {
  private remote: AuthRemote;

  constructor(remote: AuthRemote) {
    this.remote = remote;
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    return await this.remote.login(email, password);
  }
}
