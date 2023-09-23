const product = require("./product");
const customer = require("./customer");
const account = require("./account");
const news = require("./news");
function route(app) {
  app.use("/menuList", product);
  app.use("/customer", customer);
  app.use("/account", account);
  app.use("/news", news);
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
