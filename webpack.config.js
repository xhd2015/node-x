const path = require("path");
const fs = require("fs");

module.exports = {
  entry: {
    run: {
      import: "./run.ts",
      filename: "run.js",
    },
  },
  output: {
    path: path.resolve(__dirname, "bin"),
    libraryTarget: "umd", // for nodejs need this
    globalObject: "globalThis", // goja only recognize globalThis, not the default global.
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        // exclude: /(node_modules)/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
          },
        },
      },
      {
        test: /\.(js)$/,
        exclude: /(node_modules)/,
        resolve: {
          extensions: [".ts", ".js"],
        },
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
    extensions: [".ts", ".js"],
  },
  target: "node",
  plugins: [],
  // devtool: "source-map",
};
