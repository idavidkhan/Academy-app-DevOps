// routes/aboutRoutes.js
const express = require("express");
const router = express.Router();
const aboutController = require("../controllers/aboutController");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/about");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.get("/", aboutController.getAbout);
router.get("/:id", aboutController.getAboutById); // for specific id
router.post("/", upload.single("image"), aboutController.addAbout);
router.put(
  "/section/:section",
  upload.single("image"),
  aboutController.updateBySection
);
router.put("/:id", upload.single("image"), aboutController.updateAbout);
router.delete("/:id", aboutController.deleteAbout);
router.put("/founder/:id", upload.single("image"), aboutController.updateFounderById); // uniqule identify the founder



module.exports = router;
