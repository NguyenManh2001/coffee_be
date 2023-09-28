const express = require("express");
const PaymentController = require("../controller/PaymentController");
const router = express.Router();

router.post("/create_payment", PaymentController.createPayment);
module.exports = router;
