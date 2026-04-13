const express = require("express");
const router = express.Router();
const registrationsController = require("../controllers/registrationsController");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/slips/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

router.get("/", registrationsController.authenticateToken, registrationsController.getAllRegistrations);
router.post("/", registrationsController.addRegistration);
router.post("/verify", registrationsController.verifyRegistration);
router.post("/upload-slip/:regId", upload.single("slip"), registrationsController.uploadSlip);
router.put("/:id", registrationsController.authenticateToken, registrationsController.updateRegistrationStatus);
router.get("/status/:email", registrationsController.getStatusByEmail);
router.get("/status/cnic-or-appid/:cnic?/:application_id?", registrationsController.getStatusByCnicOrAppId);

module.exports = router;