const pool = require("../models/db");
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    console.error("No token provided");
    return res.status(401).json({ error: "Access token required" });
  }
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret"
    );
    req.user = decoded;
    console.log("Authenticated user:", decoded);
    next();
  } catch (err) {
    console.error("Authentication error:", err.message);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

exports.getBankInfo = async (req, res) => {
  try {
    console.log("Fetching latest bank info");
    const [rows] = await pool.query(
      "SELECT * FROM bank_info ORDER BY BankID DESC LIMIT 1"
    );
    if (!rows.length) {
      console.log("No bank info found");
      return res.status(404).json({ error: "No bank info found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Get Bank Info Error:", err.message);
    res
      .status(500)
      .json({ error: "Failed to fetch bank info", details: err.message });
  }
};

exports.getAllBankInfo = async (req, res) => {
  try {
    console.log("Fetching all bank info");
    const [rows] = await pool.query(
      "SELECT * FROM bank_info ORDER BY BankID DESC"
    );
    console.log("Fetched bank info:", rows);
    res.json(rows);
  } catch (err) {
    console.error("Get All Bank Info Error:", err.message);
    res
      .status(500)
      .json({ error: "Failed to fetch bank info", details: err.message });
  }
};

exports.addBankInfo = async (req, res) => {
  const {
    bank_name,
    account_title,
    account_number,
    iban,
    branch_code,
    branch_address,
  } = req.body;
  if (
    !bank_name ||
    !account_title ||
    !account_number ||
    !iban ||
    !branch_code ||
    !branch_address
  ) {
    console.error("Missing required fields");
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    console.log("Adding bank info:", req.body);
    const [result] = await pool.query(
      "INSERT INTO bank_info (bank_name, account_title, account_number, iban, branch_code, branch_address) VALUES (?, ?, ?, ?, ?, ?)",
      [
        bank_name,
        account_title,
        account_number,
        iban,
        branch_code,
        branch_address,
      ]
    );
    res
      .status(201)
      .json({
        message: "Bank info added successfully",
        BankID: result.insertId,
      });
  } catch (err) {
    console.error("Add Bank Info Error:", err.message);
    res
      .status(500)
      .json({ error: "Failed to add bank info", details: err.message });
  }
};

exports.updateBankInfo = async (req, res) => {
  const { BankID } = req.params;
  const {
    bank_name,
    account_title,
    account_number,
    iban,
    branch_code,
    branch_address,
  } = req.body;
  if (
    !bank_name ||
    !account_title ||
    !account_number ||
    !iban ||
    !branch_code ||
    !branch_address
  ) {
    console.error("Missing required fields for update");
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    console.log("Updating bank info:", BankID, req.body);
    const [result] = await pool.query(
      "UPDATE bank_info SET bank_name=?, account_title=?, account_number=?, iban=?, branch_code=?, branch_address=? WHERE BankID=?",
      [
        bank_name,
        account_title,
        account_number,
        iban,
        branch_code,
        branch_address,
        BankID,
      ]
    );
    if (result.affectedRows === 0) {
      console.log("Bank info not found for BankID:", BankID);
      return res.status(404).json({ error: "Bank info not found" });
    }
    res.json({ message: "Bank info updated successfully" });
  } catch (err) {
    console.error("Update Bank Info Error:", err.message);
    res
      .status(500)
      .json({ error: "Failed to update bank info", details: err.message });
  }
};

exports.deleteBankInfo = async (req, res) => {
  const { BankID } = req.params;
  try {
    console.log("Deleting bank info:", BankID);
    const [result] = await pool.query("DELETE FROM bank_info WHERE BankID=?", [
      BankID,
    ]);
    if (result.affectedRows === 0) {
      console.log("Bank info not found for BankID:", BankID);
      return res.status(404).json({ error: "Bank info not found" });
    }
    res.json({ message: "Bank info deleted successfully" });
  } catch (err) {
    console.error("Delete Bank Info Error:", err.message);
    res
      .status(500)
      .json({ error: "Failed to delete bank info", details: err.message });
  }
};

exports.authenticateToken = authenticateToken;
