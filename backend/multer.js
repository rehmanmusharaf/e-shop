// const multer = require("multer");

// // const storage = multer.diskStorage({
// //   destination: function (req, res, cb) {
// //     console.log("Destination check!");
// //     return cb(null, "./uploads");
// //   },
// //   filename: function (req, file, cb) {
// //     const uniqueSuffix =
// //       Date.now() + "-" + Math.round.apply(Maath.random() * 1e9);
// //     const filename = file.originalname.split(".")[0];
// //     cb(null, file.fieldname + "-" + uniqueSuffix, ".png");
// //   },
// // });

// // exports.upload = multer({ storage: storage });

// 2nd
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "/uploads");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     const filename = file.originalname.split(".")[0];
//     cb(null, file.fieldname + "-" + uniqueSuffix + ".png");
//   },
// });

// exports.upload = multer({ storage: storage });

// const multer = require("multer");

// const storage = multer.diskStorage({
//   destination: function (req, res, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     const filename = file.originalname.split(".")[0];
//     cb(null, filename + "-" + uniqueSuffix + ".png");
//   },
// });

// exports.upload = multer({ storage: storage });

// 3rd

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads"); // Destination folder where files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original filename
  },
});

const upload = multer({ storage: storage });

module.exports = { upload };
