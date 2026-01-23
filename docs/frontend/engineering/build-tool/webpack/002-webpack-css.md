---
title: webpack 打包 CSS
date: 2022-05-06
category:
  - 工程化
tag:
  - 项目打包
  - webpack
---

> 项目地址：<https://github.com/Stephen-wzw/webpack-demo>

继续使用[之前的项目](./001-webpack-basic.md)，不过在以下文件做点修改：

**index.html**

```diff
 <!DOCTYPE html>
 <html lang="en">
 <head>
   <meta charset="UTF-8">
   <meta http-equiv="X-UA-Compatible" content="IE=edge">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
-  <title>webpack-demo</title>
+  <title>webpack-css</title>
 </head>
 <body>
-  <script src="./dist/main.js" type="module"></script>
+  <script src="./dist/bundle.js" type="module"></script>
 </body>
 </html>
```

**webpack.config.js**

```diff
 const path = require("path");

 module.exports = {
   entry: "./src/index.js",
   output: {
-    filename: "main.js",
+    filename: "bundle.js",
     path: path.resolve(__dirname, "dist"),  // 需要使用绝对路径
   },
 };
```

> bundle.js 表示为打包的文件，见名知意。

修改完配置文件后，下面在项目中添加一个 `style.css` 文件，并将其 `import` 到 `index.js` 中：

**project**

```diff
  webpack-demo
  |- node_modules
  |- package-lock.json
  |- package.json
  |- index.html
  |- /src
+   |- /css
+     |- style.css
    |- /js
      |- format.js
      |- math.js
    |- index.js
```

**style.css**

```css
.title {
  color: #000;
  font-weight: 700;
  font-size: 30px;

  user-select: none;
}
```

**index.js**

```diff
 import { sum } from "./js/math.js";
 const { priceFormat } = require("./js/format");
+import "../css/style.css";

 console.log(sum(10, 20));
 console.log(priceFormat());

+const div = document.createElement("div");
+div.className = "title";
+div.innerHTML = "webpack-css";
+document.body.appendChild(div);
```

## `css-loader`

现在执行 `npm run build`，会看到报错：

```bash
ERROR in ./src/css/style.css 1:0
Module parse failed: Unexpected token (1:0)
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
> .title {
|   color: #000;
|   font-weight: 700;
 @ ./src/index.js 3:0-25
```

从报错信息中可以知道，需要用一个 loader 处理 css 文件。那么什么是 loader 呢？

- loader 用于对模块的源代码进行转换；
- loader 可以使你在 import 或 "load(加载)" 模块时预处理文件；
- loader 甚至允许你直接在 JavaScript 模块中 import CSS 文件！

而为了能在项目中正常使用 css，需要用到 `css-loader`。

```bash
npm install css-loader -D
```

接下来需要在 `webpack.config.js` 中配置 `css-loader` 的使用：

```diff
 const path = require('path');

 module.exports = {
   entry: './src/index.js',
   output: {
     filename: 'bundle.js',
     path: path.resolve(__dirname, 'dist'),
   },
+ module: {
+   rules: [
+     {
+       test: /\.css$/i,
+       use: ['css-loader'],
+     },
+   ],
+ },
 };
```

此时再次执行 `npm run build`，虽然不报错了，但是样式并没有应用成功，这是为什么呢？难道是 css-loader 不起作用吗？

这是因为 `css-loader` 只能将 .css 文件导入到 JavaScript 文件中，也就是它只负责**解析**，不负责**将解析后的 css 插入到页面中**。

如果希望完成这个插入操作，需要用到 `style-loader`。

## `style-loader`

```bash
npm install style-loader -D
```

同时在 `webpack.config.js` 中配置 `style-loader` 的使用：

```diff
 const path = require("path");

 module.exports = {
   entry: "./src/index.js",
   output: {
     filename: "bundle.js",
     path: path.resolve(__dirname, "dist"),  // 需要使用绝对路径
   },
   module: {
     rules: [
       {
         test: /\.css$/i,
-        use: ['css-loader'],
+        use: ['style-loader', 'css-loader'],
       },
     ],
   },
 };
```

`style-loader` 需要写在 `css-loader` 之前，因为 loader 的执行顺序是从后往前的。

现在重新执行 `npm run build`，可以发现样式已经生效了。

## less-loader

在实际开发中，我们可能会使用 less、sass 等预处理器来编写 css 样式，那么如何让项目中支持这些预处理器呢？比如说支持 less。

现在在项目中新增 `title.less` 文件：

**project**

```diff
  webpack-demo
  |- node_modules
  |- package-lock.json
  |- package.json
  |- index.html
  |- /src
    |- /css
      |- style.css
+     |- title.less
    |- /js
      |- format.js
      |- math.js
    |- index.js
```

**title.less**

