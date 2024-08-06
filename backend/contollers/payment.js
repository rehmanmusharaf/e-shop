const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncError");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.post(
  "/payment/process",
  catchAsyncErrors(async (req, res, next) => {
    const myPayment = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "pkr",
      payment_method_types: ["card"],
      metadata: {
        company: "Muhammad Rehman Company",
      },
    });
    console.log("API Endpoint Hit, my payment is: ", myPayment.client_secret);
    res.status(200).json({
      success: true,
      client_secret: myPayment,
    });
  })
);

router.get(
  "/payment/stripeapikey",
  catchAsyncErrors(async (req, res, next) => {
    console.log("stripe api key is: ", process.env.STRIPE_API_KEY);
    res.status(200).json({ stripeApikey: process.env.STRIPE_API_KEY });
  })
);

module.exports = router;
