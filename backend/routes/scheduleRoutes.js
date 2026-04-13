const express = require("express");
const router = express.Router();
const {
  addSchedule,
  getAllSchedules,
  getSchedulesByCourse,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
} = require("../controllers/scheduleController");

router.post("/", addSchedule);
router.get("/", getAllSchedules);

// Specific route first
router.get("/by-course/:course_id", getSchedulesByCourse);

// Then dynamic ID-based routes
router.get("/:id", getScheduleById);
router.put("/:id", updateSchedule);
router.delete("/:id", deleteSchedule);

module.exports = router;
