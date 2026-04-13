const db = require("../models/db");

// Submit message (works fine with callback if you're using non-promise client)
exports.submitMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const [result] = await db.query(
      `INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)`,
      [name, email, phone, subject, message]
    );

    res.status(200).json({ message: "Message submitted successfully!" });
  } catch (err) {
    console.error("Error submitting contact message:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get messages (use async/await here too)
exports.getMessages = async (req, res) => {
  try {
    const [results] = await db.query(
      `SELECT * FROM contact_messages ORDER BY id DESC`
    );
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete message
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("DELETE request received for ID:", id);

    const [result] = await db.query("DELETE FROM contact_messages WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.status(200).json({ message: "Message deleted successfully!" });
  } catch (err) {
    console.error("Error deleting message:", err);
    res.status(500).json({ error: "Server error" });
  }
};

