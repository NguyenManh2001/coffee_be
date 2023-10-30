const AccountModel = require("../modules/account");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
class RegisterController {
  //post
  Register(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role || 0;
    AccountModel.find({ email: email }).then((data) => {
      if (data.length > 0) {
        return res.status(409).json({
          message: "Mail exists",
        });
      } else {
        bcrypt.hash(password, 10, function (err, hash) {
          if (err) {
            res.status(500).json({
              error: err,
            });
          } else {
            const users = new AccountModel({
              _id: new mongoose.Types.ObjectId(),
              email: email,
              password: hash,
              role: role,
            });
            users
              .save()
              .then((result) => {
                res.status(200).json({
                  message: "Đăng ký thành công",
                  result: result,
                });
              })
              .catch((err) => {
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    });
  }
}

module.exports = new RegisterController();
