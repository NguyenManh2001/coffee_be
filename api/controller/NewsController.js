const { NewsModel } = require("../modules/news");
// const jwt = require('jsonwebtoken');
const cloudinary = require("cloudinary").v2;
const { default: mongoose } = require("mongoose");
class NewsController {
  async listNews(req, res, next) {
    try {
      const page = req.body.page || 1;
      const limit = 7;
      const search = req.body.search || "";
      const type = req.body.type || "";
      const query = {};

      if (search) {
        query.title = { $regex: new RegExp(search, "i") };
      }

      if (type) {
        query.type = type;
      }

      const results = await NewsModel.paginate(query, {
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
  async addNews(req, res, next) {
    try {
      const title = req.body.title;
      const describe = req.body.describe;
      const image = req.file;
      const type = req.body.type;
      const news = new NewsModel({
        _id: new mongoose.Types.ObjectId(),
        title: title,
        describe: describe,
        image: image?.path,
        type: type,
      });

      const result = await news.save();

      res.status(200).json({
        message: "Thêm tin tức thành công",
        menu: result,
      });
    } catch (err) {
      if (req.file) {
        await cloudinary.uploader.destroy(req.file.filename);
      }
      res.status(500).json({ error: err.message });
    }
  }

  async updateNews(req, res, next) {
    const title = req.body.title;
    const describe = req.body.describe;
    const image = req.file;
    const type = req.body.type;
    const newsId = req.params.id;
    const updatedFields = {
      title: title,
      describe: describe,
      type: type,
      image: image ? image.path : req.link,
    };

    try {
      const result = await NewsModel.findByIdAndUpdate(
        newsId,
        { $set: updatedFields },
        { new: true } // Để trả về bản ghi đã cập nhật
      );

      if (result) {
        res.status(200).json({
          message: "Cập nhật tin tức thành công",
        });
      } else {
        res.status(404).json({
          message: "Không tìm thấy tin tức để cập nhật",
        });
      }
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  }

  async deleteNews(req, res, next) {
    try {
      const id = req.params.newsId;
      const result = await NewsModel.deleteOne({ _id: id }).exec();
      if (result.deletedCount > 0) {
        if (req.file) {
          await cloudinary.uploader.destroy(req.file.filename);
        }
        res.status(200).json({
          message: "Xóa tin tức thành công",
        });
      } else {
        res.status(404).json({
          message: "Không tìm thấy tin tức để xóa",
        });
      }
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  }
}

module.exports = new NewsController();
