---
title: webpack 环境分离
date: 2022-05-17
category:
  - 工程化
tag:
  - 项目打包
  - webpack
---

> 项目地址：https://github.com/Stephen-wzw/webpack-demo

development(开发环境) 和 production(生产环境) 这两个环境下的构建目标存在着巨大差异。由于要遵循逻辑分离，需要为每个环境编写彼此独立的 webpack 配置。

## 配置

先安装 `webpack-merge`。

```bash
npm install webpack-merge -D
```

**project**

```diff
webpack-demo
  |- node_modules
  |- package-lock.json
  |- package.json
  |- postcss.config.js
  |- babel.config.js
- |- webpack.config.js
+ |- webpack.common.js
+ |- webpack.prod.js
+ |- webpack.dev.js
  |- /public
  |- /src
```

**webpack.common.js**

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { DefinePlugin } = require("webpack");
const { VueLoaderPlugin } = require("vue-loader/dist/index");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"), // 需要使用绝对路径
    publicPath: '',
    clean: true
  },
  resolve: {
    extensions: ['.wasm', '.mjs', '.js', '.json', '.jsx', '.vue', '.ts'],
    alias: {
      '@': path.resolve(__dirname, './src'),
      'js': path.resolve(__dirname, './src/js')
    }
  },
  module: {
    rules: [
      {
        test: /\.(less|css)$/,
        use: ["style-loader", "css-loader", "postcss-loader", "less-loader"],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        type: "asset",
        generator: {
          filename: "img/[name]_[hash:8][ext]"
        },
        parser: {
          dataUrlCondition: {
            maxSize: 100 * 1024
          }
        }
      },
      {
        test: /\.(eot|ttf|woff2?)$/,
        type: "asset/resource",
        generator: {
          filename: "font/[name]_[hash:6][ext]"
        }
      },
      {
        test: /\.js$/,
        loader: "babel-loader"
      },
      {
        test: /\.vue$/,
        loader: "vue-loader"
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "webpack-plugin",
      template: "./public/index.html"
    }),
    new DefinePlugin({
      BASE_URL: "'./'",
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false
    }),
    new VueLoaderPlugin()
  ]
};
```

**webpack.dev.js**

```js
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "source-map",
  devServer: {
    hot: true,
    host: "0.0.0.0",
    port: 8000,
    open: true,
    compress: true,
    proxy: {
      "/api": {
        target: "http://localhost:8888",
        pathRewrite: {
          "^/api": ""
        },
        secure: false,
        changeOrigin: true
      }
    }
  },
})
```

**webpack.prod.js**

```js
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

const CopyPlugin = require("copy-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "public",
          globOptions: {
            ignore: ['**/index.html']
          }
        }
      ]
    }),
  ]
})
```

**package.json**

```diff
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
-   "build": "webpack",
+   "build": "webpack --config webpack.prod.js",
    "watch": "webpack --watch",
-   "serve": "webpack serve"
+   "serve": "webpack serve --config webpack.dev.js"
  },
```