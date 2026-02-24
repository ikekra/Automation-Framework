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
  }
};
