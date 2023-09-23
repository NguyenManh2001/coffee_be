// const mongoose = require("../config/config");
const { default: mongoose } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const news = new Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    image: { type: String, required: true },
    type: { type: String, required: true },
    describe: { type: String, required: true },
  },
  {
    collection: "news",
    timestamps: true,
  }
);
news.plugin(mongoosePaginate);
// const MenusModel = mongoose.model('menus', menus);
const NewsModel = mongoose.model("news", news);

module.exports = { NewsModel };
