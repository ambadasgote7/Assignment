import { useEffect, useState } from "react";
import api from "../../api/api.js";

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: "", email: "", address: "" });
  const [sort, setSort] = useState({ sortBy: "name", sortDir: "asc" });
  const [popup, setPopup] = useState("");


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

  // Show popup
  setPopup("Store created successfully!");

  // Hide after 3 seconds
  setTimeout(() => setPopup(""), 3000);

  loadStores();
}


  useEffect(() => {
    loadStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">

      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Manage Stores</h1>
          <p className="text-sm text-base-content/60">Filter, sort and create stores</p>
        </div>

        <div className="flex gap-2">
          <button
            className="btn btn-sm btn-outline"
            onClick={() => {
              setFilters({ name: "", email: "", address: "" });
            }}
            title="Clear filter fields (does not reload)"
          >
            Clear Fields
          </button>
          <button
            className="btn btn-sm btn-primary"
            onClick={loadStores}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <div>
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  placeholder="Name"
                  value={filters.name}
                  onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  placeholder="Email"
                  value={filters.email}
                  onChange={(e) => setFilters({ ...filters, email: e.target.value })}
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Address</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  placeholder="Address"
                  value={filters.address}
                  onChange={(e) => setFilters({ ...filters, address: e.target.value })}
                />
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <button className="btn btn-sm btn-primary" onClick={loadStores}>
                Filter
              </button>
              <button
                className="btn btn-sm btn-ghost"
                onClick={() => setFilters({ name: "", email: "", address: "" })}
              >
                Reset Fields
              </button>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title">Sorting</h3>

            <div className="flex flex-col sm:flex-row sm:items-end gap-4 mt-2">
              <div className="w-full">
                <label className="label">
                  <span className="label-text">Sort By</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={sort.sortBy}
                  onChange={(e) => setSort({ ...sort, sortBy: e.target.value })}
                >
                  <option value="name">Name</option>
                  <option value="email">Email</option>
                  <option value="created_at">Created At</option>
                </select>
              </div>

              <div className="w-full sm:w-40">
                <label className="label">
                  <span className="label-text">Direction</span>
                </label>
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
                <button
                  className="btn btn-primary btn-sm"
                  onClick={loadStores}
                >
                  Sort
                </button>
                <button
                  className="btn btn-sm btn-ghost"
                  onClick={() => setSort({ sortBy: "name", sortDir: "asc" })}
                >
                  Reset Sort
                </button>
              </div>
            </div>

            <p className="text-xs text-base-content/60 mt-4">
              Tip: change sort options then click <span className="font-medium">Sort</span>.
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card bg-base-100 shadow overflow-auto">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-base-300">
                <tr>
                  <th className="pl-6">Name</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th className="text-right pr-6">Rating</th>
                </tr>
              </thead>
              <tbody>
                {stores.map((s) => (
                  <tr key={s.id} className="hover:bg-base-200">
                    <td className="pl-6 font-medium">{s.name}</td>
                    <td>{s.email}</td>
                    <td className="max-w-xs truncate">{s.address}</td>
                    <td className="text-right pr-6">
                      {s.avg_rating != null ? Number(s.avg_rating).toFixed(2) : "0.00"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {stores.length === 0 && (
        <p className="text-center text-gray-500">No stores found.</p>
      )}

      {popup && (
        <div className="alert alert-success shadow-lg fixed top-4 right-4 w-fit">
            <span>{popup}</span>
        </div>
        )}


      {/* Create store */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h3 className="card-title">Create Store</h3>

          <form onSubmit={createStore} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
            <input
              placeholder="Store Name"
              value={newStore.name}
              onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
              required
              className="input input-bordered w-full"
            />
            <input
              placeholder="Email"
              value={newStore.email}
              onChange={(e) => setNewStore({ ...newStore, email: e.target.value })}
              required
              className="input input-bordered w-full"
            />
            <input
              placeholder="Address"
              value={newStore.address}
              onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
              required
              className="input input-bordered w-full md:col-span-2"
            />
            <input
              placeholder="Owner ID (optional)"
              value={newStore.ownerId}
              onChange={(e) => setNewStore({ ...newStore, ownerId: e.target.value })}
              className="input input-bordered w-full"
            />

            <div className="md:col-span-2 flex gap-3 justify-end mt-2">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setNewStore({ name: "", email: "", address: "", ownerId: "" })}
              >
                Reset
              </button>
              <button type="submit" className="btn btn-primary">
                Create Store
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
}
