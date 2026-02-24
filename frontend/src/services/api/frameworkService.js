import { apiClient } from "./client";

export const frameworkService = {
  async generate(payload) {
    const response = await apiClient.post("/api/framework/generate", payload);
    return response.data.data;
  }
};
