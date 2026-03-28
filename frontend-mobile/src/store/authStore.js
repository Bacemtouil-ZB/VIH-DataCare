import { create } from "zustand"; //Zustand = mémoire globale de  application
import storageService from "../services/storage.service";
import authApi from "../api/auth.api";

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
  mustChangePassword: false,

  login: async (username, password) => {
    set({ isLoading: true });
    try {
      const data = await authApi.login(username, password);
      await storageService.setToken(data.token);
      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        mustChangePassword: data.mustChangePassword,
        isLoading: false,
      });
      return { success: true, mustChangePassword: data.mustChangePassword };
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        message: error.response?.data?.message || "Connexion échouée",
      };
    }
  },

  logout: async () => {
    await storageService.removeToken();
    set({ user: null, token: null, isAuthenticated: false, mustChangePassword: false });
  },

  restoreSession: async () => {
    try {
      const token = await storageService.getToken();
      if (!token) return;
      const data = await authApi.getMe();
      set({
        user: data.user,
        token,
        isAuthenticated: true,
        mustChangePassword: data.user?.must_change_password || false,
      });
    } catch {
      await storageService.removeToken();
    }
  },

  clearMustChangePassword: () => {
    set({ mustChangePassword: false });
  },
}));

export default useAuthStore;