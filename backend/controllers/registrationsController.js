const pool = require("../models/db");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    console.error("No token provided");
    return res.status(401).json({ error: "Access token required" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
    req.user = decoded;
    console.log("Authenticated user:", decoded);
    next();
  } catch (err) {
    console.error("Authentication error:", err.message);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

exports.getAllRegistrations = async (req, res) => {
  try {
    console.log("Fetching all registrations");
    const [rows] = await pool.query(`
      SELECT id, name, email, phone, cnic, application_id, skills, last_degree, course_id, course_title, slip, status
      FROM registrations
      ORDER BY id DESC
    `);
    console.log("Fetched registrations:", rows);
    return res.json(rows);
  } catch (err) {
    console.error("Get All Registrations Error:", err.message);
    return res.status(500).json({ error: "Failed to fetch registrations", details: err.message });
  }
};

exports.addRegistration = async (req, res) => {
  const { name, email, phone, cnic, skills, last_degree, course_id, course_title } = req.body;
  if (!name || !email || !phone || !cnic || !skills || !last_degree || !course_id || !course_title) {
    console.error("Missing required fields:", { name, email, phone, cnic, skills, last_degree, course_id, course_title });
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    console.log("Adding registration with data:", req.body);
    const [course] = await pool.query("SELECT title, trainer_name AS trainer, duration AS schedule, fees AS fee FROM courses WHERE id = ?", [course_id]);
    console.log("Course query result:", course);
    if (!course.length) {
      console.error("Course not found for course_id:", course_id);
      return res.status(404).json({ error: "Course not found" });
    }
    if (course[0].title.trim().toLowerCase() !== course_title.trim().toLowerCase()) {
      console.error("Course title mismatch:", { course_title, db_title: course[0].title });
      return res.status(400).json({ error: "Course title does not match course ID" });
    }
    let application_id, result;
    let success = false;
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const random = Math.floor(1000 + Math.random() * 9000);
        application_id = `REG-${date}-${random}`;
        console.log(`Generated application_id attempt ${attempt + 1}:`, application_id);

        [result] = await pool.query(
          "INSERT INTO registrations (name, email, phone, cnic, application_id, skills, last_degree, course_id, course_title, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Payment Pending')",
          [name, email, phone, cnic, application_id, skills, last_degree, course_id, course_title]
        );

        if (result.affectedRows > 0) {
          success = true;
          break;
        }
      } catch (insertErr) {
        if (insertErr.code === 'ER_DUP_ENTRY' && insertErr.message.includes('unique_application_id')) {
          console.warn(`Duplicate application_id ${application_id} detected on attempt ${attempt + 1}, retrying...`);
        } else {
          // Re-throw if it's not a duplicate application_id error (e.g. duplicate email/cnic which should be handled by 409 usually, but here it will hit the outer catch)
          throw insertErr;
        }
      }
    }

    if (!success) {
      throw new Error("Failed to generate unique application_id after 5 attempts");
    }

    console.log("Insert result:", result);
    return res.status(201).json({
      message: "Registration added successfully",
      regId: result.insertId,
      application_id: application_id,
      courseDetails: {
        title: course[0].title,
        trainer: course[0].trainer,
        schedule: course[0].schedule,
        fee: course[0].fee || "Not available"
      }
    });
  } catch (err) {
    console.error("Add Registration Error:", err.message);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: "Email or CNIC already registered for this course" });
    }
    return res.status(500).json({ error: "Failed to add registration", details: err.message });
  }
};

exports.verifyRegistration = async (req, res) => {
  const { cnic, application_id } = req.body;
  if (!cnic && !application_id) {
    console.error("CNIC or Application ID required");
    return res.status(400).json({ error: "CNIC or Application ID required" });
  }
  try {
    console.log("Verifying registration with:", { cnic, application_id });
    const [rows] = await pool.query(
      "SELECT id, name, email, course_id, course_title, application_id, status FROM registrations WHERE cnic = ? OR application_id = ?",
      [cnic || null, application_id || null]
    );
    if (rows.length === 0) {
      console.log("No registration found for CNIC or Application ID");
      return res.status(404).json({ error: "No registration found" });
    }
    return res.json(rows[0]);
  } catch (err) {
    console.error("Verify Registration Error:", err.message);
    return res.status(500).json({ error: "Failed to verify registration", details: err.message });
  }
};

exports.uploadSlip = async (req, res) => {
  const { regId } = req.params;
  if (!req.file) {
    console.error("No file uploaded");
    return res.status(400).json({ error: "No file uploaded" });
  }
  try {
    console.log("Uploading slip for registration:", regId, req.file.filename);
    const [result] = await pool.query(
      "UPDATE registrations SET slip = ?, status = 'Pending' WHERE id = ?",
      [req.file.filename, regId]
    );
    if (result.affectedRows === 0) {
      console.log("Registration not found for ID:", regId);
      return res.status(404).json({ error: "Registration not found" });
    }
    console.log("Slip uploaded, ID:", regId);
    return res.json({ message: "Slip uploaded successfully" });
  } catch (err) {
    console.error("Upload Slip Error:", err.message);
    return res.status(500).json({ error: "Failed to upload slip", details: err.message });
  }
};

