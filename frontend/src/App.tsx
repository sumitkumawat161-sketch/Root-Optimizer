import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import RoutePlannerPage from "./pages/RoutePlannerPage";
import VehicleManagementPage from "./pages/VehicleManagementPage";
import DriverPanelPage from "./pages/DriverPanelPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import AdminPanelPage from "./pages/AdminPanelPage";
import LiveTrackingPage from "./pages/LiveTrackingPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./components/common/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/planner"
          element={
            <ProtectedRoute roles={["ADMIN", "DISPATCHER"]}>
              <RoutePlannerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/planner/:id"
          element={
            <ProtectedRoute roles={["ADMIN", "DISPATCHER"]}>
              <RoutePlannerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vehicles"
          element={
            <ProtectedRoute roles={["ADMIN", "DISPATCHER"]}>
              <VehicleManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drivers"
          element={
            <ProtectedRoute>
              <DriverPanelPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tracking"
          element={
            <ProtectedRoute>
              <LiveTrackingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute roles={["ADMIN", "DISPATCHER"]}>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminPanelPage />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
