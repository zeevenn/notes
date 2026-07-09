---
title: CSS Containment 与 content-visibility
date: 2026-05-09
icon: box-open
category:
  - CSS
tag:
  - 性能
---

CSS Containment 是一组让浏览器**隔离元素渲染影响**的机制，允许跳过屏幕外内容的渲染，是大列表性能优化的重要手段。

## 浏览器渲染的问题

默认情况下，浏览器在渲染时需要考虑**任意元素的变化可能影响整棵树**。例如一个深层子元素改变了尺寸，浏览器可能需要重新计算整个文档的布局。

`contain` 属性告诉浏览器：这个元素的内部变化不会影响外部，可以安全地隔离计算范围。

## contain 属性

```css
.widget {
  contain: layout paint;
}
```

| 值 | 含义 |
| --- | --- |
| `layout` | 内部布局变化不影响外部元素 |
| `paint` | 内部绘制不超出元素边界，超出部分不渲染 |
| `size` | 元素尺寸不依赖子元素内容 |
| `style` | 某些属性（如 counter）不影响外部 |
| `strict` | 等同于 `size layout paint style` |
| `content` | 等同于 `layout paint style` |

实际使用最多的是 `contain: layout paint`（或 `content`），适合相对独立的 UI 组件（卡片、弹窗、侧边栏）。

## content-visibility

`content-visibility: auto` 是更激进的优化：**完全跳过屏幕外元素的渲染**（Layout + Paint 全跳过），等元素接近视口时才渲染。

```css
.article-section {
  content-visibility: auto;
  contain-intrinsic-size: 0 800px; /* 预估高度，防止滚动条跳动 */
}
```

对于长内容页面（博客文章、长列表、报告页面），效果非常显著：**渲染时间可以减少 50% 以上**。

### contain-intrinsic-size

`content-visibility: auto` 的副作用：未渲染的元素高度为 0，导致滚动条位置不正确。

`contain-intrinsic-size` 为未渲染的元素提供一个预估尺寸，使滚动条大致准确：

```css
.section {
  content-visibility: auto;
  contain-intrinsic-size: auto 500px; /* auto 表示渲染后记住实际高度 */
}
```

### 与虚拟滚动的对比

| | content-visibility | 虚拟滚动 |
| --- | --- | --- |
| **实现成本** | 纯 CSS，零代码 | 需要 JS 库（react-virtual 等） |
| **DOM 节点** | 全部存在，只是不渲染 | 只渲染可见节点 |
| **适用场景** | 静态长内容页面 | 超大数据列表（万条以上） |
| **搜索/选中** | 原生支持 Ctrl+F | 可能需要额外处理 |

两者互补：内容型页面用 `content-visibility`，数据型大列表用虚拟滚动。

## 参考

- [MDN - contain](https://developer.mozilla.org/zh-CN/docs/Web/CSS/contain)
- [MDN - content-visibility](https://developer.mozilla.org/zh-CN/docs/Web/CSS/content-visibility)
- [web.dev - content-visibility](https://web.dev/articles/content-visibility)
