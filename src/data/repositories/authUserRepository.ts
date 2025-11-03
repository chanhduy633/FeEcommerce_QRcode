// src/repositories/AuthRepository.ts

import type { IAuthUserRemote } from "../remotes/authUserRemote";

export interface IAuthUserRepository {
  login(email: string, password: string): Promise<any>;
  register(userData: { email: string; password: string; full_name: string; phone: string }): Promise<any>;
  getGoogleOAuthUrl(): string;
}

export class AuthUserRepository implements IAuthUserRepository {
  private remote: IAuthUserRemote;

  constructor(remote: IAuthUserRemote) {
    this.remote = remote;
  }

  async login(email: string, password: string) {
    return await this.remote.login(email, password);
  }

  async register(userData: { email: string; password: string; full_name: string; phone: string }) {
    return await this.remote.register(userData);
  }

  getGoogleOAuthUrl() {
    return this.remote.getGoogleOAuthUrl();
  }
}
