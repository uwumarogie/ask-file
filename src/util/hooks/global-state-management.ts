import { create } from "zustand";
import { persist } from "zustand/middleware";

type OpenCloseCompoent = {
  isOpen: boolean;
  toggle: () => void;
};

export const useSideBarStore = create<OpenCloseCompoent>()(
  persist(
    (set) => ({
      isOpen: false,
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: "isSideBarOpen",
    },
  ),
);
