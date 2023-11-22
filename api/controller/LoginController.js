const AccountModel = require("../modules/account");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
class LoginController {
  //post
  // Login(req, res, next) {
  //   AccountModel.find({ email: req.body.email })
  //     .exec()
  //     .then((user) => {
  //       if (user.length < 1) {
  //          res.status(404).json({
  //           message: "Auth faled",
  //         });
  //       } else {
  //         bcrypt.compare(
  //           req.body.password,
  //           user[0].password,
  //           function (err, result) {
  //             if (err) {
  //                res.status(404).json({
  //                 message: "Auth faled",
  //               });
  //             }
  //             if (result) {
  //               console.log(process.env.JWT_KEY);
  //               const token = jwt.sign(
  //                 {
  //                   email: user[0].email,
  //                   role: user[0].role,
  //                   userId: user[0]._id,
  //                 },
  //                 process.env.JWT_KEY,
  //                 {
  //                   expiresIn: "1h",
  //                 }
  //               );
  //                res.status(200).json({
  //                 message: "Đăng nhập thành công",
  //                 token: token,
  //               });
  //             }
  //              res.status(404).json({
  //               message: "Auth faled",
  //             });
  //           }
  //         );
  //       }
  //     })
  //     .catch((err) => {
  //       res.status(500).json({
  //         error: err,
  //       });
  //     });
  // }

  async Login(req, res, next) {
    try {
      const user = await AccountModel.findOne({ email: req.body.email }).exec();

      if (!user) {
        res.status(404).json({
          message: "Authentication failed",
        });
      }

      bcrypt.compare(
        req.body.password,
        user.password,
        async function (err, result) {
          if (err) {
            throw new Error("Error comparing passwords");
          }

          if (result) {
            const token = jwt.sign(
              {
                email: user.email,
                role: user.role,
                userId: user._id,
              },
              process.env.JWT_KEY,
              {
                expiresIn: "1h",
              }
            );

            res.status(200).json({
              message: "Đăng nhập thành công",
              token: token,
            });
          } else {
            res.status(404).json({
              message: "Authentication failed",
            });
          }
        }
      );
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "Internal Server Error",
      });
    }
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
      const data = await AccountModel.paginate(query, {
        page,
        limit,
        sort: { createdAt: -1 },
      });
      // const data = await CustomerModel.find({});
      if (data) {
        res.status(200).send(data);
      } else {
        res.status(404).send("Không có dữ liệu");
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Lỗi server");
    }
  }

  // async updateAcount(req, res, next) {
  //   const id = req.params.id;
  //   AccountModel.updateOne({ _id: id }, { $set: req.body })
  //     .exec()
  //     .then((result) => {
  //       res.status(200).json({
  //         message: "Cập nhật tài khoản thành công",
  //       });
  //     })
  //     .catch((err) => {
  //       res.status(500).json({
  //         error: err,
  //       });
  //     });
  // }

  async updateAcount(req, res, next) {
    try {
      const id = req.params.id;
      const update = await AccountModel.updateOne(
        { _id: id },
        { $set: req.body }
      ).exec();
      if (update) {
        res.status(200).json({
          message: "Cập nhật tài khoản thành công",
        });
      } else {
        res.status(404).json({
          message: "Không tìm thấy tài khoản để cập nhật",
        });
      }
    } catch (err) {
      res.status(500).json({
        error: err,
      });
    }
  }
  async deleteAccount(req, res, next) {
    try {
      const data = await AccountModel.deleteOne({ _id: req.params.id });
      if (data) {
        res.status(200).json("Xóa tài khoản thành công");
      } else {
        res.status(404).json("Không tìm thấy tài khoản để xóa");
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Lỗi server");
    }
    next();
  }
}

module.exports = new LoginController();
