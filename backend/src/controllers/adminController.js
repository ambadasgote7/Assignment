import { query } from "../config/db.js";
import { hashPassword } from "../utils/password.js";

export async function getDashboardStats(req, res) {
  try {
    const users = await query("SELECT COUNT(*) AS c FROM users");
    const stores = await query("SELECT COUNT(*) AS c FROM stores");
    const ratings = await query("SELECT COUNT(*) AS c FROM ratings");
    res.json({
      totalUsers: users[0].c,
      totalStores: stores[0].c,
      totalRatings: ratings[0].c
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
}

export async function createUser(req, res) {
  try {
    const { name, email, address, password, role } = req.body;
    const allowedRoles = ["ADMIN", "USER", "OWNER"];
    const finalRole = allowedRoles.includes(role) ? role : "USER";

    const existing = await query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const password_hash = await hashPassword(password);

    const result = await query(
      "INSERT INTO users (name, email, address, password_hash, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, address, password_hash, finalRole]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      email,
      address,
      role: finalRole
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
}

export async function createStore(req, res) {
  try {
    const { name, email, address, ownerId } = req.body;

    let owner_id = null;
    if (ownerId) {
      const owner = await query(
        "SELECT id FROM users WHERE id = ? AND role = 'OWNER'",
        [ownerId]
      );
      if (owner.length === 0) {
        return res.status(400).json({ message: "Invalid owner id" });
      }
      owner_id = ownerId;
    }

    const result = await query(
      "INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)",
      [name, email, address, owner_id]
    );

    const storeRows = await query("SELECT * FROM stores WHERE id = ?", [
      result.insertId
    ]);

    res.status(201).json(storeRows[0]);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
}

export async function listUsers(req, res) {
  try {
    const { name, email, address, role, sortBy = "name", sortDir = "asc" } =
      req.query;

    const sortCols = ["name", "email", "role", "created_at"];
    const col = sortCols.includes(sortBy) ? sortBy : "name";
    const dir = sortDir === "desc" ? "DESC" : "ASC";

    let sql = "SELECT id, name, email, address, role FROM users WHERE 1=1";
    const params = [];

    if (name) {
      sql += " AND name LIKE ?";
      params.push(`%${name}%`);
    }
    if (email) {
      sql += " AND email LIKE ?";
      params.push(`%${email}%`);
    }
    if (address) {
      sql += " AND address LIKE ?";
      params.push(`%${address}%`);
    }
    if (role) {
      sql += " AND role = ?";
      params.push(role);
    }

    sql += ` ORDER BY ${col} ${dir}`;

    const rows = await query(sql, params);
    res.json(rows);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
}

export async function getUserDetails(req, res) {
  try {
    const id = Number(req.params.id);
    const users = await query(
      "SELECT id, name, email, address, role FROM users WHERE id = ?",
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];

    if (user.role === "OWNER") {
      const ratingRows = await query(
        `
        SELECT AVG(r.rating) AS avg_rating
        FROM stores s
        LEFT JOIN ratings r ON r.store_id = s.id
        WHERE s.owner_id = ?
      `,
        [id]
      );

      user.rating = ratingRows[0].avg_rating
        ? Number(ratingRows[0].avg_rating).toFixed(2)
        : null;
    }

    res.json(user);
  } catch {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function listStores(req, res) {
  try {
    const { name, email, address, sortBy = "name", sortDir = "asc" } = req.query;

    const sortCols = ["name", "email", "created_at"];
    const col = sortCols.includes(sortBy) ? sortBy : "name";
    const dir = sortDir === "desc" ? "DESC" : "ASC";

    let sql = `
      SELECT 
        s.id,
        s.name,
        s.email,
        s.address,
        COALESCE(AVG(r.rating), 0) AS avg_rating
      FROM stores s
      LEFT JOIN ratings r ON r.store_id = s.id
      WHERE 1=1
    `;

    const params = [];

    if (name) {
      sql += " AND s.name LIKE ?";
      params.push(`%${name}%`);
    }
    if (email) {
      sql += " AND s.email LIKE ?";
      params.push(`%${email}%`);
    }
    if (address) {
      sql += " AND s.address LIKE ?";
      params.push(`%${address}%`);
    }

    sql += `
      GROUP BY s.id
      ORDER BY s.${col} ${dir}
    `;

    const result = await query(sql, params);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
