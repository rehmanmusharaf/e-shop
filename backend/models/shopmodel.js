const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var validator = require("validator");
const shopschema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    validate(value) {
      return validator.isEmail(value);
    },
    unique: true,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  password: {
    type: String,
    required: true,
    unique: true,
    select: false,
  },
  zipCode: {
    type: String,
    required: [true, "Please Enter your Zip Code ! "],
  },
  withdrawMethod: {
    type: Object,
  },
  address: {
    type: String,
    required: true,
  },
  availableBalance: {
    type: Number,
    default: 0,
  },
  transections: [
    {
      amount: {
        type: Number,
        required: true,
      },
      status: {
        type: String,
        default: "Processing",
      },
      createdAt: {
        type: Date,
        default: Date.now(),
      },
      updatedAt: {
        type: Date,
      },
    },
  ],
  phoneNumber: {
    type: Number,
    required: [true, "Please Enter Your Phone Number"],
  },
});

shopschema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

shopschema.methods.getJwtToken = async function () {
  try {
    console.log("JWT TOKEN GEnerate Function Run ! ");
    // console.log("id is ", JSON.parse(this._id));

    const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY);
    console.log("User Token Genrated : ", token);
    return token;
  } catch (error) {
    console.log("Something Went WRong Durong Token Generation ! ");
    console.log(error);
    return false;
  }
};
shopschema.methods.comparePassword = async function (enterpassword) {
  return bcrypt.compare(enterpassword, this.password);
};
module.exports = mongoose.model("Shop", shopschema);
