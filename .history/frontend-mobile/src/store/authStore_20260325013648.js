//This file manages the entire login/logout/session lifecycle of the app.
import { create } from "zustand"; //Zustand Stores data while app is running
import storageService from "../services/storage.service";
import authApi from "../api/auth.api";

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const data = await authApi.login(email, password);
      await storageService.setToken(data.token);
      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
      });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  },

  logout: async () => {
    await storageService.removeToken();
    set({ user: null, token: null, isAuthenticated: false });
  },

  restoreSession: async () => {
    try {
      const token = await storageService.getToken();
      if (!token) return;
      const data = await authApi.getMe();
      set({ user: data, token, isAuthenticated: true });
    } catch {
      await storageService.removeToken();
    }
  },
}));

export default useAuthStore;
