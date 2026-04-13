const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../uploads/certificates");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, `cert-${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage });

const certController = require("../controllers/certificateController");

router.get("/", certController.getCertificates);
router.post("/", upload.fields([{ name: "certificate", maxCount: 1 }]), certController.addCertificate);
router.delete("/:id", certController.deleteCertificate);
router.get("/registration/:registrationId", certController.getCertificateByRegistration);

module.exports = router;
