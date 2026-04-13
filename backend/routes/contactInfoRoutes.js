const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactInfoController");

router.get("/", contactController.getContactInfo);
router.post("/", contactController.addContactInfo);
router.put("/:id", contactController.updateContactInfo);
router.delete("/:id", contactController.deleteContactInfo);

module.exports = router;