import { apiClient } from "./client";

export const testService = {
  async analyze(url) {
    const response = await apiClient.post("/api/test/analyze", { url });
    return response.data.data;
  },

  async listReports(params = {}) {
    const response = await apiClient.get("/api/test/reports", {
      params: {
        limit: params.limit ?? 20,
        page: params.page ?? 1,
        search: params.search ?? "",
        ...(params.severity ? { severity: params.severity } : {})
      }
    });
    return response.data.data;
  }
};
