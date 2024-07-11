const path = require("path");
const Dotenv = require("dotenv-webpack");

module.exports = {
  mode: "development",
  entry: "./src/index.js", // Đường dẫn tới file index.js của bạn
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [new Dotenv()],
};
