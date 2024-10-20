import { User } from '@/types/User';
import { Dispatch, SetStateAction } from 'react';
import { create } from 'zustand'
import { attachedFile } from '@/components/chat/send-message/send-message';

export type ModalType =
    | "createChannel"
    | "sendMessage"
    | "createGroup"

interface ModalData {
    // server?: Server;
    // channel?: Channel;
    profile?: User
    apiUrl?: string;
    groupMembers?: User[];
    setIsCreatingGroup?: Dispatch<SetStateAction<boolean>>,
    file?: File,
    id?: string,
    defaultType?: string;
    
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