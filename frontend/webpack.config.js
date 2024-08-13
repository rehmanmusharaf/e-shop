const path = require("path");

module.exports = {
  entry: "./src/index.js", // Your entry point file
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  resolve: {
    extensions: [".jsx", "js"],
  },
  stats: {
    warnings: false, // Ignore source map warnings
  },
};
