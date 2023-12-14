const express = require("express");
const mongoosePaginate = require("mongoose-paginate-v2");
const { default: mongoose } = require("mongoose");

const ordersSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customer",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        quantity: { type: Number, required: true },
        size: { type: String, required: true },
        ice: { type: String, required: true },
        sugar: { type: String, required: true },
        toppings: [{ type: String, required: true }],
      },
    ],
    address: { type: String },
    total: Number,
    isPaid: Boolean,
  },
  {
    collection: "ordersSchema",
    timestamps: true,
  }
);
ordersSchema.plugin(mongoosePaginate);
const OrderModel = mongoose.model("Orders", ordersSchema);
module.exports = { OrderModel };
