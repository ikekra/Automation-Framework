import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useFrameworkStore = create(
  persist(
    (set) => ({
      history: [],

      addHistoryItem(item) {
        set((state) => ({
          history: [item, ...state.history].slice(0, 100)
        }));
      },

      clearHistory() {
        set({ history: [] });
      }
    }),
    {
      name: "autoforge-framework-history"
    }
  )
);
