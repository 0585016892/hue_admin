import axiosClient from "./axiosClient";

const dashboardApi = {

  // =========================
  // 1️⃣ Tổng quan hệ thống
  // =========================
  getOverview: () =>
    axiosClient.get("/dashboard/overview"),

  // =========================
  // 2️⃣ Doanh thu 7 ngày gần nhất
  // =========================
  revenueLast7Days: () =>
    axiosClient.get("/dashboard/revenue-last-7-days"),

  // =========================
  // 3️⃣ Doanh thu theo tháng (12 tháng năm hiện tại)
  // =========================
  revenueByMonth: () =>
    axiosClient.get("/dashboard/revenue-by-month"),

  // =========================
  // 4️⃣ Bệnh nhân 7 ngày gần nhất
  // =========================
  patientsLast7Days: () =>
    axiosClient.get("/dashboard/patients-last-7-days"),

  // =========================
  // 5️⃣ Top thuốc bán chạy
  // =========================
  topMedicines: () =>
    axiosClient.get("/dashboard/top-medicines"),

  // =========================
  // 6️⃣ Top bác sĩ khám nhiều
  // =========================
  topDoctors: () =>
    axiosClient.get("/dashboard/top-doctors"),

  // =========================
  // 7️⃣ Thuốc sắp hết
  // =========================
  lowStockMedicines: () =>
    axiosClient.get("/dashboard/low-stock-medicines"),

  // =========================
  // 8️⃣ Doanh thu theo khoảng ngày
  // =========================
  revenueByRange: (startDate, endDate) =>
    axiosClient.get("/dashboard/revenue-by-range", {
      params: { startDate, endDate },
    }),
};

export default dashboardApi;