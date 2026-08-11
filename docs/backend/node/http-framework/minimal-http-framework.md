---
title: 从 HTTP 服务器到最小框架
date: 2026-08-11
icon: server
category:
  - Node.js
tag:
  - node:http
  - middleware
  - router
  - framework
---

## 最小 HTTP 服务器

新建 `server.js`，监听 3000 端口并返回 `Hello World`：

```js
import { createServer } from 'node:http'

const server = createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('content-type', 'text/plain; charset=utf-8')
  res.end('Hello World')
})

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000')
})
```

启动服务并请求根路径：

```sh
node server.js
curl -i http://localhost:3000/
```

响应包含 `200 OK` 和正文 `Hello World`。

`createServer()` 接收一个请求监听器。该函数注册在服务器的 `request` 事件上，每次收到请求时执行，并接收两个参数：

- `req` 是 `http.IncomingMessage`，用于读取请求方法、URL、请求头和请求体流；
- `res` 是 `http.ServerResponse`，用于设置状态码、响应头并写回正文。

`createServer(listener)` 等价于创建服务器后监听 `request` 事件：

```js
const server = createServer()

server.on('request', (req, res) => {
  res.end('Hello World')
})

server.listen(3000)
```

`res.end()` 结束响应。请求分支既不调用 `res.end()`，也不把响应流交给其他处理逻辑时，响应会保持未完成，直到连接关闭或客户端超时。

## 按方法和路径分派请求

当前监听器没有读取请求地址，因此 `/`、`/time` 和不存在的路径都会得到相同响应。加入 `/time` 后，可以直接使用条件分支区分请求：

```js
const server = createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost')

  if (req.method === 'GET' && url.pathname === '/') {
    res.end('Hello World')
    return
  }

  if (req.method === 'GET' && url.pathname === '/time') {
    res.end(new Date().toISOString())
    return
  }

  res.statusCode = 404
  res.end('Not Found')
})
```

代码根据请求方法和 `pathname` 选择处理逻辑。查询字符串不参与路径匹配，因此需要先解析 `req.url`，再比较 `pathname`。

路由增多后，请求监听器会包含大量路径判断。将方法、路径和处理函数记录在路由表中，可以把匹配逻辑与响应逻辑分开：

```js
const routes = []

function get(path, handler) {
  routes.push({ method: 'GET', path, handler })
}

get('/', (req, res) => {
  res.end('Hello World')
})

get('/time', (req, res) => {
  res.end(new Date().toISOString())
})
```

请求监听器根据方法和路径查找路由，再调用对应的处理函数：

```js
async function handle(req, res) {
  const url = new URL(req.url ?? '/', 'http://localhost')
  const route = routes.find((item) => {
    return item.method === req.method && item.path === url.pathname
  })

  if (!route) {
    res.statusCode = 404
    res.end('Not Found')
    return
  }

  await route.handler(req, res)
}

const server = createServer((req, res) => {
  handle(req, res).catch((error) => {
    console.error(error)

    if (res.headersSent) {
      res.destroy()
      return
    }

    res.statusCode = 500
    res.end('Internal Server Error')
  })
})
```

`routes.find()` 负责匹配路由，`route.handler()` 负责生成响应。新增路由时，只需向 `routes` 添加记录，不再修改 `handle()` 中的条件分支。

`handle()` 是异步函数，调用后返回 Promise。HTTP 服务器不会等待这个 Promise，也不会处理它的拒绝状态，因此监听器需要显式调用 `catch()`。响应头尚未发送时可以返回 `500`；响应头已经发送时无法改写状态码，只能关闭连接。

## 匹配路径参数

字符串相等只能匹配固定路径。对于 `/users/42` 这类路径，可以用 `/users/:id` 声明动态片段，并将实际值保存为参数。

以下匹配器逐段比较路由模式和请求路径：

```js
function matchPath(pattern, pathname) {
  const patternParts = pattern.split('/').filter(Boolean)
  const pathParts = pathname.split('/').filter(Boolean)

  if (patternParts.length !== pathParts.length) return null

  const params = {}

  for (let index = 0; index < patternParts.length; index += 1) {
    const expected = patternParts[index]
    const actual = pathParts[index]

    if (expected.startsWith(':')) {
      try {
        params[expected.slice(1)] = decodeURIComponent(actual)
      } catch {
        return null
      }
      continue
    }

    if (expected !== actual) return null
  }

  return params
}
```

固定片段必须相等；以 `:` 开头的片段记录到参数对象中。匹配失败返回 `null`，匹配成功则由 `findRoute()` 一并返回路由和参数：

