import axiosClient from "./axiosClient";

const invoiceApi = {
  // 📄 GET ALL
  getAll: (params) =>
    axiosClient.get("/invoices", { params }),

  // 🔍 GET DETAIL
  getById: (id) =>
    axiosClient.get(`/invoices/${id}`),

  // ➕ CREATE (từ appointment hoặc prescription)
  create: (data) =>
    axiosClient.post("/invoices", data),
  // 🔥 CREATE FROM PRESCRIPTION (QUAN TRỌNG)
createFromPrescription: (id) =>
    axiosClient.post(`/invoices/convert-invoice/${id}`),
  // 💰 UPDATE PAYMENT STATUS
  updateStatus: (id, status) =>
    axiosClient.patch(`/invoices/${id}/status`, { status }),

  // ❌ DELETE
  remove: (id) =>
    axiosClient.delete(`/invoices/${id}`),
};

export default invoiceApi;