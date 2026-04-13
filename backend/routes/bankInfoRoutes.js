const express = require("express");
const router = express.Router();
const bankInfoController = require("../controllers/bankInfoController");

router.get("/", bankInfoController.getBankInfo);
router.get("/all", bankInfoController.authenticateToken, bankInfoController.getAllBankInfo);
router.post("/", bankInfoController.authenticateToken, bankInfoController.addBankInfo);
router.put("/:BankID", bankInfoController.authenticateToken, bankInfoController.updateBankInfo);
router.delete("/:BankID", bankInfoController.authenticateToken, bankInfoController.deleteBankInfo);

module.exports = router;