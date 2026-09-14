import "./App.css";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Activity,
  BriefcaseBusiness,
  CalendarDays,
  LogOut,
  Settings,
  Users,
} from "lucide-react";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import SettingsPage from "./pages/Settings";

import { AuthProvider, useAuth } from "../context/AuthContext";

function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, loading } = useAuth();

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <main className="dashboard-page">
      <aside className="dashboard-sidebar">
        <div className="dashboard-brand">
          <div className="dashboard-brand-icon">
            <BriefcaseBusiness size={20} />
          </div>

          <span>WorkForce</span>
        </div>

        <nav className="dashboard-nav">
          <span className="nav-section-label">MAIN</span>

          <button
            type="button"
            className={`dashboard-nav-item ${
              isActive("/dashboard") ? "active" : ""
            }`}
            onClick={() => navigate("/dashboard")}
          >
            <Activity size={18} />
            <span>Overview</span>
          </button>

          <button
            type="button"
            className={`dashboard-nav-item ${
              isActive("/employees") ? "active" : ""
            }`}
            onClick={() => navigate("/employees")}
          >
            <Users size={18} />
            <span>Employees</span>
          </button>

          <button
            type="button"
            className={`dashboard-nav-item ${
              isActive("/attendance") ? "active" : ""
            }`}
            onClick={() => navigate("/attendance")}
          >
            <CalendarDays size={18} />
            <span>Attendance</span>
          </button>

          <span className="nav-section-label">SYSTEM</span>

          <button
            type="button"
            className={`dashboard-nav-item ${
              isActive("/settings") ? "active" : ""
            }`}
            onClick={() => navigate("/settings")}
          >
            <Settings size={18} />
            <span>Settings</span>
          </button>
        </nav>

        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>

          <div className="sidebar-user-info">
            <strong>{user?.name || "User"}</strong>
            <span>{user?.email || ""}</span>
          </div>

          <button
            type="button"
            className="sidebar-logout"
            onClick={handleLogout}
            disabled={loading}
            title="Log out"
          >
            <LogOut size={17} />
          </button>
        </div>
      </aside>

      <section className="dashboard-content">
        {children}
      </section>
    </main>
  );
}

function ProtectedRoutes() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        }
      />

      <Route
        path="/employees"
        element={
          <DashboardLayout>
            <Employees />
          </DashboardLayout>
        }
      />

      <Route
        path="/attendance"
        element={
          <DashboardLayout>
            <Attendance />
          </DashboardLayout>
        }
      />

      <Route
        path="/settings"
        element={
          <DashboardLayout>
            <SettingsPage />
          </DashboardLayout>
        }
      />

      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />
    </Routes>
  );
}

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login />
          )
        }
      />

      <Route
        path="/*"
        element={<ProtectedRoutes />}
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;