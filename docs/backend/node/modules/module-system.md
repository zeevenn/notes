---
title: 模块化
date: 2022-08-10
category:
  - 工程化
tag:
  - 模块化
  - ESM
  - CJS
  - AMD
  - CMD
---

模块化开发的最终目的是为了将程序拆分为可按需导入的单独模块。在模块中编写属于自己的逻辑代码，拥有自己的作用域，能够导出希望暴露的变量、函数、对象等，并能通过某种方式，导入其他模块中的变量、函数或对象等。

然而在早期 JavaScript 仅仅作为一个脚本语言，所需的代码通常不会很大。然而随着前端和 JavaScript 的发展，需要通过模块化来减少代码的复杂度。

JavaScript 本身知道 ES2015 才推出了自己的模块化方案 —— ES Module。在此之前，为了让 JavaScript 支持模块化，社区中涌现了不同的模块化规范：AMD、CMD、CommonJS 等。

## 早期模块化方案

### Window

在最开始的前端时期，JavaScript 文件之间的通信通常会依靠 window 对象。

**utils.js**

```js
var utils = {
  format(time) {
    console.log(time)
  }
}
```

**time.js**

```js
var curTime = '2022-08-10 15:05'
var time = {
  curTime: curTime
}
```

**index.js**

```js
window.utils.format(window.time.curTime) // '2022-08-10 15:05'
```

**index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title></title>
</head>
<body>
  <!-- 必须保证顺序正确 -->
  <script src="./time.js"></script>
  <script src="./utils.js"></script>
  <script src="./index.js"></script>
</body>
</html>
```

然而这会带来命名冲突的问题，并且声明的全局变量会占用内存无法回收，代码可读性差。因此出现了立即调用表达式（IIFE）。

## IIFE

使用立即调用表达式（Immediately Invoked Function Expression, IIFE）改造上述代码：

**utils.js**

```js
var moduleUtils = (function () {
  var format = function (time) {
    console.log(time)
  }

  return {
    format,
  }
})()
```

**time.js**

```js
var moduleTime = (function () {
  var curTime = "2022-08-10 15:05"

  return {
    curTime,
  }
})()

```

**index.js**

```js
window.moduleUtils.format(window.moduleTime.curTime)
```

现在因为函数具有作用域，就可以解决命名冲突的问题，然而这再次带来了新的问题：

* 代码混乱不堪，每个文件的代码都需要包裹在一个立即调用函数表达式中编写；
* 在没有合适的规范的情况下，每个公司或个人都会出现任意命名导致模块名称相同的情况。

因此需要用规范编写模块化代码，这个规范需要包括两个核心功能：**模块本身可以导出暴露的属性，又可以导入需要的属性。**

## CommonJS

CommonJS 是一个 JavaScript 规范，最初提出来是在浏览器以外的地方使用，并且当时被命名为 ServerJS，后来为了体现它的广泛性，修改为 CommonJS，平时我们也会简称为 CJS。

NodeJS 对 CommonJS 进行了支持和实现：

* 在 Node 中每个 js 文件都是一个单独的模块；
* 这个模块包括 CommonJS 规范的核心变量：`exports` `module.exports` `require`。

下面在 node 环境中执行以下代码。

**utils.js**

```js
const format = function (time) {
  console.log(time)
}

module.exports = {
  format
}
```

**time.js**

```js
const curTime = "2022-08-10 15:05"

exports.curTime = curTime
```

**index.js**

```js
const { curTime } = require("./time.js")
const { format } = require("./utils")

