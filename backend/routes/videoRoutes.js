const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const videoController = require("../controllers/videoController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "Uploads/videos"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

router.get("/video", videoController.getVideo);
router.get("/video/all", videoController.getAllVideos);
router.get("/video/:id", videoController.getVideoById);
router.post("/video", upload.single("thumbnail"), videoController.addVideo);
router.put(
  "/video/:id",
  upload.single("thumbnail"),
  videoController.updateVideo
);
router.delete("/video/:id", videoController.deleteVideo);

module.exports = router;
