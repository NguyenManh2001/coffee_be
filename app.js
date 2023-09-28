const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParse = require("body-parser");
const route = require("./api/routers");

console.log(process.env.MONGO_CONNECT);
mongoose
  .connect(process.env.MONGO_CONNECT)
  .then(() => console.log("Connected!"));
app.use(morgan("dev"));
app.use(bodyParse.urlencoded({ extended: false }));
app.use(bodyParse.json());
app.use(express.json());
app.use(cors());
route(app);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://coffee-fe.vercel.app");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-Width,Content-Type,Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
    return res.status(200).json({});
  }
  next();
});
mongoose.Promise = global.Promise;
app.use("/uploads", express.static("uploads"));
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use("/product", productRouter);
// app.use("/orders", ordersRouter);
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
