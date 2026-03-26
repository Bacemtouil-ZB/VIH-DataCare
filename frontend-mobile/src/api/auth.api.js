import apiClient from "./client";

const authApi = {
  async login(email, password) {
    const response = await apiClient.post("/login", { email, password });
    return response.data;
  },

  async getMe() {
    const response = await apiClient.get("/me");
    return response.data;
  },
};

export default authApi;
