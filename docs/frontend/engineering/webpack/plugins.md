---
title: webpack 插件
date: 2022-05-14
category:
  - 工程化
tag:
  - 项目打包
  - webpack
---

> 项目地址：https://github.com/Stephen-wzw/webpack-demo

前面介绍了 webpack loader 打包 JavaScript、CSS、图片和字体等模块资源，这次介绍 webpack 中的另外一个核心：**插件**。

> webpack 官方文档描述了二者区别：loader 用于转换某些类型的模块，而插件可以执行范围更广的任务，包括：打包优化、资源管理、注入环境变量等。

## 清理 dist 文件

在前面的项目中，每次重新打包其实都略去了一步：手动删除 dist 文件夹。在 webpack5 以前，可以借助 `CleanWebpackPlugin` 来帮我们完成这个操作。而 webpack5 中，在 `output` 中设置 `clean: true` 即可。


```diff
  const path = require("path");
  
  module.exports = {
    entry: "./src/index.js",
    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, "dist"), // 需要使用绝对路径
      publicPath: './dist/',
+     clean: true
    },
    module: {
      ...
    },
  };
```

## `HtmlWebpackPlugin`

在之前的项目中，`index.html` 文件编写在根目录下，而最终打包的 dist 文件中没有 `index.html` 文件。在进行项目部署的时候，必然也是需要有对应的入口文件 `index.html`。

对 `index.html` 进行打包处理可以使用 `HtmlWebpackPlugin`。

```bash
npm install html-webpack-plugin -D
```

```diff
  const path = require("path");
+ const HtmlWebpackPlugin = require("html-webpack-plugin");
  
  module.exports = {
    entry: "./src/index.js",
    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, "dist"), // 需要使用绝对路径
-     publicPath: './dist/',
+     publicPath: '',
      clean: true
    },
    module: {
      ...
    },
+   plugins: [
+     new HtmlWebpackPlugin({
+       title: "webpack-plugin"
+     })
+   ]
  };
```

当执行 `npm run build` 时，会自动生成一个 `index.html` 文件，它在默认情况下是根据 ejs 的一个模板生成的。

> 在 `HtmlWebpackPlugin` 源码中，有一个 `default_index.ejs` 模块。

当我们想自定义一个模板时，比如开发 Vue 项目时，需要一个挂载后续组件的根标签。

这时我们修改下项目目录结构：

**project**

```diff
  webpack-demo
  |- node_modules
  |- package-lock.json
  |- package.json
- |- index.html
+ |- /public
+   |- favicon.ico
+   |- index.html
  |- /src
    |- /css
      |- style.css
      |- title.less
    |- /font
      |- iconfont.css
      |- iconfont.eot
      |- iconfont.ttf
      |- iconfont.woff
      |- iconfont.woff2
    |- /img
      |- avatar.png
      |- wallpaper.png
    |- /js
      |- format.js
      |- math.js  
    |- index.js
```

**public/index.html**

```html
<!DOCTYPE html>
<html lang="">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <link rel="icon" href="<%= BASE_URL %>favicon.ico">
    <title><%= htmlWebpackPlugin.options.title %></title>
  </head>
  <body>
    <noscript>
      <strong>We're sorry but <%= htmlWebpackPlugin.options.title %> doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
    </noscript>
    <div id="app"></div>
    <!-- built files will be auto injected -->
  </body>
</html>
```

这时可以修改 `webpack.config.js`：

```diff
  const path = require("path");
+ const HtmlWebpackPlugin = require("html-webpack-plugin");
  
  module.exports = {
    entry: "./src/index.js",
    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, "dist"), // 需要使用绝对路径
      publicPath: '',
      clean: true
    },
    module: {
      ...
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: "webpack-plugin",
+       template: "./public/index.html"
      })
    ]
  };
```

但是现在打包仍然会报错：

```bash
ERROR in   ReferenceError: BASE_URL is not defined
```

因为在编译的时候，有一个 `BASE_URL`：`<link rel="icon" href="<%= BASE_URL %>favicon.ico">`，但是我们并没有设置过这个值，因此会报错，这时我们可以使用 `DefinePlugin` 插件。

## `DefinePlugin`

`DefinePlugin` 允许在编译时创建配置的全局变量，是 webpack 内置的插件，不需要单独安装。

**webpack.config.js**

```diff
  const path = require("path");
  const HtmlWebpackPlugin = require("html-webpack-plugin");
+ const { DefinePlugin } = require("webpack");

  module.exports = {
    entry: "./src/index.js",
    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, "dist"), // 需要使用绝对路径
      publicPath: '',
      clean: true
    },
    module: {
      ...
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: "webpack-plugin",
        template: "./public/index.html"
      }),
+     new DefinePlugin({
+       BASE_URL: "'./'"
+     })
    ]
  };
```

