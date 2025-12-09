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

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200 p-6">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-base-content/60 mt-1">
          Overview of users, stores and ratings
        </p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 20c0-3.314 2.686-6 6-6h4c3.314 0 6 2.686 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }
          color="bg-primary text-primary-content"
        />

        <StatCard
          title="Total Stores"
          value={stats.totalStores}
          icon={
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M3 9l9-6 9 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 9v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }
          color="bg-secondary text-secondary-content"
        />

        <StatCard
          title="Total Ratings"
          value={stats.totalRatings}
          icon={
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }
          color="bg-accent text-accent-content"
        />
      </section>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className={`card ${color} shadow-lg`}>
      <div className="card-body flex items-center gap-4">
        <div className="rounded-lg p-3 bg-white/10 flex items-center justify-center">
          {icon}
        </div>

        <div>
          <div className="text-sm opacity-90">{title}</div>
          <div className="text-3xl font-bold mt-1">{value}</div>
        </div>
      </div>
    </div>
  );
}
