---
title: WebSocket
date: 2022-07-25
publish: false
category: 
  - HTML
tag:
  - HTML5
---

WebSocket 是 HTML5 一种协议，是在 http 协议上实现了 socket 协议的长链接，只需要客户端和服务端建立一次连接，就可以互相传送数据。

主要应用在网页即时通讯和服务端消息推送中，使客户端和服务端之间的交互变得更加简单。

http 协议是客户端请求，服务端响应，而 socket 协议可以使服务端主动向客户端发送消息。

## 传统 ajax 对比

ajax 轮询，如果同时请求认输更多会出现高并发情况，

客户端可以让客户端和服务端链接，这个链接不会诶关闭，无序平凡建立同搭配，减小服务器压力

## 2. 主要应用场景和工作原理

## 3. 相关 API 介绍

创建ws对象， var ws = new WebSocket(url)

监听链接通道（事件）ws.onopen=function() {}

监听服务端消息

发送消息

监听通道关闭

## 4.案例

客户端使用开发socket

后端使用php

服务端启动方式

监听接口

```js
if ("WebSocket" in window) {
  // 1. 船舰是对象
  var ws = new WebSocetker('')
  // 2.监听链接通道
  ws.onopen = function() {\
  	log : jianlichenggong 
    // 3.发送消息
    ws.send('mes=sss')
  } 
                          ws.onmessage =functin(event) {
                            
                          }
  ws.onclose=function() {
    log:tongdao guanbil
  }
} else {
    alert('shibai ')
  }
```

