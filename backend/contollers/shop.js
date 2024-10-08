const express = require("express");
const path = require("path");
const shopmodel = require("../models/shopmodel");
const router = express.Router();
const ErrorHandler = require("../utils/Errorhandler.js");
const catchAsyncErrors = require("../middleware/catchAsyncError.js");
var jwt = require("jsonwebtoken");
// const multer = require("multer");
const { upload } = require("../multer.js");
const sendMail = require("../utils/sendMail.js");
const cloudinary = require("cloudinary");
const sendToken = require("../utils/shopToken.js");

const {
  isAuthenticated,
  sellerAuthenticated,
  isAdmin,
} = require("../middleware/auth.js");

router.post(
  "/shop/create-shop",
  upload.single("file"),
  async (req, res, next) => {
    try {
      const { name, email, password, zipCode, address, phoneNumber } = req.body;
      console.log("req.file is :", req.file);
      if (!name) {
        return res
          .status(400)
          .json({ success: false, message: "Name not Recieve" });
      } else if (!email) {
        return res
          .status(400)
          .json({ success: false, message: "Email not recieve" });
      } else if (!password) {
        return res
          .status(400)
          .json({ success: false, message: "Password not recieve" });
      } else if (!zipCode) {
        return res
          .status(400)
          .json({ success: false, message: "Zip Code not recieve" });
      } else if (!address) {
        return res
          .status(400)
          .json({ success: false, message: "Address not recieve" });
      } else if (!phoneNumber) {
        return res
          .status(400)
          .json({ success: false, message: "Phone Number not recieve" });
      }
      // cloudinayr start
      let avatar;
      if (req.body.file !== "" || undefined) {
        const myCloud = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "shop",
          width: 150,
        });

        avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      // cloudinary end

      const newshop = {
        name,
        email,
        password,
        zipCode,
        address,
        phoneNumber,
        avatar,
      };
      const activation_token = await createactivationtoken(newshop);

      if (!activation_token) {
        return res
          .status(500)
          .json({ success: false, message: "Error During Getting Token" });
      }
      const activationurl = `${process.env.frontendurl}/seller-acount/${activation_token}`;
      sendMail({
        email: newshop.email,
        subject: "Activate Your Acount ",
        message: `Hello ${newshop.name} PLease Click The Link Bellow To Activate your Acount ${activationurl}`,
      });
      res.status(200).json({
        success: true,
        message: "Please check your Email To Activate Your Acount! ",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something Went Wrong as Internal Server Error",
        error: error.message,
      });
    }
  }
);
async function createactivationtoken(user) {
  const token = jwt.sign(user, process.env.activationkey, {
    expiresIn: "5m",
  });
  return token;
}
router.post("/shop/shopactivation", async (req, res, next) => {
  try {
    const { activation_token } = req.body;
    if (!activation_token) {
      return res
        .status(400)
        .json({ success: false, message: "Token Not Recieved! " });
    }
    const user = jwt.verify(activation_token, process.env.activationkey);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user not Found !" });
    }

    const newuser = new shopmodel(user);
    await newuser.save();
    sendToken(newuser, 201, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Inter Server Error",
      error: error.message,
    });
  }
});
router.post("/shop/login-shop", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email Is required! " });
    } else if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "Password Is required! " });
    }
    const user = await shopmodel.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "No User Found With This Email " });
    }
    const validate = await user.comparePassword(password);
    if (!validate) {
      return res
        .status(401)
        .json({ success: false, message: "invalid Password! " });
    }
    sendToken(user, 200, res);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error ",
      error: error.message,
    });
  }
});
router.get("/shop/getseller", sellerAuthenticated, async (req, res, next) => {
  try {
    // console.log("End point Hit !");
    // console.log(req.seller._id);
    const seller = await shopmodel.findById({ _id: req.seller._id });
    // console.log("Seller Data is :", seller);
    if (!seller) {
      return res
        .status(400)
        .json({ success: false, message: "User not Found! " });
    }
    return res
      .status(200)
      .json({ success: true, message: "user FOund successFully", seller });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});
router.get("/shop/logout", (req, res, next) => {
  try {
    res.cookie("seller_token", null, {
      expires: new Date(0),
      httpOnly: true,
    });
    return res
      .status(200)
      .json({ success: true, message: "Logout SuccessFully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});
// update shop profile picture
router.put(
  "/shop/update-shop-avatar",
  sellerAuthenticated,
  upload.single("file"),
  async (req, res, next) => {
    try {
      let existsSeller = await shopmodel.findById(req.seller._id);
      // console.log("req.file is:", req.file);
      if (req.body.file !== "") {
        const imageId = existsSeller.avatar.public_id;
        await cloudinary.v2.uploader.destroy(imageId);

        const myCloud = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "avatars",
          width: 150,
        });

        existsSeller.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      // const imageId = existsSeller.avatar.public_id;

      // await cloudinary.v2.uploader.destroy(imageId);

      // const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      //   folder: "avatars",
      //   width: 150,
      // });

      // existsSeller.avatar = {
      //   public_id: myCloud.public_id,
      //   url: myCloud.secure_url,
      // };
      // existsSeller.avatar = {
      //   public_id: myCloud.public_id,
      //   url: myCloud.secure_url,
      // };
      await existsSeller.save();

      res.status(200).json({
        success: true,
        seller: existsSeller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
// update seller info
router.put(
  "/shop/update-seller-info",
  sellerAuthenticated,
  async (req, res, next) => {
    try {
      const { name, description, address, phoneNumber, zipCode } = req.body;

      const shop = await shopmodel.findOne(req.seller._id);

      if (!shop) {
        return next(new ErrorHandler("User not found", 400));
      }

      shop.name = name;
      shop.description = description;
      shop.address = address;
      shop.phoneNumber = phoneNumber;
      shop.zipCode = zipCode;

      await shop.save();

      res.status(201).json({
        success: true,
        shop,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// all sellers --- for admin
router.get(
  "/admin-all-sellers",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const sellers = await shopmodel.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        sellers,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete seller ---admin
router.delete(
  "/delete-seller/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const seller = await shopmodel.findById(req.params.id);

      if (!seller) {
        return next(
          new ErrorHandler("Seller is not available with this id", 400)
        );
      }

      await shopmodel.findByIdAndDelete(req.params.id);

      res.status(201).json({
        success: true,
        message: "Seller deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update seller withdraw methods --- sellers
router.put(
  "/update-payment-methods",
  sellerAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { withdrawMethod } = req.body;

      const seller = await shopmodel.findByIdAndUpdate(req.seller._id, {
        withdrawMethod,
      });

      res.status(201).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete seller withdraw merthods --- only seller
router.delete(
  "/delete-withdraw-method/",
  sellerAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const seller = await shopmodel.findById(req.seller._id);

      if (!seller) {
        return next(new ErrorHandler("Seller not found with this id", 400));
      }

      seller.withdrawMethod = null;

      await seller.save();

      res.status(201).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
// get shop info
router.get(
  "/get-shop-info/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shop = await shopmodel.findById(req.params.id);
      res.status(201).json({
        success: true,
        shop,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
