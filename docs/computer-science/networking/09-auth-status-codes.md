---
title: 登陆失败 HTTP 状态码
date: 2024-07-10
icon: unauthorized
category:
  - 计算机网络
tag:
  - HTTP code
---

如果用户尝试登陆，但用户名或密码不正确，应该返回什么状态码？

这个问题在社区中有一定争议，有些人认为应该返回 `403 Forbidden`，有些人认为应该返回 `404 Not Found`，有些人认为应该返回 `400 Bad Request`，有些人认为应该返回 `401 Unauthorized`。

`403 Forbidden` 表示拒绝访问，但是请求接口是可以访问的，因此该状态码肯定不正确。

`404 Not Found` 表示请求的资源不存在，但是请求接口是存在的，因此该状态码也不正确。

`400 Bad Request` 表示请求参数错误，但是用户输入的数据格式也是完全正确的，因此也不应该用该状态码。

而根据 [What's the appropriate HTTP status code to return if a user tries logging in with an incorrect username / password, but correct format?](https://stackoverflow.com/questions/32752578/whats-the-appropriate-http-status-code-to-return-if-a-user-tries-logging-in-wit) 讨论，应该返回 `401 Unauthorized`。

根据 [RFC7235](https://www.rfc-editor.org/rfc/rfc7235#section-3.1)：如果请求中包含身份验证凭据，则 `401` 响应表示拒绝对这些凭据进行授权。
