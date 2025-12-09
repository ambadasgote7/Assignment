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

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: "1000px", margin: "20px auto" }}>
      <h2>Owner Dashboard</h2>

      {/* OWNER'S STORES */}
      <h3 style={{ marginTop: "20px" }}>Your Stores</h3>

      {stores.length === 0 ? (
        <p>You do not own any stores yet.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "30px" }}>
          <thead>
            <tr>
              <th style={th}>Store Name</th>
              <th style={th}>Address</th>
              <th style={th}>Average Rating</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store) => (
              <tr key={store.id}>
                <td style={td}>{store.name}</td>
                <td style={td}>{store.address}</td>
                <td style={td}>{Number(store.avg_rating || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* RATINGS RECEIVED */}
      <h3>Ratings Received</h3>

      {ratings.length === 0 ? (
        <p>No ratings for your stores yet.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>Store</th>
              <th style={th}>User Name</th>
              <th style={th}>User Email</th>
              <th style={th}>Rating</th>
              <th style={th}>Date</th>
            </tr>
          </thead>
          <tbody>
            {ratings.map((r) => (
              <tr key={r.id}>
                <td style={td}>{r.store_name}</td>
                <td style={td}>{r.user_name}</td>
                <td style={td}>{r.user_email}</td>
                <td style={td}>{r.rating}</td>
                <td style={td}>{new Date(r.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const th = {
  padding: "8px",
  borderBottom: "1px solid #ccc",
  textAlign: "left"
};

const td = {
  padding: "8px",
  borderBottom: "1px solid #eee"
};
