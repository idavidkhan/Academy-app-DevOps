
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../uploads/courses");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

const {
  getCourses,
  getCourseById,
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

router.get("/", getCourses);
router.get("/:id", getCourseById);

router.post(
  "/",
  upload.fields([{ name: "image", maxCount: 1 }]),
  addCourse
);

router.put(
  "/:id",
  upload.fields([{ name: "image", maxCount: 1 }]),
  updateCourse
);

router.delete("/:id", deleteCourse);

module.exports = router;