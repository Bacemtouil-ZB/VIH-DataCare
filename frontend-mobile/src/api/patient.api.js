import apiClient from "./client";
//envoyer au backend le token de notification push Expo
const patientApi = {
  async savePushToken(pushToken) {
    const response = await apiClient.post(
      "/mobile/patient/push-token",
      { pushToken }
    );
    return response.data;
  },
};

export default patientApi;