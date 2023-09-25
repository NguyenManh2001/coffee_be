// const mongoose = require('../config/config');
const { default: mongoose } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

// .catch(() => console.log('loi'));
// const menus = new Schema({
//     name: { type: String,required:true},
//     price:{ type: String,required:true},
//  },{
//   collection:'menus',
//   timestamps:true,
// }
//  );
const product = new Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    price: { type: Number, required: true },
    link: { type: String, required: true },
    // createdAt: { type: Date, default: Date.now },
    // updatedAt: { type: Date, default: Date.now },
    type: { type: String, required: true },
  },
  {
    collection: "product",
    timestamps: true,
  }
);
product.plugin(mongoosePaginate);
// const MenusModel = mongoose.model('menus', menus);
const ProductModel = mongoose.model("product", product);

module.exports = { ProductModel };
