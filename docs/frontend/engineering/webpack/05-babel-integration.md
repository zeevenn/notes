---
title: webpack-babel
date: 2022-05-16
category:
  - 工程化
tag:
  - 项目打包
  - webpack
---

> 项目地址：https://github.com/Stephen-wzw/webpack-demo

babel 是一个工具链，主要用于旧浏览器或环境中将 ECMAScript 2015+ 的代码转换成向后兼容版本的 JavaScript。

```js
[1, 2, 3].map((n) => n + 1);

// babel 转换后
[1, 2, 3].map(function(n) {
  return n + 1;
});
```

## 安装

babel 本身可以作为一个独立的工具单独使用，但是在实际开发中，通常会在 webpack 等构建工具中配置 babel 来对其使用。

```bash
npm install babel-loader @babel/core -D
```

> `@babel/core` 是 babel 的核心代码，必须安装。

## 使用

安装完成后，修改 `webpack.config.js` 及 `index.js`：

**webpack.config.js**

```diff
  ...

  module.exports = {
    mode: "development",
    devtool: "source-map",
    entry: "./src/index.js",
    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, "dist"), // 需要使用绝对路径
      publicPath: '',
      clean: true
    },
    module: {
      ...
+     {
+       test: /\./js$/,
+       loader: "babel-loader"
+     }
    },
    plugins: [
      ...
    ]
  };
```

**index.js**

```diff
  ...

+ // babel
+ const messages = [1, 2, 3];
+ messages.map((n) => n + 1);
```

重新执行打包后，查看 `bundle.js`，发现打包后的文件仍然是 es6 语法：

**bundle.js**

```js
const messages = [1, 2, 3];
messages.map((n) => n + 1);
```

这是因为 babel 在转换过程中，需要使用对应插件转换对应语法，因此我们需要安装相应插件。

比如需要转换箭头函数，可以安装 `@babel/plugin-transform-arrow-functions`，需要将 `const` 转换为 `var`，则需要安装 `@babel/plugin-transform-block-scoping`。

```bash
npm install @babel/plugin-transform-arrow-functions @babel/plugin-transform-block-scoping -D
```

安装成功后修改下 `babel-loader` 的配置：

```diff
  {
    test: /\.js$/,
-   loader: "babel-loader",
+   use: {
+     loader: "babel-loader",
+     options: {
+       plugins: [
+         "@babel/plugin-transform-arrow-functions",
+         "@babel/plugin-transform-block-scoping"
+       ]
+     }
+   }
  }
```

此时再执行下 `npm run build` 重新打包，查看 `bundle.js` 可以看到已经做了转换：

**bundle.js**

```js
var messages = [1, 2, 3];
messages.map(function (n) {
  return n + 1;
});
```

但是如果要转换的内容过多，一个个插件安装起来比较麻烦，可以使用 babel 提供的预设（preset）。

常见的预设有三个：

* env
* react
* TypeScript

在这里安装 `@babel/preset-env`：

```bash
npm install @babel/preset-env -D
```

**webpack.config.js**

```diff
  {
    test: /\.js$/,
    use: {
      loader: "babel-loader",
      options: {
-       plugins: [
-         "@babel/plugin-transform-arrow-functions",
-         "@babel/plugin-transform-block-scoping"
-       ],
+       presets: [
+         "@babel/preset-env"
+       ]
      }
    }
  }
```

执行 `npm run build` 重新打包，查看 `bundle.js` 也可以达到一样的效果。

## babel 的配置文件

可以将 bebel 的配置信息放到一个独立的文件，有两种方式：

* babel.config.json(或者 .js, .cjs, .mjs) 文件
* .babelrc.json(或者 .babelrc, .js, .cjs, .mjs) 文件

这二者的区别在于前者是早期使用较多的配置方式，但是对于配置 Monorepos 项目比较麻烦；后者是 babel7 以后的配置方式，可以直接用于 Monorepos 项目的子包，更加推荐。

在项目中新增 `babel.config.js`，并修改 `webpack.config.js`：

**babel.config.js**

```js
module.exports = {
  presets: [
    "@babel/preset-env"
  ]
};
```

**webpack.config.js**

```diff
- {
-   test: /\.js$/,
-   use: {
-     loader: "babel-loader",
-     options: {
-       // plugins: [
-       //   "@babel/plugin-transform-arrow-functions",
-       //   "@babel/plugin-transform-block-scoping"
-       // ],
-       presets: [
-         "@babel/preset-env"
-       ]
-     }
-   }
- }
+ {
+   test: /\.js$/,
+   loader: "babel-loader"
+ }
```

重新打包后，语法转换仍然生效。

## 总结

webpack 中的 `babel-loader` 依赖于 `@babel/core`，而他生效需要借助不同的语法转换插件，当需要转换的内容过多时，可以使用 babel 提供的预设完成。同时 babel 还能单独写一个配置文件。