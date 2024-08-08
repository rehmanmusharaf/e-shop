const express = require("express");
const path = require("path");
const shopmodel = require("../models/shopmodel");
const product = require("../models/product.js");
const router = express.Router();
const ErrorHandler = require("../utils/Errorhandler.js");
const catchasyncerr = require("../middleware/catchAsyncError.js");
const eventmodel = require("../models/event.js");
const {
  isAuthenticated,
  sellerAuthenticated,
  isAdmin,
} = require("../middleware/auth.js");
const { upload } = require("../multer.js");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads");
//     // Destination folder where files will be stored
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//     // Use the original filename
//   },
// });

// const upload = multer({ storage: storage });

// sellerAuthenticated,

router.post(
  "/event/create-event",
  upload.array("images"),
  async (req, res, next) => {
    try {
      console.log("req.file is:", req.files);
      // console.log("req.body is :", req.body);
      const files = req.files;
      const { shopId } = req.body;
      const id = shopId;
      const shop = await shopmodel.findById(id);
      if (shop == null) {
        return res
          .status(401)
          .json({ success: false, message: "shop not Found! " });
      }
      let eventdata = req.body;
      eventdata.shop = shop;
      if (eventdata === null) {
        return res
          .status(400)
          .json({ success: false, message: "Information NOt Properly found!" });
      }
      eventdata.images = files.map((value, index) => {
        return { public_id: value.originalname, url: value.filename };
      });
      const data = await eventmodel.create(eventdata);
      res
        .status(200)
        .json({ success: true, message: "Information Found! ", data });
      // res.status(200).json({ shop });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }
);
// sellerAuthenticated,
router.get("/event/getallevents/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const events = await eventmodel.find({ shopId: id });
    if (events == null) {
      return res
        .status(400)
        .json({ success: false, message: "Shop not FOund!" });
    }
    res
      .status(200)
      .json({ success: true, message: "Events Get SuccessFully", events });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server Error",
      error: error.message,
    });
  }
});

router.delete("/event/deleteevent/:id", async (req, res, next) => {
  try {
    // console.log("Api End POint Hit!");
    const { id } = req.params;
    console.log("id is : ", id);
    if (id == null || undefined) {
      return res.status(400).json({ success: false, message: "Id NOt Found" });
    }
    const result = await eventmodel.findByIdAndDelete({ _id: id });
    if (result == null) {
      return res
        .status(400)
        .json({ success: false, message: "Event Not Found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Event Deleted Successfully", result });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internale server Error",
      message: error.message,
    });
  }
});
// all events --- for admin
router.get(
  "/admin-all-events",
  isAuthenticated,
  isAdmin("Admin"),
  async (req, res, next) => {
    try {
      const events = await eventmodel.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        events,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
module.exports = router;
