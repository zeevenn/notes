---
title: finalhandler
date: 2024-08-27
icon: handle
category:
  - node
tag:
  - module
---

[finalhandler](https://github.com/pillarjs/finalhandler) 模块在 Express.js 中用于处理未处理的请求或错误，是请求处理的最后一个步骤。它确保了当请求经过所有中间件和路由后，如果没有响应或者发生了错误，应用仍然能够正确地处理这些情况，并返回适当的 HTTP 响应。

具体来说，`finalhandler` 模块实现了以下功能：

## 处理未匹配的路由

当请求经过所有中间件和路由后，`finalhandler` 会检查是否已经发送了响应。如果没有，则认为请求未被处理（即未匹配到任何路由），并返回一个 404 状态码（"Not Found"）。

## 处理未捕获的错误

如果请求处理过程中抛出了错误（无论是在中间件还是在路由处理程序中），而这些错误没有被处理，那么 `finalhandler` 会捕获到这些错误，并根据错误类型返回适当的 HTTP 状态码。常见的错误处理包括返回 500 状态码（"Internal Server Error"），以及输出错误信息（在开发环境中）。

## 处理不同的响应类型

`finalhandler` 会根据请求的 Accept 头信息，决定返回纯文本错误信息还是返回 HTML 格式的错误页面。

## 日志记录

在处理错误时，finalhandler 可以记录错误日志，帮助开发者排查问题。

简而言之，finalhandler 是 Express 应用的最后一道防线，确保所有请求都能得到适当的处理，即使发生了未预料的错误或未匹配的路由。
