---
title: 浏览器
icon: creative
star: true
date: 2024-04-15
---

# 浏览器

现代浏览器由多个进程和服务协作完成导航、网络请求、脚本执行、页面渲染、存储和设备访问。“浏览器内核”不是边界稳定的标准术语，讨论实现时应直接指出渲染引擎、JavaScript 引擎或浏览器进程等具体组件。

## 主要组件

- **浏览器进程**：管理窗口、标签页、导航和权限，并协调其他进程。
- **渲染器进程**：解析页面内容、执行脚本、计算布局并生成绘制结果，通常运行在沙箱中。
- **网络服务**：处理 DNS、HTTP、缓存和连接复用等网络操作。
- **GPU 进程或线程**：参与栅格化、合成和最终显示。
- **存储及其他服务**：管理 Cookie、Web Storage、IndexedDB、音视频等能力。

不同浏览器的进程划分会随平台和版本变化。例如 Chromium 使用浏览器进程、多个渲染器进程以及独立的网络、GPU、存储服务；一个标签页也不一定只对应一个渲染器进程。

## 渲染引擎与 JavaScript 引擎

渲染引擎负责解释 HTML 和 CSS、构建页面结构并完成布局、绘制和合成相关工作。常见组合包括：

| 浏览器 | 渲染引擎 | JavaScript 引擎 |
| --- | --- | --- |
| Chrome、Chromium 版 Edge | Blink | V8 |
| Firefox | Gecko | SpiderMonkey |
| Safari | WebKit | JavaScriptCore |

JavaScript 引擎实现 ECMAScript 语言并执行代码。DOM、定时器、网络和存储等 Web API 由浏览器这一宿主环境提供，再通过绑定暴露给 JavaScript；它们不属于 ECMAScript，也不是 JavaScript 引擎自身提供的能力。同一 JavaScript 引擎可以嵌入不同宿主，例如 V8 同时用于 Chromium 和 Node.js，但两者暴露的宿主 API 不同。

## 内容索引

- [从输入 URL 到页面显示](./url-to-page.md)
- [HTTP 缓存（浏览器缓存）](../../computer-science/networking/http-caching.md)
- [V8 引擎](./v8-engine.md)
- [内存管理](./memory-management.md)
- [跨域](./cross-origin.md)
- [浏览器存储](./web-storage.md)
- [Service Worker](./service-worker.md)
- [Web Worker](./web-worker.md)
- [WebAssembly](./webassembly.md)
- [AJAX](./ajax.md)
- [DOM 事件监听](./event-listeners.md)

## 参考资料

- [Chromium Multi-process Architecture](https://www.chromium.org/developers/design-documents/multi-process-architecture/)
- [MDN：JavaScript technologies overview](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/JavaScript_technologies_overview)
- [MDN：JavaScript execution model](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model)
