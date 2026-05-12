import { apiClient } from "./client";

const getFileNameFromHeaders = (headers, fallback) => {
  const disposition = headers?.["content-disposition"] || "";
  const match = disposition.match(/filename="?([^"]+)"?/i);
  return match?.[1] || fallback;
};

const triggerBrowserDownload = (blob, fileName) => {
  const objectUrl = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(objectUrl);
};

export const frameworkService = {
  async list(params = {}) {
    const response = await apiClient.get("/api/framework", {
      params: {
        limit: params.limit ?? 10,
        page: params.page ?? 1
      }
    });

    return response.data.data;
  },

  async generate(payload) {
    const response = await apiClient.post("/api/framework/generate", payload);
    return response.data.data;
  },

  async remove(id) {
    await apiClient.delete(`/api/framework/${id}`);
  },

  async requestDownloadAccess(id) {
    const response = await apiClient.post(`/api/framework/${id}/download-access`);
    return response.data.data;
  },

  async download(item) {
    const access = item?.download?.token && item?.download?.path
      ? item.download
      : await frameworkService.requestDownloadAccess(item.id);

    const token = access?.token;
    const path = access?.path;

    const response = await apiClient.get(`${path}?token=${encodeURIComponent(token)}`, {
      responseType: "blob"
    });

    const fileName = getFileNameFromHeaders(response.headers, `framework-${item.id}.zip`);
    triggerBrowserDownload(response.data, fileName);
  }
};
