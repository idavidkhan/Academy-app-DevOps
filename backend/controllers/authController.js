const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models/db"); 
exports.login = async (req, res) => {
  const { username, password } = req.body;
  console.log("📩 Login attempt:", { username, password });

  try {
    const [rows] = await db.query("SELECT * FROM admins WHERE username = ?", [
      username,
    ]);

    if (rows.length === 0) {
      console.log("❌ Admin not found");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];

    console.log("🧠 Username found:", user.username);
    console.log("🔐 Input password:", password);
    console.log("🔐 DB hashed password:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔍 bcrypt result:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || "mysecret",
      {
        expiresIn: "1h",
      }
    );

    console.log("✅ Login successful, token generated.");
    return res.json({ token });
  } catch (err) {
    console.error("🔥 Server error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