```js
function findRoute(routes, method, pathname) {
  for (const route of routes) {
    if (route.method !== method) continue

    const params = matchPath(route.path, pathname)
    if (params !== null) return { route, params }
  }

  return null
}
```

请求监听器将参数写入 `req.params`，路由处理函数可以直接读取：

```js
get('/users/:id', (req, res) => {
  res.setHeader('content-type', 'application/json; charset=utf-8')
  res.end(JSON.stringify({ id: req.params.id }))
})
```

`req.params` 不是 `IncomingMessage` 的原生属性，而是当前路由代码写入请求对象的数据。

该匹配器只支持固定片段和单段参数，不支持通配符与可选参数。`filter(Boolean)` 会删除空片段，因此 `/users/42/` 和 `/users//42` 都能匹配 `/users/:id`；固定片段仍区分字母大小写。

## 中间件

请求日志、身份认证等逻辑通常服务于多个路由。直接把计时代码写入 `/time` 处理函数，会使其他路由重复相同代码：

```js
get('/time', async (req, res) => {
  const startedAt = Date.now()
  res.end(new Date().toISOString())
  console.log(req.method, req.url, `${Date.now() - startedAt}ms`)
})
```

计时代码与 `/time` 的响应内容无关，可以移到公共处理函数中。中间件接收 `req`、`res` 和 `next` 三个参数；调用 `next()` 会执行后续中间件或路由处理函数。不调用 `next()` 时，后续函数不会执行，当前中间件需要结束响应，否则 `handle()` 最终返回 `404`。

```js
async function logger(req, res, next) {
  const startedAt = Date.now()

  res.once('finish', () => {
    console.log(req.method, req.url, res.statusCode, `${Date.now() - startedAt}ms`)
  })

  await next()
}
```

认证中间件在请求头有效时继续执行，认证失败时直接返回 `401`：

```js
async function requireAuth(req, res, next) {
  if (req.headers.authorization !== 'Bearer demo') {
    res.statusCode = 401
    res.end('Unauthorized')
    return
  }

  await next()
}
```

中间件按注册顺序存入数组，由调度器逐个执行：

```js
async function run(stack, req, res) {
  let lastIndex = -1

  async function dispatch(index) {
    if (index <= lastIndex) {
      throw new Error('next() called multiple times')
    }

    lastIndex = index
    const current = stack[index]
    if (!current) return

    await current(req, res, () => dispatch(index + 1))
  }

  await dispatch(0)
}
```

`dispatch(0)` 从数组中的第一个函数开始。`next()` 返回 `dispatch(index + 1)` 的 Promise，因此 `await next()` 会等待后续处理链完成。`lastIndex` 用于拒绝同一个中间件重复调用 `next()`，避免后续函数执行多次。

该调度器要求 `next()` 返回 Promise，`await next()` 等待下游的方式与 Koa 中间件相近。Express 的 `next()` 只通知路由器继续调度，不能用 `await next()` 等待下游完成。详细差异见[Express 与 Koa 的中间件模型](./express-vs-koa-middleware.md)。

## `createApp()`

路由表和中间件数组放在 `createApp()` 的闭包中，不再使用模块级变量。每个应用持有独立的注册状态，返回对象暴露 `use()`、`get()` 和 `listen()` 三个方法：

```js
const app = createApp()

app.use(logger)

app.get('/', (req, res) => {
  res.end('Hello World')
})

app.get('/time', (req, res) => {
  res.end(new Date().toISOString())
})

app.get('/users/:id', requireAuth, (req, res) => {
  res.setHeader('content-type', 'application/json; charset=utf-8')
  res.end(JSON.stringify({ id: req.params.id }))
})

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000')
})
```

`app.use()` 注册全局中间件，所有请求都会经过 `logger`。`app.get()` 接收多个处理函数，`requireAuth` 因此只作用于 `/users/:id`。

完整的 `server.js` 如下：

