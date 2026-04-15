import axiosClient from "./axiosClient";

const appointmentApi = {
  // 📄 GET ALL (pagination + filter)
  getAll: (params) =>
    axiosClient.get("/appointments", { params }),

  // 🔍 GET DETAIL
  getById: (id) =>
    axiosClient.get(`/appointments/${id}`),

  // ➕ CREATE
  create: (data) =>
    axiosClient.post("/appointments", data),

  // 🩺 EXAMINE (khám bệnh)
  examine: (id, data) =>
    axiosClient.put(`/appointments/${id}/examine`, data),

  // 🔄 UPDATE STATUS
  updateStatus: (id, status) =>
    axiosClient.patch(`/appointments/${id}/status`, { status }),

  // ❌ DELETE
  remove: (id) =>
    axiosClient.delete(`/appointments/${id}`),
};

export default appointmentApi;