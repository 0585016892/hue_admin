import axiosClient from "./axiosClient";

const patientApi = {
  getAll: (params) => axiosClient.get("/patients", { params }),

  create: (data) => axiosClient.post("/patients", data),

  update: (id, data) =>
    axiosClient.put(`/patients/${id}`, data),

  remove: (id) =>
    axiosClient.delete(`/patients/${id}`),
};

export default patientApi;