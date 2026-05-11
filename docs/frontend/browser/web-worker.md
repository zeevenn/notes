---
title: Web Worker
date: 2026-05-09
icon: thread
category:
  - 浏览器
tag:
  - 浏览器
  - 性能
---

JavaScript 是单线程的，所有代码运行在主线程（UI 线程）上。长时间的计算会阻塞渲染，导致页面卡顿。Web Worker 允许在**独立线程**中运行 JS，不影响主线程。

## 核心限制

Worker 线程与主线程完全隔离：

- **无法访问 DOM**：`document`、`window` 均不可用
- **独立内存**：不共享变量，通过消息传递通信
- **可以使用**：`fetch`、`XMLHttpRequest`、`setTimeout`、`IndexedDB`、部分 Web API

## 通信：postMessage

主线程和 Worker 通过 `postMessage` / `onmessage` 双向通信，数据经过**结构化克隆**（深拷贝），不共享引用。

```js
// main.js
const worker = new Worker('./worker.js')

worker.postMessage({ data: largeArray })

worker.onmessage = (e) => {
  console.log('结果:', e.data)
}

// worker.js
self.onmessage = (e) => {
  const result = heavyCompute(e.data)
  self.postMessage(result)
}
```

传输大数据（如 ArrayBuffer）时，可用 **Transferable Objects** 转移所有权而非拷贝，避免内存开销：

```js
const buffer = new ArrayBuffer(1024 * 1024 * 32) // 32MB
worker.postMessage(buffer, [buffer]) // 转移后 main 线程不再持有 buffer
```

## 适用场景

| 场景       | 示例                             |
| ---------- | -------------------------------- |
| 大数据处理 | 解析 CSV / 大 JSON、数据聚合计算 |
| 音视频处理 | WAD 检测、音频编解码、视频帧处理 |
| 图像处理   | 滤镜、压缩、格式转换             |
| 加密运算   | RSA、AES 等计算密集型加密        |
| 复杂计算   | 物理引擎、路径寻找算法           |

## 三种 Worker 类型

| 类型                 | 说明                             |
| -------------------- | -------------------------------- |
| **Dedicated Worker** | 专属于一个页面，最常用           |
| **Shared Worker**    | 可被同源的多个 Tab 共享          |
| **Service Worker**   | 拦截网络请求，PWA 离线缓存的核心 |

## SharedArrayBuffer

普通 `postMessage` 是拷贝，`SharedArrayBuffer` 允许主线程和 Worker **共享同一块内存**，配合 `Atomics` 做同步控制（类似多线程锁），适用于极高频率通信的场景（如音频处理）。

> [!TIP]
>
> 出于 Spectre 安全漏洞的考虑，`SharedArrayBuffer` 需要页面设置特定的响应头才能使用：
>
> ```
> Cross-Origin-Opener-Policy: same-origin
> Cross-Origin-Embedder-Policy: require-corp
> ```

## 参考

- [MDN - Web Workers API](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API)
