const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

// const upload = multer({ storage: storage });
const upload = multer({
  storage: multer.diskStorage({}),
});
// limits: { fileSize: 500000 },

module.exports = { upload };
