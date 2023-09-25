const express = require("express");
const router = express.Router();
const multer = require("multer");
const checkAuth = require("../middleware/check_auth");
const fileUploader = require("../controller/upload");

const {
  addNews,
  listNews,
  updateNews,
  deleteNews,
} = require("../controller/NewsController");

router.post("/addNews", fileUploader.single("image"), addNews);
router.post("/listNews", listNews);
router.put("/editNews/:id", fileUploader.single("image"), updateNews);
// router.post("/editMenu/:id2/:id1", editMenu);
router.delete("/deleteNews/:newsId", deleteNews);
module.exports = router;
