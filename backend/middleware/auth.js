const shopmodel = require("../models/shopmodel");
const usermodel = require("../models/usermodel");
const ErrorHandler = require("../utils/Errorhandler");
const catchAsyncError = require("./catchAsyncError");
const jsonwebtoken = require("jsonwebtoken");

exports.isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    console.log("token is", token);
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Please login to countinue" });
    }
    const decoded = await jsonwebtoken.verify(
      token,
      process.env.JWT_SECRET_KEY
    );
    req.user = await usermodel.findById(decoded.id);
    next();
  } catch (error) {
    // console.log(error.message);
    res.status(500).json({ success: false, message: error.message, error });
  }
};

exports.sellerAuthenticated = async (req, res, next) => {
  try {
    const { seller_token } = req.cookies;
    console.log("Seller Token is ", seller_token);
    if (!seller_token) {
      return res
        .status(401)
        .json({ success: false, message: "Please login to countinue" });
    }
    const decoded = await jsonwebtoken.verify(
      seller_token,
      process.env.JWT_SECRET_KEY
    );
    // console.log(decoded);
    req.seller = await shopmodel.findById(decoded.id);
    // console.log(req.seller);
    next();
  } catch (error) {
    // console.log(error.message);
    res.status(500).json({ success: false, message: error.message, error });
  }
};
