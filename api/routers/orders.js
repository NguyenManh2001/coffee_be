const express = require("express");
const router = express.Router();
const { default: mongoose } = require("mongoose");

const Orders = require("../modules/orders");
const Product = require("../modules/product");

router.get("/", (req, res, next) => {
  Orders.find()
    .select("product quatity _id")
    .populate("product", "name")
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map((doc) => {
          return {
            _id: doc._id,
            product: doc.product,
            quatity: doc.quatity,
            request: {
              type: "GET",
              url: "http://localhost:3001/orders/" + doc._id,
            },
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
  Product.findById(req.body.productId)
    .exec()
    .then((product) => {
      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }
      const orders = new Orders({
        _id: new mongoose.Types.ObjectId(),
        product: req.body.productId,
        quatity: req.body.quatity,
      });
      return orders.save();
    })
    .then((result) => {
      res.status(200).json({
        message: "Created orders successfully",
        orders: {
          _id: result._id,
          product: result.product,
          quatity: result.quatity,
          request: {
            type: "GET",
            url: "http://localhost:3001/orders/" + result._id,
          },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.get("/:orderId", (req, res, next) => {
  const id = req.params.orderId;
  Orders.findById(id)
    .select("product quatity _id")
    .populate("product")
    .exec()
    .then((order) => {
      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }
      res.status(200).json({
        order: order,
        require: {
          type: "GET",
          url: "http://localhost:3001/orders/",
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

// router.put("/:orderId", (req, res, next) => {
//   const id = req.params.orderId;
//   Orders.updateOne({ _id: id }, { $set: req.body })
//     .exec()
//     .then((docs) => {
//       res.status(200).json({
//         message: "Updated successfully",
//         require: {
//           type: "GET",
//           url: "http://localhost:3001/orders/" + id,
//         },
//       });
//     })
//     .catch((err) => {
//       res.status(500).json({
//         error: err,
//       });
//     });
// });

router.delete("/:orderId", (req, res, next) => {
  const id = req.params.orderId;
  Orders.deleteOne({ _id: id })
    .exec()
    .then((doc) => {
      res.status(200).json({
        message: "Orders deleted",
        require: {
          type: "POST",
          url: "http://localhost:3001/orders/" + id,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
