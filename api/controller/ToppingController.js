const { ToppingModel } = require("../modules/topping");
// const jwt = require('jsonwebtoken');
const cloudinary = require("cloudinary").v2;
const { default: mongoose } = require("mongoose");
class ToppingController {
  async listTopping(req, res, next) {
    try {
      const page = req.body.page || 1;
      const limit = req.body.limit || 7;
      const search = req.body.search || "";
      const query = {};

      if (search) {
        query.name = { $regex: new RegExp(search, "i") };
      }

      const results = await ToppingModel.paginate(query, {
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
  async addTopping(req, res, next) {
    try {
      const name = req.body.name;
      const type = req.body.type;
      const price = req.body.price;
      const menu = new ToppingModel({
        _id: new mongoose.Types.ObjectId(),
        name: name,
        type: type,
        price: price,
      });

      const result = await menu.save();

      res.status(200).json({
        message: "Thêm thành công",
        menu: result,
      });
    } catch (err) {
      if (req.file) {
        await cloudinary.uploader.destroy(req.file.filename);
      }
      res.status(500).json({ error: err.message });
    }
  }

  async updateTopping(req, res, next) {
    const name = req.body.name;
    const type = req.body.type;
    const price = req.body.price;
    const id = req.params.id;
    const updatedFields = {
      name: name,
      type: type,
      price: price,
    };

    try {
      const result = await ToppingModel.findByIdAndUpdate(
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

  async deleteTopping(req, res, next) {
    try {
      const id = req.params.id;
      const result = await ToppingModel.deleteOne({ _id: id }).exec();
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

module.exports = new ToppingController();
