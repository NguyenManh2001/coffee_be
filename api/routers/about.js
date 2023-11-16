const express = require("express");
const router = express.Router();
const multer = require("multer");
const checkAuth = require("../middleware/check_auth");
const fileUploader = require("../controller/upload");

const {
  addAbouts,
  listAbouts,
  updateAbouts,
  deleteAbouts,
} = require("../controller/AboutsController");

router.post("/addAbouts", fileUploader.single("image"), addAbouts);
router.post("/listAbouts", listAbouts);
router.put("/editAbouts/:id", fileUploader.single("image"), updateAbouts);
router.delete("/deleteAbouts/:id", deleteAbouts);
module.exports = router;
