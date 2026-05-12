import { create } from "zustand";
import { frameworkService } from "../services/api/frameworkService";

const mergeHistoryItem = (items, nextItem) => {
  const filtered = items.filter((item) => item.id !== nextItem.id);
  return [nextItem, ...filtered];
};

export const useFrameworkStore = create((set, get) => ({
  history: [],
  meta: { page: 1, limit: 10, total: 0, totalPages: 1 },
  loading: false,
  bootstrapped: false,

  async fetchHistory(params = {}) {
    const nextPage = params.page ?? get().meta.page ?? 1;
    const nextLimit = params.limit ?? get().meta.limit ?? 10;

    set({ loading: true });

    try {
      const data = await frameworkService.list({ page: nextPage, limit: nextLimit });
      set({
        history: data.items || [],
        meta: data.meta || { page: nextPage, limit: nextLimit, total: 0, totalPages: 1 },
        loading: false,
        bootstrapped: true
      });
    } catch (error) {
      set({ loading: false, bootstrapped: true });
      throw error;
    }
  },

  upsertHistoryItem(item) {
    set((state) => ({
      history: mergeHistoryItem(state.history, item),
      meta: {
        ...state.meta,
        total: Math.max(state.meta.total, state.history.some((entry) => entry.id === item.id) ? state.meta.total : state.meta.total + 1),
        totalPages: Math.max(
          1,
          Math.ceil(
            Math.max(state.meta.total, state.history.some((entry) => entry.id === item.id) ? state.meta.total : state.meta.total + 1) /
            Math.max(1, state.meta.limit)
          )
        )
      }
    }));
  },

  async generateFramework(payload) {
    const data = await frameworkService.generate(payload);

    if (data?.summary) {
      get().upsertHistoryItem(data.summary);
    }

    return data;
  },

  async deleteHistoryItem(id) {
    await frameworkService.remove(id);
    set((state) => ({
      history: state.history.filter((item) => item.id !== id),
      meta: {
        ...state.meta,
        total: Math.max(0, state.meta.total - 1),
        totalPages: Math.max(1, Math.ceil(Math.max(0, state.meta.total - 1) / Math.max(1, state.meta.limit)))
      }
    }));
  },

  async downloadHistoryItem(item) {
    await frameworkService.download(item);
  },

  clearHistory() {
    set({
      history: [],
      meta: { page: 1, limit: 10, total: 0, totalPages: 1 },
      loading: false,
      bootstrapped: false
    });
  }
}));
