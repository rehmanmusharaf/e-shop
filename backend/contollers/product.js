const express = require("express");
const path = require("path");
const shopmodel = require("../models/shopmodel");
const product = require("../models/product.js");
const router = express.Router();
const ErrorHandler = require("../utils/Errorhandler.js");
const catchasyncerr = require("../middleware/catchAsyncError.js");
var jwt = require("jsonwebtoken");
const multer = require("multer");
const { upload } = require("../multer.js");
const sendMail = require("../utils/sendMail.js");
const sendToken = require("../utils/shopToken.js");
const Order = require("../models/order.js");
const cloudinary = require("cloudinary");
const {
  isAuthenticated,
  sellerAuthenticated,
  isAdmin,
} = require("../middleware/auth.js");

// const multer = require("multer");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./uploads");
//     // Destination folder where files will be stored
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//     // Use the original filename
//   },
// });

// const upload = multer({ storage: storage });
router.post(
  "/product/create-product",
  sellerAuthenticated,
  upload.array("images"),
  async (req, res) => {
    try {
      const {
        shopId,
        name,
        description,
        category,
        tags,
        originalPrice,
        discountPrice,
        stock,
      } = req.body;
      const shop = await shopmodel.findById(shopId);
      if (!shop) {
        return res
          .status(404)
          .json({ success: false, message: "Shop Doesn't exist" });
      }

      // const files = req.files;
      // let images = files.map((value, index) => {
      //   return { public_id: value.originalname, url: value.filename };
      // });
      // cloudinary start
      // Initialize arrays for storing results
      let imagesLinks = [];
      let response = [];

      // Upload all files to Cloudinary
      const uploadPromises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
          cloudinary.v2.uploader.upload(file.path, (error, result) => {
            if (error) {
              console.log("cloudinary image upload error:", error);
              reject(error);
            } else {
              console.log("cloudinary image upload result:", result);
              resolve(result);
            }
          });
        });
      });

      response = await Promise.all(uploadPromises);

      // Map upload results to imagesLinks
      response.forEach((element) => {
        imagesLinks.push({
          public_id: element.public_id,
          url: element.secure_url,
        });
      });

      // cloudinary end
      const productData = {
        shopId,
        name,
        description,
        category,
        tags,
        originalPrice,
        discountPrice,
        stock,
        images: response,
      };
      // console.log("Name is : ", name);
      productData.shop = shop;
      // console.log("log before creation of product", productData);
      const productresult = "awaited";
      await product.create(productData);
      res.status(201).json({
        success: false,
        productresult,
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }
);
router.get(
  "/get-all-products-shop/:id",
  sellerAuthenticated,
  async (req, res, next) => {
    try {
      // console.log("Api End Point Hit! ");
      const { id } = req.params;
      const products = await product.find({ shopId: id });
      // console.log("Find Products : ", products);
      if (products == null) {
        return res.status(204).json({
          success: true,
          message: `No Products Found IN Your Shop`,
          products,
        });
      }
      return res.status(200).json({
        success: true,
        message: `${products.length} products Found`,
        products,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error! " });
    }
  }
);

router.delete(
  "/delete-shop-product/:id",
  sellerAuthenticated,
  async (req, res, next) => {
    try {
      const deletedproduct = await product.findByIdAndDelete({
        _id: req.params.id,
      });
      if (deletedproduct && deletedproduct.images) {
        for (let i = 0; i < deletedproduct.images.length; i++) {
          try {
            const result = await cloudinary.v2.uploader.destroy(
              deletedproduct.images[i].public_id
            );
            console.log(
              `Deleted image with public_id ${deletedproduct.images[i].public_id}: ${result.result}`
            );
          } catch (error) {
            console.error(
              `Failed to delete image with public_id ${deletedproduct.images[i].public_id}:`,
              error
            );
          }
        }
      }
      // for (let i = 0; i < deletedproduct.images.length; i++) {
      //   console.log("loop run");
      //   const result = await cloudinary.v2.uploader.destroy(
      //     deletedproduct.images[i].public_id
      //   );

      //   console.log(
      //     `Deleted image with public_id ${deletedproduct.images[i].public_id}: ${result.result}`
      //   );
      // }

      if (deletedproduct == null) {
        return res
          .status(401)
          .json({ success: false, message: "Product Not Found With This ID" });
      }
      return res
        .status(200)
        .json({ success: true, message: "Product Deleted Successfully!" });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal Server error",
        error: error.message,
      });
    }
  }
);
// get all products
router.get("/get-all-products", async (req, res, next) => {
  try {
    const products = await product.find().sort({ createdAt: -1 });
    console.log("Products count is: ", products.length);

    res.status(201).json({
      success: true,
      products,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ sucess: false, message: "Internal Problem", error });
    // return next(new ErrorHandler(error, 400));
  }
});

// review for a product
router.put("/create-new-review", isAuthenticated, async (req, res, next) => {
  try {
    const { user, rating, comment, productId, orderId } = req.body;

    const product2 = await product.findById(productId);

    const review = {
      user,
      rating,
      comment,
      productId,
    };

    const isReviewed = product2.reviews.find(
      (rev) => rev.user._id === req.user._id
    );

    if (isReviewed) {
      product2.reviews.forEach((rev) => {
        if (rev.user._id === req.user._id) {
          (rev.rating = rating), (rev.comment = comment), (rev.user = user);
        }
      });
    } else {
      product2.reviews.push(review);
    }

    let avg = 0;

    product2.reviews.forEach((rev) => {
      avg += rev.rating;
    });

    product2.ratings = avg / product2.reviews.length;

    await product2.save({ validateBeforeSave: false });
    await Order.findByIdAndUpdate(
      orderId,
      { $set: { "cart.$[elem].isReviewed": true } },
      { arrayFilters: [{ "elem._id": productId }], new: true }
    );

    res.status(200).json({
      success: true,
      message: "Reviwed succesfully!",
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});

// all products --- for admin
router.get(
  "/admin-all-products",
  isAuthenticated,
  isAdmin("Admin"),
  async (req, res, next) => {
    try {
      const products = await product.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

module.exports = router;
