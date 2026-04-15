import axiosClient from "./axiosClient";

const userApi = {
  // 👤 Lấy danh sách user (admin)
  getAll: (params) => axiosClient.get("/user", { params }),

  // 👤 Lấy chi tiết 1 user
  getById: (id) => axiosClient.get(`/user/${id}`),

  // ➕ Tạo user (admin)
  create: (data) => axiosClient.post("/user", data),

  // ✏️ Update user (admin)
  update: (id, data) => axiosClient.put(`/user/${id}`, data),

  // 👤 Update profile cá nhân (user login)
  updateProfile: (id, data) =>
    axiosClient.put(`/user/profile/${id}`, data),

  // 🔐 Đổi mật khẩu
  changePassword: (id, data) =>
    axiosClient.put(`/user/change-password/${id}`, data),


  // ❌ Xoá user
  remove: (id) => axiosClient.delete(`/user/${id}`),
};

export default userApi;