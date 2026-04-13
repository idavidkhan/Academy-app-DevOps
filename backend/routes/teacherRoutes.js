const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../uploads/teachers");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

const {
  getAllTeachers,
  getTeacherById,
  addTeacher,
  updateTeacher,
  deleteTeacher,
} = require("../controllers/teacherController");

router.get("/", getAllTeachers);
router.get("/:id", getTeacherById);
router.post("/", upload.single("image"), (req, res, next) => {
  console.log("POST /api/teachers received", req.body, req.file);
  next();
}, addTeacher);
router.put("/:id", upload.single("image"), (req, res, next) => {
  console.log("PUT /api/teachers/:id received", req.body, req.file);
  next();
}, updateTeacher);
router.delete("/:id", deleteTeacher);

module.exports = router;