import axiosClient from "./axiosClient";

const dashboardApi = {
  getOverview: () => axiosClient.get("/dashboard/overview"),

  revenueByDay: () => axiosClient.get("/dashboard/revenue-by-day"),

  patientsByDay: () => axiosClient.get("/dashboard/patients-by-day"),

  lowStock: () => axiosClient.get("/dashboard/low-stock-medicines"),

  topMedicines: () => axiosClient.get("/dashboard/top-medicines"),
};

export default dashboardApi;