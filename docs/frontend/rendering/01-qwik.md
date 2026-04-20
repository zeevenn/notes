---
title: Qwik
date: 2024-01-03
icon: STARTUP
category:
  - 工程化
tag:
  - frontend
  - SSR
---

## Web Apps 历史

在了解 Qwik 之前，有必要了解 Web 应用程序的历史。

### 第一代

第一代应用程序采用 MPA 技术，是在服务器上通过 PHP 等技术完成的。

服务器会渲染一系列包含 HTML 和 JavaScript 的文档，客户端使用 jQuery 在模板中添加交互。

这种方法的问题在于必须处理两种语言，一种在服务器端（如 PHP），另一种在客户端（JavaScript），这可能会导致在 PHP 中编写的元素与其在 JavaScript 中的行为之间产生混淆，从而导致多次编写一个功能。

这就是这种方法难以扩展的原因。

### 第二代

第二代应用程序就是 SPA，即 AngularJS、Angular、React、Vue.js 等现代框架，这些框架都基于 MVC 架构。

SPA 只在客户端向服务器发起请求更新状态，但是在首次加载时，浏览器会下载所有 JavaScript 代码。

SPA 在首次加载时会是一个空白页，需要很长时间才能加载，而且如果想开发大型应用程序，它不具备可扩展性。

![client renderin - Adservio](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/63e3d6905bacd65c5da3920b_Client%20Rendering-min.jpg)

### SSR

处于第二代和第三代的技术就是服务端渲染，比如 Next.js 或 Svelte。

在 SSR 中，仍然构建 SPA 应用程序，然而步骤略有不同：

1. 服务端拼接 HTML

   用户请求某个页面时，服务端会拼接好一个页面的 HTML 结构返回给客户端。

2. 客户端对 HTML 进行预渲染

   HTML 结构加载显示，但是 JavaScript 代码还未加载，此时页面还不能进行交互。

3. 进行 hydration（水合）处理

   通过 JavaScript 代码的执行，动态地为当前页面上的 DOM 绑定事件。

> HTML 相当于一个干货海参，JavaScript 代码理解为水，hydration 过程就是用水把海参泡发，即达到页面可正常交互的状态。

SSR 确实将首屏加载速度变快，但仍有一些缺点：

1. 在水合之前，此时页面仍然不可交互，所以 tti（页面可交互时间）并没有太多优化。
2. 下载的 JavaScript 代码仍然是比较全量的代码。
3. 比较耗费服务器资源，维护成本也较高。

![server renderin - Adservio ](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/63e3d6905bacd612ada3920c_Server%20Rendering-min%20(1).jpg)

为了减少加载 JavaScript 代码所需的时间，Astro 框架出现了。

Astro 有一个名为「部分水合」的概念，因此在页面可见之前，它不会对页面进行水合。

例如，如果联系表单位于页面底部，而我们位于页面顶部，那么联系表单将不可见，这样就不需要加载表单所需的 JavaScript。

只有当页面向下滚动到有联系表单的部分时，才会进行水合，将表单中的组件与所需的 JavaScript 水合。

## Qwik 介绍

Qwik 可以理解为一个语法接近 React 的前端 SSR 框架，但是相比于 Astro，它的优化更加彻底：**「0 水合」和「0 JavaScript」**。

例如，如果我们在页面底部有一个联系表单，Angular、React 或 Vue 会在首次加载时加载所需的 JavaScript，Astro 会在我们向下滚动时加载，而 Qwik 只有在点击表单的发送按钮时才会加载，它不是在页面出现表单时加载 JavaScript，**而是在与表单交互时加载**。

Qwik 的核心理念：to do it faster by doing nothing。

### Resumability

现代的框架都在尝试优化水合作用，Qwik 的独特之处在于 **可恢复性** (no eager JS execution and no hydration)。

![resumability in qwik framework](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/63e3d6905bacd6233ba391e2_Hydration%20-%20Ready-min.jpg)

如果有一个庞大的应用程序，那么加载水合将会耗费大量时间，即使使用部分水合技术，也会面临挑战。而使用可恢复性的 Qwik 技术，只加载 HTML，则不会耗费大量时间。

## 思考

从概念上看，Qwik 确实会大幅提升庞大应用程序的性能，能提供最快的首次渲染和交互性能。然而，作为一个新技术，尽管它有潜力成为未来广泛使用的框架之一，仍然需要时间和社区支持。

## 参考资料

1. [A Brief History of Web Apps – Why Qwik is Innovative](https://www.adservio.fr/post/a-brief-history-of-web-apps-why-qwik-is-innovative)
2. [Qwik – The Post-Modern Framework](https://www.adservio.fr/post/qwik-the-post-modern-framework)
3. [Qwik.js框架是如何追求极致性能的?!](https://segmentfault.com/a/1190000042250628)
