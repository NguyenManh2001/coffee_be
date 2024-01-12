const express = require("express");
const router = express.Router();
const multer = require("multer");
const checkAuth = require("../middleware/check_auth");
const fileUploader = require("../controller/upload");
const {
  addTopping,
  listTopping,
  updateTopping,
  deleteTopping,
} = require("../controller/ToppingController");

router.post("/addTopping", addTopping);
router.post("/listTopping", listTopping);
router.put("/editTopping/:id", updateTopping);
router.delete("/deleteTopping/:id", deleteTopping);
module.exports = router;
