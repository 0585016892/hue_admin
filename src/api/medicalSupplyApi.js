import axiosClient from "./axiosClient";

const medicalSupplyApi = {
  getAll: (params) => axiosClient.get("/medical-supplies", { params }),
  create: (data) => axiosClient.post("/medical-supplies", data),
  update: (id, data) => axiosClient.put(`/medical-supplies/${id}`, data),
  remove: (id) => axiosClient.delete(`/medical-supplies/${id}`),
};

export default medicalSupplyApi;