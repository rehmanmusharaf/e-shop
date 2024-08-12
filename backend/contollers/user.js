const express = require("express");
const path = require("path");
const usermodel = require("../models/usermodel");
const router = express.Router();
const ErrorHandler = require("../utils/Errorhandler.js");
const fs = require("fs");
const catchasyncerr = require("../middleware/catchAsyncError.js");
var jwt = require("jsonwebtoken");
// const multer = require("../multer");
const sendMail = require("../utils/sendMail.js");
const sendToken = require("../utils/sendToken.js");
const { isAuthenticated, isAdmin } = require("../middleware/auth.js");
const { upload } = require("../multer.js");
const cloudinary = require("cloudinary");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./uploads");
//     // console.log("destination is : ", destination);
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + "-" + file.originalname);
//   },
// });
// const upload = multer({ storage: storage });

router.post(
  "/api/create-user",
  upload.single("file"),
  async (req, res, next) => {
    const { name, email, password } = req.body;
    // console.log(req.file);
    // avatar = "NUll";
    try {
      const userdata = await usermodel.findOne({ email });
      if (userdata) {
        // console.log("User Already Exist!", userdata);
        res.status(409).json({ success: false, mesage: "USer Already exist" });
        return next(new ErrorHandler("User Already Exists!", 400));
      }

      const url = "null";
      const user = {
        name,
        email,
        password,
        avatar: {
          public_id: req.file.originalname,
          url: req.file.filename,
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
      // console.log("send Token Function Will run ! ");
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
    // console.log("user is ", user);
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

router.get("/user/logout", isAuthenticated, (req, res, next) => {
  try {
    res.cookie("token", null, {
      expires: new Date(0),
      httpOnly: true,
    });
    res
      .status(200)
      .json({ success: true, messaage: "User Logout Successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Somethinng Went Wrong ", error });
  }
});
router.put(
  "/user/update-user-info",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const { name, email, phoneNumber, password } = req.body;
      // console.log("name is:", name);
      if (!name || !email || !phoneNumber || !password) {
        return res
          .status(400)
          .json({ success: false, message: "Your Fields is Incomplete Fill" });
      }
      const user = await usermodel.findOne({ email }).select("+password");
      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid Credentials" });
      }
      // console.log("user is: ", user);
      const passwordcomaprison = await user.comparePassword(password);
      if (!passwordcomaprison) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid Crednetials" });
      }
      user.name = name;
      user.email = email;
      user.phoneNumber = phoneNumber;
      await user.save();
      return res.status(200).json({
        success: true,
        message: "user Information Updated Successfully",
        user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "internaal Server Error",
        error: error.message,
      });
    }
  }
);

router.put(
  "/user/update-avatar",
  upload.single("file"),
  isAuthenticated,
  async (req, res, next) => {
    try {
      console.log("end poitn hit!");
      let existsUser = await usermodel.findById(req.user.id);
      console.log("req.file is:", req.file);
      if (req.body.file !== "") {
        const imageId = existsUser.avatar.public_id;
        await cloudinary.v2.uploader.destroy(imageId);

        const myCloud = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "avatars",
          width: 150,
        });

        existsUser.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      console.log("now existin guse is:", existsUser);
      await existsUser.save();

      res.status(200).json({
        success: true,
        user: existsUser,
      });

      // Path to the file you want to delete
      // console.log("req.file is :", req.file);
      // if (req.file) {
      //   const filename = req.user.avatar.url;
      //   const filePath = `uploads/${filename}`;
      //   await usermodel.findByIdAndUpdate(
      //     req.user._id,
      //     {
      //       avatar: {
      //         public_id: req.file.originalname,
      //         url: req.file.filename,
      //       },
      //     },
      //     { new: true }
      //   );
      //   // Delete the file
      //   fs.unlink(filePath, (err) => {
      //     if (err) {
      //       // console.error("Error deleting file:", err);
      //       return res.status(500).json({
      //         success: false,
      //         message: "File Not Deleted!",
      //         error: err.message,
      //       });
      //     }
      //     return res
      //       .status(200)
      //       .json({ success: true, message: "Image Updated Successfully!" });
      //   });
      // } else {
      //   return res
      //     .status(400)
      //     .json({ success: false, message: "Image Not Found" });
      // }
    } catch (error) {
      console.log("error is:", error);
      return res.status(500).json({
        success: false,
        message: "Image not Deleted!",
        error: error.message,
      });
    }
  }
);

router.put(
  "/user/update-user-addresses",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const user = await usermodel.findById(req.user.id);
      const addressexist = user.addresses.find((address) => {
        return address.addressType === req.body.addressType;
      });
      if (addressexist) {
        return res
          .status(400)
          .json({ success: false, message: "AddressType Already Exist" });
      }

      user.addresses.push(req.body);
      console.log("user is :", user);
      user.save();
      return res.status(200).json({
        success: true,
        message: "User Addresses Added SSuccessfully",
        user,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error!",
        error: error.message,
      });
    }
  }
);

router.delete(
  "/user/delete-user-address/:id",
  isAuthenticated,
  async (req, res) => {
    try {
      // console.log("api end point hit");
      const { id } = req.params;
      if (!id) {
        return res
          .status(400)
          .json({ success: false, message: "Address Id Not Found!" });
      }
      const user = await usermodel.findById(req.user.id);
      user.addresses = user.addresses.filter((address) => {
        return address._id != id;
      });
      user.save();
      return res.status(200).json({
        success: true,
        message: "Address Deleted Successfully!",
        user,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }
);
router.put(
  "/user/update-user-password",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const { oldPassword, newPassword, confirmPassword } = req.body;
      // console.log(oldPassword, newPassword, confirmPassword);
      if (newPassword !== confirmPassword) {
        return res
          .status(400)
          .json({ success: false, message: "New Passord doesn't Match!" });
      }
      const user = await usermodel.findById(req.user.id).select("+password");
      const comparison = await user.comparePassword(oldPassword);
      if (!comparison) {
        return res
          .status(400)
          .json({ success: flase, message: "Invalid Password" });
      }
      user.password = newPassword;
      user.save();
      return res.status(200).json({
        success: true,
        message: "User Information Updated Successfully!",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }
);
// find user infoormation with the userId
router.get("/user-info/:id", async (req, res, next) => {
  try {
    const user = await usermodel.findById(req.params.id);

    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// all users --- for admin
router.get(
  "/admin-all-users",
  isAuthenticated,
  isAdmin("Admin"),
  async (req, res, next) => {
    try {
      const users = await usermodel.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        users,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// delete users --- admin
router.delete(
  "/delete-user/:id",
  isAuthenticated,
  isAdmin("Admin"),
  async (req, res, next) => {
    try {
      const user = await usermodel.findById(req.params.id);

      if (!user) {
        return next(
          new ErrorHandler("User is not available with this id", 400)
        );
      }

      const imageId = user.avatar.public_id;

      await cloudinary.v2.uploader.destroy(imageId);

      await usermodel.findByIdAndDelete(req.params.id);

      res.status(201).json({
        success: true,
        message: "User deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
module.exports = router;
