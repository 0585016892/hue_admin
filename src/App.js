import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { useUser } from "./context/UserContext";
import Patients from "./pages/Patients";
import Medicines from "./pages/Medicines";
import Appointments from "./pages/Appointments";
import Invoices from "./pages/Invoices";
import Prescriptions from "./pages/Prescriptions";
import Doctors from "./pages/Doctors";
import Profile from "./pages/Profile";
import SalaryManager from "./pages/SalaryManager";
import MedicalSupplyManager from "./pages/MedicalSupplyManager";
import DoctorDashboard from "./pages/DoctorDashboard";
import Home from "./pages/Home";
import SpecialtiesPage from "./components/Specialties";
import PackagesPage from "./components/PackagesPage";
import BedPage from "./pages/BedPage";
function App() {
  const { isAuth, user } = useUser();

  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/specialties" element={<SpecialtiesPage />} />
      <Route path="/packages" element={<PackagesPage />} />
        {/* 🔐 LOGIN */}
        <Route
          path="/login"
            element={
              isAuth ? (
                user?.role === "doctor" ? (
                  <Navigate to="/doctor" replace />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              ) : (
                <Login />
              )
            }
          />

        {/* 👨‍⚕️ DOCTOR ROUTES */}
        <Route
          element={
            <ProtectedRoute roles={["doctor"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/doctor" element={<DoctorDashboard />} />
        </Route>

        {/* 🏥 ADMIN ROUTES */}
        <Route
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/salary" element={<SalaryManager />} />
          <Route path="/medicines" element={<Medicines />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/medical-records" element={<Prescriptions />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/analytics" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/medical-supplies" element={<MedicalSupplyManager />} />
          <Route path="/beds" element={<BedPage />} />
        </Route>

        {/* ❌ NOT FOUND */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;