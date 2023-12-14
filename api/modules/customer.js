// const mongoose = require("../config/config");
const { default: mongoose } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const customer = new Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    gender: { type: String, required: true },
    address: { type: String, required: true },
    temporaryAddress: { type: String },
    email: { type: String, required: true },
    number: { type: String, required: true },
  },
  {
    collection: "customer",
    timestamps: true,
  }
);
customer.plugin(mongoosePaginate);
// const MenusModel = mongoose.model('menus', menus);
const CustomerModel = mongoose.model("customer", customer);

module.exports = { CustomerModel };
