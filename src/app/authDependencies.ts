// src/app/dependencies.ts
import { AuthRemote } from "../data/remotes/authRemote";

const authRemote = new AuthRemote();

export const dependencies = {
  authRemote,
};
