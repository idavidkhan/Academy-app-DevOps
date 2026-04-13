const express = require("express");
const router = express.Router();
const contactFormController = require("../controllers/contactFormController");

// Submit contact form
router.post("/contact-form", contactFormController.submitMessage);

// Get all contact messages
router.get("/contact-form", contactFormController.getMessages);

router.delete("/contact-form/:id", contactFormController.deleteMessage);


module.exports = router;
