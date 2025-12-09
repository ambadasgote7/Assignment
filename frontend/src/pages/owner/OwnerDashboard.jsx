import { useEffect, useState } from "react";
import api from "../../api/api.js";

export default function OwnerDashboard() {
  const [stores, setStores] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    try {
      const res = await api.get("/owner/dashboard");
      setStores(res.data.stores || []);
      setRatings(res.data.ratings || []);
    } catch (err) {
      console.error("Failed to load owner dashboard", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">

      {/* ---------- DASHBOARD HEADER ---------- */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-3">Owner Dashboard</h1>
        <p className="text-base-content/60 text-sm">
          Manage your stores & view customer feedback
        </p>
      </div>

      {/* ---------- KPI CARDS ---------- */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        <div className="card bg-primary text-primary-content shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Total Stores</h2>
            <p className="text-4xl font-bold">{stores.length}</p>
          </div>
        </div>

        <div className="card bg-secondary text-secondary-content shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Total Ratings</h2>
            <p className="text-4xl font-bold">{ratings.length}</p>
          </div>
        </div>

        <div className="card bg-accent text-accent-content shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Avg Store Rating</h2>
            <p className="text-4xl font-bold">
              {stores.length === 0
                ? "0.0"
                : (
                    stores.reduce((sum, s) => sum + (parseFloat(s.avg_rating) || 0), 0) /
                    stores.length
                  ).toFixed(2)}
            </p>
          </div>
        </div>

      </div>

      {/* ---------- YOUR STORES ---------- */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="text-2xl font-semibold mb-4">Your Stores</h2>

          {stores.length === 0 ? (
            <p className="text-center text-gray-500 py-4">You do not own any stores yet.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl">
              <table className="table table-zebra w-full">
                <thead className="bg-base-300 text-base font-semibold">
                  <tr>
                    <th>Store</th>
                    <th>Address</th>
                    <th>Avg Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {stores.map((store) => (
                    <tr key={store.id}>
                      <td>{store.name}</td>
                      <td>{store.address}</td>
                      <td>
                        <span className="badge badge-lg badge-primary p-3">
                          {Number(store.avg_rating || 0).toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ---------- RATINGS RECEIVED ---------- */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="text-2xl font-semibold mb-4">Ratings Received</h2>

          {ratings.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No ratings for your stores yet.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl">
              <table className="table w-full">
                <thead className="bg-base-300 text-base font-semibold">
                  <tr>
                    <th>Store</th>
                    <th>User</th>
                    <th>Email</th>
                    <th>Rating</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {ratings.map((r) => (
                    <tr key={r.id}>
                      <td>{r.store_name}</td>
                      <td>{r.user_name}</td>
                      <td>{r.user_email}</td>
                      <td>
                        <span className="badge badge-lg badge-secondary p-3">
                          {r.rating}
                        </span>
                      </td>
                      <td>{new Date(r.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
