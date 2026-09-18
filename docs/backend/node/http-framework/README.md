# Node HTTP 框架原理

从 `node:http` 的请求监听器出发，实现路由、路径参数和中间件，再对照 Express、Koa 的处理方式。

1. [从 HTTP 服务器到最小框架](./minimal-http-framework.md)：用 `use()` 和 `get()` 组织请求处理，调度采用 Koa 风格的洋葱模型。
2. [Express 与 Koa 的中间件模型](./express-vs-koa-middleware.md)：分别解释 Express 的责任链模式和 Koa 的洋葱模型，以及两者的异步等待与错误传播。

数据库访问、业务服务与依赖注入属于应用结构，另见[后端分层与职责边界](../../engineering/layered-backend-boundaries.md)。
