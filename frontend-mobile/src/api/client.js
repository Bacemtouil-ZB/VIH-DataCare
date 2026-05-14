import axios from "axios";
import config from "../constants/config";
import storageService from "../services/storage.service";

const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,  // la requête est annulée si le backend ne répond pas en 10 secondes 
});

apiClient.interceptors.request.use(
  async (requestConfig) => {
    const token = await storageService.getToken();
    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }
    return requestConfig;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      storageService.removeToken();
    }
    return Promise.reject(error);
  },
);

export default apiClient;
