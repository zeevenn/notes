---
title: 从 node:http 手写最小后端框架
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

这篇笔记围绕三个具体需求展开：

- 访问 `GET /hello` 时返回 `Hello World`；
- 访问 `GET /users/:id` 时先校验身份，再返回路径中的用户 ID；
- 每个请求都记录方法、URL 和处理时间，未匹配的请求返回 `404`。

先用一个函数完成最小响应，再让新增需求逐步推动路由、路径参数、中间件和错误处理出现。这里不会预先设计一套完整框架。

## 第一步：从请求入口开始

先创建一个只返回 `Hello World` 的服务器：

```js
import { createServer } from 'node:http'

function handle(req, res) {
  res.writeHead(200, {
    'content-type': 'text/plain; charset=utf-8'
  })
  res.end('Hello World')
}

const server = createServer(handle)
server.listen(3000)
```

这里的调用关系是：

1. 程序启动时，`createServer(handle)` 创建 HTTP 服务器，并把 `handle` 注册为 `request` 事件的监听器。
2. `server.listen(3000)` 开始监听端口。
3. 每当一个请求到达，Node 调用 `handle(req, res)`。
4. `res.end()` 写完响应，并结束这次请求。

`handle` 不是手动调用的。它由 Node 在请求到达时调用，等价写法是：

```js
const server = createServer()
server.on('request', handle)
server.listen(3000)
```

启动文件后可以直接验证：

```sh
node server.mjs
curl -i http://localhost:3000
```

此时还没有框架。全部请求都进入同一个 `handle`，它就是后续所有抽象的起点。

## 第二步：根据方法和路径选择处理函数

服务器通常需要处理多个接口。最直接的写法是在 `handle` 中判断请求方法和路径：

```js
function handle(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`)

  if (req.method === 'GET' && url.pathname === '/hello') {
    res.end('Hello World')
    return
  }

  if (req.method === 'GET' && url.pathname === '/users') {
    res.end('User list')
    return
  }

  res.statusCode = 404
  res.end('Not Found')
}
```

两个路由还容易阅读；路由增加后，`handle` 会变成很长的条件分支。先把“匹配规则”和“匹配后的处理函数”放进数组：

```js
const routes = []

function get(path, handler) {
  routes.push({ method: 'GET', path, handler })
}

get('/hello', (req, res) => {
  res.end('Hello World')
})

get('/users', (req, res) => {
  res.end('User list')
})
```

`handle` 只负责解析 URL、查找路由和执行处理函数：

```js
function handle(req, res) {
  const host = req.headers.host ?? 'localhost'
  const url = new URL(req.url ?? '/', `http://${host}`)

  const route = routes.find((item) => {
    return item.method === req.method && item.path === url.pathname
  })

  if (!route) {
    res.statusCode = 404
    res.end('Not Found')
    return
  }

  route.handler(req, res)
}
```

路由器最初不需要是一个类。它的核心数据就是一组路由记录，核心操作就是注册和匹配。

## 第三步：支持路径参数

静态字符串无法让 `/users/42` 匹配 `/users/:id`。路径匹配器需要逐段比较，并返回从动态片段中提取的参数：

```js
function matchPath(pattern, pathname) {
  const patternParts = pattern.split('/').filter(Boolean)
  const pathParts = pathname.split('/').filter(Boolean)

  if (patternParts.length !== pathParts.length) return null

  const params = {}

  for (let index = 0; index < patternParts.length; index += 1) {
    const patternPart = patternParts[index]
    const pathPart = pathParts[index]

    if (patternPart.startsWith(':')) {
      params[patternPart.slice(1)] = decodeURIComponent(pathPart)
      continue
    }

    if (patternPart !== pathPart) return null
  }

  return params
}
```

路由查找现在需要同时返回路由和参数：

```js
function matchRoute(routes, method, pathname) {
  for (const route of routes) {
    if (route.method !== method) continue

    const params = matchPath(route.path, pathname)
    if (params !== null) return { route, params }
  }

  return null
}
```

在入口中把参数放到 `req.params`，路由处理函数就不需要再次解析 URL：

```js
function handle(req, res) {
  const host = req.headers.host ?? 'localhost'
  const url = new URL(req.url ?? '/', `http://${host}`)
  const matched = matchRoute(routes, req.method, url.pathname)

  if (!matched) {
    res.statusCode = 404
    res.end('Not Found')
    return
  }

  req.params = matched.params
  matched.route.handler(req, res)
}
```

这里已经出现框架的第一个增强：Node 原生请求对象没有 `params`，是框架在完成路由匹配后添加的。Express 的 `req.params` 也来自路由层，而不是来自 HTTP 协议。

## 第四步：重复逻辑推动中间件出现

假设部分接口需要记录日志和校验身份。直接写进每个处理函数会产生重复：

```js
get('/users/:id', (req, res) => {
  console.log(req.method, req.url)

  if (req.headers.authorization !== 'Bearer demo') {
    res.statusCode = 401
    res.end('Unauthorized')
    return
  }

  res.end(`User ${req.params.id}`)
})
```

把这些逻辑拆成独立函数时，需要一种方式表达两种结果：

- 当前函数已经生成响应，请求到此结束；
- 当前函数处理完成，继续执行下一个函数。

Express 使用 `next()` 表示第二种结果：

```js
function logger(req, res, next) {
  const startedAt = Date.now()

  res.once('finish', () => {
    console.log(req.method, req.url, Date.now() - startedAt)
  })

  next()
}

