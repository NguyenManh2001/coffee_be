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
    product: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true,
      },
    ],
    // items: [
    //   {
    //     productId: {
    //       type: mongoose.Schema.Types.ObjectId,
    //       required: true,
    //     },
    //     name: { type: String, required: true },
    //     link: { type: String, required: true },
    //     price: { type: Number, required: true },
    //     quantity: { type: Number, default: 1 },
    //     size: String,
    //   },
    // ],
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
