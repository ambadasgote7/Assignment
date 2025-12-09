import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api.js";
import { setUser } from "../../utils/auth.js";
import { Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", {
        email: form.email,
        password: form.password
      });

      const user = res.data.user;
      setUser(user);

      // Redirect by role
      if (user.role === "ADMIN") navigate("/admin/dashboard");
      else if (user.role === "OWNER") navigate("/owner/dashboard");
      else navigate("/stores");

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-6">
      <div className="card w-full max-w-sm bg-base-100 shadow-xl rounded-2xl">
        <div className="card-body p-8">

          <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

          {error && (
            <div className="alert alert-error shadow-lg mb-4">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

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

            <button type="submit" className="btn btn-primary w-full rounded-lg mt-2">
              Login
            </button>
          </form>

          <Link to='/signup'>
          <p
            className="mt-4 text-sm text-center text-primary cursor-pointer"
          >
            New user? Create an account
          </p>
          </Link>

          

        </div>
      </div>
    </div>
  );
}
