---
title: rest client 无法调试 localhost
date: 2024-07-19
icon: error
category:
  - practice
tag:
  - vscode
---

## 故障描述

REST Client 插件无法调试 localhost。

- REST Client: v0.25.1
- VS code: 1.91.1

本地启动 node 服务，使用 REST Client 发送请求：

```http
GET http://127.0.0.1:8000/ HTTP/1.1
```

![报错](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20240719143258.png)

## 排查

初步怀疑是走了代理，但是查看代理软件日志，发现并没有可疑请求走了国外代理。

最终在 github 中找到了一个 issue: [Rest client ceased to work](https://github.com/Huachao/vscode-restclient/issues/1163)。

并在下方回答中找到：[ECONNREFUSED - Connection was Rejected](https://github.com/Huachao/vscode-restclient/issues/1145)。

将代码改为以下即可成功：

```http
GET http://[::1]:8000/ HTTP/1.1
```
