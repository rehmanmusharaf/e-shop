const mongoose = require("mongoose");
require("dotenv").config();
function connecttodb() {
  mongoose
    .connect(process.env.mongo_url)
    .then((resp) => {
      console.log(`Connection Successfull ${resp.connection.host}`);
    })
    .catch((error) => {
      // console.log(process.env.mongo_url);
      console.log(`Something Went Wrong ${error}`);
    });
}
module.exports = { connecttodb };
