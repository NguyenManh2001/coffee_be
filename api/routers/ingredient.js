const express = require("express");
const router = express.Router();
const multer = require("multer");
const checkAuth = require("../middleware/check_auth");
const fileUploader = require("../controller/upload");
const {
  addIngredient,
  listIngredient,
  updateIngredient,
  deleteIngredient,
} = require("../controller/IngredientController");

router.post("/addIngredient", addIngredient);
router.post("/listIngredient", listIngredient);
router.put("/editIngredient/:id", updateIngredient);
router.delete("/deleteIngredient/:id", deleteIngredient);
module.exports = router;
