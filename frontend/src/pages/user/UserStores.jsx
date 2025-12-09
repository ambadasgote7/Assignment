import { useEffect, useState } from "react";
import api from "../../api/api.js";

export default function UserStores() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState({ name: "", address: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadStores() {
    try {
      setLoading(true);

      const params = {};
      if (search.name) params.name = search.name;
      if (search.address) params.address = search.address;

      const res = await api.get("/stores", { params });
      setStores(res.data);
    } catch (err) {
      setError("Failed to load stores");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleRating(storeId, rating) {
    try {
      await api.post("/ratings", { storeId, rating });
      loadStores(); // reload after rating
    } catch (err) {
        console.error(err);
      alert("Failed to submit rating");
    }
  }

  useEffect(() => {
    loadStores();
  }, []);

  if (loading) return <p>Loading stores...</p>;

  return (
    <div style={{ maxWidth: "900px", margin: "20px auto" }}>
      <h2>All Stores</h2>

      {/* Search Section */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          placeholder="Search by name"
          value={search.name}
          onChange={(e) => setSearch({ ...search, name: e.target.value })}
        />
        <input
          placeholder="Search by address"
          value={search.address}
          onChange={(e) => setSearch({ ...search, address: e.target.value })}
        />
        <button onClick={loadStores}>Search</button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "10px"
        }}
      >
        <thead>
          <tr>
            <th style={th}>Store Name</th>
            <th style={th}>Address</th>
            <th style={th}>Overall Rating</th>
            <th style={th}>Your Rating</th>
            <th style={th}>Action</th>
          </tr>
        </thead>

        <tbody>
          {stores.map((store) => (
            <tr key={store.id}>
              <td style={td}>{store.name}</td>
              <td style={td}>{store.address}</td>
              <td style={td}>{store.overall_rating}</td>
              <td style={td}>{store.user_rating || "Not rated"}</td>
              <td style={td}>
                <select
                  value={store.user_rating || ""}
                  onChange={(e) =>
                    handleRating(store.id, Number(e.target.value))
                  }
                >
                  <option value="">Rate</option>
                  {[1, 2, 3, 4, 5].map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {stores.length === 0 && <p>No stores found.</p>}
    </div>
  );
}

const th = {
  borderBottom: "1px solid #ccc",
  padding: "8px",
  textAlign: "left"
};

const td = {
  borderBottom: "1px solid #eee",
  padding: "8px"
};
