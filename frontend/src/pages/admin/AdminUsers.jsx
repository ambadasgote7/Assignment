import { useEffect, useState } from "react";
import api from "../../api/api.js";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
    role: ""
  });

  const [sort, setSort] = useState({
    sortBy: "name",
    sortDir: "asc"
  });

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "USER"
  });

  const [viewUser, setViewUser] = useState(null);

  async function loadUsers() {
    const params = {};

    if (filters.name) params.name = filters.name;
    if (filters.email) params.email = filters.email;
    if (filters.address) params.address = filters.address;
    if (filters.role) params.role = filters.role;

    params.sortBy = sort.sortBy;
    params.sortDir = sort.sortDir;

    const res = await api.get("/admin/users", { params });
    setUsers(res.data);
  }

  async function handleView(id) {
    const res = await api.get(`/admin/users/${id}`);
    setViewUser(res.data);
  }

  async function handleCreateUser(e) {
    e.preventDefault();
    await api.post("/admin/users", newUser);
    setNewUser({ name: "", email: "", address: "", password: "", role: "USER" });
    loadUsers();
  }

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div style={{ maxWidth: 1000, margin: "20px auto" }}>
      <h2>Manage Users</h2>

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
        <select
          value={filters.role}
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
        >
          <option value="">All</option>
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
          <option value="OWNER">Owner</option>
        </select>

        <button onClick={loadUsers}>Filter</button>
      </div>

      {/* Sorting */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <select
          value={sort.sortBy}
          onChange={(e) => setSort({ ...sort, sortBy: e.target.value })}
        >
          <option value="name">Name</option>
          <option value="email">Email</option>
          <option value="role">Role</option>
          <option value="created_at">Created At</option>
        </select>

        <select
          value={sort.sortDir}
          onChange={(e) => setSort({ ...sort, sortDir: e.target.value })}
        >
          <option value="asc">ASC</option>
          <option value="desc">DESC</option>
        </select>

        <button onClick={loadUsers}>Sort</button>
      </div>

      {/* Table */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={th}>Name</th>
            <th style={th}>Email</th>
            <th style={th}>Address</th>
            <th style={th}>Role</th>
            <th style={th}>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td style={td}>{u.name}</td>
              <td style={td}>{u.email}</td>
              <td style={td}>{u.address}</td>
              <td style={td}>{u.role}</td>
              <td style={td}>
                <button onClick={() => handleView(u.id)}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {users.length === 0 && <p>No users found.</p>}

      {/* User Details Modal */}
      {viewUser && (
        <div style={modal}>
          <div style={modalContent}>
            <h3>User Details</h3>
            <p><b>Name:</b> {viewUser.name}</p>
            <p><b>Email:</b> {viewUser.email}</p>
            <p><b>Address:</b> {viewUser.address}</p>
            <p><b>Role:</b> {viewUser.role}</p>

            {viewUser.role === "OWNER" && (
              <p><b>Store Rating:</b> {viewUser.rating || "No ratings yet"}</p>
            )}

            <button onClick={() => setViewUser(null)}>Close</button>
          </div>
        </div>
      )}

      {/* Create User Form */}
      <h3 style={{ marginTop: "30px" }}>Create User</h3>

      <form
        onSubmit={handleCreateUser}
        style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: 400 }}
      >
        <input
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          required
        />
        <input
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          required
        />
        <input
          placeholder="Address"
          value={newUser.address}
          onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
          required
        />
        <input
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          required
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
        >
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
          <option value="OWNER">Owner</option>
        </select>

        <button type="submit">Create User</button>
      </form>
    </div>
  );
}

const th = { padding: "8px", borderBottom: "1px solid #ccc", textAlign: "left" };
const td = { padding: "8px", borderBottom: "1px solid #eee" };

const modal = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const modalContent = {
  background: "white",
  padding: "20px",
  borderRadius: "6px",
  minWidth: "300px"
};
