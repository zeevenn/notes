---
title: webpack 基础打包
date: 2022-04-29
category:
  - 工程化
tag:
  - 项目打包
  - webpack
---

> 项目地址：<https://github.com/Stephen-wzw/webpack-demo>

## 基本安装

webpack 需要安装两个工具：webpack 和 webpack-cli（命令行接口）。

webpack 在执行时依赖 webpack-CLI，webpack-cli 提供了许多命令来使 webpack 的工作变得更简单。如果没有安装，运行 webpack 命令时会报错。

```bash
# 全局安装
npm install webpack webpack-cli -g

# 局部安装
npm install webpack webpack-cli -D
```

首先全局安装，在具体的项目中再使用局部安装。

## 为什么需要 webpack

首先创建一个目录，然后局部安装 webpack 和 webpack-cli。

```bash
mkdir webpack-demo
cd webpack-demo
npm init -y
npm install webpack webpack-cli -D
```

> 一个 JS 相关的项目往往都是从 package.json 文件开始的。
> npm 官方提供了 `npm init` 命令帮助我们快速初始化 package.json 文件。
> 执行之后会有一个交互式的命令行让你输入需要的字段值，当然如果你想直接使用默认值，也可以使用 npm init -y 来初始化。

然后创建如下目录结构、文件和内容：

**project**

```diff
  webpack-demo
  |- node_modules
  |- package-lock.json
  |- package.json
+ |- index.html
+ |- /src
+   |- /js
+     |- format.js
+     |- math.js
+   |- index.js
```

**index.html**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>webpack-demo</title>
  </head>
  <body>
    <script src="./src/index.js" type="module"></script>
  </body>
</html>
```

**src/js/format.js**

```js
const priceFormat = function () {
  return '￥100.8'
}

// CommonJS
module.exports = {
  priceFormat
}
```

**src/js/math.js**

```js
// ES Module
export function sum(num1, num2) {
  return num1 + num2
}
```

**src/index.js**

```js
import { sum } from './js/math.js'
const { priceFormat } = require('./js/format')

console.log(sum(10, 20))
console.log(priceFormat())
```

现在用浏览器打开 index.html 文件，再打开控制台，毫无疑问地报错了：

```js
Uncaught ReferenceError: require is not defined
```

因为浏览器不知道 node.js 的语法，因此报错。

那么如何让项目中使用 CommonJS 规范呢，这时候就需要利用 webpack 打包工具。另外项目中还需要加载图片和 CSS 资源，如何让 CSS 也支持导入？这也需要用到 webpack。

## 开始

继续刚才的项目，我们在命令行中输入：

```bash
npx webpack
```

> npx webpack 会使用局部安装的 webpack，而非全局安装的 webpack。

此时项目会生成一个 dist 文件夹，下面会有一个 main.js 文件：

**project**

```diff
  webpack-demo
+ |- dist
+   |- main.js
  |- node_modules
  |- package-lock.json
  |- package.json
  |- index.html
  |- /src
    |- /js
      |- format.js
      |- math.js
    |- index.js
```

修改 index.html:

```diff
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>webpack-demo</title>
</head>
<body>
-  <script src="./src/index.js" type="module"></script>
+  <script src="./dist/main.js" type="module"></script>
</body>
</html>
```

重新加载 index.html 文件，可以看到控制台正确的输出了结果：

```js
30
￥100.8
```

## 使用配置文件

通常在项目中需要一个配置文件，以满足复杂的项目需求。

**project**

```diff
  webpack-demo
  |- dist
    |- main.js
  |- node_modules
  |- package-lock.json
  |- package.json
  |- index.html
  |- /src
    |- /js
      |- format.js
      |- math.js
    |- index.js
+ |- webpack.config.js
```

**webpack.config.js**

```js
const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist') // 需要使用绝对路径
  }
}
```

接下来使用 npm scripts 来执行 webpack 命令。为此需要在 package.json 中添加：

```diff
 {
   "name": "12_webpack-demo",
   "version": "1.0.0",
   "description": "",
   "main": "index.js",
   "scripts": {
     "test": "echo \"Error: no test specified\" && exit 1",
+    "build": "webpack"
   },
   "keywords": [],
   "author": "",
   "license": "ISC",
   "devDependencies": {
     "webpack": "^5.72.0",
     "webpack-cli": "^4.9.2"
   }
 }
```

之后可以使用 `npm run build` 来代替之前的 `npx webpack` 命令。注意：npm scripts 会优先使用局部安装的包。

```bash
npm run build
```

浏览器打开 index.html 后，仍能正常显示正确结果。

## 总结

从这个案例中，我们首先安装了 webpack，并使用它对 JS 两种模块风格的代码进行了打包。

而打包又可以使用 `webpack` 命令使用全局安装的 webpack 进行打包，也可以使用 `npx webpack` 使用局部安装的 webpack 进行打包。

最后又引入了配置文件，并使用 npm scripts 来执行 webpack 命令。

