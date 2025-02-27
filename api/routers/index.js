const product = require("./product");
const customer = require("./customer");
const account = require("./account");
const news = require("./news");
const orders = require("./orders");
const payment = require("./payment");
const abouts = require("./about");
const sibar = require("./sibar");
const menu = require("./menu");
const topping = require("./topping");
const ingredient = require("./ingredient");
const discounted = require("./discounted");
function route(app) {
  app.use("/product", product);
  app.use("/customer", customer);
  app.use("/account", account);
  app.use("/news", news);
  app.use("/abouts", abouts);
  app.use("/orders", orders);
  app.use("/sibar", sibar);
  app.use("/payment", payment);
  app.use("/menu", menu);
  app.use("/topping", topping);
  app.use("/ingredient", ingredient);
  app.use("/discounted", discounted);
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
}

module.exports = route;
