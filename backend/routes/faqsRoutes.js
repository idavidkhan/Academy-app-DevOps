const express = require("express");
const router = express.Router();
const faqController = require("../controllers/faqsController");
const authMiddleware = require("../middleware/authMiddleware");

// Admin routes
router.post("/add", authMiddleware, faqController.addFaqs);
router.put("/:id", authMiddleware, faqController.updateFaqs);
router.delete("/:id", authMiddleware, faqController.deleteFaqs);

// Public route
router.get("/", faqController.getFaqs);

module.exports = router;
