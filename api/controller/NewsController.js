const { NewsModel } = require("../modules/news");
// const jwt = require('jsonwebtoken');
const cloudinary = require("cloudinary").v2;
const { default: mongoose } = require("mongoose");
class NewsController {
  async listNews(req, res, next) {
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
    NewsModel.paginate(query, { page, limit })
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
  async addNews(req, res, next) {
    const title = req.body.title;
    const describe = req.body.describe;
    const image = req.file;
    const type = req.body.type;
    console.log(image);
    const news = new NewsModel({
      _id: new mongoose.Types.ObjectId(),
      title: title,
      describe: describe,
      image: image?.path,
      type: type,
    });
    news
      .save()
      .then((result) => {
        res.status(201).json({
          message: "Thêm tin tức thành công",
          menu: result,
        });
      })
      .catch((err) => {
        if (image) cloudinary.uploader.destroy(image.filename);
        res.status(500).json({ error: err });
      });
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
          message: "News not found or no changes were made.",
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: err.message,
      });
    }
  }

  async deleteNews(req, res, next) {
    const id = req.params.newsId;
    console.log(id);
    NewsModel.deleteOne({ _id: id })
      .exec()
      .then((doc) => {
        res.status(200).json({
          message: "Xóa tin tức thành công",
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  }
}

module.exports = new NewsController();
