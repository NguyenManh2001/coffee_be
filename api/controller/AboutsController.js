const { AboutsModel } = require("../modules/about");
// const jwt = require('jsonwebtoken');
const cloudinary = require("cloudinary").v2;
const { default: mongoose } = require("mongoose");
class AboutsController {
  async listAbouts(req, res, next) {
    try {
      const page = req.body.page || 1;
      const limit = 7;
      const search = req.body.search || "";
      const query = {};

      if (search) {
        query.name = { $regex: new RegExp(search, "i") };
      }

      const results = await AboutsModel.paginate(query, {
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
  async addAbouts(req, res, next) {
    try {
      const name = req.body.name;
      console.log(req.body.name);
      const title = req.body.title;
      const describe = req.body.describe;
      const image = req.file;
      const abouts = new AboutsModel({
        _id: new mongoose.Types.ObjectId(),
        name: name,
        title: title,
        describe: describe,
        image: image?.path,
      });

      const result = await abouts.save();

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

  async updateAbouts(req, res, next) {
    const title = req.body.title;
    const describe = req.body.describe;
    const image = req.file;
    const name = req.body.name;
    const id = req.params.id;
    console.log(id);
    const updatedFields = {
      title: title,
      describe: describe,
      name: name,
      image: image ? image.path : req.link,
    };

    try {
      const result = await AboutsModel.findByIdAndUpdate(
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

  async deleteAbouts(req, res, next) {
    try {
      const id = req.params.id;
      const result = await AboutsModel.deleteOne({ _id: id }).exec();
      if (result.deletedCount > 0) {
        if (req.file) {
          await cloudinary.uploader.destroy(req.file.filename);
        }
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

module.exports = new AboutsController();
