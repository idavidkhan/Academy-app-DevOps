const db = require("../models/db");
const fs = require("fs");
const path = require("path");

exports.getAllTeachers = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM teachers ORDER BY id DESC");
    console.log("Fetched teachers:", rows.map(t => ({ id: t.id, name: t.name, image: t.image })));
    res.json(rows);
  } catch (err) {
    console.error("Error fetching teachers:", err);
    res.status(500).json({ message: "Error fetching teachers", error: err.message });
  }
};

exports.getTeacherById = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM teachers WHERE id = ?", [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    console.log("Fetched teacher:", { id: rows[0].id, name: rows[0].name, image: rows[0].image });
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching teacher:", err);
    res.status(500).json({ message: "Error fetching teacher", error: err.message });
  }
};

exports.addTeacher = async (req, res) => {
  const { name, designation, bio, languages, specialties, linkedin, twitter, facebook, github } = req.body;
  const image = req.file ? `teachers/${req.file.filename}` : null;

  try {
    await db.query(
      "INSERT INTO teachers (name, designation, bio, languages, specialties, image, linkedin, twitter, facebook, github) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [name, designation, bio, languages, specialties, image, linkedin, twitter, facebook, github]
    );
    res.json({ message: "Teacher added successfully" });
  } catch (err) {
    console.error("Error inserting teacher:", err);
    res.status(500).json({ message: "Error adding teacher", error: err.message });
  }
};

exports.updateTeacher = async (req, res) => {
  const { name, designation, bio, languages, specialties, linkedin, twitter, facebook, github, existingImage } = req.body;
  const id = req.params.id;
  const image = req.file ? `teachers/${req.file.filename}` : (existingImage !== undefined ? existingImage : null);

  // Delete old image if new one is uploaded
  if (req.file && image) {
    const [[existing]] = await db.query("SELECT image FROM teachers WHERE id = ?", [id]);
    if (existing?.image) {
      const existingPath = path.join("uploads", existing.image);
      if (fs.existsSync(existingPath)) {
        fs.unlinkSync(existingPath);
      }
    }
  }

  console.log("Updating teacher ID:", id, "Image:", image, "Existing Image:", existingImage);

  const updateQuery = `
    UPDATE teachers SET 
      name = ?, designation = ?, bio = ?, languages = ?, specialties = ?,
      image = COALESCE(?, image), linkedin = ?, twitter = ?, facebook = ?, github = ?
    WHERE id = ?
  `;

  try {
    const [result] = await db.query(updateQuery, [
      name,
      designation,
      bio,
      languages,
      specialties,
      image,
      linkedin,
      twitter,
      facebook,
      github,
      id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.json({ message: "Teacher updated successfully" });
  } catch (err) {
    console.error("Error updating teacher:", err);
    res.status(500).json({ message: "Error updating teacher", error: err.message });
  }
};

exports.deleteTeacher = async (req, res) => {
  const id = req.params.id;
  try {
    const [[existing]] = await db.query("SELECT image FROM teachers WHERE id = ?", [id]);
    if (!existing) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    if (existing.image) {
      const filePath = path.join("uploads", existing.image);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    const [result] = await db.query("DELETE FROM teachers WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.json({ message: "Teacher deleted successfully" });
  } catch (err) {
    console.error("Error deleting teacher:", err);
    res.status(500).json({ message: "Error deleting teacher", error: err.message });
  }
};