// utils/imageHelper.ts
import { API_ROUTES } from "../config/api";

export const getImageUrl = (filename: string | undefined | null): string => {
  if (!filename) return "";
  
  return `${API_ROUTES.IMAGE}/${filename}`;
};