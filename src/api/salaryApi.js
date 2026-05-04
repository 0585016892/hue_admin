import axiosClient from "./axiosClient";

const salaryApi = {
  // ===============================
  // 📄 Lấy danh sách lương (có phân trang)
  // ===============================
  getAll: (params) =>
    axiosClient.get("/salary", { params }),

  // ===============================
  // 💰 Tổng lương toàn bệnh viện
  // ===============================
  getSummary: (params) =>
    axiosClient.get("/salary/summary", { params }),

  // ===============================
  // ➕ Thêm lương
  // ===============================
  create: (data) =>
    axiosClient.post("/salary", data),

  // ===============================
  // ✏️ Cập nhật lương
  // ===============================
  update: (id, data) =>
    axiosClient.put(`/salary/${id}`, data),

  // ===============================
  // ❌ Xoá lương
  // ===============================
  remove: (id) =>
    axiosClient.delete(`/salary/${id}`),

  // ===============================
  // 👨‍⚕️ Lấy danh sách bác sĩ
  // ===============================
  getDoctors: () =>
    axiosClient.get("/salary/doctors"),

  // ===============================
  // 📁 Xuất Excel
  // ===============================
  exportExcel: async (params) => {
    const response = await axiosClient.get("/salary/export", {
      params,
      responseType: "blob",
    });

    return response;
  },

  // ===============================
  // 📊 Dữ liệu biểu đồ theo tháng
  // ===============================
  getChart: () =>
    axiosClient.get("/salary/chart"),
};

export default salaryApi;