const path = require("path");
const webpack = require("webpack");
require("dotenv").config();
/*
Плагин задает что бы при билде был файл html, так же можно задать
свой файл html как шаблон.
*/
const HtmlWebpackPlugin = require("html-webpack-plugin"); 
/*
Очищает папку с билдом.
*/
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
/*
Позволяет копировать указанные файлы в билд.
*/
const CopyWebpackPlugin = require("copy-webpack-plugin");
/*
Уменьшает размер js файла.
*/ 
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

function setDevTool(isProd) {
  if (isProd === "development") {
    return "inline-source-map";
  } else if (isProd === "production") {
    return "source-map";
  } else {
    return "eval-source-map";
  }
}

const config = {
  entry: "./src/app/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
  },
  devServer: {
    contentBase: "./dist",
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader"],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: true }),
    new HtmlWebpackPlugin({template:"./src/index.html"}),
    new HtmlWebpackPlugin({filename: "second.html", template:"./src/second.html"}),
    // new CopyWebpackPlugin({
    //   patterns: [{ from: __dirname + "/src/public", to: __dirname + "/dist" }],
    // }),
    new webpack.DefinePlugin({
      SOME_CONST_TO_APP: JSON.stringify(process.env.SOME_CONST_TO_APP),
    }),
  ],
};

module.exports = (env) => {
  const ENV = env.MODE;
  config.devtool = setDevTool(ENV);
  config.mode = ENV;
  if (ENV === "production") {
    config.plugins.push(new UglifyJSPlugin());
  }

  config.module.rules.push(
    {
      test: /\.html$/i,
      loader: 'html-loader',
      options: {
        minimize: (ENV === "production")?true:false,
      }
    }
  )

  return config;
};
