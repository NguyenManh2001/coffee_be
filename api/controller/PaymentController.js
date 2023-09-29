const CryptoJS = require("crypto-js");
const qs = require("qs");
var sortObject = require("sort-object");
// import dateFormat, { masks } from "dateformat";
class PaymentController {
  async createPayment(req, res, next) {
    // const ipAddr =
    //   req.headers["x-forwarded-for"] ||
    //   req.connection.remoteAddress ||
    //   req.socket.remoteAddress ||
    //   req.connection.socket.remoteAddress;

    // const vnp_TmnCode = process.env.YOUR_VNPAY_TMNCODE; // Thay thế bằng mã TMNCODE của bạn
    // const vnp_HashSecret = process.env.YOUR_VNPAY_HASH_SECRET; // Thay thế bằng mã bí mật của bạn
    // const vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"; // URL thanh toán của VNPAY (sandbox)

    // // Lấy các thông tin từ yêu cầu của khách hàng
    // const { amount, orderDescription, bankCode } = req.body;

    // // Xây dựng tham số thanh toán VNPAY
    // const vnp_Params = {
    //   vnp_Version: "2.1.0",
    //   vnp_Command: "pay",
    //   vnp_TmnCode: vnp_TmnCode,
    //   vnp_Locale: "vn",
    //   vnp_CurrCode: "VND",
    //   vnp_TxnRef: Date.now().toString(),
    //   vnp_OrderInfo: orderDescription,
    //   vnp_OrderType: "payment",
    //   vnp_Amount: amount * 100, // Chuyển đổi sang đơn vị tiền tệ của VNPAY
    //   vnp_ReturnUrl: "http://localhost:3000/return", // URL để xử lý kết quả thanh toán
    //   vnp_IpAddr: req.ip,
    //   vnp_CreateDate: new Date(),
    // };

    // // Thêm mã ngân hàng nếu có
    // if (bankCode) {
    //   vnp_Params.vnp_BankCode = bankCode;
    // }

    // // Sắp xếp tham số theo thứ tự chữ cái
    // const sortedParams = Object.keys(vnp_Params)
    //   .sort()
    //   .reduce((obj, key) => {
    //     obj[key] = vnp_Params[key];
    //     return obj;
    //   }, {});

    // // Tạo chuỗi dữ liệu cần ký
    // const signData = qs.stringify(sortedParams, { encode: false });

    // // Tạo mã bảo mật (HMAC-SHA512)
    // const hmac = CryptoJS.HmacSHA512(signData, vnp_HashSecret);
    // const signed = CryptoJS.enc.Hex.stringify(hmac);

    // // Thêm mã bảo mật vào tham số thanh toán
    // vnp_Params.vnp_SecureHash = signed;

    // // Tạo URL thanh toán
    // const vnpayPaymentURL =
    //   vnp_Url + "?" + qs.stringify(vnp_Params, { encode: false });

    // // Chuyển hướng người dùng đến URL thanh toán
    // // res.redirect(vnpayPaymentURL);
    // res.json({ vnpayPaymentURL });

    const ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    const vnp_TmnCode = process.env.YOUR_VNPAY_TMNCODE; // Thay thế bằng mã TMNCODE của bạn
    const vnp_HashSecret = process.env.YOUR_VNPAY_HASH_SECRET; // Thay thế bằng mã bí mật của bạn
    var vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"; // URL thanh toán của VNPAY (sandbox)
    const returnUrl = "http://localhost:3000/return";

    // const date = new Date();
    const createDate = new Date();
    const orderId = Date.now().toString();
    const amount = req.body.amount;
    const bankCode = req.body.bankCode;

    const orderInfo = req.body.orderDescription;
    const orderType = req.body.orderType;
    const locale = req.body.language;
    if (locale === null || locale === "") {
      locale = "vn";
    }
    const currCode = "VND";
    var vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = vnp_TmnCode;
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params["vnp_Locale"] = locale;
    vnp_Params["vnp_CurrCode"] = currCode;
    vnp_Params["vnp_TxnRef"] = orderId;
    vnp_Params["vnp_OrderInfo"] = orderInfo;
    vnp_Params["vnp_OrderType"] = orderType;
    vnp_Params["vnp_Amount"] = amount * 100;
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;
    if (bankCode !== null && bankCode !== "") {
      vnp_Params["vnp_BankCode"] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    const querystring = require("qs");
    const signData = querystring.stringify(vnp_Params, { encode: false });
    const crypto = require("crypto");
    const hmac = crypto.createHmac("sha512", vnp_HashSecret);
    const signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;
    vnp_Url += "?" + querystring.stringify(vnp_Params, { encode: false });

    res.json({ vnp_Url });
  }
}

module.exports = new PaymentController();
