const { IngredientModel } = require("../modules/ingredient");
// const jwt = require('jsonwebtoken');
const cloudinary = require("cloudinary").v2;
const { default: mongoose } = require("mongoose");
class IngredientController {
  async listIngredient(req, res, next) {
    try {
      const page = req.body.page || 1;
      const limit = req.body.limit || 7;
      const search = req.body.search || "";
      const query = {};

      if (search) {
        query.name = { $regex: new RegExp(search, "i") };
      }

      const results = await IngredientModel.paginate(query, {
        page,
        limit,
        sort: { createdAt: -1 },
      });

      if (results.docs.length > 0) {
        res.status(200).json(results);
      } else {
        res.status(404).json({
          message: "No entries found",
        });
      }
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  }
  async addIngredient(req, res, next) {
    try {
      const name = req.body.name;
      const supplier = req.body.supplier;
      const price = req.body.price;
      const email = req.body.email;
      const number = req.body.number;
      const address = req.body.address;
      const quantity = req.body.quantity;
      const menu = new IngredientModel({
        _id: new mongoose.Types.ObjectId(),
        name: name,
        supplier: supplier,
        price: price,
        email: email,
        number: number,
        address: address,
        quantity: quantity,
      });

      const result = await menu.save();

      res.status(200).json({
        message: "Thêm thành công",
        menu: result,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async updateIngredient(req, res, next) {
    const name = req.body.name;
    const supplier = req.body.supplier;
    const price = req.body.price;
    const email = req.body.email;
    const number = req.body.number;
    const address = req.body.address;
    const quantity = req.body.quantity;
    const id = req.params.id;
    const updatedFields = {
      name: name,
      supplier: supplier,
      price: price,
      email: email,
      number: number,
      address: address,
      quantity: quantity,
    };

    try {
      const result = await IngredientModel.findByIdAndUpdate(
        id,
        { $set: updatedFields },
        { new: true } // Để trả về bản ghi đã cập nhật
      );

      if (result) {
        res.status(200).json({
          message: "Cập nhật thành công",
        });
      } else {
        res.status(404).json({
          message: "Không tìm thấy thông tin để cập nhật",
        });
      }
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  }

  async deleteIngredient(req, res, next) {
    try {
      const id = req.params.id;
      const result = await IngredientModel.deleteOne({ _id: id }).exec();
      if (result.deletedCount > 0) {
        res.status(200).json({
          message: "Xóa thông tin thành công",
        });
      } else {
        res.status(404).json({
          message: "Không tìm thấy thông tin để xóa",
        });
      }
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  }
}

module.exports = new IngredientController();