function requireAuth(req, res, next) {
  if (req.headers.authorization !== 'Bearer demo') {
    res.statusCode = 401
    res.end('Unauthorized')
    return
  }

  next()
}
```

框架需要一个调度器按顺序执行这些函数：

```js
function dispatch(stack, req, res, done) {
  let index = 0

  function next(error) {
    if (error !== undefined) {
      done(error)
      return
    }

    const current = stack[index]
    index += 1

    if (!current) {
      done()
      return
    }

    try {
      const result = current(req, res, next)
      Promise.resolve(result).catch(next)
    } catch (error) {
      next(error)
    }
  }

  next()
}
```

执行 `dispatch([logger, requireAuth, getUser], ...)` 时：

1. 调度器先执行 `logger`。
2. `logger` 调用 `next()`，调度器执行 `requireAuth`。
3. 认证失败时，`requireAuth` 发送 `401`，不调用 `next()`，处理链停止。
4. 认证成功时，调度器继续执行 `getUser`。
5. `getUser` 发送响应，通常不再调用 `next()`。

这就是 Express 风格中间件的最小核心：数组保存顺序，游标记录位置，`next()` 转移控制权。生产实现还需要防止重复调用 `next()`，并区分普通中间件和错误处理中间件。

## 第五步：把路由处理函数也放进栈

路由处理函数和中间件都接收 `req`、`res`。因此一个路由可以保存多个处理函数：

```js
const globalMiddleware = []
const routes = []

function use(middleware) {
  globalMiddleware.push(middleware)
}

function get(path, ...handlers) {
  routes.push({ method: 'GET', path, handlers })
}
```

注册时可以同时声明路由级中间件和最终处理函数：

```js
use(logger)

get('/users/:id', requireAuth, (req, res) => {
  res.setHeader('content-type', 'application/json; charset=utf-8')
  res.end(JSON.stringify({ id: req.params.id }))
})
```

入口按照“全局中间件 → 路由中间件 → 路由处理函数”的顺序组装栈：

```js
function handle(req, res) {
  const host = req.headers.host ?? 'localhost'
  const url = new URL(req.url ?? '/', `http://${host}`)
  const matched = matchRoute(routes, req.method, url.pathname)

  req.params = matched?.params ?? {}

  const routeHandlers = matched?.route.handlers ?? []
  const stack = [...globalMiddleware, ...routeHandlers]

  dispatch(stack, req, res, (error) => {
    finalHandler(res, error)
  })
}
```

当路由没有匹配时，栈中仍可执行日志等全局中间件；栈正常走完后，`finalHandler` 返回 `404`。处理过程中发生错误时，同一个入口返回 `500`：

```js
function finalHandler(res, error) {
  if (res.writableEnded) return

  if (res.headersSent) {
    res.destroy(error instanceof Error ? error : undefined)
    return
  }

  const status = error ? 500 : 404

  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8'
  })
  res.end(JSON.stringify({
    code: status,
    message: status === 404 ? 'Not Found' : 'Internal Server Error'
  }))
}
```

这里的 `404` 不是路由器直接返回的，而是“处理栈已经走完，仍然没有人生成响应”的结果。最终处理器因此也常被称为兜底处理器。

## 第六步：收拢成 Application

目前的函数依赖几个模块级数组。把状态和操作收进 `createApp()`，就得到一个最小 Application：

```js
import { createServer } from 'node:http'

function createApp() {
  const globalMiddleware = []
  const routes = []

  function use(middleware) {
    globalMiddleware.push(middleware)
  }

  function get(path, ...handlers) {
    routes.push({ method: 'GET', path, handlers })
  }

  function handle(req, res) {
    const host = req.headers.host ?? 'localhost'
    const url = new URL(req.url ?? '/', `http://${host}`)
    const matched = matchRoute(routes, req.method, url.pathname)

    req.params = matched?.params ?? {}

    const routeHandlers = matched?.route.handlers ?? []
    const stack = [...globalMiddleware, ...routeHandlers]

    dispatch(stack, req, res, (error) => {
      finalHandler(res, error)
    })
  }

  function listen(port, callback) {
    const server = createServer(handle)
    return server.listen(port, callback)
  }

  return { use, get, listen }
}
```

使用方式已经接近 Express：

```js
const app = createApp()

