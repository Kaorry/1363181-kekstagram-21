const path = require("path");

module.exports = {
  entry: [
    "./js/util.js",
    "./js/api.js",
    "./js/data.js",
    "./js/photo-list.js",
    "./js/filters.js",
    "./js/big-picture.js",
    "./js/editor-effect.js",
    "./js/editor-message.js",
    "./js/editor.js",
    "./js/main.js"
  ],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname),
    iife: true
  },
  devtool: false
};
