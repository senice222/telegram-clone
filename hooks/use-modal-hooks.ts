import { User } from '@/types/User';
import { Dispatch, SetStateAction } from 'react';
import { create } from 'zustand'

export type ModalType =
    | "createChannel"
    | "sendMessage"
    | "createGroup"
    | "openImage"

export interface ModalData {
    // server?: Server;
    // channel?: Channel;
    profile?: User
    apiUrl?: string;
    groupMembers?: User[];
    setIsCreatingGroup?: Dispatch<SetStateAction<boolean>>,
    setIsAddingToGroup?: Dispatch<SetStateAction<boolean>>,
    file?: File,
    id?: string,
    defaultType?: string;
    src? : any,
    srcType?: string,
    categorizedMessages?: {
        media: MessageType[];
        files: MessageType[];
        links: MessageType[];
      }
        
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