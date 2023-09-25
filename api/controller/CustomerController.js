const { CustomerModel } = require("../modules/customer");
const cloudinary = require("cloudinary").v2;
const { default: mongoose } = require("mongoose");
const jwt = require("jsonwebtoken");

class customerController {
  async CreateCustomer(req, res, next) {
    const name = req.body.name;
    const gender = req.body.gender;
    const address = req.body.address;
    const email = req.body.email;
    const number = req.body.number;

    const customersModel = new CustomerModel({
      _id: new mongoose.Types.ObjectId(),
      name: name,
      gender: gender,
      address: address,
      email: email,
      number: number,
    });
    try {
      const data = await customersModel.save();
      if (data) {
        res.json("Thêm thông tin thành công!");
      } else {
        res.json("that bai");
      }
    } catch (err) {
      res.status(500).json("loi sever");
    }
  }

  async listCustomer(req, res, next) {
    const page = req.body.page || 1;
    const limit = req.body.select || 10;
    const search = req.body.search || "";
    const email = req.body.email || "";
    try {
      const query = {};
      if (search) {
        query.name = { $regex: new RegExp(search, "i") };
      }
      if (email) {
        query.email = email;
      }
      const data = await CustomerModel.paginate(query, { page, limit });
      // const data = await CustomerModel.find({});
      if (data) {
        res.send(data);
      } else {
        console.log("Không có dữ liệu");
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Lỗi server");
    }
  }

  async updateCustomer(req, res, next) {
    const id = req.params.id;
    CustomerModel.updateOne({ _id: id }, { $set: req.body })
      .exec()
      .then((result) => {
        res.status(200).json({
          message: "Customer updated",
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  }
  //   async EditCar(req,res,next){
  //     try {
  //       const data = await CreatecarModel.findOne({_id:req.params.id});
  //       if (data) {
  //         res.send(data);
  //       } else {
  //         console.log('Không có dữ liệu');
  //       }
  //     } catch (err) {
  //       console.log(err);
  //       res.status(500).send('Lỗi server');
  //     }
  //     next();
  //   }
  //   async editCar(req,res,next){
  //     try {
  //       const data = await CreatecarModel.updateOne({_id:req.params.id},req.body);
  //       if (data) {
  //         res.json('update thanh cong')
  //       } else {
  //         console.log('Không có dữ liệu');
  //       }
  //     } catch (err) {
  //       console.log(err);
  //       res.status(500).send('Lỗi server');
  //     }
  //     next();
  //   }

  async deleteCustomer(req, res, next) {
    try {
      const data = await CustomerModel.deleteOne({ _id: req.params.id });
      if (data) {
        res.json("delete thanh cong");
      } else {
        console.log("Không có dữ liệu");
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Lỗi server");
    }
    next();
  }
  //   async searchCar(req,res,next){
  //     try{
  //        const data = await CreatecarModel.find({name: req.body.searchValue})
  //        if(data){
  //         res.send(data);
  //        }else{
  //         console.log('Không có dữ liệu');
  //        }
  //     }catch(err){
  //       console.log(err);
  //       res.status(500).send('Lỗi server');
  //     }
  //      next();
  //   }
}

module.exports = new customerController();
