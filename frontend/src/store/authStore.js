import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "../services/api/authService";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: "",
      isAuthenticated: false,

      applyAuth(data) {
        const verified = data?.user?.emailVerified !== false;
        set({
          user: data?.user || null,
          accessToken: verified ? data?.accessToken || "" : "",
          isAuthenticated: verified
        });
      },

      async register(payload) {
        const data = await authService.register(payload);
        get().applyAuth(data);
      },

      async login(payload) {
        const data = await authService.login(payload);
        get().applyAuth(data);
      },

      async requestOtp(payload) {
        return authService.requestOtp(payload);
      },

      async loginOtp(payload) {
        const data = await authService.loginOtp(payload);
        get().applyAuth(data);
      },

      async refreshAccessToken() {
        const data = await authService.refresh();
        get().applyAuth(data);
      },

      async verifyEmail(payload) {
        const data = await authService.verifyEmail(payload);
        set({
          user: data.user
        });
      },

      async resendVerification(payload) {
        return authService.resendVerification(payload);
      },

      async logout() {
        try {
          await authService.logout();
        } finally {
          get().clearAuth();
        }
      },

      async updateProfile(payload) {
        const data = await authService.updateProfile(payload);
        set({
          user: data.user
        });
      },

      async changePassword(payload) {
        await authService.changePassword(payload);
        get().clearAuth();
      },

      async setupTwoFactor() {
        return authService.setupTwoFactor();
      },

      async verifyTwoFactor(payload) {
        const data = await authService.verifyTwoFactor(payload);
        set({
          user: data.user
        });
      },

      async disableTwoFactor(payload) {
        const data = await authService.disableTwoFactor(payload);
        set({
          user: data.user
        });
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
