import axiosClient from "./axiosClient";

const doctorApi = {
  getAll: (params) =>
    axiosClient.get("/doctors/", { params }),

  getById: (id) =>
    axiosClient.get(`/doctors/${id}`),

  create: (data) =>
    axiosClient.post("/doctors", data),

  update: (id, data) =>
    axiosClient.put(`/doctors/${id}`, data),

  remove: (id) =>
    axiosClient.delete(`/doctors/${id}`),
};

export default doctorApi;