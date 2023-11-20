const { OrderModel } = require("../modules/orders");
const { ProductModel } = require("../modules/product");
const cloudinary = require("cloudinary").v2;
const { default: mongoose } = require("mongoose");
const jwt = require("jsonwebtoken");

class OrderController {
  async addOrder(req, res, next) {
    const customer = req.body.customerId;
    const product = req.body.productId;
    const total = req.body.total;
    const isPaid = req.body.isPaid;

    const ordersModel = new OrderModel({
      _id: new mongoose.Types.ObjectId(),
      customer: customer,
      products: product,
      total: total,
      isPaid: isPaid,
    });
    try {
      const data = await ordersModel.save();
      if (data) {
        res.status(200).json({
          message: "Thêm đơn hàng thành công",
          menu: data,
        });
      } else {
        res.status(404).send("Thêm thông tin thất bại");
      }
    } catch (err) {
      res.status(500).json("Lỗi sever");
    }
  }

  async listOrder(req, res, next) {
    const page = req.body.page || 1;
    const limit = req.body.select || 10;
    const search = req.body.search || "";
    const email = req.body.email || "";
    try {
      const query = {};
      if (search) {
        query.name = { $regex: new RegExp(search, "i") };
      }
      if (email) {
        query.email = email;
      }
      const options = {
        page: page,
        limit: limit,
        populate: ["customer", "products.product"], // Populate customerId and items.productId
      };
      const data = await OrderModel.paginate(query, options);
      if (data) {
        res.status(200).send(data);
      } else {
        res.status(404).send("Không có dữ liệu");
      }
    } catch (err) {
      res.status(500).send("Lỗi server");
    }
  }

  async listAllOrders(req, res, next) {
    try {
      const search = req.body.search || "";
      const email = req.body.email || "";

      const query = {};
      if (search) {
        query.name = { $regex: new RegExp(search, "i") };
      }
      if (email) {
        query.email = email;
      }

      const orders = await OrderModel.find(query).populate(
        "customer products.product"
      );

      if (orders.length > 0) {
        res.status(200).send(orders);
      } else {
        res.status(404).send("Không có dữ liệu");
      }
    } catch (err) {
      res.status(500).send("Lỗi server");
    }
  }

  // async updateOrder(req, res, next) {
  //   const id = req.params.id;
  //   OrderModel.updateOne({ _id: id }, { $set: req.body })
  //     .exec()
  //     .then((result) => {
  //       res.status(200).json({
  //         message: "Customer updated",
  //       });
  //     })
  //     .catch((err) => {
  //       res.status(500).json({
  //         error: err,
  //       });
  //     });
  // }
  //   async EditCar(req,res,next){
  //     try {
  //       const data = await CreatecarModel.findOne({_id:req.params.id});
  //       if (data) {
  //         res.send(data);
  //       } else {
  //         console.log('Không có dữ liệu');
  //       }
  //     } catch (err) {
  //       console.log(err);
  //       res.status(500).send('Lỗi server');
  //     }
  //     next();
  //   }
  //   async editCar(req,res,next){
  //     try {
  //       const data = await CreatecarModel.updateOne({_id:req.params.id},req.body);
  //       if (data) {
  //         res.json('update thanh cong')
  //       } else {
  //         console.log('Không có dữ liệu');
  //       }
  //     } catch (err) {
  //       console.log(err);
  //       res.status(500).send('Lỗi server');
  //     }
  //     next();
  //   }

  async deleteOrder(req, res, next) {
    try {
      const data = await OrderModel.deleteOne({ _id: req.params.id });
      if (data) {
        res.status(200).json("Xóa đơn hàng thành công");
      } else {
        res.status(404).json("Không tìm thấy đơn hàng để xóa");
      }
    } catch (err) {
      res.status(500).send("Lỗi server");
    }
  }
}

module.exports = new OrderController();
