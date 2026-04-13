const db = require("../models/db");

// POST: Add new schedule
exports.addSchedule = async (req, res) => {
  try {
    const { course_id, start_date, end_date, venue, timing } = req.body;

    if (!course_id || !start_date || !end_date || !venue || !timing) {
      return res.status(400).json({ message: "All fields are required." });
    }

    await db.query(
      `INSERT INTO course_schedules 
        (course_id, start_date, end_date, venue, timing)
        VALUES (?, ?, ?, ?, ?)`,
      [course_id, start_date, end_date, venue, timing]
    );

    res.status(201).json({ message: "Schedule created successfully" });
  } catch (err) {
    console.error("Add Schedule Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET: All schedules (optional)
exports.getAllSchedules = async (req, res) => {
  try {
    const [schedules] = await db.query(
      `SELECT cs.*, c.title 
       FROM course_schedules cs 
       JOIN courses c ON cs.course_id = c.id`
    );
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch schedules", error: err.message });
  }
};

// GET: Schedules by course (optional)
exports.getSchedulesByCourse = async (req, res) => {
  try {
    const { course_id } = req.params;
    const [schedules] = await db.query(
      `SELECT * FROM course_schedules WHERE course_id = ?`,
      [course_id]
    );
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ message: "Error fetching course schedules", error: err.message });
  }
};


// GET: Single schedule by ID
exports.getScheduleById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      `SELECT * FROM course_schedules WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch schedule", error: err.message });
  }
};



// PUT: Update schedule
exports.updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { course_id, start_date, end_date, venue, timing } = req.body;

    await db.query(
      `UPDATE course_schedules 
       SET course_id = ?, start_date = ?, end_date = ?, venue = ?, timing = ?
       WHERE id = ?`,
      [course_id, start_date, end_date, venue, timing, id]
    );

    res.json({ message: "Schedule updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update schedule", error: err.message });
  }
};

// DELETE: Delete schedule
exports.deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(`DELETE FROM course_schedules WHERE id = ?`, [id]);
    res.json({ message: "Schedule deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete schedule", error: err.message });
  }
};

