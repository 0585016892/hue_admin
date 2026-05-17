import axios from "./axiosClient";



// ===============================
// 📌 LẤY TẤT CẢ GIƯỜNG
// ===============================
export const getBeds = async () => {
  const res = await axios.get('/beds');
  return res.data;
};


// ===============================
// 📌 LẤY GIƯỜNG THEO TRẠNG THÁI
// ===============================
export const getBedsByStatus = async (status) => {
  const res = await axios.get(`/beds/status/${status}`);
  return res.data;
};


// ===============================
// 📌 LẤY CHI TIẾT 1 GIƯỜNG
// ===============================
export const getBedById = async (id) => {
  const res = await axios.get(`/beds/${id}`);
  return res.data;
};


// ===============================
// 📌 THÊM GIƯỜNG
// ===============================
export const createBed = async (data) => {
  const res = await axios.post('/', data);
  return res.data;
};


// ===============================
// 📌 CẬP NHẬT GIƯỜNG
// ===============================
export const updateBed = async (id, data) => {
  const res = await axios.put(`/beds/${id}`, data);
  return res.data;
};


// ===============================
// 📌 XOÁ GIƯỜNG
// ===============================
export const deleteBed = async (id) => {
  const res = await axios.delete(`/beds/${id}`);
  return res.data;
};


// ===============================
// 📌 GÁN BỆNH NHÂN VÀO GIƯỜNG
// ===============================
export const assignBed = async (bed_id, patient_id) => {
  const res = await axios.post(`/beds/assign`, {
    bed_id,
    patient_id,
  });
  return res.data;
};


// ===============================
// 📌 TRẢ GIƯỜNG
// ===============================
export const releaseBed = async (id) => {
  const res = await axios.post(
    `/beds/release/${id}`
  );
  return res.data;
};


// ===============================
// 📌 GIƯỜNG ĐANG DÙNG
// ===============================
export const getOccupiedBeds = async () => {
  const res = await axios.get(`/beds/occupied`);
  return res.data;
};


// ===============================
// 📌 THỐNG KÊ GIƯỜNG
// ===============================
export const getBedStats = async () => {
  const res = await axios.get(`/beds/stats/summary`);
  return res.data;
};