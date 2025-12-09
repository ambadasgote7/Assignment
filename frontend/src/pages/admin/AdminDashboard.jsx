import { useEffect, useState } from "react";
import api from "../../api/api.js";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0
  });

  const [loading, setLoading] = useState(true);

  async function loadStats() {
    try {
      const res = await api.get("/admin/dashboard");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load dashboard", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: 800, margin: "20px auto" }}>
      <h2>Admin Dashboard</h2>

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <Card title="Total Users" value={stats.totalUsers} />
        <Card title="Total Stores" value={stats.totalStores} />
        <Card title="Total Ratings" value={stats.totalRatings} />
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div
      style={{
        padding: "20px",
        background: "#f4f4f4",
        borderRadius: "8px",
        flex: 1,
        textAlign: "center",
      }}
    >
      <h3>{title}</h3>
      <p style={{ fontSize: "22px", fontWeight: "bold" }}>{value}</p>
    </div>
  );
}
