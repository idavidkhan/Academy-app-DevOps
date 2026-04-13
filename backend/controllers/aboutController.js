// controllers/aboutController.js
const db = require("../models/db");
const fs = require("fs");
const path = require("path");

// Get all about data
exports.getAbout = async (req, res) => {
  try {
    const [data] = await db.query("SELECT * FROM about ORDER BY id DESC");
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching about data", err });
  }
};

// Add entry
exports.addAbout = async (req, res) => {
  const {
    section,
    card_heading,
    card_paragraph,
    trainer_name,
    title,
    quote,
    bio,
  } = req.body;

  const image = req.file ? `/uploads/about/${req.file.filename}` : null;

  try {
    await db.query(
      `INSERT INTO about 
      (section, card_heading, card_paragraph, trainer_name, title, quote, bio, image) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        section,
        card_heading,
        card_paragraph,
        trainer_name,
        title,
        quote,
        bio,
        image,
      ]
    );
    res.status(201).json({ message: "About entry added" });
  } catch (err) {
    res.status(500).json({ message: "Error adding entry", err });
  }
};

// Update by ID
exports.updateAbout = async (req, res) => {
  const { id } = req.params;
  const {
    section,
    card_heading,
    card_paragraph,
    trainer_name,
    title,
    quote,
    bio,
  } = req.body;

  let image;
  if (req.file) {
    image = `/uploads/about/${req.file.filename}`;
    const [oldData] = await db.query("SELECT image FROM about WHERE id = ?", [
      id,
    ]);
    if (oldData[0]?.image) {
      fs.unlink(path.join(__dirname, "..", oldData[0].image), () => {});
    }
  }

  try {
    await db.query(
      `UPDATE about SET 
      section=?, card_heading=?, card_paragraph=?, trainer_name=?, title=?, quote=?, bio=?, image=IFNULL(?, image)
      WHERE id=?`,
      [
        section,
        card_heading,
        card_paragraph,
        trainer_name,
        title,
        quote,
        bio,
        image,
        id,
      ]
    );
    res.json({ message: "About updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Update failed", err });
  }
};

// ✅ Update by section name (for mission, vision, why, custom, founder)
exports.updateBySection = async (req, res) => {
  const { section } = req.params;
  const { card_heading, card_paragraph, trainer_name, title, quote, bio } =
    req.body;

  let image;
  if (req.file) {
    image = `/uploads/about/${req.file.filename}`;
    const [old] = await db.query(
      "SELECT image FROM about WHERE section = ? LIMIT 1",
      [section]
    );
    if (old[0]?.image) {
      fs.unlink(path.join(__dirname, "..", old[0].image), () => {});
    }
  }

  try {
    const [existing] = await db.query(
      "SELECT id FROM about WHERE section = ?",
      [section]
    );

    if (existing.length > 0) {
      await db.query(
        `UPDATE about SET 
          card_heading = ?, 
          card_paragraph = ?, 
          trainer_name = ?, 
          title = ?, 
          quote = ?, 
          bio = ?, 
          image = IFNULL(?, image)
        WHERE section = ?`,
        [
          card_heading,
          card_paragraph,
          trainer_name,
          title,
          quote,
          bio,
          image,
          section,
        ]
      );
      res.json({ message: `Section '${section}' updated.` });
    } else {
      await db.query(
        `INSERT INTO about 
        (section, card_heading, card_paragraph, trainer_name, title, quote, bio, image) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          section,
          card_heading,
          card_paragraph,
          trainer_name,
          title,
          quote,
          bio,
          image,
        ]
      );
      res.status(201).json({ message: `Section '${section}' created.` });
    }
  } catch (err) {
    res.status(500).json({ message: "Update by section failed", err });
  }
};

// Delete
exports.deleteAbout = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT image FROM about WHERE id = ?", [id]);
    if (rows[0]?.image) {
      fs.unlink(path.join(__dirname, "..", rows[0].image), () => {});
    }
    await db.query("DELETE FROM about WHERE id = ?", [id]);
    res.json({ message: "About entry deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", err });
  }
};

// for unique founder
exports.updateFounderById = async (req, res) => {
  const { id } = req.params;
  const { trainer_name, title, quote, bio } = req.body;

  let image;
  if (req.file) {
    image = `/uploads/about/${req.file.filename}`;
    const [old] = await db.query("SELECT image FROM about WHERE id = ?", [id]);
    if (old[0]?.image) {
      fs.unlink(path.join(__dirname, "..", old[0].image), () => {});
    }
  }

  try {
    await db.query(
      `UPDATE about SET 
        trainer_name = ?, 
        title = ?, 
        quote = ?, 
        bio = ?, 
        image = IFNULL(?, image)
      WHERE id = ? AND section = 'founder'`,
      [trainer_name, title, quote, bio, image, id]
    );
    res.json({ message: `Founder with ID ${id} updated.` });
  } catch (err) {
    res.status(500).json({ message: "Failed to update founder", err });
  }
};





// Get a single about entry by ID
exports.getAboutById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM about WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Entry not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Error fetching entry", err });
  }
};
