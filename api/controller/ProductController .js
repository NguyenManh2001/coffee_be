const { ProductModel } = require("../modules/product");
// const jwt = require('jsonwebtoken');
const cloudinary = require("cloudinary").v2;
const { default: mongoose } = require("mongoose");
class ProductController {
  async listProduct(req, res, next) {
    try {
      const page = req.body.page || 1;
      const limit = req.body.limit || 7;
      const search = req.body.search || "";
      const type = req.body.type || "";
      const query = {};

      if (search) {
        query.name = { $regex: new RegExp(search, "i") };
      }

      if (type) {
        query.type = type;
      }

      const results = await ProductModel.paginate(query, { page, limit });

      if (results.docs.length > 0) {
        // const response = {
        //   count: results.docs.length,
        //   products: results.docs.map((doc) => ({
        //     _id: doc._id,
        //     name: doc.name,
        //     price: doc.price,
        //     type: doc.type,
        //     link: doc.link,
        //     createdAt: doc.createdAt,
        //   })),
        // };

        res.status(200).json(response);
      } else {
        res.status(404).send("Không có dữ liệu");
      }
    } catch (err) {
      res.status(500).json({
        error: err,
      });
    }
  }
  async addProduct(req, res, next) {
    try {
      const { type, name, price } = req.body;
      const image = req.file;
      const product = new ProductModel({
        _id: new mongoose.Types.ObjectId(),
        name: name,
        price: price,
        link: image?.path,
        type: type,
      });

      const result = await product.save();
      if (result) {
        res.status(200).json({
          message: "Thêm sản phẩm thành công",
          product: result,
        });
      }
    } catch (err) {
      if (req.file) {
        await cloudinary.uploader.destroy(req.file.filename);
      }

      res.status(500).json({ error: err });
    }
  }

  async updateProduct(req, res, next) {
    const type = req.body.type;
    const name = req.body.name;
    const price = req.body.price;
    const image = req.file;
    const productId = req.params.id;
    const updatedFields = {
      name: name,
      price: price,
      type: type,
      link: image ? image.path : req.link,
    };

    try {
      const result = await ProductModel.findByIdAndUpdate(
        productId,
        { $set: updatedFields },
        { new: true } // Để trả về bản ghi đã cập nhật
      );

      if (result) {
        res.status(200).json({
          message: "Cập nhật sản phẩm thành công",
        });
      } else {
        res.status(404).json({
          message: "Không tìm thấy sản phẩm để cập nhật",
        });
      }
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  }

  async deleteProduct(req, res, next) {
    try {
      const id = req.params.productId;
      console.log(id);

      const result = await ProductModel.deleteOne({ _id: id }).exec();

      if (result.deletedCount > 0) {
        res.status(200).json({
          message: "Xóa sản phẩm thành công",
        });
      } else {
        res.status(404).json({
          message: "Không tìm thấy sản phẩm để xóa",
        });
      }
    } catch (err) {
      res.status(500).json({
        error: err,
      });
    }
  }
}

module.exports = new ProductController();
