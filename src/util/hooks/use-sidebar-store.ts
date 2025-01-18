import { create } from "zustand";
import { persist } from "zustand/middleware";

type SideBarStore = {
  isOpen: boolean;
  toggle: () => void;
};

export const useSideBarStore = create<SideBarStore>()(
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
