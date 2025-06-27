import { create } from "zustand";

interface ConversationHistory {
    conversations: { chatId: string; name: string }[];
    addConversation: (chatId: string, name: string) => void;
    removeConversation: (chatId: string) => void;
    setConversations: (conversations: { chatId: string; name: string }[]) => void;
}
export const useConversationHistoryStore = create<ConversationHistory>((set) => ({
    conversations: [],
    addConversation: (chatId, name) =>
        set((state) => ({
            conversations: [{ chatId, name }, ...state.conversations],
        })),
    removeConversation: (chatId) =>
        set((state) => ({
            conversations: state.conversations.filter((conv) => conv.chatId !== chatId),
        })),
    setConversations: (conversations) => set({ conversations }),
}));
