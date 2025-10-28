// src/app/authDependencies.ts
import { AuthRemote } from "../data/remotes/authRemote";
import { AuthRepository } from "../data/repositories/authRepository";
import { AuthUseCase } from "../domain/usecases/authUseCase";

const authRemote = new AuthRemote();
const authRepository = new AuthRepository(authRemote);
const authUseCase = new AuthUseCase(authRepository);

export const dependencies = {
  authUseCase, 
};
