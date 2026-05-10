import { create } from "zustand";

interface Content {
  id: number;

  inputPrompt: string;

  result: string;

  type: string;

  language: string;

  createdAt: string;
}

interface ChatState {
  conversations: Content[];

  selectedChat: Content | null;

  setConversations: (
    data: Content[]
  ) => void;

  setSelectedChat: (
    chat: Content | null
  ) => void;

  addConversation: (
    chat: Content
  ) => void;
}

export const useChatStore =
  create<ChatState>((set) => ({
    conversations: [],

    selectedChat: null,

    setConversations: (data) =>
      set({
        conversations: data,
      }),

    setSelectedChat: (chat) =>
      set({
        selectedChat: chat,
      }),

    addConversation: (chat) =>
      set((state) => ({
        conversations: [
          chat,
          ...state.conversations,
        ],
      })),
  }));