import apiClient from "./client";

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