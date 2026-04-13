const express = require("express");
const router = express.Router();
const {
  addSubscriber,
  getSubscribers,
  deleteSubscriber,
} = require("../controllers/subscriberController");

router.post("/", addSubscriber);
router.get("/", getSubscribers);
router.delete("/:id", deleteSubscriber);

module.exports = router;