现在重新输入 `npm run build` 进行打包，则不会出现刚才的错误。

## `CopyWebpackPlugin`

经过上述步骤的处理后，虽然打包成功，但是网站图标没有被打包进 `dist` 文件夹。在 Vue 项目的打包过程中，如果我们将一些文件夹放到 `public` 文件夹中，那么这个目录会被复制到 `dist` 文件夹中。

这个功能可以通过 `CopyWebpackPlugin` 完成。

```bash
npm install copy-webpack-plugin -D
```

```diff
  const path = require("path");
  const HtmlWebpackPlugin = require("html-webpack-plugin");
  const { DefinePlugin } = require("webpack");
+ const CopyPlugin = require("copy-webpack-plugin");

  module.exports = {
    entry: "./src/index.js",
    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, "dist"), // 需要使用绝对路径
      publicPath: '',
      clean: true
    },
    module: {
      ...
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: "webpack-plugin",
        template: "./public/index.html"
      }),
      new DefinePlugin({
        BASE_URL: "'./'"
      }),
+     new CopyPlugin({
+       patterns: [
+         {
+           from: "public",
+           globOptions: {
+             ignore: ['**/index.html']
+           }
+         }
+       ]
+     })      
    ]
  };
```

复制的规则可以在 `patterns` 中设置：

* `from`：设置从哪个源开始复制；
* `to`：复制到的位置，省略则复制到打包的目录下；
* `globOptions`：设置一些额外的选项。`ignore` 设置忽略的文件，这里设置为忽略 `index.html`，因为它已经通过 `HtmlWebpackPlugin` 完成了打包。

重新执行 `npm run build` 进行打包，可以看到 `favicon.ico` 被复制到了 `dist` 文件夹中，并且浏览器也能正确显示网站图标了。

> 若没显示网站图标，可以清下缓存试试。

## Mode 配置

前面打包的过程中，其实一直报了一个警告：

```bash
WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value.
Set 'mode' option to 'development' or 'production' to enable defaults for each environment.
You can also set it to 'none' to disable any default behavior. Learn more: https://webpack.js.org/configuration/mode/
```

webpack 提供 `mode` 配置选项，告知 webpack 使用相应模式的内置优化。

* `development`：会将 `DefinePlugin` 中 `process.env.NODE_ENV` 的值设置为 `development`，为模块和 chunk 启用有效的名；
* `production`：会将 `DefinePlugin` 中 `process.env.NODE_ENV` 的值设置为 `production`。为模块和 chunk 启用确定性的混淆名称，`FlagDependencyUsagePlugin`，`FlagIncludedChunksPlugin`，`ModuleConcatenationPlugin`，`NoEmitOnErrorsPlugin` 和 `TerserPlugin`。
* `none`：不使用任何默认优化。

![mode配置](/assets/image/frontend/tool/webpack/004/mode.png)

在开发阶段，通常会设置 `mode: development`。

为了演示它的作用，可以在 `format.js` 中写个错误代码：

**format.js**

```diff
  const priceFormat = function () {
    return "￥100.8";
  };
  
+ const content = "hello webpack";
+ console.log(content1.length);
  
  // CommonJS
  module.exports = {
    priceFormat,
  };
```

控制台上会报错，但是不会显示具体在原文件的哪个位置。

![without-source-map](/assets/image/frontend/tool/webpack/004/source-map-1.png)

如果需要显示错误的具体位置，那么需要在 `webpack.config.js` 中配置开发模式：

```diff
 // 省略其他 
 module.exports = {
+  mode: "development",
+  devtool: "source-map"
 }
```

其中 `source-map` 可以帮我们快速定位错误位置，在开发模式中，会默认设置 `devtool: "source-map"`。

此时重新打包后，在控制台就会出现错误的具体位置，能够快速帮我们解决 bug。

![with-source-map](/assets/image/frontend/tool/webpack/004/source-map-2.png)

## 总结

webpack5 除了 loader 外，还有插件这一核心概念，他能执行范围更广的任务。

在这个案例中，我们首先介绍了如何清理 `dist` 文件夹；然后介绍如何打包 `index.html` 文件；接着是两个插件 `DefinePlugin` 和 `CopyWebpackPlugin` 的使用，它们可以帮助我们实现 Vue 打包中的一些功能；最后介绍了 webpack 的 `mode` 配置。