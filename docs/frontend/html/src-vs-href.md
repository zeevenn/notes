---
title: src 和 href 的区别
date: 2022-04-28
icon: vs
category:
  - HTML
tag:
  - HTML 属性
  - 资源加载
  - 性能优化
---

`src` 和 `href` 是 HTML 中两个常见属性，含义不同，不可互换：

| 属性   | 全称                | 用途                       | 对页面解析的影响             |
| ------ | ------------------- | -------------------------- | ---------------------------- |
| `src`  | Source              | **嵌入**外部资源到当前位置 | 阻塞解析，需等待资源加载完成 |
| `href` | Hypertext Reference | **链接**到外部资源         | 不阻塞解析（但可能阻塞渲染） |

## src

`src` 属性指向的资源会被嵌入到当前元素所在位置，浏览器遇到它时会 **暂停页面解析**，直到资源获取、解析并执行完毕。

```html
<script src="script.js"></script>
```

浏览器解析到上面的标签后，会暂停 HTML 的继续解析，待 `script.js` 下载并执行完成后才恢复。其行为等价于将脚本内容内联到 `<script>` 标签中。

> [!TIP]
> 这就是为什么通常建议将 `<script>` 标签放在 `<body>` 末尾，或使用 `defer` / `async` 属性来避免阻塞。

同样使用 `src` 的标签还有：

- `<img src="photo.jpg" />`：空标签，内容完全由 `src` 决定，加载时也会阻塞页面；
- `<iframe src="page.html">`：嵌入另一个文档，行为类似。

## href

`href` 属性用于指定外部资源的地址，建立当前元素或文档与目标资源之间的关联，**不会阻塞 HTML 的解析**。

```html
<link href="style.css" rel="stylesheet" />
```

浏览器识别到这是样式表后，会继续解析 HTML，但会在渲染前等待 CSS 加载完成（以避免 FOUC，即 Flash of Unstyled Content，无样式内容闪烁——页面先以无样式状态短暂呈现，CSS 加载后再重新渲染的现象）。

常见使用场景：

- `<a href="https://example.com">链接</a>`：定义超链接；
- `<link href="style.css" rel="stylesheet" />`：引入外部样式表。
