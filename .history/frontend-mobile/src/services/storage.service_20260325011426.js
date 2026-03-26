import * as SecureStore from "expo-secure-store";

const storageService = {
  async setToken(token) {
    await SecureStore.setItemAsync("authToken", token);
  },

  async getToken() {
    return await SecureStore.getItemAsync("authToken");
  },

  async removeToken() {
    await SecureStore.deleteItemAsync("authToken");
  },
};

export default storageService;
