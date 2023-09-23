const express = require("express");
const router = express.Router();
const multer = require("multer");
const checkAuth = require("../middleware/check_auth");
const fileUploader = require("../controller/upload");

const {
  addProduct,
  listProduct,
  updateProduct,
  deleteProduct,
} = require("../controller/ProductController ");

router.post("/addMenu", fileUploader.single("link"), addProduct);
router.post("/ListMenu", listProduct);
router.put("/editMenu/:id", fileUploader.single("link"), updateProduct);
// router.post("/editMenu/:id2/:id1", editMenu);
router.delete("/deleteMenu/:productId", deleteProduct);
module.exports = router;
