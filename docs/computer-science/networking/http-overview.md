---
title: HTTP 概述
date: 2022-04-20
icon: STARTUP
category:
  - 计算机网络
tag:
  - HTTP
---

超文本传输协议（HyperText Transfer Protocol, HTTP）一般是用于浏览器和服务器之间传输文字、图片、音频视频等超文本数据的应用层协议。

## HTTP 协议特性

- 简单：HTTP 基本的报文格式就是 header + body，头部信息也是 key-value 的简单文本形式，易于理解，降低了学习和使用的门槛。
- 灵活易扩展：HTTP/1.0 出现的 HTTP headers 让协议扩展变得非常容易，只要服务端和客户端对新 headers 达成语义一致，新功能就可以被添加进来。
- 无连接：每次连接只处理一个请求。服务器处理完客户端的请求，并收到客户端的应答后，就会断开连接，HTTP 1.1 可以开启长连接。
- 无状态：对于事物处理没有记忆能力。因此浏览器无法保存用户的登录信息，每次进行需要登录才能执行的操作时，都需要输入用户名和密码。而 cookie 可以创建有状态的会话。好处在于服务器不会记忆 HTTP 的状态，能减轻服务器的压力。
- 明文传输：给调试带来便利性，但是用户毫无隐私可言，不安全。

## HTTP 报文格式

### 请求报文格式

客户端发送 HTTP 请求到服务器的请求消息：**请求行、请求头、空行和请求体四个部分组成。**

```
POST / HTTP1.1
Host:www.wrox.com
User-Agent:Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 2.0.50727; .NET CLR 3.0.04506.648; .NET CLR 3.5.21022)
Content-Type:application/x-www-form-urlencoded
Content-Length:40
Connection: Keep-Alive

name=Professional%20Ajax&publisher=Wiley
```

第一部分：请求行，请求方法 + URI + HTTP 版本。

第二部分：请求头部。

第三部分：空行。

第四部分：请求数据。

### 响应报文格式

服务器响应也由四个部分组成，分别是：**响应行、响应头、空行和响应体**。

```
HTTP/1.1 200 OK
Date: Fri, 22 May 2009 06:07:21 GMT
Content-Type: text/html; charset=UTF-8

<html>
  <head></head>
  <body>
    <!--body goes here-->
  </body>
</html>
```

## HTTP 常见状态码

- 1xx：提示信息，表示目前是协议处理的中间状态，还需进一步操作；
- 2xx：成功，表示请求已被成功收到并正确处理；
- 3xx：重定向，资源位置发生变动，需要客户端重新发送请求；
- 4xx：客户端错误，请求报文有误，服务器无法处理；
- 5xx：服务器错误，服务器在处理请求时内部发生了错误。

| 常见状态码                | 状态描述                                                         |
| ------------------------- | ---------------------------------------------------------------- |
| 200 OK                    | 客户端请求成功                                                   |
| 400 Bad Request           | 客户端请求有语法错误，不能被服务器所理解                         |
| 401 Unauthorized          | 请求未经授权，这个状态代码必须和 WWW-Authenticate 报头域一起使用 |
| 403 Forbidden             | 服务器收到请求，但是拒绝提供服务                                 |
| 404 Not Found             | 请求资源不存在，举个例子：输入了错误的 URL                       |
| 500 Internal Server Error | 服务器发生不可预期的错误                                         |
| 503 Server Unavailable    | 服务器当前不能处理客户端的请求，一段时间后可能恢复正常           |

::: tip

详细状态码请见[MDN 文档](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status)。

:::

## HTTP 常见的字段

- Host：指定服务器的域名；
- Content-length：服务器返回数据时，告知本次响应的数据长度；
- Connection：客户端告知服务器使用 TCP 持久连接（HTTP1.1 的改进），以便其他请求复用，字段值为 `Connection: keep-alive`；
- Accept：客户端请求时，表明自己可以接受哪些数据格式，`Accept: */*`，表明可以接受任何格式；
- Content-Type：服务器响应时告知客户端本次数据的格式，`Content-Type: text/html; charset=utf-8`，表明发送的是网页，编码是 UTF-8；
- Accept-Encoding：客户端可以接受哪些压缩方法；
- Content-Encoding：服务器返回的数据使用了何种压缩格式，`Content-Encoding: gzip`。

::: tip

详细字段请见[MDN 文档](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers)。
:::
