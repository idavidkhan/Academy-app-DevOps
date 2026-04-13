const db = require("../models/db");

exports.getFaqs = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM faqs ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to load FAQs" });
  }
};

exports.addFaqs = async (req, res) => {
  const { question, answer } = req.body;
  if (!question || !answer) return res.status(400).json({ message: "All fields are required" });

  try {
    await db.query("INSERT INTO faqs (question, answer) VALUES (?, ?)", [question, answer]);
    res.status(201).json({ message: "FAQ added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to add FAQ" });
  }
};

exports.updateFaqs = async (req, res) => {
  const { question, answer } = req.body;
  const { id } = req.params;

  try {
    await db.query("UPDATE faqs SET question = ?, answer = ? WHERE id = ?", [question, answer, id]);
    res.json({ message: "FAQ updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update FAQ" });
  }
};

exports.deleteFaqs = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM faqs WHERE id = ?", [id]);
    res.json({ message: "FAQ deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete FAQ" });
  }
};
