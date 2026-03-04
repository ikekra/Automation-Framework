import { apiClient } from "./client";

export const authService = {
  async register(payload) {
    const response = await apiClient.post("/api/v1/auth/register", payload);
    return response.data.data;
  },

  async login(payload) {
    const response = await apiClient.post("/api/v1/auth/login", payload);
    return response.data.data;
  },

  async requestOtp(payload) {
    const response = await apiClient.post("/api/v1/auth/request-otp", payload);
    return response.data.data;
  },

  async loginOtp(payload) {
    const response = await apiClient.post("/api/v1/auth/login-otp", payload);
    return response.data.data;
  },

  async verifyEmail(payload) {
    const response = await apiClient.post("/api/v1/auth/verify-email", payload);
    return response.data.data;
  },

  async resendVerification(payload) {
    const response = await apiClient.post("/api/v1/auth/resend-verification", payload);
    return response.data;
  },

  async refresh() {
    const response = await apiClient.post("/api/v1/auth/refresh", {});
    return response.data.data;
  },

  async logout() {
    await apiClient.post("/api/v1/auth/logout", {});
  },

  async me() {
    const response = await apiClient.get("/api/v1/auth/me");
    return response.data.data;
  },

  async updateProfile(payload) {
    const response = await apiClient.patch("/api/v1/auth/profile", payload);
    return response.data.data;
  },

  async changePassword(payload) {
    const response = await apiClient.patch("/api/v1/auth/password", payload);
    return response.data;
  },

  async setupTwoFactor() {
    const response = await apiClient.post("/api/v1/auth/2fa/setup", {});
    return response.data.data;
  },

  async verifyTwoFactor(payload) {
    const response = await apiClient.post("/api/v1/auth/2fa/verify", payload);
    return response.data.data;
  },

  async disableTwoFactor(payload) {
    const response = await apiClient.post("/api/v1/auth/2fa/disable", payload);
    return response.data.data;
  }
};
