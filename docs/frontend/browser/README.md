---
title: 浏览器
icon: creative
star: true
date: 2024-04-15
---

## 浏览器内核

浏览器内核是浏览器的核心，也就是浏览器的 **排版引擎**，分为两部分：

- 将 HTML 和 CSS 渲染到浏览器上的 **渲染引擎**，
- 解析 JavaScript 的 **JavaScript 引擎**。

最开始渲染引擎和 JS 引擎并没有明确的区分，后来 JS 引擎开始独立起来，慢慢发展到现在，内核一般指的是渲染引擎。

不同的浏览器有不同的内核组成：

- Gecko：早期是 Netscape 和 Firefox 浏览器的内核；
- Trident：IE4 - IE11 的内核；
- Webkit：Safari 内核，Google Chrome 之前也使用过；
- Blink： Webkit 的一个分支，目前用于 Chrome、Edge、Opera 等。

## JavaScript 引擎

**JavaScript 引擎** 是一个专门处理 JavaScript 脚本的虚拟机，一般会附带在网页浏览器之中，能为程序员提供部分操作浏览器的功能（网络、DOM、外部事件、HTML5 视频、canvas 和存储），并且用于将 JavaScript 代码翻译成 CPU 指令。比较常见的引擎有：

- SpiderMonkey：第一款 JavaScript 引擎，由 Brendan Eich 开发（也就是 JavaScript 作者）；
- Chakra（JScript 引擎）：微软开发，用于 IE 浏览器；
- Chakra（JavaScript 引擎）：微软开发，用于 Edge 浏览器；
- JavaScriptCore：WebKit 中的 JavaScript 引擎，Apple 公司开发，用于 Safari；
- V8：Google 开发的强大 JavaScript 引擎，C++ 编写。

## 目录

- [浏览器渲染原理](./01-how-browser-rendering-works.md)
- [V8 引擎](./02-V8.md)
- [内存管理](./03-memory-management.md)
- [跨域](./04-cross-domain.md)
- [输入 URL 发生了什么](./05-what-happens-after-entering-the-URL.md)
- [浏览器存储](./web-storage.md)
- [Web Worker](./web-worker.md)
- [WebAssembly](./webassembly.md)