app.use(logger)

app.get('/hello', (req, res) => {
  res.end('Hello World')
})

app.get('/users/:id', requireAuth, (req, res) => {
  res.setHeader('content-type', 'application/json; charset=utf-8')
  res.end(JSON.stringify({ id: req.params.id }))
})

app.listen(3000, () => {
  console.log('http://localhost:3000')
})
```

`handle` 的调用链现在非常明确：

```text
app.listen(3000)
  -> createServer(handle)
  -> 请求到达
  -> Node 调用 handle(req, res)
  -> matchRoute(...)
  -> dispatch(...)
  -> 路由处理函数调用 res.end()
```

`app.listen()` 只是把 `createServer(handle).listen()` 包装起来。框架的真正请求入口仍然是 `handle`。

## 第七步：把请求体解析做成中间件

Node 不会自动生成 `req.body`。`req` 同时是一个可读流，请求体可能分成多个数据块到达：

```js
async function readJson(req, limit = 1_000_000) {
  const contentType = req.headers['content-type'] ?? ''

  if (!contentType.toLowerCase().startsWith('application/json')) {
    return undefined
  }

  const chunks = []
  let size = 0

  for await (const chunk of req) {
    size += chunk.length

    if (size > limit) {
      throw new Error('Request body too large')
    }

    chunks.push(chunk)
  }

  const text = Buffer.concat(chunks).toString('utf8')
  return text === '' ? undefined : JSON.parse(text)
}
```

解析器可以包装成全局中间件：

```js
async function json(req, res, next) {
  req.body = await readJson(req)
  next()
}

app.use(json)
```

`json` 返回 Promise。解析失败时 Promise 会被拒绝，前面的 `dispatch` 通过 `Promise.resolve(result).catch(next)` 把错误交给最终处理器。

真实请求体解析器还必须区分错误类型：无效 JSON 通常返回 `400 Bad Request`，超过限制返回 `413 Content Too Large`，不支持的媒体类型返回 `415 Unsupported Media Type`。还要处理请求中止、流错误和字符集，不能只把所有错误都映射为 `500`。

## 最小框架解决了什么

沿着这次演进，可以看到各组件是被具体问题推动出来的：

| 遇到的问题 | 引入的结构 |
| --- | --- |
| Node 需要一个请求监听器 | `handle(req, res)` |
| 多个接口挤在条件分支中 | 路由表与 `matchRoute` |
| 动态路径需要传递参数 | `matchPath` 与 `req.params` |
| 日志、认证等逻辑重复 | 中间件函数 |
| 多个中间件需要有序执行 | `dispatch` 与 `next()` |
| 没有匹配或处理过程出错 | `finalHandler` |
| 原始请求体是数据流 | 请求体解析中间件与 `req.body` |
| 多个应用不应共享全局状态 | `createApp()` 闭包 |

Controller、Service、数据库访问和依赖注入不在这条链中。它们解决应用代码的组织问题；HTTP 框架内核解决的是请求如何进入、如何匹配、如何传递控制权，以及最终如何结束。

## 需要固定的行为

继续扩展框架前，应先用测试确定这些语义：

- HTTP 方法和路径必须同时匹配；
- `/users/42` 能得到 `req.params.id === '42'`；
- 中间件按注册顺序执行；
- 中间件不调用 `next()` 时，后续处理函数不执行；
- 未匹配路由返回 `404`；
- 同步异常和 rejected Promise 都进入错误处理；
- 同一个中间件重复调用 `next()` 不会重复执行后续栈；
- 响应已经结束后，最终处理器不再写入第二个响应；
- 请求体超限或中途断开时，解析过程能够结束。

Express 和 Koa 对“如何传递控制权”给出了不同答案。掌握这条演进路径后，再阅读[Express 与 Koa 的中间件模型](./express-vs-koa-middleware.md)。

## 参考资料

- [Node.js HTTP API：`http.createServer()`](https://nodejs.org/api/http.html#httpcreateserveroptions-requestlistener)
- [Node.js：Introduction to Node.js](https://nodejs.org/en/learn/getting-started/introduction-to-nodejs)
- [Express：Using middleware](https://expressjs.com/en/guide/using-middleware/)
- [Express：Error handling](https://expressjs.com/en/guide/error-handling/)
- [The Node Beginner Book：Building the application stack](https://www.nodebeginner.org/#building-the-application-stack)：用于参考从用例到模块的讲解顺序。页面最后更新于 2017 年，示例面向 Node.js 6/8，不作为当前 API 依据。
