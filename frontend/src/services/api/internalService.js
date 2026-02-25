import { apiClient } from "./client";

export const internalService = {
  async runSelfTest() {
    const response = await apiClient.post("/api/internal/self-test");
    return response.data.data;
  }
};
