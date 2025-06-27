import { create } from 'zustand';

interface ChatStore {
    pendingMessage: string;
    setPendingMessage: (msg: string) => void;
    clearPendingMessage: () => void;
}

export const useMsgStore = create<ChatStore>((set) => ({
    pendingMessage: '',
    setPendingMessage: (msg: string) => set({ pendingMessage: msg }),
    clearPendingMessage: () => set({ pendingMessage: '' }),
}));