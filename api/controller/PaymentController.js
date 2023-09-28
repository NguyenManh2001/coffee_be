const CryptoJS = require("crypto-js");
const qs = require("qs");
class PaymentController {
  async createPayment(req, res, next) {
    const vnp_TmnCode = process.env.YOUR_VNPAY_TMNCODE; // Thay thế bằng mã TMNCODE của bạn
    const vnp_HashSecret = process.env.YOUR_VNPAY_HASH_SECRET; // Thay thế bằng mã bí mật của bạn
    const vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"; // URL thanh toán của VNPAY (sandbox)

    // Lấy các thông tin từ yêu cầu của khách hàng
    const { amount, orderDescription, bankCode } = req.body;

    // Xây dựng tham số thanh toán VNPAY
    const vnp_Params = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: vnp_TmnCode,
      vnp_Locale: "vn",
      vnp_CurrCode: "VND",
      vnp_TxnRef: Date.now().toString(),
      vnp_OrderInfo: orderDescription,
      vnp_OrderType: "payment",
      vnp_Amount: amount * 100, // Chuyển đổi sang đơn vị tiền tệ của VNPAY
      vnp_ReturnUrl: "http://localhost:4000/return", // URL để xử lý kết quả thanh toán
      vnp_IpAddr: req.ip,
      vnp_CreateDate: new Date().toISOString(),
    };

    // Thêm mã ngân hàng nếu có
    if (bankCode) {
      vnp_Params.vnp_BankCode = bankCode;
    }

    // Sắp xếp tham số theo thứ tự chữ cái
    const sortedParams = Object.keys(vnp_Params)
      .sort()
      .reduce((obj, key) => {
        obj[key] = vnp_Params[key];
        return obj;
      }, {});

    // Tạo chuỗi dữ liệu cần ký
    const signData = qs.stringify(sortedParams, { encode: false });

    // Tạo mã bảo mật (HMAC-SHA512)
    const hmac = CryptoJS.HmacSHA512(signData, vnp_HashSecret);
    const signed = CryptoJS.enc.Hex.stringify(hmac);

    // Thêm mã bảo mật vào tham số thanh toán
    vnp_Params.vnp_SecureHash = signed;

    // Tạo URL thanh toán
    const vnpayPaymentURL =
      vnp_Url + "?" + qs.stringify(vnp_Params, { encode: false });

    // Chuyển hướng người dùng đến URL thanh toán
    res.redirect(vnpayPaymentURL);
  }
}

module.exports = new PaymentController();
