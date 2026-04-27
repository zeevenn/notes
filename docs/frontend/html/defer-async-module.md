---
title: defer、async 与 type="module"
date: 2022-07-25
icon: vs
category:
  - HTML
tag:
  - HTML
---

普通 `<script src>` 会阻塞 HTML 解析器：浏览器遇到标签后暂停解析，等脚本下载并执行完才继续。`defer` 和 `async` 都允许脚本异步下载，区别在于**何时执行**。

## 对比

|          | 普通 `<script>`    | `async`                    | `defer`                                |
| -------- | ------------------ | -------------------------- | -------------------------------------- |
| 下载时机 | 阻塞解析，立即下载 | 并行下载                   | 并行下载                               |
| 执行时机 | 下载完立即执行     | 下载完立即执行             | HTML 解析完成后，`DOMContentLoaded` 前 |
| 执行顺序 | 文档顺序           | 不保证（谁先下完谁先执行） | 保证文档顺序                           |
| 阻塞解析 | 是                 | 是（执行时阻塞）           | 否                                     |

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

## type="module" 与 defer 的差异

`type="module"` 的执行时机与 `defer` 相同，但并非完全等价：

| #            | `defer`                 | `type="module"`                                             |
| ------------ | ----------------------- | ----------------------------------------------------------- |
| 内联脚本     | 无效，会被忽略          | 同样被推迟执行                                              |
| 作用域       | 全局                    | 独立模块作用域，不污染 `window`                             |
| 严格模式     | 默认非严格              | 强制严格模式                                                |
| 跨域请求     | 无限制                  | 需要 CORS 响应头                                            |
| 重复加载     | 每次都执行              | 同一 URL 只执行一次                                         |
| 配合 `async` | `defer` 与 `async` 互斥 | `<script type="module" async>` 有效，变为异步执行，不等 DOM |

## 现代前端中的实际分布

自己写的业务代码基本走构建工具，几乎不需要手写这三种属性。但在 HTML 模板里接入第三方脚本时，`defer` 和 `async` 仍然是日常。

| 来源                            | 属性                                                                                 |
| ------------------------------- | ------------------------------------------------------------------------------------ |
| 构建工具生成的入口脚本          | `type="module"`，或自动注入 `defer`                                                  |
| 第三方分析 / 监控（GA、Sentry） | `async`（独立，不依赖 DOM）                                                          |
| 第三方功能脚本（客服、支付）    | `defer`（依赖 DOM 或有顺序要求）                                                     |
| Next.js `<Script>` 组件         | `strategy="afterInteractive"` 底层是 `defer`，`strategy="lazyOnload"` 底层是 `async` |

## 参考

- [MDN - script](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script)
