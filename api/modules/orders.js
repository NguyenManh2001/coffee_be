const express = require("express");
const mongoosePaginate = require("mongoose-paginate-v2");
const { default: mongoose } = require("mongoose");

const ordersSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quatity: { type: Number, default: 1 },
    size: { type: String },
  },
  {
    collection: "ordersSchema",
    timestamps: true,
  }
);
ordersSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Orders", ordersSchema);
