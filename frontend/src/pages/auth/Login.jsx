import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api.js";
import { setUser } from "../../utils/auth.js";

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
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>Login</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
