const AccountModel = require("../modules/account");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
class RegisterController {
  //post
  async Register(req, res, next) {
    try {
      const email = req.body.email;
      const password = req.body.password;
      const role = req.body.role || 0;

      const existingUser = await AccountModel.findOne({ email: email });

      if (existingUser) {
        return res.status(409).json({
          message: "Mail exists",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new AccountModel({
        _id: new mongoose.Types.ObjectId(),
        email: email,
        password: hashedPassword,
        role: role,
      });

      const result = await newUser.save();

      res.status(200).json({
        message: "Đăng ký thành công",
        result: result,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: err,
      });
    }
  }
}

module.exports = new RegisterController();
