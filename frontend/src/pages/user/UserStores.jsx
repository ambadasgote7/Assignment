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
      loadStores();
    } catch (err) {
      console.error(err);
      alert("Failed to submit rating");
    }
  }

  useEffect(() => {
    loadStores();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center mt-10">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">All Stores</h2>

      {/* Search Box Card */}
      <div className="card bg-base-100 shadow-md mb-6">
        <div className="card-body grid grid-cols-1 md:grid-cols-3 gap-4">

          <div>
            <label className="label">
              <span className="label-text">Store Name</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Search name"
              value={search.name}
              onChange={(e) => setSearch({ ...search, name: e.target.value })}
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Address</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Search address"
              value={search.address}
              onChange={(e) => setSearch({ ...search, address: e.target.value })}
            />
          </div>

          <div className="flex gap-3 md:items-end">
            <button className="btn btn-primary w-1/2" onClick={loadStores}>Search</button>
            <button
              className="btn btn-ghost w-1/2"
              onClick={() => {
                setSearch({ name: "", address: "" });
              }}
            >
              Reset
            </button>
          </div>

        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      {/* Table */}
      <div className="card bg-base-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full table-zebra">
            <thead className="bg-base-300 font-semibold">
              <tr>
                <th>Store</th>
                <th>Address</th>
                <th>Overall Rating</th>
                <th>Your Rating</th>
                <th>Rate</th>
              </tr>
            </thead>

            <tbody>
              {stores.map((store) => (
                <tr key={store.id} className="hover:bg-base-200">

                  <td className="font-medium">{store.name}</td>

                  <td>{store.address}</td>

                  <td>
                    <div className="badge badge-info badge-lg p-3">
                      {store.overall_rating || "0"}
                    </div>
                  </td>

                  <td>
                    <div className="badge badge-ghost badge-lg p-3">
                      {store.user_rating || "Not rated"}
                    </div>
                  </td>

                  <td>
                    <select
                      className="select select-bordered w-28"
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
        </div>
      </div>

      {/* Empty state */}
      {stores.length === 0 && (
        <p className="text-center text-gray-500 mt-6">No stores found.</p>
      )}
    </div>
  );
}
