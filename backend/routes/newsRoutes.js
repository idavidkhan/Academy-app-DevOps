const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../uploads/news");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

const {
  createNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews,
} = require("../controllers/newsController");

router.post("/", upload.single("image"), (req, res, next) => {
  console.log("POST /api/news received", req.body, req.file);
  next();
}, createNews);
router.get("/", (req, res, next) => {
  console.log("GET /api/news received");
  next();
}, getAllNews);
router.get("/:id", getNewsById);
router.put("/:id", upload.single("image"), (req, res, next) => {
  console.log("PUT /api/news/:id received", req.body, req.file);
  next();
}, updateNews);
router.delete("/:id", deleteNews);

module.exports = router;