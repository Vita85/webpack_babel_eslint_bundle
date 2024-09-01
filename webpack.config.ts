import path from "path";
import webpack from "webpack";
import htmlWebpackPlugin from "html-webpack-plugin";
import type { Configuration as DevServerConfiguration } from "webpack-dev-server";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CssMinimizerWebpackPlugin from "css-minimizer-webpack-plugin";
import ESLintPlugin from "eslint-webpack-plugin";
// import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

type Mode = "production" | "development";

interface EnvVariables {
  mode: Mode;
  port: number;
}

module.exports = (env: EnvVariables) => {
  const config: webpack.Configuration = {
    mode: env.mode ?? "development",
    entry: {
      filename: path.resolve(__dirname, "src/index.ts"),
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name][contenthash].js",
      assetModuleFilename: "[name][ext]",
      clean: true,
    },

    devServer: {
      compress: true,
      port: env.port ?? 9000,
      hot: true,
      static: {
        directory: path.join(__dirname, "dist"),
      },
    },
    optimization: {
      minimizer: [new CssMinimizerWebpackPlugin()],
    },
    plugins: [
      new htmlWebpackPlugin({
        template: path.resolve(__dirname, "src/index.html"),
      }),
      new MiniCssExtractPlugin({
        filename: "[name].[contenthash].css",
      }),
      new ESLintPlugin({ extensions: ["js", "ts", "tsx"], fix: true }),
      // new BundleAnalyzerPlugin(),
    ],

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },

        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, "css-loader"],
        },
        {
          test: /\.less$/i,
          use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
        },
        {
          test: /\.s[ac]ss$/i,
          use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-typescript"],
            },
          },
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
  };

  return config;
};