format(curTime) // "2022-08-10 15:05"
```

### `exports` 和 `module.exports`

可以看到，node 中实用 `exports` 和 `module.exports` 实现模块导出，使用 `require()` 实现模块导入。

那么为什么要有两个导出方式？

因为 CommonJS 规范中只定义了 `exports`，但是它存在一些问题，因此 node 使用 `module.exports = exports` 间接代替了 `exports`，他们两个指向同一个内存地址的对象。`require()` 会返回 `module.exports` 指向的对象。

可以在 index.js 中打印 `module` 对象：

```js
Module {
  id: '.',                    // 模块 id
  path: '/* ... */',          // 文件路径
  exports: {},                // 模块导出对象
  filename: '/* ... */',      // 文件名
  loaded: false,              // 模块是否加载完成
  children: [
    Module {}, // 模块 utils
    Module {}  // 模块 time
  ],
  paths: [ /* ... */ ]        // 搜索路径
}
```

### require

`require()` 引入模块需要经历三个步骤：

1. 路径分析
2. 文件定位
3. 编译执行

#### 核心模块和文件模块

而在 Node 中，模块分为核心模块和文件模块：

* 核心模块：在 Node 源代码的编译过程中，编译成了二进制执行文件。在 Node 进程启动时，核心模块就直接加载进了内存中，因此核心模块引入时，不需要进行文件定位和编译执行，并且在路径分析时会优先判断，因此它的加载速度是最快的。
* 文件模块：在运行时动态加载，需要完整的路径分析、文件定位、编译执行过程，速度比核心模块慢。

#### 优先从缓存中加载

Node 会对引入过的模块进行缓存，以减少二次引入时的开销，对任何模块都会采取缓存优先的策略，**缓存是第一优先级**。

从缓存加载的优化策略使得二次引入时不需要路径分析、文件定位和编译执行的过程，提高了加载模块的效率。

#### 路径分析

在判断缓存后，需要对模块进行路径分析和文件定位，`require(X)` 接收一个**模块标识符**，不同标识符有不同查找规则。

**情况一：X 是一个核心模块，如 path、http**

**核心模块**会直接返回模块，并且停止查找。

试图加载一个与核心模块标识符相同的自定义模块是不会成功的，如果自己编写了一个 `http` 用户模块，想要加载成功，则必须选择一个不同的标识符或者换用路径方式。

**情况二：X 以 ./ 或 ../ 或 / （路径形式）开头**

以路径开始的标识符，会被当成**文件模块**，在分析路径时，`require(X)` 方法会将路径转换为真实路径，并以真实路径作为索引，将编译执行的过程中放到缓存中。由于文件模块给 Node 指明了确切的文件位置，因此在查找过程中可以节约大量时间，**文件模块的加载速度慢于核心模块**。

**情况三：直接是一个 X（没有路径），并且 X 不是一个核心模块**

这种情况下，X 是一个**自定义模块**，那么 Node 会从**模块路径** `moudle.paths` 中查找。

> 模块路径：Node 在定位文件模块的具体文件时指定的查找策略，为多个路径组成的数组。

在 Linux 下，打印这个可能输出：

```js
[ '/home/jackson/research/node_modules',
'/home/jackson/node_modules',
'/home/node_modules',
'/node_modules' ]
```

Windows 下，可能会输出：

```js
[ 'c:\\nodejs\\node_modules', 'c:\\node_modules' ]
```

模块路径的生成规则如下：

* 当前文件目录下的 `node_modules` 目录
* 父目录下的 `node_modules` 目录
* 父目录的父目录下的 `node_modules` 目录
* 沿路径向上逐级递归，直到根目录下的 `node_modules` 目录

在加载过程中，Node 会逐个尝试模块路径中的路径，直到找到目标模块，因此速度在三个情况中最慢。

#### 文件定位

文件定位主要包括文件扩展名分析、目录和包的处理。

**文件扩展名分析**

`require(X)` 在分析标识符的过程中，会出现标识符不包含文件扩展名的情况。

1. 如果有文件扩展名，按照后缀名的格式查找对应的文件
2. 如果没有文件扩展名，会按照如下顺序尝试：
  * 直接查找文件 X
  * 查找 `X.js` 文件
  * 查找 `X.json` 文件
  * 查找 `X.node` 文件

在尝试的过程中，需要调用 `fs` 模块同步阻塞式地判断文件是否存在，所以会引起性能问题，因此，最好带上文件扩展名，会加快模块加载速度。

**目录分析和包**

在分析标识符的过程中，通过分析文件扩展名可能并没有得到对应文件，但却得到一个目录，此时 Node 会将目录当作一个包来处理。

1. 首先在当前目录下查找 `package.json` 文件，通过 `JSON.parse()` 解析出包描述对象，从中取出 `main` 属性指定的文件名进行定位，如果文件名缺少扩展名，则会进行文件扩展名分析
2. 如果 `main` 属性指定的文件名错误，或者没有 `package.json` 文件，那么会一次查找目录下面的 `index` 文件
  * 查找 `X/index.js` 文件
  * 查找 `X/index.json` 文件
  * 查找 `X/index.node` 文件
3. 如果目录分析的过程中没有成功定位，则自定义模块进入下一个模块路径中进行搜索；如果所有路径都遍历完毕，仍然没有找到目标文件，那么报错：`not found`

### 模块编译

Node 中对于模块的定义如下：

```js
function Module(id, parent) {
  this.id = id
  this.exports = {}
  this.parent = parent
  if (parent && parent.children) {
    parent.children.push(this)
  }

  this.filename = null
  this.loaded = false
  this.children = []
  // ...
}
```

当定位到目标文件时，Node 会新建一个模块对象，然后根据路径载入并编译，对于不同的文件扩展名，它的载入方法也不同：

* `.js` 文件：通过 `fs` 模块同步读取文件后编译执行；
* `.node` 文件：这是用 `C/C++` 编写的扩展文件，通过 `dlopen()` 方法加载最后编译生成的文件；
* `.json` 文件：通过 `fs` 模块同步读取文件后，用 `JSON.parse()` 解析返回结果；
* 其余扩展名文件：都被当作 `.js` 文件载入。

模块在第一次被引入时，模块中的代码会被执行一次；模块被多次引入，会缓存（`module.loaded` 设置为 `true`），最终只运行一次；如果有循环引入，会采用深度优先搜索加载模块。

每一个编译成功的模块都会讲其文件路径作为索引缓存在 `Module._cache` 对象上，以提高二次引入的性能。

### 其他

每个模块都存在 `require`、`exports`、`module` 等其它变量，这些变量从何而来？这是因为 Node 对获取的 JavaScript 文件内容进行了头尾包装。

```js
(function (exports, require, module, __filename, __dirname) {
  var Math = require('math')
  exports.area = function (raduis) {
    return Math.PI * radius * radius
  }
})
```

这样每个模块文件都用函数进行了作用域隔离，包装之后的代码会通过 `vm` 原生模块的 `runInThisContext()` 方法执行（类似 `eval`，只是有明确作用域，不会污染全局），返回一个具体的 `function` 对象。最后,将当前模块的 `exports` 属性、`require()` 方法、`module` 以及在文件定位中得到的完整文件路径和文件目录作为参数传递给这个 `function` 执行。

那么为什么存在 `exports` 的情况下，还存在 `module.exports`？

先来看看包装之后的文件：

```js
function (exports, require, module, __filename, __dirname) {}
```

`exports` 是通过形参的方式传入，**直接赋值形参会改变形参的引用**，但并不能改变作用域外的值，因此在使用 `exports` 的时候不推荐直接赋值一个对象，而是通过赋值属性的方式导出变量。而如果想要达到 `require` 直接引入一个类的效果，应该赋值给 `module.exports` 对象，这种方案不会改变形参的引用。

### 缺点

CommonJS 加载模块是同步的：同步意味着只有等到对应的模块加载完毕，当前模块中的内容才能被运行。

这也是通常用作服务器模块化规范的原因，因为服务器加载的 js 文件都是本地文件，加载速度非常快。

如果将它应用于浏览器呢？浏览器加载 js 文件需要先从服务器将文件下载下来，之后在加载运行，会阻塞后续代码的执行。

所以早期在浏览器中，我们通常不使用 CommonJS 规范，而通常会采用 AMD 或 CMD 规范。

## AMD/CMD

AMD 和 CMD 是用于浏览器端的模块化规范。

但是目前一方面现代的浏览器已经支持 ES Modules，另一方面借助于 webpack 等工具可以实现对 CommonJS 或者 ES Module 代码的转换。AMD 和 CMD 已经使用非常少了，所以这里我们进行简单的演练。

### AMD

异步模块定义（Asynchronous Module Definition，AMD）采用异步加载模块，因此可以在浏览器中使用。比较常用的库是 `require.js`。

> 先有 RequireJS，后有 AMD 规范，随着 RequireJS 的推广和普及，AMD 规范才被创建出来。

```bash
AMD
├── index.html
├── index.js
├── lib
│   └── require.js
└── modules
    ├── time.js
    └── .js
