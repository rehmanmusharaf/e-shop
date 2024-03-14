const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyparser = require("body-parser");
const { connecttodb } = require("./db/Database");
const ErrorHandler = require("./utils/Errorhandler");
const cors = require("cors");
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
app.use(express.urlencoded({ extended: false }));

connecttodb();
// app.use();
app.get("/", (req, res) => {
  console.log("Server IS Listning!");
  res.send("<h1>Server IS Listning!</h1>");
});

// create user
const user = require("./contollers/user.js");
app.post("/api/create-user", user);
app.post("/api/activation", user);
app.post("/api/login", user);
app.get("/getuser", user);
//  error handling

app.use(ErrorHandler);
module.exports = app;
