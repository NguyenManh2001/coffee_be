const { DiscountedModel } = require("../modules/discounted");
// const jwt = require('jsonwebtoken');
const cloudinary = require("cloudinary").v2;
const { default: mongoose } = require("mongoose");
const { ProductModel } = require("../modules/product");
class DiscountedController {
  async listDiscounted(req, res, next) {
    try {
      const page = req.body.page || 1;
      const limit = 7;
      const search = req.body.search || "";
      const type = req.body.type || "";
      const query = {};

      if (search) {
        query.name = { $regex: new RegExp(search, "i") };
      }

      if (type) {
        query.type = type;
      }

      const results = await DiscountedModel.paginate(query, {
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
  async addDiscounted(req, res, next) {
    try {
      const name = req.body.name;
      const product = req.body.product;
      const startDate = req.body.startDate;
      const endDate = req.body.endDate;
      const discounted = req.body.discounted;
      const discount = new DiscountedModel({
        _id: new mongoose.Types.ObjectId(),
        name: name,
        product: product,
        startDate: startDate,
        endDate: endDate,
        discounted: discounted,
      });

      const result = await discount.save();

      if (result) {
        const allDiscounts = await DiscountedModel.find({});

        // Lấy tất cả sản phẩm từ bảng ProductModel
        const allProducts = await ProductModel.find({});

        // Thêm thông tin khuyến mãi từ DiscountedModel vào các sản phẩm trong ProductModel
        for (const product of allProducts) {
          product.discounts = allDiscounts.map((discount) => discount._id); // Gán thông tin khuyến mãi vào sản phẩm
          await product.save(); // Lưu sản phẩm đã được cập nhật
        }
      }
      // Lấy tất cả bản ghi từ bảng DiscountedModel
      res.status(200).json({
        message: "Thêm phiếu giảm giá thành công",
        menu: result,
      });
    } catch (err) {
      // if (req.file) {
      //   await cloudinary.uploader.destroy(req.file.filename);
      // }
      res.status(500).json({ error: err.message });
    }
  }

  async updateDiscounted(req, res, next) {
    const name = req.body.name;
    const product = req.body.product;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const discounted = req.body.discounted;
    const discountedId = req.params.discountedId;
    const updatedFields = {
      name: name,
      product: product,
      startDate: startDate,
      endDate: endDate,
      discounted: discounted,
    };

    try {
      const result = await DiscountedModel.findByIdAndUpdate(
        discountedId,
        { $set: updatedFields },
        { new: true } // Để trả về bản ghi đã cập nhật
      );

      if (result) {
        const allProducts = await ProductModel.find({});

        // Lấy lại thông tin khuyến mãi từ DiscountedModel sau khi xóa
        const allDiscounts = await DiscountedModel.find({});

        // Cập nhật thông tin khuyến mãi trong các sản phẩm
        for (const product of allProducts) {
          product.discounts = allDiscounts.map((discount) => discount._id); // Gán lại thông tin khuyến mãi vào sản phẩm
          await product.save(); // Lưu sản phẩm đã được cập nhật
        }
        res.status(200).json({
          message: "Cập nhật phiếu giảm giá thành công",
          menu: result,
        });
      } else {
        res.status(404).json({
          message: "Không tìm thấy phiếu giảm giá để cập nhật",
        });
      }
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  }

  async deleteDiscounted(req, res, next) {
    try {
      const id = req.params.discountedId;
      const result = await DiscountedModel.deleteOne({ _id: id }).exec();
      if (result.deletedCount > 0) {
        const allProducts = await ProductModel.find({});

        // Lấy lại thông tin khuyến mãi từ DiscountedModel sau khi xóa
        const allDiscounts = await DiscountedModel.find({});

        // Cập nhật thông tin khuyến mãi trong các sản phẩm
        for (const product of allProducts) {
          product.discounts = allDiscounts.map((discount) => discount._id); // Gán lại thông tin khuyến mãi vào sản phẩm
          await product.save(); // Lưu sản phẩm đã được cập nhật
        }

        res.status(200).json({
          message: "Xóa phiếu giảm giá thành công",
        });
      } else {
        res.status(404).json({
          message: "Không tìm thấy phiếu giảm giá để xóa",
        });
      }
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  }
}

module.exports = new DiscountedController();
