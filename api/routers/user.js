const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../modules/user");
const { default: mongoose } = require("mongoose");

router.get("/", (req, res, next) => {
  Users.find()
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        Users: docs.map((doc) => {
          return {
            _id: doc._id,
            email: doc.email,
            password: doc.password,
          };
        }),
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});
router.post("/", (req, res, next) => {
  Users.find({ email: req.body.email }).then((user) => {
    if (user.length > 0) {
      return res.status(409).json({
        message: "Mail exists",
      });
    } else {
      bcrypt.hash(req.body.password, 10, function (err, hash) {
        if (err) {
          res.status(500).json({
            error: err,
          });
        } else {
          const users = new Users({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.email,
            password: hash,
          });
          users
            .save()
            .then((result) => {
              res.status(200).json({
                message: "Create accouct successfully",
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
});
router.post("/login", (req, res, next) => {
  Users.find({ email: req.body.email })
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
                  userId: user[0]._id,
                },
                process.env.JWT_KEY,
                {
                  expiresIn: "1h",
                },
              );
              return res.status(200).json({
                message: "Auth successful",
                token: token
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
});
router.delete("/:userId", (req, res, next) => {
  const id = req.params.userId;
  Users.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Users deleted",
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});
module.exports = router;
