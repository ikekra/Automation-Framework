import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "../services/api/authService";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: "",
      isAuthenticated: false,

      async register(payload) {
        const data = await authService.register(payload);
        set({
          user: data.user,
          accessToken: data.accessToken,
          isAuthenticated: true
        });
      },

      async login(payload) {
        const data = await authService.login(payload);
        set({
          user: data.user,
          accessToken: data.accessToken,
          isAuthenticated: true
        });
      },

      async refreshAccessToken() {
        const data = await authService.refresh();
        set({
          user: data.user,
          accessToken: data.accessToken,
          isAuthenticated: true
        });
      },

      async logout() {
        try {
          await authService.logout();
        } finally {
          get().clearAuth();
        }
      },

      clearAuth() {
        set({
          user: null,
          accessToken: "",
          isAuthenticated: false
        });
      }
    }),
    {
      name: "autoforge-auth"
    }
  )
);
