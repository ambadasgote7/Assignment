import { query } from "../config/db.js";

export async function getOwnerDashboard(req, res) {
  try {
    const ownerId = req.user.id;

    const stores = await query(
      `
      SELECT 
        s.id,
        s.name,
        s.address,
        COALESCE(AVG(r.rating), 0) AS avg_rating
      FROM stores s
      LEFT JOIN ratings r ON r.store_id = s.id
      WHERE s.owner_id = ?
      GROUP BY s.id
    `,
      [ownerId]
    );

    const ratings = await query(
      `
      SELECT
        s.id AS store_id,
        s.name AS store_name,
        u.id AS user_id,
        u.name AS user_name,
        u.email AS user_email,
        r.rating,
        r.created_at
      FROM stores s
      JOIN ratings r ON r.store_id = s.id
      JOIN users u ON u.id = r.user_id
      WHERE s.owner_id = ?
      ORDER BY s.id, r.created_at DESC
    `,
      [ownerId]
    );

    res.json({ stores, ratings });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
}
