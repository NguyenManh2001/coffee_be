const express = require("express");
const RegisterController = require("../controller/RegisterController ");
const {
  Login,
  listAcount,
  updateAcount,
  deleteAccount,
} = require("../controller/LoginController");
// const { Register } = require("../controller/RegisterController");
const router = express.Router();
// const fileUploader = require("../app/controllers/upload");

router.post("/register", RegisterController.Register);
router.post("/login", Login);
router.post("/listAccounts", listAcount);
router.put("/editAccount/:id", updateAcount);
router.delete("/deleteAccount/:id", deleteAccount);
// router.post('/ListMenu', Menu);
// router.post('/List', List);
// router.put('/EditMenu/:id2/:id1',fileUploader.single('link'), EditMenu);
// router.post('/editMenu/:id2/:id1', editMenu);
// router.delete('/deleteMenu/:id2/:id1', DeleteMenu);
module.exports = router;