```

**index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <!-- 注意 data-main -->
  <script src="./lib/require.js" data-main="./index.js"></script>
</body>
</html>
```

**index.js**

```js
;(function () {
  // 配置
  require.config({
    baseUrl: "",
    // 模块映射关系
    paths: {
      time: "./modules/time",
      utils: "./modules/utils",
    },
  })

  require(["utils", "time"], function (utils, time) {
    // 逻辑代码
    console.log(utils.format) // Function
    console.log(time.curTime) // 2022-08-10 15:05
  })
})()
```

**time.js**

```js
// 定义模块
define(function () {
  const curTime = "2022-08-10 15:05"

  // 暴露属性
  return {
    curTime,
  }
})
```

**utils.js**

```js
// 定义模块，引入需要的模块
define(["time"], function (time) {
  const format = function (time) {
    console.log(time)
  }

  format(time.curTime) // 2022-08-10 15:05

  // 暴露属性
  return {
    format,
  }
})
```

### CMD

通用模块定义（Common Module Definition，CMD）采用异步加载模块，并且吸收 CommonJS 的优点，比较常用的库是 `SeaJS`。

```bash
CMD
├── index.html
├── index.js
├── lib
│   └── sea.js
└── modules
    ├── time.js
    └── .js
```

**index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  
  <script src="./lib/sea.js"></script>
  <script>
    seajs.use('./index.js');
  </script>
