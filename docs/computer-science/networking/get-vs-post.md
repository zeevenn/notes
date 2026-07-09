---
title: GET 和 POST 的区别
date: 2022-04-24
icon: vs
category:
  - 计算机网络
tag:
  - HTTP
---

## 概述

GET 和 POST 是 HTTP 协议中发送请求的方法。

- GET：请求资源，从服务器获取数据；
- POST：将数据提交到指定地址。

二者本质上都是 TCP 链接，因此本质上**没有区别**，但由于 HTTP 规定和浏览器/服务器的限制，导致它们在实际操作中会有一定区别。

## 区别

- GET 在浏览器回退时是无害的，而 POST 会再次提交请求。
- GET 产生的 URL 地址可以被 Bookmarked，而 POST 不可以。
- GET 请求会被浏览器主动 cache，而 POST 不会，除非手动设置。
- GET 请求只能进行 url 编码，而 POST 支持多种编码方式。
- GET 请求参数会被完整保留在浏览器历史记录里，而 POST 中的参数不会被保留。
- GET 请求在 URL 中传送的参数是有长度限制的，而 POST 没有。
- 对参数的数据类型，GET 只接受 ASCII 字符，而 POST 没有限制。
- GET 比 POST 更不安全，因为参数直接暴露在 URL 上，所以不能用来传递敏感信息。
- GET 参数通过 URL 传递，POST 放在 Request body 中。
- GET 方法是安全且幂等的，POST 方法是**不安全且不幂等**的。

::: tip

- 安全：请求方法不会破坏服务器上的资源；
- 幂等：执行多次相同的操作，结果都是相同的。

:::

## 误区

### 参数长度

GET 参数有长度限制，但这是因为浏览器对 URL 的长度限制，而不是 HTTP 协议本身对参数长度的限制。HTTP 同样对 POST 参数长度没有限制，而是靠服务器的设置来限制大小的。

### 安全性

POST **相对**比 GET 安全性要高。

通过 GET 提交的请求都将显示到 URL 上，页面会被浏览器缓存，其他人查看历史记录会看到提交的数据。

这里的相对在于：**HTTP 本身是明文传输的协议**，无论使用 GET 还是 POST 都有可能受到中间人攻击而造成数据泄露。

如果 HTTP 链接使用 SSL/TLS，那么 GET 参数也会被加密，但是仍然会在某些地方出现，比如服务器日志、浏览器插件和其他应用。而 POST 数据会被加密并且不会被任何方式泄露。

::: tip

因此如果想要保证总是安全地传输数据，需要使用 HTTPS 上的 POST。

:::

### Request Body

GET 可以带 Request Body，但不能保证一定能被接收到。如果你用 GET 请求，在 Request Body 携带数据，不同服务器的处理方式也是不同的，有些服务器会帮你读出数据，有些服务器直接忽略。

### 数据包

对于 GET 请求，浏览器会把 http header 和 data 一并发送出去，服务器响应 200（返回数据）。

对于 POST，浏览器先发送 header，服务器响应 100 continue，浏览器再发送 data，服务器响应 200 ok。

并不是所有浏览器都会在 POST 中发送两次包，Firefox 就只发送一次。

## 参考链接

- [https - What is the difference between GET and POST encryption? - Stack Overflow](https://stackoverflow.com/questions/3063530/what-is-the-difference-between-get-and-post-encryption)
- [99%的人都理解错了 HTTP 中 GET 与 POST 的区别 (qq.com)](https://mp.weixin.qq.com/s?__biz=MzI3NzIzMzg3Mw==&mid=100000054&idx=1&sn=71f6c214f3833d9ca20b9f7dcd9d33e4#rd)
- [面试官：说一下 GET 和 POST 的区别？ · Issue #145 · febobo/web-interview (github.com)](https://github.com/febobo/web-interview/issues/145)
