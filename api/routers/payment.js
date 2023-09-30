const express = require("express");
const {
  createPayment,
  vnpayReturn,
  vnpayIpn,
} = require("../controller/PaymentController");

const router = express.Router();

router.post("/create_payment", createPayment);
router.get("/vnpay_return", vnpayReturn);
router.get("/vnpay_ipn", vnpayIpn);
module.exports = router;
