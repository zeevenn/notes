---
title: webpack 打包其他资源
date: 2022-05-13
category:
  - 工程化
tag:
  - 项目打包
  - webpack
---

> 项目地址：<https://github.com/Stephen-wzw/webpack-demo>

继续使用[之前的项目](./0006、webpack打包CSS.md)。

## 打包图片资源

在项目中引入图片文件夹，并添加两张图片：

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
      |- title.less
+   |- /img
+     |- avatar.png
+     |- wallpaper.png
    |- /js
      |- format.js
      |- math.js
    |- index.js
```

下面通过两种方式引入图片资源：

- `img` 元素，设置 `src` 属性；
- 其他元素，css 设置 `background-image` 属性。

**index.js**

```diff
  import { sum } from "./js/math.js";
  const { priceFormat } = require("./js/format");
  import "./css/style.css";
  import "./css/title.less";

+ // 导入图片
+ import avatar from "./img/avatar.png";

  console.log(sum(10, 20));
  console.log(priceFormat());

  const div = document.createElement("div");
  div.className = "title";
  div.innerHTML = "webpack-css";

+ // 方式一：设置 img 元素的 src
+ const imgEl = document.createElement("img");
+ imgEl.src = avatar;
+
+ // 方式二：设置背景图片
+ const bgEl = document.createElement("div");
+ bgEl.className = "image-bg";

  document.body.appendChild(div);
+ document.body.appendChild(imgEl);
+ document.body.appendChild(bgEl);
```

为方式二修改 `style.css` 文件：

**style.css**

```diff
.title {
  color: #000;
  font-weight: 700;
  font-size: 30px;

  user-select: none;
}

+ .image-bg {
+   background-image: url("../img/wallpaper.jpg");
+   background-repeat: no-repeat;
+   background-size: contain;
+   width: 500px;
+   height: 300px;
+ }
```

下面需要配置 `webpack.config.js`，在 webpack5 以前，图片等资源一般使用 `file-loader` 或 `url-loader` 进行打包，但是 webpack5 后，这两个 loader 在官方文档中已经被删掉了，因此使用它们会出现一系列的问题。现在更推荐使用**资源模块类型(asset module type)**进行打包。

但是虽然官方已经不推荐使用了，了解下他们的各自用途还是必要的:

- `file-loader`：将文件发送到输出目录；
- `url-loader`：将文件作为 data URI 内联到 bundle 中，可以将较小的文件转成 base64 的 URI；
- `raw-loader`：将文件导入为字符串。

而在 webpack5 中，通过添加四种新的模块类型，替换上面这些 loader：

- `asset/resource` 发送一个单独的文件并导出 URL。之前使用 `file-loader` 实现；
- `asset/inline` 导出一个资源的 data URI。之前通过使用 `url-loader` 实现；
- `asset/source` 导出资源的源代码。之前通过使用 `raw-loader` 实现；
- `asset` 在导出一个 data URI 和发送一个单独的文件之间自动选择。之前通过使用 `url-loader`，并且配置资源体积限制实现。

那么现在可以对 `webpack.config.js` 配置 `asset` 对图片进行打包：

```diff
 const path = require("path");

 module.exports = {
   entry: "./src/index.js",
   output: {
     filename: "bundle.js",
     path: path.resolve(__dirname, "dist"), // 需要使用绝对路径
+    publicPath: "./dist/",  // 保证 css url 导入时路径正确
   },
   module: {
     rules: [
       {
         test: /\.(less|css)$/,
         use: ["style-loader", "css-loader", "less-loader"]
       },
+      {
+        test: /\.(jpe?g|png|gif|svg)$/,
+        type: "asset",
+        generator: {
+          filename: "img/[name]_[hash:8][ext]"
+        },
+        parser: {
+          dataUrlCondition: {
+            maxSize: 100 * 1024 // 100 kb
+          }
+        }
+      }
     ],
   },
 };
```

`generator` 可以配置生成器的选项，`parser` 可以配置解析器的选项。

> 具体配置项可查阅[官方文档](https://webpack.docschina.org/configuration/module/)。

其中 `dataUrlCondition` 的含义为：如果一个模块源码大小小于 maxSize，那么模块会被作为一个 Base64 编码的字符串注入到包中， 否则模块文件会被生成到输出的目标目录中。

## 打包字体资源

在项目中引入字体文件夹，并添加字体文件：

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
      |- title.less
+   |- /font
+     |- iconfont.css
+     |- iconfont.eot
+     |- iconfont.ttf
+     |- iconfont.woff
+     |- iconfont.woff2
    |- /img
      |- avatar.png
      |- wallpaper.png
    |- /js
      |- format.js
      |- math.js
    |- index.js
```

**index.js**

```diff
 import { sum } from "./js/math.js";
 const { priceFormat } = require("./js/format");
 import "./css/style.css";
 import "./css/title.less";
+import "./font/iconfont.css";

 // 导入图片
 import avatar from "./img/avatar.png";

 console.log(sum(10, 20));
 console.log(priceFormat());

 const div = document.createElement("div");
 div.className = "title";
 div.innerHTML = "webpack-css";

 // 方式一：设置 img 元素的 src
 const imgEl = document.createElement("img");
 imgEl.src = avatar;

 // 方式二：设置背景图片
 const bgEl = document.createElement("div");
 bgEl.className = "image-bg";

+// i元素
+const iEl = document.createElement('i');
+iEl.className = "iconfont icon-ashbin";

 document.body.appendChild(div);
 document.body.appendChild(imgEl);
 document.body.appendChild(bgEl);
+document.body.appendChild(iEl);
```

修改 `webpack.config.js` 配置 `asset/resource` 对字体进行打包：

```diff
 const path = require("path");

 module.exports = {
   entry: "./src/index.js",
   output: {
     filename: "bundle.js",
     path: path.resolve(__dirname, "dist"), // 需要使用绝对路径
     publicPath: './dist/',
   },
   module: {
     rules: [
       {
         test: /\.(less|css)$/,
         use: ["style-loader", "css-loader", "less-loader"]
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
+      {
+        test: /\.(eot|ttf|woff2?)$/,
+        type: "asset/resource",
+        generator: {
+          filename: "font/[name]_[hash:6][ext]"
+        }
+      }
     ],
   },
 };
```

执行 `npm run build` 打包，接下来打开浏览器可以看到 `i` 元素正常加载，控制台也未报错。

## 总结

webpack5 提供四种资源模块类型代替之前的 loader，可以对图片、字体等资源进行打包。

