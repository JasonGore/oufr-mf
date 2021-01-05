const { ModuleFederationPlugin } = require("webpack").container;
const path = require("path");
const deps = require("./package.json").dependencies;

module.exports = {
  entry: "./src/index",
  mode: "development",
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    port: 8032,
  },
  output: {
    publicPath: "auto",
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          presets: ["@babel/preset-react"],
        },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "mf",
      filename: "remoteEntry.js",
      exposes: {
        "./Fabric": "./src/index",
        // TODO: it seems having multiple exports of the same things causes a react MF error?
        // remoteEntry.js:443 Uncaught (in promise) ChunkLoadError: Loading chunk webpack_sharing_consume_default_react_react failed.
        // (error: http://localhost:3002/webpack_sharing_consume_default_react_react.js)
        //     at Object.__webpack_require__.f.j (http://localhost:3002/remoteEntry.js:443:29)
        //     at http://localhost:3002/remoteEntry.js:84:40
        // "./PrimaryButton": "./src/PrimaryButton"
      },
      shared: {
        react: { singleton: true },
        "react-dom": { singleton: true },
      },
    }),
  ],
};