```js
import { createServer } from 'node:http'

function matchPath(pattern, pathname) {
  const patternParts = pattern.split('/').filter(Boolean)
  const pathParts = pathname.split('/').filter(Boolean)

  if (patternParts.length !== pathParts.length) return null

  const params = {}

  for (let index = 0; index < patternParts.length; index += 1) {
    const expected = patternParts[index]
    const actual = pathParts[index]

    if (expected.startsWith(':')) {
      try {
        params[expected.slice(1)] = decodeURIComponent(actual)
      } catch {
        return null
      }
      continue
    }

    if (expected !== actual) return null
  }

  return params
}

function findRoute(routes, method, pathname) {
  for (const route of routes) {
    if (route.method !== method) continue

    const params = matchPath(route.path, pathname)
    if (params !== null) return { route, params }
  }

  return null
}

async function run(stack, req, res) {
  let lastIndex = -1

  async function dispatch(index) {
    if (index <= lastIndex) {
      throw new Error('next() called multiple times')
    }

    lastIndex = index
    const current = stack[index]
    if (!current) return

    await current(req, res, () => dispatch(index + 1))
  }

  await dispatch(0)
}

function sendText(res, statusCode, text) {
  if (res.writableEnded) return

  res.statusCode = statusCode
  res.setHeader('content-type', 'text/plain; charset=utf-8')
  res.end(text)
}

function createApp() {
  const middleware = []
  const routes = []

  function use(handler) {
    middleware.push(handler)
  }

  function get(path, ...handlers) {
    routes.push({ method: 'GET', path, handlers })
  }

  async function handle(req, res) {
    const url = new URL(req.url ?? '/', 'http://localhost')
    const matched = findRoute(routes, req.method, url.pathname)

    req.params = matched?.params ?? {}

    const routeHandlers = matched?.route.handlers ?? [(req, res) => sendText(res, 404, 'Not Found')]

    await run([...middleware, ...routeHandlers], req, res)

    // 路由处理函数遗漏 res.end() 时返回 404，避免响应保持未完成。
    if (!res.writableEnded) {
      sendText(res, 404, 'Not Found')
    }
  }

  function listen(port, callback) {
    const server = createServer((req, res) => {
      handle(req, res).catch((error) => {
        console.error(error)

        if (res.headersSent) {
          res.destroy()
          return
        }

        sendText(res, 500, 'Internal Server Error')
      })
    })

    return server.listen(port, callback)
  }

  return { use, get, listen }
}

async function logger(req, res, next) {
  const startedAt = Date.now()

  res.once('finish', () => {
    console.log(req.method, req.url, res.statusCode, `${Date.now() - startedAt}ms`)
  })

  await next()
}

async function requireAuth(req, res, next) {
  if (req.headers.authorization !== 'Bearer demo') {
    sendText(res, 401, 'Unauthorized')
    return
  }

  await next()
}

const app = createApp()

app.use(logger)

app.get('/', (req, res) => {
  sendText(res, 200, 'Hello World')
})

app.get('/time', (req, res) => {
  sendText(res, 200, new Date().toISOString())
})

app.get('/users/:id', requireAuth, (req, res) => {
  res.setHeader('content-type', 'application/json; charset=utf-8')
  res.end(JSON.stringify({ id: req.params.id }))
})

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000')
})
```

启动服务后检查公开路由、认证路由和路径参数：

```sh
curl -i http://localhost:3000/time
curl -i http://localhost:3000/users/42
curl -i -H 'Authorization: Bearer demo' http://localhost:3000/users/42
```

三个请求依次返回 `200`、`401` 和 `200`。未注册的路径返回 `404`。

## 实现范围

一次请求的处理顺序如下：

```text
node:http 接收请求
  -> 全局中间件
  -> 按方法和路径查找路由
  -> 路由级中间件
  -> 最终处理函数
  -> 返回 404 或处理异常
```

当前代码只实现 `GET` 路由、单段路径参数和 Koa 风格中间件。以下行为仍需单独处理：

- `POST`、`PUT`、`HEAD` 和 `OPTIONS` 等方法；
- 请求体大小限制、内容类型判断和 JSON 解析；
- 请求中止、超时以及请求流、响应流产生的错误；
- 通配符、可选参数和方法协商等路由行为。

`IncomingMessage` 是可读流，原生对象上不存在已经解析好的 `req.body`。请求体解析需要收集数据块、限制总大小、处理流错误，并根据内容类型转换数据。这部分逻辑可以实现为独立中间件，不属于当前路由与调度示例。

## 参考资料

- [The Node Beginner Book：一个基础的 HTTP 服务器](https://www.nodebeginner.org/index-zh-cn.html#a-basic-http-server)（旧版 CommonJS 示例）
- [Node.js Learn：Anatomy of an HTTP Transaction](https://nodejs.org/en/learn/http/anatomy-of-an-http-transaction)
- [Node.js HTTP API](https://nodejs.org/api/http.html)
- [MDN：Express/Node introduction](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/Express_Nodejs/Introduction)
- [Koa：Cascading middleware](https://koajs.com/#application)
- [Express：Using middleware](https://expressjs.com/en/guide/using-middleware/)
