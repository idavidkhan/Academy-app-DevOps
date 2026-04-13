const db = require("../models/db");

// CREATE news
exports.createNews = async (req, res) => {
  const {
    author,
    category,
    title,
    title_tag,
    duration,
    meta_description,
    content,
    written_by,
  } = req.body;

  const image = req.file ? req.file.filename : null;

  const query = `
    INSERT INTO news 
    (author, category, title, title_tag, duration, meta_description, content, written_by, image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    await db.query(query, [
      author,
      category,
      title,
      title_tag,
      duration,
      meta_description,
      content,
      written_by,
      image,
    ]);
    res.status(201).json({ message: "News created successfully" });
  } catch (err) {
    console.error("Error inserting news:", err);
    res.status(500).json({ error: "Failed to insert news", details: err.message });
  }
};

// GET all news
exports.getAllNews = async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM news ORDER BY created_at DESC");
    console.log("Fetched news:", results.map(item => ({ id: item.id, title: item.title, image: item.image }))); // Debug
    res.json(results);
  } catch (err) {
    console.error("Error fetching news:", err);
    res.status(500).json({ error: "Failed to fetch news", details: err.message });
  }
};

// GET single news
exports.getNewsById = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("SELECT * FROM news WHERE id = ?", [id]);
    if (result.length === 0) {
      return res.status(404).json({ error: "News not found" });
    }
    console.log("Fetched news by ID:", { id: result[0].id, title: result[0].title, image: result[0].image }); // Debug
    res.json(result[0]);
  } catch (err) {
    console.error("Error fetching news by ID:", err);
    res.status(500).json({ error: "Failed to fetch news", details: err.message });
  }
};

// UPDATE news
exports.updateNews = async (req, res) => {
  const { id } = req.params;
  const {
    author,
    category,
    title,
    title_tag,
    duration,
    meta_description,
    content,
    written_by,
    existingImage,
  } = req.body;

  const image = req.file ? req.file.filename : (existingImage !== undefined ? existingImage : null);

  console.log("Updating news ID:", id, "Image:", image, "Existing Image:", existingImage); // Debug

  const query = `
    UPDATE news SET 
      author = ?, category = ?, title = ?, title_tag = ?, 
      duration = ?, meta_description = ?, content = ?, 
      written_by = ?, image = ? WHERE id = ?
  `;

  try {
    const [result] = await db.query(query, [
      author,
      category,
      title,
      title_tag,
      duration,
      meta_description,
      content,
      written_by,
      image,
      id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "News not found" });
    }
    res.json({ message: "News updated successfully" });
  } catch (err) {
    console.error("Error updating news:", err);
    res.status(500).json({ error: "Failed to update news", details: err.message });
  }
};

// DELETE news
exports.deleteNews = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM news WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "News not found" });
    }
    res.json({ message: "News deleted successfully" });
  } catch (err) {
    console.error("Error deleting news:", err);
    res.status(500).json({ error: "Failed to delete news", details: err.message });
  }
};