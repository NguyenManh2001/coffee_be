const { default: mongoose } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const topping = new Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    type: { type: String, required: true },
    price: { type: Number, required: true },
  },
  {
    collection: "topping",
    timestamps: true,
  }
);
topping.plugin(mongoosePaginate);
// const MenusModel = mongoose.model('menus', menus);
const ToppingModel = mongoose.model("topping", topping);

module.exports = { ToppingModel };
