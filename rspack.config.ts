import { defineConfig } from "@rspack/cli";
import rspack from "@rspack/core";
import ReactRefreshPlugin from "@rspack/plugin-react-refresh";

const isProd = process.env.NODE_ENV === "production";

const config = defineConfig({
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
        test: /\.(sass|scss)$/,
        use: [
          {
            loader: "sass-loader",
            options: {
              // using `modern-compiler` and `sass-embedded` together significantly improve build performance,
              // requires `sass-loader >= 14.2.1`
              api: "modern-compiler",
              implementation: require.resolve("sass-embedded"),
            },
          },
        ],
        // set to 'css/auto' if you want to support '*.module.(scss|sass)' as CSS Module, otherwise set type to 'css'
        type: "css/auto",
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: {
                  tailwindcss: {},
                  autoprefixer: {},
                },
              },
            },
          },
        ],
        type: "css",
      },
      {
        test: /\.module\.css$/i,
        type: "css/module", // this is enabled by default for module.css,   so you don't need to specify it
      },
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
      template: "./popup/popup.html",
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
});

module.exports = config;
