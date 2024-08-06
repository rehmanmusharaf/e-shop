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
// app.use(cors());
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use("/", express.static("uploads"));
app.use(bodyparser.urlencoded({ extended: true }));
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
app.get("/", (req, res) => {
  // console.log("Server IS Listning!");
  try {
    return res.send("<h1>Server IS Listning!</h1>");
  } catch (error) {
    console.log("error Something Went Wrong!");
    return res
      .status(500)
      .json({ message: "Something Went Wrong!", error: error.message });
  }
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
app.post("/product/create-product", product);
app.get("/get-all-products-shop/:id", product);
app.delete("/delete-shop-product/:id", product);
app.get("/get-all-products", product);
app.put("/create-new-review", product);
app.post("/event/create-event", events);
app.get("/event/getallevents/:id", events);
app.delete("/event/deleteevent/:id", events);
app.get("/coupon/get-coupon-value/:name", coupons);
app.post("/coupon/create-coupon-code", coupons);
app.put("/user/update-user-info", user);
app.put("/user/update-avatar", user);
app.put("/user/update-user-addresses", user);
app.delete("/user/delete-user-address/:id", user);
app.put("/user/update-user-password", user);
app.get("/user-info/:id", user);
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

module.exports = app;
