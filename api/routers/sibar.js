const express = require("express");
const router = express.Router();
const multer = require("multer");
const checkAuth = require("../middleware/check_auth");
const fileUploader = require("../controller/upload");
const {
  addSibar,
  listSibar,
  updateSibar,
  deleteSibar,
} = require("../controller/SibarController");

router.post(
  "/addSibar",
  fileUploader.fields([{ name: "srcImage" }, { name: "iconImage" }]),
  addSibar
);
router.post("/listSibar", listSibar);
router.put(
  "/editSibar/:id",
  fileUploader.fields([{ name: "srcImage" }, { name: "iconImage" }]),
  updateSibar
);
router.delete("/deleteSibar/:id", deleteSibar);
module.exports = router;
