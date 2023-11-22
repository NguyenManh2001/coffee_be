const { SibarModel } = require("../modules/sibar");
// const jwt = require('jsonwebtoken');
const cloudinary = require("cloudinary").v2;
const { default: mongoose } = require("mongoose");
class SibarController {
  async listSibar(req, res, next) {
    try {
      const page = req.body.page || 1;
      const limit = 7;
      const search = req.body.search || "";
      const query = {};

      if (search) {
        query.title = { $regex: new RegExp(search, "i") };
      }

      const results = await SibarModel.paginate(query, {
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
  async addSibar(req, res, next) {
    try {
      const name = req.body.name;
      const title = req.body.title;
      const btnName = req.body.btnName;
      const image1 = req.files["srcImage"][0];
      const image2 = req.files["iconImage"][0];
      const imagePath1 = image1?.path;
      const imagePath2 = image2?.path;
      const sibar = new SibarModel({
        _id: new mongoose.Types.ObjectId(),
        name: name,
        title: title,
        btnName: btnName,
        srcImage: imagePath1,
        iconImage: imagePath2,
      });

      const result = await sibar.save();

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

  async updateSibar(req, res, next) {
    const name = req.body.name;
    const title = req.body.title;
    const btnName = req.body.btnName;
    const image1 = req.files["srcImage"];
    const image2 = req.files["iconImage"];
    console.log(image1);
    const id = req.params.id;
    console.log(id);
    const updatedFields = {
      name: name,
      title: title,
      btnName: btnName,
      srcImage: image1 ? image1?.path : req.srcImage,
      iconImage: image2 ? image2?.path : req.iconImage,
      // image: image ? image.path : req.link,
    };

    try {
      const result = await SibarModel.findByIdAndUpdate(
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

  async deleteSibar(req, res, next) {
    try {
      const id = req.params.id;
      const result = await SibarModel.deleteOne({ _id: id }).exec();
      if (result.deletedCount > 0) {
        if (req.file) {
          await cloudinary.uploader.destroy(req.files["srcImage"][0].filename);
          await cloudinary.uploader.destroy(req.files["iconImage"][0].filename);
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

module.exports = new SibarController();
