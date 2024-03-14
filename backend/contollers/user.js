const express = require("express");
const path = require("path");
const usermodel = require("../models/usermodel");
const router = express.Router();
const ErrorHandler = require("../utils/Errorhandler.js");
const catchasyncerr = require("../middleware/catchAsyncError.js");
var jwt = require("jsonwebtoken");
// const multer = require("multer");
const { upload } = require("../multer.js");
const sendMail = require("../utils/sendMail.js");
const sendToken = require("../utils/sendToken.js");
const { isAuthenticated } = require("../middleware/auth.js");

router.post(
  "/api/create-user",
  upload.single("file"),
  async (req, res, next) => {
    console.log("Api End Point hit");
    const joinpath = path.join(__dirname + "/uploads");
    console.log(joinpath);
    const { name, email, password } = req.body;
    avatar = "NUll";
    try {
      const userdata = await usermodel.findOne({ email });
      if (userdata) {
        console.log("User Already Exist!", userdata);
        res.status(409).json({ success: false, mesage: "USer Already exist" });
        return next(new ErrorHandler("User Already Exists!", 400));
      }

      const url = "null";
      const user = {
        name,
        email,
        password,
        avatar: {
          public_id: "avatarPublicId",
          url: "avatarUrl",
        },
      };

      const activation_token = await createactivationtoken(user);
      const activationurl = `http://localhost:3000/activation/${activation_token}`;
      // console.log("activatoion url is ", activationurl);
      try {
        sendMail({
          email: user.email,
          subject: "Activate Your Acount ",
          message: `Hello ${user.name} PLease Click The Link Bellow To Activate yOur Acount ${activationurl}`,
        });

        res.status(201).json({
          success: true,
          message: "Please Check Your Email To Activate Your Acount",
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 400));
      }

      // res
      //   .status(201)
      //   .json({ success: true, message: "User created successfully", user });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500)); // Handle internal server error
    }
  }
);

async function createactivationtoken(user) {
  try {
    const key = jwt.sign(user, process.env.activationkey, {
      expiresIn: "5m",
    });

    // console.log("Key Is ", key);
    return key;
  } catch (error) {
    return next(new ErrorHandler("Error creating activation token", 500));
  }
}

router.post(
  "/api/activation",
  catchasyncerr(async (req, res, next) => {
    try {
      // console.log("For Activation of token End Point Hit!");
      const { activation_token } = req.body;
      // console.log("Activation token :  ", activation_token);
      const newuser = jwt.verify(activation_token, process.env.activationkey);
      // console.log("User DAta is From Json web Token ", newuser);
      if (!newuser) {
        return next(new ErrorHandler("invalid Handler", 400));
      }
      const { name, email, password, avatar } = newuser;
      const result = await new usermodel({
        name,
        email,
        password,
        avatar,
      });
      await result.save();

      // if(result)
      // {
      console.log("send Token Function Will run ! ");
      sendToken(result, 201, res);
      // }
    } catch (error) {
      res.status(500).json({ success: false, message: error, error });
    }
  })
);

router.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email && !password) {
      return res.status(401).json({
        success: false,
        message: "Please Enter Your Credentials Before Login",
      });
    }
    const user = await usermodel.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Credenetials" });
    }
    console.log("user is ", user);
    const validate = await user.comparePassword(password);
    // console.log("bcrypt comparison result : ", validate);

    if (!validate) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Credentials" });
    }
    sendToken(user, 200, res);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something Went Wrong ",
      error: error.message,
    });
  }
});

router.get("/getuser", isAuthenticated, async (req, res) => {
  try {
    // console.log(req.user);
    const user = await usermodel.findById(req.user._id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: error.message, error: error });
  }
});

module.exports = router;
