const { ProductModel } = require("../modules/product");
// const jwt = require('jsonwebtoken');
const cloudinary = require("cloudinary").v2;
const { default: mongoose } = require("mongoose");
class ProductController {
  async listProduct(req, res, next) {
    const page = req.body.page || 1;
    const limit = req.body.limit || 5;
    const search = req.body.search || "";
    const type = req.body.type || "";
    const query = {};
    if (search) {
      query.name = { $regex: new RegExp(search, "i") };
    }
    if (type) {
      query.type = type;
    }
    ProductModel.paginate(query, { page, limit })
      .then((results) => {
        // const respone = {
        //   count: results?.docs?.length,
        //   products: results?.docs?.map((doc) => {
        //     return {
        //       _id: doc._id,
        //       name: doc.name,
        //       price: doc.price,
        //       type: doc.type,
        //       link: doc.link,
        //       createdAt: doc.createdAt,
        //     };
        //   }),
        // };
        if (results) {
          res.status(200).json(results);
        } else {
          res.status(404).json({
            message: "No enties found",
          });
        }
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  }
  async addProduct(req, res, next) {
    const type = req.body.type;
    const name = req.body.name;
    const price = req.body.price;
    const image = req.file;
    console.log(image);
    const menu = new ProductModel({
      _id: new mongoose.Types.ObjectId(),
      name: name,
      price: price,
      link: image?.path,
      type: type,
    });
    menu
      .save()
      .then((result) => {
        res.status(201).json({
          message: "Thêm sản phẩm thành công",
          menu: result,
        });
      })
      .catch((err) => {
        if (image) cloudinary.uploader.destroy(image.filename);
        res.status(500).json({ error: err });
      });
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
          message: "Product not found or no changes were made.",
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: err.message,
      });
    }
  }

  async deleteProduct(req, res, next) {
    const id = req.params.productId;
    console.log(id);
    ProductModel.deleteOne({ _id: id })
      .exec()
      .then((doc) => {
        res.status(200).json({
          message: "Xóa sản phẩm thành công",
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  }
}

module.exports = new ProductController();
