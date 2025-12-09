import { query } from "../config/db.js";

export async function listStoresForUser(req, res) {
  try {
    const userId = req.user.id;
    const { name, address, sortBy = "name", sortDir = "asc" } = req.query;

    const sortCols = ["name", "created_at"];
    const col = sortCols.includes(sortBy) ? sortBy : "name";
    const dir = sortDir === "desc" ? "DESC" : "ASC";

    let sql = `
      SELECT
        s.id,
        s.name,
        s.address,
        COALESCE(AVG(r.rating), 0) AS overall_rating,
        ur.rating AS user_rating
      FROM stores s
      LEFT JOIN ratings r ON r.store_id = s.id
      LEFT JOIN ratings ur ON ur.store_id = s.id AND ur.user_id = ?
      WHERE 1=1
    `;

    const params = [userId];

    if (name) {
      sql += " AND s.name LIKE ?";
      params.push(`%${name}%`);
    }
    if (address) {
      sql += " AND s.address LIKE ?";
      params.push(`%${address}%`);
    }

    sql += `
      GROUP BY s.id, ur.rating
      ORDER BY ${col} ${dir}
    `;

    const result = await query(sql, params);
    res.json(result);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
}
