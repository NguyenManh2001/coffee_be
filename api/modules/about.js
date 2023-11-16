// const mongoose = require("../config/config");
const { default: mongoose } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const abouts = new Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    title: { type: String, required: true },
    image: { type: String, required: true },
    describe: { type: String, required: true },
  },
  {
    collection: "abouts",
    timestamps: true,
  }
);
abouts.plugin(mongoosePaginate);
// const MenusModel = mongoose.model('menus', menus);
const AboutsModel = mongoose.model("abouts", abouts);

module.exports = { AboutsModel };
