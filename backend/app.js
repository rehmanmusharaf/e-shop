const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyparser = require("body-parser");
const { connecttodb } = require("./db/Database");
const ErrorHandler = require("./utils/Errorhandler");
const shop = require("./contollers/shop.js");
const cors = require("cors");
const coupons = require("./contollers/coupons.js");
const shopmodel = require("./models/shopmodel.js");
const productmodel = require("./models/product.js");
const orders = require("./contollers/order.js");
const conversation = require("./contollers/conversation.js");
const withdraw = require("./contollers/withdraw.js");
const cloudinary = require("cloudinary").v2;
// const multer = require("multer");
// var upload = multer();
// const corsOptions = {
//   origin: process.env.frontendurl,
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   credentials: true,
//   optionsSuccessStatus: 204,
// };
app.use(
  cors({
    origin: [process.env.frontendurl],
    credentials: true,
  })
);
// origin: process.env.frontendurl,
// credentials: true, //access-control-allow-credentials:true
// optionSuccessStatus: 200,
// app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use("/", express.static("uploads"));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
// for parsing application/json
// app.use(
//   bodyparser.json({
//     limit: "50mb",
//   })
// );
// for parsing application/xwww-form-urlencoded
// app.use(
//   bodyparser.urlencoded({
//     limit: "50mb",
//     extended: true,
//   })
// );

// for parsing multipart/form-data
// app.use(upload.array());
// app.use(express.urlencoded({ extended: false }));

connecttodb();
// app.use();

// create user
const user = require("./contollers/user.js");
const product = require("./contollers/product.js");
const events = require("./contollers/events.js");
const payment = require("./contollers/payment");
const order = require("./models/order.js");
const message = require("./contollers/message.js");
const { upload } = require("./multer.js");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
app.get("/", (req, res) => {
  console.log("frontend url is: ", process.env.frontendurl);
  try {
    return res.send("<h1>Server IS Listning!</h1>");
  } catch (error) {
    console.log("error Something Went Wrong!");
    return res
      .status(500)
      .json({ message: "Something Went Wrong!", error: error.message });
  }
});
app.post("/test", upload.array("files"), async (req, res) => {
  let response = [];
  console.log("req.files is:", req.files);
  const uploadPromises = req.files.map((file) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(file.path, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  });

  response = await Promise.all(uploadPromises);
  console.log("here is the upload Result", response);
  res.status(200).json({ success: true, result: response });
});
app.post("/api/create-user", user);
app.post("/api/activation", user);
app.post("/api/login", user);
app.get("/getuser", user);
app.get("/user/logout", user);
app.post("/shop/create-shop", shop);
app.post("/shop/login-shop", shop);
app.post("/shop/shopactivation", shop);
app.put("/shop/update-shop-avatar", shop);
app.get("/shop/getseller", shop);
app.get("/shop/logout", shop);
app.put("/shop/update-seller-info", shop);
app.get("/get-shop-info/:id", shop);
app.get("/admin-all-sellers", shop);
app.delete("/delete-seller/:id", shop);
app.put("/update-payment-methods", shop);
app.delete("/delete-withdraw-method/", shop);

app.post("/product/create-product", product);
app.get("/get-all-products-shop/:id", product);
app.delete("/delete-shop-product/:id", product);
app.get("/get-all-products", product);
app.put("/create-new-review", product);
app.get("/admin-all-products", product);
app.post("/event/create-event", events);
app.get("/event/getallevents/:id", events);
app.get("/get-all-events", events);
app.delete("/event/deleteevent/:id", events);
app.get("/admin-all-events", events);
app.delete("/delete-shop-event/:id", events);

app.get("/coupon/get-coupon-value/:name", coupons);
app.post("/coupon/create-coupon-code", coupons);
app.put("/user/update-user-info", user);
app.put("/user/update-avatar", user);
app.put("/user/update-user-addresses", user);
app.delete("/user/delete-user-address/:id", user);
app.put("/user/update-user-password", user);
app.get("/user-info/:id", user);
app.get("/admin-all-users", user);
app.delete("/delete-user/:id", user);
app.post("/payment/process", payment);
app.get("/payment/stripeapikey", payment);
app.post("/create-order", orders);
app.get("/get-all-orders/:userId", orders);
app.get("/get-seller-all-orders/:shopId", orders);
app.put("/update-order-status/:id", orders);
app.put("/order-refund/:id", orders);
app.put("/order-refund-success/:id", orders);
app.get("/admin-all-orders", orders);
app.post("/create-new-conversation", conversation);
app.get("/get-all-conversation-seller/:id", conversation);
app.get("/get-all-conversation-user/:id", conversation);
app.put("/update-last-message/:id", conversation);
app.post("/create-new-message", message);
app.get("/get-all-messages/:id", message);
app.post("/create-withdraw-request", withdraw);
app.get("/get-all-withdraw-request", withdraw);
app.put("/update-withdraw-request/:id", withdraw);
module.exports = app;
