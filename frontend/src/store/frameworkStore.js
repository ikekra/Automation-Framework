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

      deleteHistoryItem(id) {
        set((state) => ({
          history: state.history.filter((item) => item.id !== id)
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
