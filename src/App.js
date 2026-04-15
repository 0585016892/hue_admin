import { BrowserRouter, Routes, Route ,Navigate} from "react-router-dom";
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
function App() {
  const token = localStorage.getItem("token");
const { isAuth } = useUser();
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔐 LOGIN */}
       <Route
          path="/login"
          element={isAuth ? <Navigate to="/" /> : <Login />}
        />

        {/* 🏥 ADMIN */}
        <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/patients"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Routes>
                    <Route path="/" element={<Patients />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/medicines"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Routes>
                    <Route path="/" element={<Medicines />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Routes>
                    <Route path="/" element={<Appointments   />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/invoices"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Routes>
                    <Route path="/" element={<Invoices   />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/medical-records"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Routes>
                    <Route path="/" element={<Prescriptions   />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctors"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Routes>
                    <Route path="/" element={<Doctors   />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/invoices"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Routes>
                    <Route path="/" element={<Invoices   />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Routes>
                    <Route path="/" element={<Dashboard   />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            }
          />
           <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Routes>
                    <Route path="/" element={<Profile   />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            }
          />
      </Routes>
    </BrowserRouter>
  );
}

export default App;