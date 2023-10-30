const express = require("express");
const router = express.Router();
// const fileUploader = require("../app/controllers/upload");
const {
  listCustomer,
  deleteCustomer,
  updateCustomer,
  addCustomer,
} = require("../controller/CustomerController");

router.get("/listCustomer", listCustomer);
router.post("/addCustomer", addCustomer);
router.put("/updateCustomer/:id", updateCustomer);
router.delete("/deleteCustomer/:id", deleteCustomer);
// router.post('/ListMenu', Menu);
// router.post('/List', List);
// router.put('/EditMenu/:id2/:id1',fileUploader.single('link'), EditMenu);
// router.post('/editMenu/:id2/:id1', editMenu);
// router.delete('/deleteMenu/:id2/:id1', DeleteMenu);
module.exports = router;
