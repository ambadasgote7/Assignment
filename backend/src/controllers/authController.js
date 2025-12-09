import { query } from "../config/db.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { signToken } from "../utils/jwt.js";

export async function register(req, res) {
  try {
    const { name, email, address, password } = req.body;

    const existing = await query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const password_hash = await hashPassword(password);
    const role = "USER";

    const result = await query(
      "INSERT INTO users (name, email, address, password_hash, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, address, password_hash, role]
    );

    const user = { id: result.insertId, name, email, address, role };
    const token = signToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({ user });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const rows = await query(
      "SELECT id, name, email, address, role, password_hash FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];
    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    delete user.password_hash;
    const token = signToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ user });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function logout(req, res) {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
}

export async function changePassword(req, res) {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    const rows = await query("SELECT password_hash FROM users WHERE id = ?", [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const valid = await comparePassword(oldPassword, rows[0].password_hash);
    if (!valid) {
      return res.status(400).json({ message: "Old password incorrect" });
    }

    const newHash = await hashPassword(newPassword);
    await query("UPDATE users SET password_hash = ? WHERE id = ?", [newHash, userId]);

    res.json({ message: "Password updated" });
  } catch (err) {
    console.error("CHANGE PASSWORD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
}
