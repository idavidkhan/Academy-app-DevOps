const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");

async function createAdmin() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "", 
    database: "trescoldb",
  });

  const username = "admin";
  const plainPassword = "admin1234";
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  await connection.execute(
    "INSERT INTO admins (username, password) VALUES (?, ?)",
    [username, hashedPassword]
  );

  console.log("✅ Admin user created: username = admin, password = admin1234");
  await connection.end();
}

createAdmin().catch(console.error);
