const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    index: "./src/index.js",
  },
  output: {
    filename: "./dist/index.bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: {
              minimize: true,
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|bmp|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              esModule: false,
              name: "[name].[ext]",
              outputPath: "assets/images/",
              publicPath: "assets/images/",
            },
          },
        ],
      },
      {
        test: /\.(gltf|glb|bin|obj|mtl|fbx|dae|bin|vrm)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              esModule: false,
              name: "[name].[ext]",
              outputPath: "assets/models/",
              publicPath: "assets/models/",
            },
          },
        ],
      },
      {
        test: /\.(ogg|mp3|wav|mpe?g)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              esModule: false,
              name: "[name].[ext]",
              outputPath: "assets/audio/",
              publicPath: "assets/audio/",
            },
          },
        ],
      },
      {
        test: /\.(glsl|vs|fs)$/,
        loader: "shader-loader",
      },
    ],
  },
  devtool: "inline-source-map",
  devServer: {
    contentBase: "./dist",
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Development",
    }),
  ],
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
};
