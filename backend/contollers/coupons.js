const express = require("express");
const path = require("path");
const shopmodel = require("../models/shopmodel");
const product = require("../models/product.js");
const router = express.Router();
const ErrorHandler = require("../utils/Errorhandler.js");
const catchasyncerr = require("../middleware/catchAsyncError.js");
const eventmodel = require("../models/event.js");
const couponmodel = require("../models/coupon.js");
const {
  isAuthenticated,
  sellerAuthenticated,
} = require("../middleware/auth.js");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
    // Destination folder where files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
    // Use the original filename
  },
});
router.get("/coupon/get-coupon-value/:name", async (req, res, next) => {
  try {
    const { name } = req.params;
    const couponCode = await couponmodel.findOne({ name: name });
    if (couponCode == null) {
      return res
        .status(400)
        .json({ success: false, message: "Coupon Not Found" });
    }
    const shop = await shopmodel.find({ _Id: couponCode.shopId });
    if (shop == null) {
      return res.status(200).json({
        success: false,
        message: "Coupon Code Not Valid Because Shop gets Closed",
      });
    }
    return res.status(200).json({
      success: true,
      message: `Coupon Found`,
      couponCode,
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: error.message,
      error: error,
    });
  }
});
router.post("/coupon/create-coupon-code", async (req, res, next) => {
  try {
    // console.log("Api End Point Hit!");
    const { name, minAmount, maxAmount, selectedProducts, value, shopId } =
      req.body;
    console.log("selected Product Is: ", selectedProducts);
    if (!name || !value || !shopId) {
      return res.status(400).json({
        success: false,
        message: "Please Provide the Complete Information!",
      });
    }
    const coupondetail = {
      name,
      minAmount,
      maxAmount,
      selectedProduct: selectedProducts,
      value,
      shopId,
    };
    const coupon = await couponmodel.create(coupondetail);
    return res
      .status(200)
      .json({ success: true, message: "Coupon Created Successfully!", coupon });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Srever Error",
      error: error.message,
    });
  }
});
const upload = multer({ storage: storage });

module.exports = router;
