const { default: mongoose } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const ingredient = new Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    quantity: { type: String, required: true },
    supplier: { type: String, required: true },
    price: { type: Number, required: true },
    email: { type: String, required: true },
    number: { type: String, required: true },
    address: { type: String, required: true },
  },
  {
    collection: "ingredient",
    timestamps: true,
  }
);
ingredient.plugin(mongoosePaginate);
// const MenusModel = mongoose.model('menus', menus);
const IngredientModel = mongoose.model("ingredient", ingredient);

module.exports = { IngredientModel };
