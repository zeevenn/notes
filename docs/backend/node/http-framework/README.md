# Node HTTP 框架原理

这一组笔记从 `node:http` 提供的请求监听器开始，逐步加入路由匹配、中间件调度、请求解析、响应封装和错误收口。目标不是复刻完整框架，而是识别 Express、Koa 等后端框架共同解决的问题，以及不同中间件模型对异步控制流的影响。

## 学习路径

1. [从 HTTP 服务器到最小框架](./minimal-http-framework.md)：`createServer()`、路由匹配、路径参数与 Koa 风格中间件调度。
2. [Express 与 Koa 的中间件模型](./express-vs-koa-middleware.md)：比较回调式传递与基于 Promise 的洋葱模型。

## 能力边界

这组笔记关注 HTTP 框架内核：

- 将 Node 请求事件适配为应用入口；
- 根据请求方法和路径选择处理程序；
- 编排可复用的横切逻辑；
- 解析输入并扩展请求上下文；
- 保证请求最终得到响应或进入统一错误处理。

依赖注入、数据库访问、领域服务和分层架构属于应用架构，不是 HTTP 框架内核。相关边界见[后端分层与职责边界](../../engineering/layered-backend-boundaries.md)。
