---
title: express.js
date: 2024-08-23
icon: code
category:
  - node
tag:
  - express
---

`express.js` 文件定义了 Express 应用的主入口。它的核心功能是创建一个新的 Express 应用实例，并暴露相关的原型和构造函数，使应用能够处理 HTTP 请求并管理中间件（`middleware`）。

## Hello World

先看看官网的 Hello World：

```js
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
```

思考一下，`express()` `app.get()` 和 `app.listen()` 分别做了什么？

接下来一步步看源码，就能看出它们的作用。

## 模块依赖

引入了一些依赖模块：

- `bodyParser`: 用于解析请求体（body）。
- `EventEmitter`: Node.js 的事件模块，使 `app` 具有事件处理能力。
- [`merge-descriptors`](https://www.npmjs.com/package/merge-descriptors): 一个合并对象属性的模块，用于将多个对象的属性混入到一个对象中。
- `proto`: 从 **application.js** 引入的核心应用逻辑。
- `Route` 和 `Router`: 处理路由的模块。
- `req` 和 `res`: 扩展了 `request` 和 `response` 对象。

```js
var bodyParser = require('body-parser')
var EventEmitter = require('events').EventEmitter
var mixin = require('merge-descriptors')
var proto = require('./application')
var Route = require('./router/route')
var Router = require('./router')
var req = require('./request')
var res = require('./response')
```

## `createApplication()`

暴露了一个 `createApplication()` 函数，用于创建一个新的 Express 应用。

该函数主要创建了一个应用程序对象，该 `app` 对象首先混入了 `EventEmitter` 和 `proto`（**application.js** 导出的对象），并分别将 `request` 属性和 `response` 属性初始化成了 `req`（**request.js** 导出的对象）实例和 `res`（**response.js** 导出的对象）实例。

```js
exports = module.exports = createApplication

function createApplication() {
  var app = function (req, res, next) {
    app.handle(req, res, next)
  }

  mixin(app, EventEmitter.prototype, false)
  mixin(app, proto, false)

  // expose the prototype that will get set on requests
  app.request = Object.create(req, {
    app: { configurable: true, enumerable: true, writable: true, value: app }
  })

  // expose the prototype that will get set on responses
  app.response = Object.create(res, {
    app: { configurable: true, enumerable: true, writable: true, value: app }
  })

  app.init()
  return app
}
```

具体功能如下：

- `app` 函数: 这是一个处理请求的函数，当请求到达时，`app.handle(req, res, next)` 会被调用来处理请求。
- `mixin(app, EventEmitter.prototype, false)`: 将 `EventEmitter` 的原型方法混入 `app`，使得 `app` 具备事件处理能力，`false` 代表不覆盖原对象属性。
- `mixin(app, proto, false)`: 将 `application.js` 中定义的核心功能混入 `app`。
- `app.request` 和 `app.response`: 创建 `req` 和 `res` 的原型对象，并绑定 `app`。
- `app.init()`: 初始化应用。

调用下述代码时，实际上就相当于调用了 `createApplication()` 函数，返回一个新的 `app` 函数，它使用了 [混入模式](../../../reading/patterns/vanilla/mixin-pattern.md) 增强了一些功能（`proto` 为 `application.js` 暴露的对象），该原型提供了初始化 `init` 方法。

```js
const express = require('express')
const app = express()

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
```

`listen` 函数实际做了如下功能：

```js
app.listen = function listen() {
  var server = http.createServer(this)
  return server.listen.apply(server, arguments)
}
```

注意到他这里直接将 `app` 传入了 `http.createServer` 函数，该函数的签名为：`http.createServer([options][, requestListener])`，`requestListener` 函数的签名为 `(request, response) => void`。而在 `express.js` 中，`createApplication()` 中就已经声明 `app` 是 `requestListener` 类型的。

```js
var app = function (req, res, next) {
  app.handle(req, res, next)
}
```

到这里为止，我们其实已经弄清楚了 Hello World 内部的实现。

## 暴露的接口

暴露的接口如下：

```js
// 原型
exports.application = proto
exports.request = req
exports.response = res

// 路由构造函数
exports.Route = Route
exports.Router = Router

// 中间件
exports.json = bodyParser.json
exports.query = require('./middleware/query')
exports.raw = bodyParser.raw
exports.static = require('serve-static')
exports.text = bodyParser.text
exports.urlencoded = bodyParser.urlencoded
```

- `application`, `request`, `response`: 分别暴露了应用的原型和请求、响应对象的原型，供外部使用或扩展。
- `Route`, `Router`: 暴露了路由相关的构造函数。
- `json`, `query`, `raw`, `static`, `text`, `urlencoded`: 这些是常用的 middleware，用于处理请求的各种内容。

## 移除的中间件

Express 在较新的版本中移除了许多默认包含的中间件，用户需要手动安装这些中间件。如果用户尝试访问这些被移除的中间件，会抛出错误提示，并引导用户去手动安装。

```js
var removedMiddlewares = [
  'bodyParser',
  'compress',
  'cookieSession',
  'session',
  'logger',
  'cookieParser',
  'favicon',
  'responseTime',
  'errorHandler',
  'timeout',
  'methodOverride',
  'vhost',
  'csrf',
  'directory',
  'limit',
  'multipart',
  'staticCache'
]

removedMiddlewares.forEach(function (name) {
  Object.defineProperty(exports, name, {
    get: function () {
      throw new Error(
        'Most middleware (like ' +
          name +
          ') is no longer bundled with Express and must be installed separately. Please see https://github.com/senchalabs/connect#middleware.'
      )
    },
    configurable: true
  })
})
```

## 总结

**express.js** 文件的核心功能是创建并返回一个 Express 应用实例，并提供了一些内置的中间件和路由工具。移除的中间件部分提醒开发者需要手动安装以前版本中内置的中间件。
