---
title: 总体架构
date: 2024-08-20
icon: architecture
category:
  - node
tag:
  - express
  - architecture
---

[Express](https://github.com/expressjs/express) 是适用于 Node.js 的极简网络应用程序框架。它为构建网络和移动应用程序提供了一套强大的功能。尽管简单，Express 却具有很强的可扩展性，允许开发人员添加中间件并自定义应用程序的行为。

::: warning

在代码解读中，贴上的源码有可能改为 TS 类型，在阅读源码时请注意。

:::

## 核心组件

包括 `Application`、`Request`、`Response` 和 `Router`：

- `Application`：应用程序对象，由 `express()` 创建，它代表一个 Express 应用程序，用于通过设置中间件、路由和错误处理程序来配置应用程序。
- `Request`： HTTP 请求实例，该对象封装了传入请求的所有信息，如 `header`、`query parameters`、`URL`、`body` 等。
- `Response`：HTTP 响应实例，该对象用于向客户端发回数据、设置响应 `header`、`cookie`、状态代码等。
- `Router`: 路由器对象，由 `express.Router()` 创建，一个小型 `Application`，可拥有自己的路由和中间件。它有助于将应用组织成更小的、模块化的部分。

## Middleware

可以访问请求（`req`）、响应（`res`）以及应用程序请求-响应循环中下一个中间件函数的函数。中间件可以执行任何代码、修改请求和响应对象、结束请求-响应循环或调用下一个中间件函数。

在 Express 中，有不同类型的中间件：

- 应用程序级中间件：与 `Express` 应用程序实例绑定。
- 路由器级中间件：与 `express.Router()` 实例绑定。
- 错误处理中间件：能捕捉错误并进行处理的特殊中间件。

中间件按照应用程序中定义的顺序执行。 如果中间件函数没有结束请求-响应循环（调用 `res.end()`），则必须调用 `next()` 将控制权传递给下一个中间件函数。

::: warning

Most middleware (like ' + name + ') is no longer bundled with Express and must be installed separately. Please see <https://github.com/senchalabs/connect#middleware>.

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
```

:::

## Routing

路由定义了应用程序响应客户端请求的端点（URI）。每个路由可以有多个处理程序，并支持所有 HTTP 方法（GET、POST、PUT、DELETE 等）。

支持自动解析 `query parameters` 和 `URL` 中的 `:param` 值。

简单理解为分发请求并进行相应处理。

## Layer

Express 用 `Layer` 保存路径匹配规则和处理函数。例如：

```js
app.use(logger)
app.get('/users/:id', requireAuth, showUser)
```

`logger` 用于所有请求，`requireAuth` 和 `showUser` 只用于匹配该路径的 GET 请求。

应用里的 `Router` 是路由器，它用 `stack` 数组按注册顺序保存这些层。一条 `Route` 则记录某个路径支持的请求方法和处理函数。上面的注册结果可以简化为：

```text
Router.stack
├─ Layer：根路径前缀匹配，调用 logger
└─ Layer：匹配 /users/:id，进入对应 Route
   └─ Route：支持 GET
      └─ Route.stack
         ├─ Layer：调用 requireAuth
         └─ Layer：调用 showUser
```

请求 `GET /users/42` 时，先执行 `logger`。它调用 `next()`，路由器继续找到匹配 `/users/:id` 的层，取得参数 `id = '42'`，再进入 `Route`。路由里的 `requireAuth` 调用自己的 `next()` 后，才轮到 `showUser`。源码分别在 [`Router`](https://github.com/pillarjs/router/blob/v2.2.0/index.js) 和 [`Route`](https://github.com/pillarjs/router/blob/v2.2.0/lib/route.js) 中。

`use()` 和路由按顺序放进同一个路由器数组。如果把日志中间件注册在一个已经响应且不再调用 `next()` 的路由后面，这个请求就不会执行日志中间件。`stack` 虽然叫“栈”，这里仍是从前往后查找，而非最后注册的先执行。

`Layer` 在 [Express 4.18.2](https://github.com/expressjs/express/blob/4.18.2/lib/router/layer.js) 中就有。Express 5.1.0 将路由实现交给独立的 `router` 包，仍然使用这套结构。中间件的执行方式见[Express 与 Koa 的中间件模型](../http-framework/express-vs-koa-middleware.md)。

### 相关源码

- [`router` 2.2.0：Router](https://github.com/pillarjs/router/blob/v2.2.0/index.js)
- [`router` 2.2.0：Layer](https://github.com/pillarjs/router/blob/v2.2.0/lib/layer.js)
- [`router` 2.2.0：Route](https://github.com/pillarjs/router/blob/v2.2.0/lib/route.js)
- [Express 4.18.2：Layer](https://github.com/expressjs/express/blob/4.18.2/lib/router/layer.js)
- [Express 5.1.0：依赖声明](https://github.com/expressjs/express/blob/v5.1.0/package.json)

## lib 源码结构

Express@4.21.0 中，`lib` 目录结构如下：

```shell
lib/
├── application.js
├── express.js
├── middleware/
│   ├── init.js
│   ├── query.js
├── request.js
├── response.js
├── router/
│   ├── index.js
│   ├── layer.js
│   ├── route.js
├── utils.js
└── view.js
```

- `express.js`: 主入口文件，导出了核心的 `express()` 函数。
- `application.js`: 定义了 Express 应用的核心功能，如 `app.use()`、`app.get()` 等方法。
- `middleware/`: 包含 Express 内置的 `middleware`，例如 `init.js` 用于初始化中间件，`query.js` 用于解析查询字符串。
- `request.js`: 定义了 `req` 对象的扩展和辅助方法。
- `response.js`: 定义了 `res` 对象的扩展和辅助方法。
- `router/`: 包含与路由相关的代码，其中 `index.js` 是路由器的主模块，`layer.js` 和 `route.js` 用于处理路由层次和路径匹配。
- `utils.js`: 一些工具函数，用于简化内部实现。
- `view.js`: 处理视图渲染相关的逻辑。

接下来会对每个文件进行详细分析。
