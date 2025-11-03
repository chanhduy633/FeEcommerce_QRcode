import { API_ROUTES } from "../../config/api";
import type { IUploadRepository } from "../repositories/uploadRepository";

export class UploadRemote implements IUploadRepository {
  async upload(file: File, folder: string = "products"): Promise<string> {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("folder", folder);

    const res = await fetch(API_ROUTES.UPLOAD, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Upload failed");

    const data = await res.json();

    // server trả về URL: http://localhost:5317/uploads/products/...
    console.log("Uploaded image URL:", data.url);
    return data.url;
  }
}
