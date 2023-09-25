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

router.post("/addProduct", fileUploader.single("link"), addProduct);
router.post("/listProduct", listProduct);
router.put("/updateProduct/:id", fileUploader.single("link"), updateProduct);
// router.post("/editMenu/:id2/:id1", editMenu);
router.delete("/deleteProduct/:productId", deleteProduct);
module.exports = router;