</body>
</html>
```

**index.js**

```js
define(function (require, exports, module) {
  const { curTime } = require("./modules/foo")
  const { format } = require("./modules/utils")

  format(curTime) // 2022-08-10 15:05
})
```

**time.js**

```js
define(function (require, exports, module) {
  const curTime = "2022-08-10 15:05"

  module.exports = {
    curTime,
  }
})
```

**utils.js**

```js
define(function (require, exports, module) {
  const format = function (time) {
    console.log(time)
  }

  module.exports = {
    format,
  }
})
```

## ESM

ES2015 后浏览器实现的模块化方案，长远来看，未来无论是基于 JS 的 WEB 端，还是基于 node 的服务器端或桌面应用，模块规范都会统一使用 ES6 module。

### 兼容性

并不是所有浏览器都对 ESM 实现完全支持，需要用到 webpack 等工具实现代码转换。

可见 [浏览器支持](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Modules#%E6%B5%8F%E8%A7%88%E5%99%A8%E6%94%AF%E6%8C%81)。

### 导出

#### 方式一：分别导出

```js
export const curTime = "2022-08-10 15:05";
export const format = function (time) {
  console.log(time)
};
```

#### 方式二：统一导出

```js
const curTime = "2022-08-10 15:05";
const format = function (time) {
  console.log(time)
};

export {
  curTime,
  format
}
```

#### 方式三：别名导出 

```js
export {
  curTime as time,
  format
}
```

注意这里 `{}` 并非对象。

#### 方式四：默认导出

一个模块中只能有一个默认导出。

```js
export default function(time) {
  console.log("format", time);
}
```

### 导入

#### 方式一：统一导入

```js
import { curTime, format } from './module.js'
```

#### 方式二：整体导入

```js
import * as module from './module.js'
module.format(module.time)
```

#### 方式三：别名导入

```js
import { curTime as time, format } from './module.js'
```

#### 方式四：默认导出的导入

```js
import format from './module.js'
```

### `import()`

上述的导入都是用 import 关键字实现模块实现，`import()` 函数可以实现动态导入模块。

```js
let flag = true
if (flag) {
  import('./foo.js').then(foo => {
    // 逻辑代码
  })
} else {
  import('./bar.js').then(bar => {
    // 逻辑代码
  })
}
```

### ESM VS CommonJS

CommonJS 模块加载 js 文件的过程是运行时加载的，并且是同步的：

* 运行时加载意味着是 js 引擎在执行 js 代码的过程中加载模块；
* 同步的就意味着一个文件没有加载结束之前，后面的代码都不会执行。

ES Module 加载 js 文件的过程是编译（解析）时加载的，并且是异步的：

* 编译时（解析）时加载，意味着 `import` 关键字不能和运行时相关的内容放在一起使用；
* 异步的意味着：JS 引擎在遇到 import 时会去获取这个 js 文件，但是这个获取的过程是异步的，并不会阻塞主线程继
续执行。

CommonJS 通过 `module.exports` 导出的是一个对象，导出和导入指向的是同一块内存空间，两边修改会同时影响导出对象。

ES Module 通过 `export` 导出的是变量本身的引用：JS 引擎会创建**模块环境记录**，会和导出的变量进行绑定。所以在导出的模块中修改变化，导入的地方可以通过模块环境记录获取最新的值；但是在导入的地方不允许修改变量（直接报错），因为导入它时相当于给一个常量赋值。

> 如果 ESM 导出的是一个对象，那么导入的模块也能修改对象中的属性，因为他指向内存空间。

## 总结

本文主要介绍了模块化发展的历程，介绍各种规范如 CommonJS、AMD、CMD、ESM 的使用和对比。