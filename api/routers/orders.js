const express = require("express");
const router = express.Router();
// const fileUploader = require("../app/controllers/upload");
const {
  listOrder,
  deleteOrder,
  // updateOrder,
  addOrder,
} = require("../controller/OrderController");

router.post("/listOrder", listOrder);
router.post("/addOrder", addOrder);
router.delete("/deleteOrder/:id", deleteOrder);
module.exports = router;
