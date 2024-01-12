// const mongoose = require("../config/config");
const { default: mongoose } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const sibar = new Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    title: { type: String, required: true },
    srcImage: { type: String, required: true },
    iconImage: { type: String, required: true },
    btnName: { type: String, required: true },
    linkVideo: { type: String },
  },
  {
    collection: "sibar",
    timestamps: true,
  }
);
sibar.plugin(mongoosePaginate);
// const MenusModel = mongoose.model('menus', menus);
const SibarModel = mongoose.model("sibar", sibar);

module.exports = { SibarModel };
