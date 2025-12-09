import { Link, useNavigate } from "react-router-dom";
import api from "../api/api.js";
import { getUser, getRole, clearUser } from "../utils/auth.js";

export default function Navbar() {
  const navigate = useNavigate();
  const user = getUser();
  const role = getRole();

  async function handleLogout() {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout failed:", err);
    }
    clearUser();
    navigate("/login");
  }

  return (
    <nav style={{
      padding: "12px 20px",
      background: "#222",
      color: "white",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <div>
        <Link to="/" style={{ color: "white", textDecoration: "none", fontWeight: "bold" }}>
          Store Rating System
        </Link>
      </div>

      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        {!user && (
          <>
            <Link to="/login" style={{ color: "white", textDecoration: "none" }}>Login</Link>
            <Link to="/signup" style={{ color: "white", textDecoration: "none" }}>Signup</Link>
          </>
        )}

        {role === "USER" && (
          <>
            <Link to="/stores" style={{ color: "white", textDecoration: "none" }}>Stores</Link>
            <Link to="/change-password" style={{ color: "white", textDecoration: "none" }}>
              Change Password
            </Link>
            <button
              onClick={handleLogout}
              style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}
            >
              Logout
            </button>
          </>
        )}

        {role === "ADMIN" && (
          <>
            <Link to="/admin/dashboard" style={{ color: "white", textDecoration: "none" }}>Dashboard</Link>
            <Link to="/admin/users" style={{ color: "white", textDecoration: "none" }}>Users</Link>
            <Link to="/admin/stores" style={{ color: "white", textDecoration: "none" }}>Stores</Link>
            <Link to="/change-password" style={{ color: "white", textDecoration: "none" }}>
              Change Password
            </Link>
            <button
              onClick={handleLogout}
              style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}
            >
              Logout
            </button>
          </>
        )}

        {role === "OWNER" && (
          <>
            <Link to="/owner/dashboard" style={{ color: "white", textDecoration: "none" }}>Dashboard</Link>
            <Link to="/change-password" style={{ color: "white", textDecoration: "none" }}>
              Change Password
            </Link>
            <button
              onClick={handleLogout}
              style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
