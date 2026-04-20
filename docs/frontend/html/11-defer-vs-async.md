---
title: defer 和 async 的区别
date: 2022-07-25
icon: vs
category:
  - HTML
tag:
  - HTML
---

HTML 中在页面插入 JavaScript 的主要方式就是使用 `<script>` 元素，可以直接在页面中嵌入 JavaScript 代码，但是一般来说，通常会通过 `src` 属性来引入外部脚本。

在 [src 和 href 的区别](./009-src-vs-href.md) 中提到了 `src` 会暂停当前页面的加载，直到获取、解析并执行完这个 JS 文件。这样就会阻塞后续文档的加载。

而使用 `defer` 和 `async` 都可以 **异步加载** 外部的 JavaScript 脚本，主要区别如下：

- **执行顺序**：多个带 `async` 属性的标签，不能保证加载的顺序；多个带 `defer` 属性的标签，按照加载顺序执行；
- **脚本何时执行**：`async` 属性表示脚本加载完成后立即执行，不会等到文档解析完成。`defer` 属性表示脚本加载完成后还需等到所有元素解析完成，即 `DOMContentLoaded` 事件触发前完成。
