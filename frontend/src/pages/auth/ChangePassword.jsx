import { useState } from "react";
import api from "../../api/api.js";

export default function ChangePassword() {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (form.newPassword !== form.confirmNewPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await api.post("/auth/change-password", {
        oldPassword: form.oldPassword,
        newPassword: form.newPassword
      });

      setMessage("Password updated successfully");
      setForm({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
      setTimeout(() => setMessage(""), 3000);

    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-6">
      <div className="card w-full max-w-sm bg-base-100 shadow-xl rounded-2xl">
        <div className="card-body p-8">

          <h2 className="text-2xl font-bold text-center mb-4">
            Change Password
          </h2>

          {message && (
            <div className="alert alert-success mb-4">
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="label">
                <span className="label-text">Old Password</span>
              </label>
              <input
                type="password"
                name="oldPassword"
                placeholder="Old Password"
                required
                value={form.oldPassword}
                onChange={handleChange}
                className="input input-bordered w-full rounded-lg"
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">New Password</span>
              </label>
              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                required
                value={form.newPassword}
                onChange={handleChange}
                className="input input-bordered w-full rounded-lg"
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Confirm New Password</span>
              </label>
              <input
                type="password"
                name="confirmNewPassword"
                placeholder="Confirm New Password"
                required
                value={form.confirmNewPassword}
                onChange={handleChange}
                className="input input-bordered w-full rounded-lg"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full rounded-lg mt-2"
            >
              Update Password
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
