const express = require("express");
const router = express.Router();
const multer = require("multer");
const checkAuth = require("../middleware/check_auth");
const fileUploader = require("../controller/upload");
const {
  addMenu,
  listMenu,
  updateMenu,
  deleteMenu,
} = require("../controller/MenuController");

router.post("/addMenu", fileUploader.single("image"), addMenu);
router.post("/listMenu", listMenu);
router.put("/editMenu/:id", fileUploader.single("image"), updateMenu);
router.delete("/deleteMenu/:id", deleteMenu);
module.exports = router;
