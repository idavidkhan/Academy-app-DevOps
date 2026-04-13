const db = require("../models/db");
const fs = require("fs");

// GET all courses
exports.getCourses = async (req, res) => {
  try {
    const [courses] = await db.query(`
      SELECT 
        c.*, 
        t.name AS trainer_name, 
        t.image AS trainer_image
      FROM courses c
      LEFT JOIN teachers t ON c.trainer_id = t.id
      ORDER BY c.id DESC
    `);
    res.json(courses);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to load courses", error: err.message });
  }
};

// GET single course by ID
exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT * FROM courses WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch course", error: err.message });
  }
};

// ADD course
exports.addCourse = async (req, res) => {
  try {
    const {
      title,
      trainer_id,
      description,
      duration,
      fees,
      learning_outcomes,
    } = req.body;

    const imageFile = req.files?.image?.[0];
    if (!imageFile) {
      return res.status(400).json({ message: "Course image is required" });
    }

    const imagePath = `uploads/courses/${imageFile.filename}`;

    await db.query(
      `INSERT INTO courses 
        (title, image, trainer_id, description, duration, fees, learning_outcomes)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        imagePath,
        trainer_id || null,
        description,
        duration,
        fees,
        learning_outcomes,
      ]
    );

    res.status(201).json({ message: "Course added successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

// UPDATE course
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      trainer_id, // Use trainer_id instead of trainer_name
      description,
      duration,
      fees,
      learning_outcomes,
      existingImage,
    } = req.body;

    const [existingRows] = await db.query(
      "SELECT * FROM courses WHERE id = ?",
      [id]
    );
    if (existingRows.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    const existingCourse = existingRows[0];

    const imageFile = req.files?.image?.[0];
    let imagePath = existingImage ?? existingCourse.image;

    if (imageFile) {
      if (fs.existsSync(existingCourse.image)) {
        fs.unlinkSync(existingCourse.image);
      }
      imagePath = `uploads/courses/${imageFile.filename}`;
    }

    await db.query(
  `UPDATE courses SET 
    title = ?, 
    image = ?, 
    trainer_id = ?, 
    description = ?, 
    duration = ?, 
    fees = ?, 
    learning_outcomes = ?
   WHERE id = ?`,
  [
    title,
    imagePath,
    trainer_id,
    description,
    duration,
    fees,
    learning_outcomes,
    id,
  ]
);

    res.json({ message: "Course updated successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update course", error: err.message });
  }
};

// DELETE course
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query("SELECT image FROM courses WHERE id = ?", [
      id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    const { image } = rows[0];
    await db.query("DELETE FROM courses WHERE id = ?", [id]);

    if (fs.existsSync(image)) {
      fs.unlinkSync(image);
    }

    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete course", error: err.message });
  }
};
