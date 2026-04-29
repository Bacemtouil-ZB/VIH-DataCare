import apiClient from "./client";

const rendezvousApi = {
  async getRendezvous() {
    const response = await apiClient.get("/mobile/rendezvous");
    return response.data;
  },

  async getRendezvousDetail(id) {
    const response = await apiClient.get(`/mobile/rendezvous/${id}`);
    return response.data;
  },
};

export default rendezvousApi;