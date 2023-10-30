const AccountModel = require("../modules/account");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
class LoginController {
  //post
  Login(req, res, next) {
    AccountModel.find({ email: req.body.email })
      .exec()
      .then((user) => {
        if (user.length < 1) {
          return res.status(404).json({
            message: "Auth faled",
          });
        } else {
          bcrypt.compare(
            req.body.password,
            user[0].password,
            function (err, result) {
              if (err) {
                return res.status(404).json({
                  message: "Auth faled",
                });
              }
              if (result) {
                console.log(process.env.JWT_KEY);
                const token = jwt.sign(
                  {
                    email: user[0].email,
                    role: user[0].role,
                    userId: user[0]._id,
                  },
                  process.env.JWT_KEY,
                  {
                    expiresIn: "1h",
                  }
                );
                return res.status(200).json({
                  message: "Đăng nhập thành công",
                  token: token,
                });
              }
              return res.status(404).json({
                message: "Auth faled",
              });
            }
          );
        }
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  }

  async listAcount(req, res, next) {
    const page = req.body.page || 1;
    const limit = req.body.select || 10;
    const search = req.body.search || "";
    // const email = req.body.email || "";
    try {
      const query = {};
      if (search) {
        query.email = { $regex: new RegExp(search, "i") };
      }
      // if (email) {
      //   query.email = email;
      // }
      const data = await AccountModel.paginate(query, { page, limit });
      // const data = await CustomerModel.find({});
      if (data) {
        res.send(data);
      } else {
        console.log("Không có dữ liệu");
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Lỗi server");
    }
  }

  async updateAcount(req, res, next) {
    const id = req.params.id;
    AccountModel.updateOne({ _id: id }, { $set: req.body })
      .exec()
      .then((result) => {
        res.status(200).json({
          message: "Cập nhật tài khoản thành công",
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  }

  async deleteAccount(req, res, next) {
    try {
      const data = await AccountModel.deleteOne({ _id: req.params.id });
      if (data) {
        res.json("Xóa tài khoản thành công");
      } else {
        console.log("Không có dữ liệu");
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Lỗi server");
    }
    next();
  }
}

module.exports = new LoginController();
