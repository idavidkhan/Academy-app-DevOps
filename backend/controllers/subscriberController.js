const db = require("../models/db");

exports.addSubscriber = async (req, res) => {
  const { email } = req.body;

  console.log("Received subscription request:", { email });

  if (!email || typeof email !== "string" || email.length > 191) {
    console.error("Validation failed:", { email, length: email?.length });
    return res.status(400).json({ message: "Invalid email format or length" });
  }

  const trimmedEmail = email.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    console.error("Invalid email format:", trimmedEmail);
    return res.status(400).json({ message: "Invalid email address" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO subscribers (email) VALUES (?)",
      [trimmedEmail]
    );
    console.log("Subscription successful:", {
      email: trimmedEmail,
      insertId: result.insertId,
    });
    res.status(201).json({ message: "Subscribed successfully" });
  } catch (error) {
    console.error("Database error in addSubscriber:", {
      code: error.code,
      message: error.message,
      sql: error.sql,
      sqlMessage: error.sqlMessage,
    });
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Email already subscribed" });
    }
    res
      .status(500)
      .json({ message: "Error saving subscriber", error: error.message });
  }
};

exports.getSubscribers = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM subscribers ORDER BY subscribed_at DESC"
    );
    console.log("Fetched subscribers:", rows);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Database error in getSubscribers:", {
      code: error.code,
      message: error.message,
      sql: error.sql,
      sqlMessage: error.sqlMessage,
    });
    res
      .status(500)
      .json({ message: "Error fetching subscribers", error: error.message });
  }
};

exports.deleteSubscriber = async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM subscribers WHERE id = ?", [
      req.params.id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Subscriber not found" });
    }
    console.log("Deleted subscriber with ID:", req.params.id);
    res.status(200).json({ message: "Subscriber deleted" });
  } catch (error) {
    console.error("Database error in deleteSubscriber:", {
      code: error.code,
      message: error.message,
    });
    res
      .status(500)
      .json({ message: "Error deleting subscriber", error: error.message });
  }
};
