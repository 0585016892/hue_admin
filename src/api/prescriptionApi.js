import axiosClient from "./axiosClient";

const prescriptionApi = {
  // ➕ tạo đơn thuốc (kê đơn)
  create: (data) =>
    axiosClient.post("/prescriptions", data),

  // 📄 GET ALL (pagination + search)
  getAll: (params) =>
    axiosClient.get("/prescriptions", { params }),

  // 🔍 GET BY APPOINTMENT
  getByAppointment: (appointmentId) =>
    axiosClient.get(`/prescriptions/${appointmentId}`),

  // 🔍 GET DETAIL (optional nâng cao)
  getById: (id) =>
    axiosClient.get(`/prescriptions/detail/${id}`),

  // ❌ DELETE (xoá + hoàn kho)
  remove: (id) =>
    axiosClient.delete(`/prescriptions/${id}`),
};

export default prescriptionApi;