---
title: 快速开始
date: 2023-03-25
icon: STARTUP
category: 
  - CSS
tag:
  - frontend
  - css
  - basic-knowledge
---

::: tip CSS

层叠样式表（**C**ascading **S**tyle **S**heet, CSS）是一种用于给网页添加样式的计算机语言，它并不是真正的编程语言，甚至不是标记语言，只是一种样式表语言。

:::

## 历史

早期的网页是通过 HTML 编写的，随着 Web 的逐渐发展，人们希望 HTML 页面可以更加丰富，因此为浏览器增加了很多具备特殊样式的元素，比如 `i`、`strong`、`del` 等。

后来不同的浏览器厂商实现各自的样式语言，但是没有统一的规划。CSS 的发展历史如下：

- 1994 年，哈肯·维姆·莱和伯特·波斯一起合作设计 CSS，于 1996 年发布 CSS1；
- 1997 年，W3C 成立 CSS 工作组，于 1998 年发布了 CSS2；
- 2006 ~ 2009 年，`div` + `css` 布局方式逐渐成为网页内容布局的主流方案（2007 年出现 CSS2.1）；
- CSS3 将所有的 CSS 分成了不同的模块，每一个模块都有于 CSS2 中额外增加的功能，并且支持向后兼容。

::: tip

CSS3标准已部分公布，但仍未全部制订完毕，还会有其它新内容继续加入。 [CSS3发展过程报告. W3C.](https://www.w3.org/TR/css3-roadmap/)

:::

## 基本语法

CSS 可以设置元素的样式，比如使用 `color: red` 将字体改为红色。

::: normal-demo 基本语法

```html
<p>我是一个段落</p>
```

```css
p {
  color: red;
}
```

:::

CSS 的基本语法规则为：选择器 + 属性声明：

```
selector {
  property: property value;
}
```

- [选择器（Selector）](002-selector.md)：通过选择器选择了一个或多个需要添加样式的元素（在这个例子中就是 `p` 元素）。
- 声明（Declaration）：一个单独的规则，如 `color: red`; 用来指定添加样式元素的属性。
- 属性（Properties）：改变 HTML 元素样式的途径，本例中 `color` 就是 `<p>` 元素的属性。
- 属性的值（Property value）：在属性的右边，`:` 后面即属性的值，它用来指定属性的值。

::: warning

注意其他重要的语法：

- 每个规则集（除了选择器的部分）都应该包含在成对的大括号里（`{}`）。
- 在每个声明里要用冒号（`:`）将属性与属性值分隔开。
- 在每个规则集里要用分号（`;`）将各个声明分隔开。

:::

## 引入 CSS

引入 CSS 可以分为三种方式：

- 内联样式
- 内部样式表
- 外部样式表

### 内联样式

内联样式的使用方式是使用 HTML 元素的 `style` 属性：

::: normal-demo 内联样式

```html
<p style="color: red">我是一个段落</p>
```

:::

### 内部样式表

将 CSS 放在 HTML 文件 `<head>` 元素里的 `<style>`元素之中。

::: normal-demo 内联样式

```html
<head>
  <style>
    p {
      color: red;
    }
  </style>
</head>
<p>我是一个段落</p>
```

:::

### 外部样式表

将 CSS 编写一个独立的文件中，并且 通过 `<link>` 元素引入进来：

```html
<head>
  <link rel="stylesheet" href="example.css">
</head>
<p>我是一个段落</p>
```

**example.css**

```css
p {
  color: red;
}
```

## @规则

`@rules` 是一种特殊的规则，为 CSS 提供一些关于如何表现的指导。有些 `@rules` 规则很简单，有规则名和值。

要将额外的样式表导入主 CSS 样式表，可以使用 `@import`：

```css
@import 'example.css'
```

最常见的 `@rules` 之一是 `@media`，它允许使用媒体查询来应用 CSS，仅当某些条件成立 (例如，当屏幕分辨率高于某一数量，或屏幕宽度大于某一宽度时)。

在下面的 CSS 中，我们将给 `<body>` 元素一个粉红色的背景色。但是，我们随后使用 `@media` 创建样式表的一个部分，该部分仅适用于视口小于 `540px` 的浏览器。如果浏览器的宽度小于 `540px`，则背景色将为蓝色。

::: normal-demo @media

```html
<p>改变浏览器宽度查看效果</p>  
```

```css
p {
  background-color: pink;
}

@media (max-width: 760px) {
  p {
    background-color: blue;
    color: white;
  }
}
```

:::

## 注释

CSS 注释以 `/*` 开始，以 `*/` 结束。

```css
/* 这是个注释 */
p {
  /* 这是另一个注释 */
  color: red;
}

```
