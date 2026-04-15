import axiosClient from "./axiosClient";

const medicineApi = {
  // 📄 GET ALL (có pagination + search)
  getAll: (params) =>
    axiosClient.get("/medicines", { params }),

  // 🔍 GET DETAIL
  getById: (id) =>
    axiosClient.get(`/medicines/${id}`),

  // ➕ CREATE
  create: (data) =>
    axiosClient.post("/medicines", data),

  // ✏️ UPDATE
  update: (id, data) =>
    axiosClient.put(`/medicines/${id}`, data),

  // ❌ DELETE
  remove: (id) =>
    axiosClient.delete(`/medicines/${id}`),

  // 📦 UPDATE STOCK (dùng cho nhập/xuất kho)
  updateStock: (id, stock) =>
    axiosClient.patch(`/medicines/${id}/stock`, { stock }),

  // ⚠️ LOW STOCK
  getLowStock: () =>
    axiosClient.get("/dashboard/low-stock-medicines"),
};

export default medicineApi;