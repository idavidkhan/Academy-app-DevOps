const cron = require("node-cron");
const db = require("../models/db");

cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();

    const [expiredCourses] = await db.query(`
      SELECT c.id
      FROM courses c
      LEFT JOIN course_schedules cs ON c.id = cs.course_id
      GROUP BY c.id
      HAVING MAX(cs.end_date) < ?
    `, [now]);

    const expiredIds = expiredCourses.map(row => row.id);

    if (expiredIds.length > 0) {
      await db.query("DELETE FROM course_schedules WHERE course_id IN (?)", [expiredIds]);
      await db.query("DELETE FROM courses WHERE id IN (?)", [expiredIds]);
      console.log("🗑️ Deleted expired courses:", expiredIds);
    } else {
      console.log("✅ No expired courses to delete.");
    }
  } catch (error) {
    console.error("❌ Cron job error:", error.message);
  }
});
