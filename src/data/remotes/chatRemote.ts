import { API_ROUTES } from "../../config/api";

export interface AskChatResponse {
  aiResponse: string;
}

export async function askAI(message: string): Promise<AskChatResponse> {
  const res = await fetch(`${API_ROUTES.CHAT}/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || "Lỗi khi gọi AI");
  }

  return data;
}
