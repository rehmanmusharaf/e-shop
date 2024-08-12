const express = require("express");
const path = require("path");
const shopmodel = require("../models/shopmodel");
const product = require("../models/product.js");
const router = express.Router();
const ErrorHandler = require("../utils/Errorhandler.js");
const catchasyncerr = require("../middleware/catchAsyncError.js");
const eventmodel = require("../models/event.js");
const cloudinary = require("cloudinary").v2;

const {
  isAuthenticated,
  sellerAuthenticated,
  isAdmin,
} = require("../middleware/auth.js");
const { upload } = require("../multer.js");

router.post(
  "/event/create-event",
  upload.array("images"),
  async (req, res, next) => {
    try {
      const { shopId } = req.body;
      const shop = await shopmodel.findById(shopId);
      if (!shop) {
        return res
          .status(401)
          .json({ success: false, message: "Shop not found!" });
      }

      // Initialize arrays for storing results
      let imagesLinks = [];
      let response = [];

      // Upload all files to Cloudinary
      const uploadPromises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
          cloudinary.uploader.upload(file.path, (error, result) => {
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

      // Prepare event data for saving
      let eventdata = req.body;
      eventdata.images = imagesLinks;
      console.log("event data", eventdata);

      eventdata.shop = shop;

      console.log("Event data before saving:", eventdata);

      if (!eventdata) {
        return res
          .status(400)
          .json({ success: false, message: "Information not properly found!" });
      }

      // Save event data
      const data = await eventmodel.create(eventdata);
      console.log("Data is:", data);
      res
        .status(200)
        .json({ success: true, message: "Information found!", data });
    } catch (error) {
      console.error("Error is:", error);
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
    // const result = await eventmodel.findById(id);

    if (result && result.images) {
      for (let i = 0; i < result.images.length; i++) {
        try {
          console.log("result.images is:", result.images);
          const result2 = await cloudinary.uploader.destroy(
            result.images[i].public_id
          );
          console.log(
            `Deleted image with public_id ${result2.images[i].public_id}: ${result2}`
          );
        } catch (error) {
          console.error(
            `Failed to delete image with public_id ${result.images[i].public_id}:`,
            error
          );
        }
      }
    }

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

// delete event of a shop
router.delete("/delete-shop-event/:id", async (req, res, next) => {
  try {
    console.log("delete event end point hit?");
    const event = await eventmodel.findById(req.params.id);

    if (!event) {
      return next(new ErrorHandler("event is not found with this id", 404));
    }

    // for (let i = 0; 1 < event.images.length; i++) {
    //   const result = await cloudinary.v2.uploader.destroy(
    //     event.images[i].public_id
    //   );
    // }

    await event.deleteOne();

    res.status(201).json({
      success: true,
      message: "Event Deleted successfully!",
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
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

// get all events
router.get("/get-all-events", async (req, res, next) => {
  try {
    const events = await eventmodel.find();
    res.status(201).json({
      success: true,
      events,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});

// get all events of a shop
router.get("/get-all-events/:id", async (req, res, next) => {
  try {
    const events = await Event.find({ shopId: req.params.id });

    res.status(201).json({
      success: true,
      events,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});
module.exports = router;
