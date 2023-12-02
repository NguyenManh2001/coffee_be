const express = require("express");
const router = express.Router();
const multer = require("multer");
const checkAuth = require("../middleware/check_auth");
const fileUploader = require("../controller/upload");
const {
  addDiscounted,
  listDiscounted,
  updateDiscounted,
  deleteDiscounted,
} = require("../controller/DiscountedController");

router.post("/addDiscounted", addDiscounted);
router.post("/listDiscounted", listDiscounted);
router.put("/editDiscounted/:discountedId", updateDiscounted);
// router.post("/editMenu/:id2/:id1", editMenu);
router.delete("/deleteDiscounted/:discountedId", deleteDiscounted);
module.exports = router;
