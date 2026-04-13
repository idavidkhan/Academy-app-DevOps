const pool = require("../models/db");

exports.getContactInfo = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM contact_info ORDER BY id ASC LIMIT 1");
    res.json(rows[0] || {});
  } catch (err) {
    console.error("Error in getContactInfo:", err);
    res.status(500).json({ error: "Failed to fetch contact info" });
  }
};

exports.addContactInfo = async (req, res) => {
  try {
    const {
      phone, email, support_email, office_name,
      address_line1, address_line2, city, country,
      working_days, weekend, map_location,
      facebook, linkedin, twitter, github
    } = req.body;

    await pool.query("DELETE FROM contact_info");

    const [result] = await pool.query(
      `INSERT INTO contact_info 
      (phone, email, support_email, office_name, address_line1, address_line2, city, country, working_days, weekend, map_location, facebook, linkedin, twitter, github) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [phone, email, support_email, office_name, address_line1, address_line2, city, country, working_days, weekend, map_location, facebook, linkedin, twitter, github]
    );

    res.status(201).json({ message: "Contact info added", id: result.insertId });
  } catch (err) {
    console.error("Error in addContactInfo:", err);
    res.status(500).json({ error: "Failed to add contact info" });
  }
};

exports.updateContactInfo = async (req, res) => {
  try {
    const {
      phone, email, support_email, office_name,
      address_line1, address_line2, city, country,
      working_days, weekend, map_location,
      facebook, linkedin, twitter, github
    } = req.body;

    const [result] = await pool.query(
      `UPDATE contact_info SET 
        phone = ?, email = ?, support_email = ?, office_name = ?, 
        address_line1 = ?, address_line2 = ?, city = ?, country = ?, 
        working_days = ?, weekend = ?, map_location = ?,
        facebook = ?, linkedin = ?, twitter = ?, github = ?
      WHERE id = ?`,
      [phone, email, support_email, office_name, address_line1, address_line2, city, country, working_days, weekend, map_location, facebook, linkedin, twitter, github, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Contact info not found" });
    }

    res.json({ message: "Contact info updated" });
  } catch (err) {
    console.error("Error in updateContactInfo:", err);
    res.status(500).json({ error: "Failed to update contact info" });
  }
};

exports.deleteContactInfo = async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM contact_info WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Contact info not found" });
    }
    res.json({ message: "Contact info deleted" });
  } catch (err) {
    console.error("Error in deleteContactInfo:", err);
    res.status(500).json({ error: "Failed to delete contact info" });
  }
};
