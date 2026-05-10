import api from "@/lib/api";

export interface GeneratePayload {
  prompt: string;

  type:
    | "CAPTION"
    | "DESCRIPTION"
    | "TAGLINE";

  language: "ID" | "EN";
}

export const generateContent =
  async (data: GeneratePayload) => {
    return await api
      .post("content/generate", {
        json: data,
      })
      .json();
  };

export const getHistory =
  async () => {
    return await api
      .get("content/history")
      .json();
  };

export const continueConversation =
  async (
    id: number,
    newPrompt: string
  ) => {
    return await api
      .post(
        `content/${id}/continue`,
        {
          json: { newPrompt },
        }
      )
      .json();
  };

export const deleteConversation =
  async (id: number) => {
    return await api
      .delete(`content/${id}`)
      .json();
  };