import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

import Login from "./pages/auth/Login.jsx";
import Signup from "./pages/auth/Signup.jsx";
import ChangePassword from "./pages/auth/ChangePassword.jsx";

import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import AdminStores from "./pages/admin/AdminStores.jsx";

import UserStores from "./pages/user/UserStores.jsx";

import OwnerDashboard from "./pages/owner/OwnerDashboard.jsx";

import { getUser, getRole, isLoggedIn } from "./utils/auth.js";

// 🔐 Simple ProtectedRoute
function ProtectedRoute({ children, allowed }) {
  const user = getUser();
  const role = getRole();
  const location = useLocation();

  // Not logged in → go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but role not allowed → redirect to correct dashboard
  if (allowed && !allowed.includes(role)) {
    if (role === "ADMIN") return <Navigate to="/admin/dashboard" replace />;
    if (role === "USER") return <Navigate to="/stores" replace />;
    if (role === "OWNER") return <Navigate to="/owner/dashboard" replace />;
  }

  return children;
}

export default function App() {
  const loggedIn = isLoggedIn();
  const role = getRole();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Navbar always visible */}
      <Navbar />

      <div style={{ flex: 1 }}>
        <Routes>

          {/* Public routes */}
          <Route
            path="/login"
            element={
              loggedIn ? (
                role === "ADMIN" ? (
                  <Navigate to="/admin/dashboard" replace />
                ) : role === "OWNER" ? (
                  <Navigate to="/owner/dashboard" replace />
                ) : (
                  <Navigate to="/stores" replace />
                )
              ) : (
                <Login />
              )
            }
          />

          <Route
            path="/signup"
            element={
              loggedIn ? (
                <Navigate to="/stores" replace />
              ) : (
                <Signup />
              )
            }
          />

          {/* Change password → any logged-in role */}
          <Route
            path="/change-password"
            element={
              <ProtectedRoute allowed={["ADMIN", "USER", "OWNER"]}>
                <ChangePassword />
              </ProtectedRoute>
            }
          />

          {/* USER ROUTES */}
          <Route
            path="/stores"
            element={
              <ProtectedRoute allowed={["USER"]}>
                <UserStores />
              </ProtectedRoute>
            }
          />

          {/* ADMIN ROUTES */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowed={["ADMIN"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowed={["ADMIN"]}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/stores"
            element={
              <ProtectedRoute allowed={["ADMIN"]}>
                <AdminStores />
              </ProtectedRoute>
            }
          />

          {/* OWNER ROUTES */}
          <Route
            path="/owner/dashboard"
            element={
              <ProtectedRoute allowed={["OWNER"]}>
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />

          {/* ANY UNKNOWN ROUTE → redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}