```less
@bgColor: blue;
@textDecoration: underline;

.title {
  background-color: @bgColor;
  text-decoration: @textDecoration;
}
```

**index.js**

```diff
 import { sum } from "./js/math.js";
 const { priceFormat } = require("./js/format");
 import "./css/style.css";
+import "./css/title.less";

 console.log(sum(10, 20));
 console.log(priceFormat());

 const div = document.createElement("div");
 div.className = "title";
 div.innerHTML = "webpack-css";

 document.body.appendChild(div);
```

现在我们需要安装 `less-loader` 来处理 .less 文件：

```bash
npm install less-loader -D
```

> `less-loader` 会自动使用 less 工具将 .less 文件转换为 .css 文件。

同时在 `webpack.config.js` 中配置 `less-loader` 的使用：

```diff
 const path = require("path");

 module.exports = {
   entry: "./src/index.js",
   output: {
     filename: "bundle.js",
     path: path.resolve(__dirname, "dist"),  // 需要使用绝对路径
   },
   module: {
     rules: [
       {
-        test: /\.css$/i,
+        test: /\.(less|css)$/,
-        use: ['style-loader', 'css-loader'],
+        use: ['style-loader', 'css-loader', 'less-loader'],
       },
     ],
   },
 };
```

现在重新执行 `npm run build`，可以发现 less 样式已经生效了。

## `post-css-loader`

开发中除了使用预处理器外，还可能需要使用 CSS 后处理器 `postcss`。他能帮我们进行 CSS 的转换和适配，比如自动添加浏览器前缀、CSS 样式的重置。

首先安装 `postcss` 和 `postcss-loader`：

```bash
npm install postcss postcss-loader -D
```

还需要安装自动添加前缀的插件 `autoprefixer`：

```bash
npm install autoprefixer -D
```

此时配置 `webpack.config.js`：

**webpack.config.js**

```diff
  const path = require("path");

  module.exports = {
    entry: "./src/index.js",
    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, "dist"),  // 需要使用绝对路径
    },
    module: {
      rules: [
        {
          test: /\.(less|css)$/,
          use: [
            'style-loader',
            'css-loader',
+           {
+             loader: 'postcss-loader',
+             options: {
+               postcssOptions: {
+                 plugins: [
+                   require("autoprefixer")
+                 ]
+               }
+             }
+           },
           'less-loader'],
        },
      ],
    },
  };
```

执行 `npm run build` 打包，在浏览器中查看样式，即可看到 `postcss` 为我们自动添加了前缀：

```css
.title {
  color: #000;
  font-weight: 700;
  font-size: 30px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
```

### `postcss.config.js`

以上的这些配置信息太长了，我们可以将它们单独在一个文件中进行配置，在项目根目录下新建 `postcss.config.js`。

**postcss.config.js**

```js
module.exports = {
  plugins: [require('autoprefixer')]
}
```

**webpack.config.js**

```diff
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"), // 需要使用绝对路径
  },
  module: {
    rules: [
      {
        test: /\.(less|css)$/,
+       use: ["style-loader", "css-loader", "postcss-loader", "less-loader"],
      },
    ],
  },
};
```

重新打包后打开浏览器样式依然生效。

### `postcss-preset-env`

事实上，在配置 `postcss-loader` 的时候，配置插件并不需要使用 `autoprefixer`。可以使用另一个插件 `postscc-preset-env`，它可以帮助我们将一些现代的 CSS 特性，转成大多数浏览器认识的 CSS，并且会根据目标浏览器或者运行时环境添加所需的 ployfill。

> ployfill 用来为旧浏览器提供它没有原生支持的较新的功能。比如说 polyfill 可以让 IE7 使用 Silverlight 插件来模拟 HTML Canvas 元素的功能，或模拟 CSS 实现 rem 单位的支持，或 text-shadow，或其他任何你想要的功能。

这个插件也会自动帮我们添加 autoprefixer。

```bash
npm install postcss-preset-env -D
```

然后修改下 `postcss.config.js` 文件。

**postcss.config.js**

```diff
 module.exports = {
   plugins: [
-    require("autoprefixer")
+    // 在使用某些插件时，也可以直接传入字符串
+    "postcss-preset-env"
   ]
 };
```

重新打包后打开浏览器样式依然生效。

### `postcss-px-to-viewport`

这个插件可以帮助我们将 px 单位转换为视口单位，这在进行移动端适配时尤为重要。详细使用见 [postcss-px-to-view](../../../practice/005-postcss-px-to-viewport.md)。

## 总结

在这个案例里，我们分别使用了 `style-loader` 加载 css 样式， `css-loader` 处理 .css 文件， `less-loader` 处理 .less 文件，以及使用 `postcss` 给样式自动添加前缀。

loader 的执行顺序是从后往前的，因此需要配置规则中写成 `use: ["style-loader", "css-loader", "postcss-loader", "less-loader"]` 。

