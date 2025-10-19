import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type settingsState = {
  language: string;
  setLanguage: (language: string) => void;
  sidebarExpand: boolean;
  setSidebarExpand: (sidebarExpand: boolean) => void;
};

const useSettings = create<settingsState>()(
  persist(
    (set) => ({
      language: "en",
      setLanguage: (language: string) => set({ language }),
      sidebarExpand: true,
      setSidebarExpand: (sidebarExpand: boolean) => set({ sidebarExpand }),
    }),
    {
      name: "settings",
      storage:
        typeof globalThis !== "undefined"
          ? createJSONStorage(() => globalThis.localStorage)
          : undefined,
    }
  )
);

export default useSettings;
