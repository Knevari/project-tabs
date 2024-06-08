const rspack = require("@rspack/core");
const ReactRefreshPlugin = require("@rspack/plugin-react-refresh");

const isProd = process.env.NODE_ENV === "production";

module.exports = {
  mode: isProd ? "production" : "development",
  entry: "./src/index.tsx",
  output: {
    filename: "bundle.js",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        use: {
          loader: "builtin:swc-loader",
          options: {
            jsc: {
              parser: {
                syntax: "ecmascript",
                jsx: true,
              },
            },
          },
        },
        type: "javascript/auto",
      },
      {
        test: /\.tsx$/,
        use: {
          loader: "builtin:swc-loader",
          options: {
            jsc: {
              parser: {
                syntax: "typescript",
                tsx: true,
              },
            },
          },
        },
        type: "javascript/auto",
      },
    ],
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: "./popup.html",
      filename: "index.html",
    }),
    new rspack.CopyRspackPlugin({
      patterns: [
        {
          from: "./public",
        },
      ],
    }),
    !isProd && new ReactRefreshPlugin(),
  ].filter(Boolean),
};
