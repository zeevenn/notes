---
title: 跨域
date: 2022-05-06
icon: domain
category:
  - browser
tag:
  - network
---

跨域是因为浏览器的同源策略，协议、域名、端口三者不一致即会造成跨域问题。

## CORS

简单请求和非简单请求

### 简单请求

请求方法：

- HEAD
- GET
- POST

请求头：

- Accept
- Accept-Language
- Content-Language
- Last-Event-ID
- Content-Type

对于简单请求，浏览器会在请求头信息增加一个 origin 字段，该字段用来说明本次请求来自哪个源：协议+端口+域名。

服务器根据这个值来决定是否同意这次请求，如果 origin 指定的源在允许范围内，服务器就返回如下响应头：

```
Access-Control-Allow-Origin: http://api.bob.com 和 origin 一致
Access-Control-Allow-Credentials: true
Access-Control-Expose-Headers: FooBar
Content-Type: text/html; charset=utf-8
```

服务器至少设置 Access-Control-Allow-Origin。

### 非简单请求

需要进行 options 预检请求。

请求头

```
Access-Control-Request-Method 必须
Access-Control-Request-Headers 逗号分隔符，指定请求会额外发送的头信息字段
```

响应头：

```
Access-Control-Allow-Origin: http://api.bob.com 和 origin 一致
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: FooBar
Access-Control-Max-Age: 1728000 本次预检的有效期，秒
```
