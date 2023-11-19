// const mongoose = require("../config/config");
const { default: mongoose } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const menu = new Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    image: { type: String, required: true },
  },
  {
    collection: "menu",
    timestamps: true,
  }
);
menu.plugin(mongoosePaginate);
// const MenusModel = mongoose.model('menus', menus);
const MenuModel = mongoose.model("menu", menu);

module.exports = { MenuModel };
