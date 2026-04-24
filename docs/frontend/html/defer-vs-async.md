---
title: defer 和 async 的区别
date: 2022-07-25
icon: vs
category:
  - HTML
tag:
  - HTML
---

普通 `<script src>` 会阻塞 HTML 解析器：浏览器遇到标签后暂停解析，等脚本下载并执行完才继续。`defer` 和 `async` 都允许脚本异步下载，区别在于**何时执行**。

## 对比

| | 普通 `<script>` | `async` | `defer` |
| --- | --- | --- | --- |
| 下载时机 | 阻塞解析，立即下载 | 并行下载 | 并行下载 |
| 执行时机 | 下载完立即执行 | 下载完立即执行 | HTML 解析完成后，`DOMContentLoaded` 前 |
| 执行顺序 | 文档顺序 | 不保证（谁先下完谁先执行） | 保证文档顺序 |
| 阻塞解析 | 是 | 是（执行时阻塞） | 否 |

## 时序

```
普通 <script>:
HTML ----[暂停]--[下载+执行]----→ 继续解析

async:
HTML ──────────────────────────→ 继续解析
     ↘[下载]↗[立即执行，可能打断解析]

defer:
HTML ──────────────────────────→ 解析完成
     ↘[下载...........↗[执行] → DOMContentLoaded
```

## 使用场景

**`defer`** — 依赖 DOM 或需要保证执行顺序的脚本（绝大多数业务脚本）：

```html
<script defer src="main.js"></script>
<script defer src="analytics.js"></script>
<!-- 保证 main.js 先于 analytics.js 执行 -->
```

**`async`** — 完全独立、不依赖 DOM 和其他脚本的脚本（统计、广告）：

```html
<script async src="gtag.js"></script>
```

> [!TIP]
> 现代构建工具（Vite、webpack）生成的入口 `<script>` 默认加 `type="module"`，模块脚本天然具有 `defer` 行为，不需要手动添加。

## 参考

- [MDN - script](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script)
