const db = require("../models/db");
const fs = require("fs");
const path = require("path");

// GET all certificates
exports.getCertificates = async (req, res) => {
    try {
        const [rows] = await db.query(`
      SELECT 
        cert.*, 
        r.name as student_name, 
        r.email as student_email,
        c.title as course_title
      FROM certificates cert
      JOIN registrations r ON cert.registration_id = r.id
      JOIN courses c ON cert.course_id = c.id
      ORDER BY cert.id DESC
    `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: "Failed to load certificates", error: err.message });
    }
};

// ADD certificate
exports.addCertificate = async (req, res) => {
    try {
        const { registration_id, course_id, certificate_code, issue_date } = req.body;
        const certFile = req.files?.certificate?.[0];

        if (!certFile) {
            return res.status(400).json({ message: "Certificate file is required" });
        }

        const filePath = `uploads/certificates/${certFile.filename}`;

        await db.query(
            "INSERT INTO certificates (registration_id, course_id, certificate_code, issue_date, file_path) VALUES (?, ?, ?, ?, ?)",
            [registration_id, course_id, certificate_code, issue_date, filePath]
        );

        res.status(201).json({ message: "Certificate issued successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to issue certificate", error: err.message });
    }
};

// DELETE certificate
exports.deleteCertificate = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query("SELECT file_path FROM certificates WHERE id = ?", [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Certificate not found" });
        }

        const { file_path } = rows[0];
        await db.query("DELETE FROM certificates WHERE id = ?", [id]);

        const fullPath = path.join(__dirname, "..", file_path);
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }

        res.json({ message: "Certificate deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete certificate", error: err.message });
    }
};

// GET certificate by registration ID (for students)
exports.getCertificateByRegistration = async (req, res) => {
    try {
        const { registrationId } = req.params;
        const [rows] = await db.query("SELECT * FROM certificates WHERE registration_id = ?", [registrationId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "No certificate found for this registration" });
        }

        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch certificate", error: err.message });
    }
};
