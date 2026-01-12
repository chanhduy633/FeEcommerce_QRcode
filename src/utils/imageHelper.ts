const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";

export const getImageUrl = (filename: string | undefined | null): string => {
  if (!filename) return "";
  
  return `${SUPABASE_URL}/storage/v1/object/public/products/${filename}`;
};