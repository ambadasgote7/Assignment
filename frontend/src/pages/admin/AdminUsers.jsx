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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Manage Users</h1>
          <p className="text-sm text-base-content/60">Filter, sort, view and create users</p>
        </div>

        <div className="flex gap-2">
          <button
            className="btn btn-sm btn-outline"
            onClick={() => setFilters({ name: "", email: "", address: "", role: "" })}
            title="Clear filter fields (does not reload)"
          >
            Clear Fields
          </button>

          <button
            className="btn btn-sm btn-primary"
            onClick={loadUsers}
          >
            Refresh
          </button>
        </div>
      </header>

      {/* Filters & Sort */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title">Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
              <div>
                <label className="label"><span className="label-text">Name</span></label>
                <input
                  className="input input-bordered w-full"
                  placeholder="Name"
                  value={filters.name}
                  onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                />
              </div>

              <div>
                <label className="label"><span className="label-text">Email</span></label>
                <input
                  className="input input-bordered w-full"
                  placeholder="Email"
                  value={filters.email}
                  onChange={(e) => setFilters({ ...filters, email: e.target.value })}
                />
              </div>

              <div>
                <label className="label"><span className="label-text">Address</span></label>
                <input
                  className="input input-bordered w-full"
                  placeholder="Address"
                  value={filters.address}
                  onChange={(e) => setFilters({ ...filters, address: e.target.value })}
                />
              </div>

              <div>
                <label className="label"><span className="label-text">Role</span></label>
                <select
                  className="select select-bordered w-full"
                  value={filters.role}
                  onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                >
                  <option value="">All</option>
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                  <option value="OWNER">Owner</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <button className="btn btn-sm btn-primary" onClick={loadUsers}>Filter</button>
              <button className="btn btn-sm btn-ghost" onClick={() => setFilters({ name: "", email: "", address: "", role: "" })}>Reset Fields</button>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title">Sorting</h3>

            <div className="flex flex-col sm:flex-row sm:items-end gap-4 mt-2">
              <div className="w-full">
                <label className="label"><span className="label-text">Sort By</span></label>
                <select
                  className="select select-bordered w-full"
                  value={sort.sortBy}
                  onChange={(e) => setSort({ ...sort, sortBy: e.target.value })}
                >
                  <option value="name">Name</option>
                  <option value="email">Email</option>
                  <option value="role">Role</option>
                  <option value="created_at">Created At</option>
                </select>
              </div>

              <div className="w-full sm:w-40">
                <label className="label"><span className="label-text">Direction</span></label>
                <select
                  className="select select-bordered w-full"
                  value={sort.sortDir}
                  onChange={(e) => setSort({ ...sort, sortDir: e.target.value })}
                >
                  <option value="asc">ASC</option>
                  <option value="desc">DESC</option>
                </select>
              </div>

              <div className="flex gap-2 mt-2 sm:mt-0">
                <button className="btn btn-primary btn-sm" onClick={loadUsers}>Sort</button>
                <button className="btn btn-sm btn-ghost" onClick={() => setSort({ sortBy: "name", sortDir: "asc" })}>Reset Sort</button>
              </div>
            </div>

            <p className="text-xs text-base-content/60 mt-4">Tip: change sort options then click <span className="font-medium">Sort</span>.</p>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card bg-base-100 shadow overflow-auto">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-base-300">
                <tr>
                  <th className="pl-6">Name</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Role</th>
                  <th className="text-right pr-6">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-base-200">
                    <td className="pl-6 font-medium">{u.name}</td>
                    <td>{u.email}</td>
                    <td className="max-w-xs truncate">{u.address}</td>
                    <td>
                      <span className={`badge ${u.role === "ADMIN" ? "badge-primary" : u.role === "OWNER" ? "badge-accent" : "badge-ghost"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="text-right pr-6">
                      <button className="btn btn-sm btn-outline" onClick={() => handleView(u.id)}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {users.length === 0 && <p className="text-center text-gray-500">No users found.</p>}

      {/* View User Modal (DaisyUI modal) */}
      {viewUser && (
        <div className="modal modal-open">
          <div className="modal-box max-w-md">
            <h3 className="font-bold text-lg">User Details</h3>
            <div className="mt-4 space-y-2">
              <p><strong>Name:</strong> {viewUser.name}</p>
              <p><strong>Email:</strong> {viewUser.email}</p>
              <p><strong>Address:</strong> {viewUser.address}</p>
              <p>
                <strong>Role:</strong>{" "}
                <span className={`badge ${viewUser.role === "ADMIN" ? "badge-primary" : viewUser.role === "OWNER" ? "badge-accent" : "badge-ghost"}`}>
                  {viewUser.role}
                </span>
              </p>

              {viewUser.role === "OWNER" && (
                <p><strong>Store Rating:</strong> {viewUser.rating || "No ratings yet"}</p>
              )}
            </div>

            <div className="modal-action">
              <button className="btn" onClick={() => setViewUser(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Create User Form */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h3 className="card-title">Create User</h3>

          <form onSubmit={handleCreateUser} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
            <input
              placeholder="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              required
              className="input input-bordered w-full"
            />
            <input
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              required
              className="input input-bordered w-full"
            />
            <input
              placeholder="Address"
              value={newUser.address}
              onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
              required
              className="input input-bordered w-full"
            />
            <input
              placeholder="Password"
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              required
              className="input input-bordered w-full"
            />

            <select
              className="select select-bordered w-full"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
              <option value="OWNER">Owner</option>
            </select>

            <div className="md:col-span-2 flex gap-3 justify-end mt-2">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setNewUser({ name: "", email: "", address: "", password: "", role: "USER" })}
              >
                Reset
              </button>

              <button type="submit" className="btn btn-primary">Create User</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
