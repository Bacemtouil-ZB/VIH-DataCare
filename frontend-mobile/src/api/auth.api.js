import apiClient from "./client";

const authApi = {
  async login(username, password) {
    const response = await apiClient.post("/mobile/auth/login", { username, password });
    return response.data;
  },

  async getMe() {
    const response = await apiClient.get("/mobile/auth/me");
    return response.data;
  },

  async changePassword(newPassword) {
    const response = await apiClient.put("/mobile/auth/change-password", { newPassword });
    return response.data;
  },
};

export default authApi;