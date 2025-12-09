import { useEffect, useState } from "react";
import api from "../../api/api.js";

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: "", email: "", address: "" });
  const [sort, setSort] = useState({ sortBy: "name", sortDir: "asc" });

  const [newStore, setNewStore] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: ""
  });

  async function loadStores() {
    const params = {};

    if (filters.name) params.name = filters.name;
    if (filters.email) params.email = filters.email;
    if (filters.address) params.address = filters.address;

    params.sortBy = sort.sortBy;
    params.sortDir = sort.sortDir;

    const res = await api.get("/admin/stores", { params });
    setStores(res.data);
  }

  async function createStore(e) {
    e.preventDefault();
    const payload = {
      name: newStore.name,
      email: newStore.email,
      address: newStore.address,
      ownerId: newStore.ownerId || null
    };
    await api.post("/admin/stores", payload);
    setNewStore({ name: "", email: "", address: "", ownerId: "" });
    loadStores();
  }

  useEffect(() => {
    loadStores();
  }, []);

  return (
    <div style={{ maxWidth: 1000, margin: "20px auto" }}>
      <h2>Manage Stores</h2>

      {/* Filters */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <input
          placeholder="Name"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        <input
          placeholder="Email"
          value={filters.email}
          onChange={(e) => setFilters({ ...filters, email: e.target.value })}
        />
        <input
          placeholder="Address"
          value={filters.address}
          onChange={(e) => setFilters({ ...filters, address: e.target.value })}
        />
        <button onClick={loadStores}>Filter</button>
      </div>

      {/* Sorting */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <select
          value={sort.sortBy}
          onChange={(e) => setSort({ ...sort, sortBy: e.target.value })}
        >
          <option value="name">Name</option>
          <option value="email">Email</option>
          <option value="created_at">Created At</option>
        </select>

        <select
          value={sort.sortDir}
          onChange={(e) => setSort({ ...sort, sortDir: e.target.value })}
        >
          <option value="asc">ASC</option>
          <option value="desc">DESC</option>
        </select>

        <button onClick={loadStores}>Sort</button>
      </div>

      {/* Table */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={th}>Name</th>
            <th style={th}>Email</th>
            <th style={th}>Address</th>
            <th style={th}>Rating</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((s) => (
            <tr key={s.id}>
              <td style={td}>{s.name}</td>
              <td style={td}>{s.email}</td>
              <td style={td}>{s.address}</td>
              <td style={td}>{Number(s.avg_rating).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {stores.length === 0 && <p>No stores found.</p>}

      {/* Create store */}
      <h3 style={{ marginTop: "30px" }}>Create Store</h3>

      <form
        onSubmit={createStore}
        style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: 400 }}
      >
        <input
          placeholder="Store Name"
          value={newStore.name}
          onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
          required
        />
        <input
          placeholder="Email"
          value={newStore.email}
          onChange={(e) => setNewStore({ ...newStore, email: e.target.value })}
          required
        />
        <input
          placeholder="Address"
          value={newStore.address}
          onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
          required
        />
        <input
          placeholder="Owner ID (optional)"
          value={newStore.ownerId}
          onChange={(e) => setNewStore({ ...newStore, ownerId: e.target.value })}
        />

        <button type="submit">Create Store</button>
      </form>
    </div>
  );
}

const th = { padding: "8px", borderBottom: "1px solid #ccc", textAlign: "left" };
const td = { padding: "8px", borderBottom: "1px solid #eee" };
