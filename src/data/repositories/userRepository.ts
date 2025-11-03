// src/repositories/UserRepository.ts

import { API_ROUTES } from "../../config/api";

export interface IUserRepository {
  getUserById(userId: string): Promise<any>;
}

export class RemoteUserRepository implements IUserRepository {
  async getUserById(userId: string) {
    const res = await fetch(API_ROUTES.USERS(userId));
    const data = await res.json();
    return data.data;
  }
}
