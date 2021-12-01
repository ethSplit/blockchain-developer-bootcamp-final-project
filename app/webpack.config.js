const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: "./src/dapp.js",
  output: {
    filename: "dapp.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new CopyWebpackPlugin([{ from: "./src/index.html", to: "index.html" }]),
    new CopyWebpackPlugin([{ from: "./src/staking.html", to: "staking.html" }]),
  ],
  devServer: { contentBase: path.join(__dirname, "dist"), compress: true },
};
