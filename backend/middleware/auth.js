const usermodel = require("../models/usermodel");
const ErrorHandler = require("../utils/Errorhandler");
const catchAsyncError = require("./catchAsyncError");
const jsonwebtoken = require("jsonwebtoken");

exports.isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;
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
