// const mongoose = require("../config/config");
const { default: mongoose } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const discounted = new Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    discounted: { type: Number, required: true },
  },
  {
    collection: "discounted",
    timestamps: true,
  }
);
discounted.plugin(mongoosePaginate);
// const MenusModel = mongoose.model('menus', menus);
const DiscountedModel = mongoose.model("discounted", discounted);

module.exports = { DiscountedModel };
