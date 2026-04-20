---
title: 怎样实现响应式网页布局
date: 2024-03-04
icon: tool
category:
  - CSS
tag:
  - 布局
---

## 设置响应式断点

[`tailwind`](https://tailwindcss.com/docs/responsive-design) 典型的断点如下：

```css
@media (min-width: 640px) {
  /* ... */
}
@media (min-width: 768px) {
  /* ... */
}
@media (min-width: 1024px) {
  /* ... */
}
@media (min-width: 1280px) {
  /* ... */
}
@media (min-width: 1536px) {
  /* ... */
}
```

[Bootstrap]() 断点如下：

```css
@media (min-width: 576px) {
  /* ... */
}
@media (min-width: 768px) {
  /* ... */
}
@media (min-width: 992px) {
  /* ... */
}
@media (min-width: 1200px) {
  /* ... */
}
@media (min-width: 1400px) {
  /* ... */
}
```

## 用百分比确定布局元素的大小或创建 CSS 网格布局

布局容器的数量取决于设计，但大多数网站都将重点放在以下元素上：

- Wrapper or Container
- Header
- Content
- Sidebar
- Footer

![Common layout](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20240304183547.png)

根据 [移动优先原则](./015-responsive-design.md#始终坚持移动端优先的设计理念)，你可以像这样设计主要布局元素的样式（针对手机的基本样式不使用媒体查询）：

```css
#wrapper {
  width: 95%;
  margin: 0 auto;
}

#header {
  width: 100%;
}

#content {
  width: 100%;
}

#sidebar {
  width: 100%;
}

#footer {
  width: 100%;
}

/* Small devices (landscape phones, 576px and up) */

@media (min-width: 576px) {
  /* ... */
}

/* Medium devices (tablets, 768px and up) */

@media (min-width: 768px) {
  #wrapper {
    width: 90%;
    margin: 0 auto;
  }

  #content {
    width: 70%;
    float: left;
  }

  #sidebar {
    width: 30%;
    float: right;
  }
}

/* Large devices (desktops, 992px and up) */

@media (min-width: 992px) {
  /* ... */
}

/* Extra large devices (large desktops, 1200px and up) */

@media (min-width: 1200px) {
  #wrapper {
    width: 90%;
    margin: 0 auto;
  }
}
```

在基于百分比的方法中，[`float`](./008-float.md) 属性控制元素显示在屏幕的左侧或右侧。

如果要完成响应式设计，还需要熟悉 CSS 的 [`flex`](./009-flex.md) 布局及其它属性，如 [`box-sizing`](./003-box-model.md#box-sizing)。

## 响应式图片

见 [响应式图片](./015-responsive-design.md#响应式图片)。

## 响应式文字

响应式网页设计的重点在于布局块、元素和媒体的响应性。文字往往是事后才考虑的问题。

但要实现真正的响应式设计，还应该根据屏幕尺寸适当调整字体大小。

最简单的方法是为字体大小设置一个静态值，如 `22px`，并在每个媒体查询中进行调整。

![Font size vs view size scatter points](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20240304184534.png)

::: tip

一般设置 `html` 字体大小，并使用 `rem` 单位，或使用插件转换为「视口」单位。

相关阅读：

- [样式单位](./010-unit.md)
- [postcss-px-to-viewport](../../practice/005-postcss-px-to-viewport.md)

:::
