import { create } from "zustand";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ModalData = Record<string, any>;

interface ModalState {
  modals: { [key: string]: { isOpen: boolean; data?: ModalData } };
  openModal: (key: string, data?: ModalData) => void;
  closeModal: (key: string) => void;
  getModalData: (key: string) => ModalData | undefined;
}

export const useModalStore = create<ModalState>((set, get) => ({
  modals: {},
  
  openModal: (key, data) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [key]: { isOpen: true, data },
      },
    })),
  
  closeModal: (key) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [key]: { isOpen: false, data: undefined },
      },
    })),
  
  getModalData: (key) => get().modals[key]?.data,
}));

export const useModal = (key: string) => {
  const { modals, openModal, closeModal, getModalData } = useModalStore();
  
  return {
    isOpen: modals[key]?.isOpen || false,
    data: getModalData(key),
    open: (data?: ModalData) => openModal(key, data),
    close: () => closeModal(key),
  };
};

