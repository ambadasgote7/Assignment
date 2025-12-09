import { query } from "../config/db.js";

export async function submitRating(req, res) {
  try {
    const userId = req.user.id;
    const { storeId, rating } = req.body;
    const numRating = Number(rating);

    if (!Number.isInteger(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const storeExists = await query("SELECT id FROM stores WHERE id = ?", [
      storeId
    ]);
    if (storeExists.length === 0) {
      return res.status(404).json({ message: "Store not found" });
    }

    const existing = await query(
      "SELECT id FROM ratings WHERE user_id = ? AND store_id = ?",
      [userId, storeId]
    );

    if (existing.length > 0) {
      await query("UPDATE ratings SET rating = ? WHERE id = ?", [
        numRating,
        existing[0].id
      ]);
      return res.json({ message: "Rating updated" });
    }

    await query(
      "INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)",
      [userId, storeId, numRating]
    );

    res.status(201).json({ message: "Rating submitted" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
}
