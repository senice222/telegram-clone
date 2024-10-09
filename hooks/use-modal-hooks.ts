import { User } from '@/types/User';
import { create } from 'zustand'

export type ModalType =
    | "createChannel"
    | "sendMessage"

interface ModalData {
    // server?: Server;
    // channel?: Channel;
    profile?: User
    apiUrl?: string;
    // query?: Record<string, any>
}

interface ModalStore {
    type: ModalType | null;
    data: ModalData;
    isOpen: boolean;
    onOpen: (type: ModalType, data?: ModalData) => void;
    onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
    type: null,
    data: {},
    isOpen: false,
    onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
    onClose: () => set({ isOpen: false })
}))