exports.updateRegistrationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!status || !["Payment Pending", "Pending", "Verified", "Rejected"].includes(status)) {
    console.error("Invalid status");
    return res.status(400).json({ error: "Invalid status" });
  }
  try {
    console.log("Updating registration status:", id, status);
    const [result] = await pool.query(
      "UPDATE registrations SET status = ? WHERE id = ?",
      [status, id]
    );
    if (result.affectedRows === 0) {
      console.log("Registration not found for ID:", id);
      return res.status(404).json({ error: "Registration not found" });
    }
    console.log("Registration status updated, ID:", id);
    return res.json({ message: "Status updated successfully" });
  } catch (err) {
    console.error("Update Registration Status Error:", err.message);
    return res.status(500).json({ error: "Failed to update status", details: err.message });
  }
};

exports.getStatusByEmail = async (req, res) => {
  const { email } = req.params;
  if (!email) {
    console.error("Email parameter is missing");
    return res.status(400).json({ error: "Email is required" });
  }
  try {
    console.log("Fetching status for email:", email);
    const [rows] = await pool.query(
      `SELECT 
        r.id, r.course_id, r.course_title, r.application_id, r.status,
        COALESCE(t.name, c.trainer_name) AS trainer, c.duration AS course_duration, c.fees AS fee,
        cs.venue AS venue, cs.timing AS timing,
        cert.file_path AS certificate_path, cert.issue_date AS certificate_issue_date,
        CONCAT(DATEDIFF(cs.end_date, cs.start_date), ' Days (',
               ROUND(TIME_TO_SEC(TIMEDIFF(cs.end_date, cs.start_date)) / 3600), ' Hours)') AS schedule_duration
      FROM registrations r
      LEFT JOIN courses c ON r.course_id = c.id
      LEFT JOIN course_schedules cs ON r.course_id = cs.course_id
      LEFT JOIN teachers t ON c.trainer_id = t.id
      LEFT JOIN certificates cert ON r.id = cert.registration_id
      WHERE r.email = ?
      ORDER BY r.id DESC
      LIMIT 1`,
      [email]
    );
    console.log("Fetched status:", rows);
    rows.forEach(row => {
      row.duration = row.course_duration || row.schedule_duration || "Not specified";
      delete row.course_duration;
      delete row.schedule_duration;
    });
    return res.json(rows);
  } catch (err) {
    console.error("Get Status Error:", err.message);
    return res.status(500).json({ error: "Failed to fetch status", details: err.message });
  }
};

exports.getStatusByCnicOrAppId = async (req, res) => {
  const { cnic, application_id } = req.params;
  if (!cnic && !application_id) {
    console.error("CNIC or Application ID required");
    return res.status(400).json({ error: "CNIC or Application ID required" });
  }
  try {
    console.log("Fetching status for:", { cnic, application_id });
    const [rows] = await pool.query(
      `SELECT 
        r.id, r.course_id, r.course_title, r.application_id, r.status,
        COALESCE(t.name, c.trainer_name) AS trainer, c.duration AS course_duration, c.fees AS fee,
        cs.venue AS venue, cs.timing AS timing,
        cert.file_path AS certificate_path, cert.issue_date AS certificate_issue_date,
        CONCAT(DATEDIFF(cs.end_date, cs.start_date), ' Days (',
               ROUND(TIME_TO_SEC(TIMEDIFF(cs.end_date, cs.start_date)) / 3600), ' Hours)') AS schedule_duration
      FROM registrations r
      LEFT JOIN courses c ON r.course_id = c.id
      LEFT JOIN course_schedules cs ON r.course_id = cs.course_id
      LEFT JOIN teachers t ON c.trainer_id = t.id
      LEFT JOIN certificates cert ON r.id = cert.registration_id
      WHERE r.cnic = ? OR r.application_id = ?
      ORDER BY r.id DESC
      LIMIT 1`,
      [cnic || null, application_id || null]
    );
    console.log("Fetched status:", rows);
    if (rows.length === 0) {
      return res.status(404).json({ error: "No registration found" });
    }
    rows.forEach(row => {
      row.duration = row.course_duration || row.schedule_duration || "Not specified";
      delete row.course_duration;
      delete row.schedule_duration;
    });
    return res.json(rows);
  } catch (err) {
    console.error("Get Status Error:", err.message);
    return res.status(500).json({ error: "Failed to fetch status", details: err.message });
  }
};

exports.authenticateToken = authenticateToken;