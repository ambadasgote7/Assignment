import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api.js";
import { setUser } from "../../utils/auth.js";
import { Link } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        address: form.address,
        password: form.password
      });

      // Save user
      setUser(res.data.user);

      // Redirect to user stores
      navigate("/stores");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-6">
      <div className="card w-full max-w-md bg-base-100 shadow-xl rounded-2xl">
        <div className="card-body p-8">

          <h2 className="text-2xl font-bold text-center mb-4">Create Account</h2>

          {error && (
            <div className="alert alert-error shadow-lg mb-4">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                name="name"
                type="text"
                placeholder="John Doe (20-60 characters)"
                required
                value={form.name}
                onChange={handleChange}
                className="input input-bordered w-full rounded-lg"
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                value={form.email}
                onChange={handleChange}
                className="input input-bordered w-full rounded-lg"
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Address</span>
              </label>
              <input
                name="address"
                type="text"
                placeholder="Your address"
                required
                value={form.address}
                onChange={handleChange}
                className="input input-bordered w-full rounded-lg"
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                required
                value={form.password}
                onChange={handleChange}
                className="input input-bordered w-full rounded-lg"
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <input
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                required
                value={form.confirmPassword}
                onChange={handleChange}
                className="input input-bordered w-full rounded-lg"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full rounded-lg mt-2"
            >
              Create Account
            </button>
          </form>

            <Link to='/login'>
          <p
            className="mt-4 text-sm text-center text-primary cursor-pointer"
          >
            Already have an account? Login
          </p>
          </Link>


        </div>
      </div>
    </div>
  );
}
