---
title: 盒模型
date: 2022-04-28
icon: box
category: 
  - CSS
tag:
  - frontend
  - css
  - basic-knowledge
---

## 盒模型

所有的 HTML 元素都可以看作一个盒子，他由外边距 `margin`、边框 `border`、内边距 `padding`和内容区 `content` 组成。

![盒模型](/assets/image/frontend/basic/css/003/box.png)

## 标准盒模型和怪异盒模型

在 [DOCTYPE](../html/003-doctype.md) 中提到了浏览器的渲染模式，现代的浏览器一般都有两种渲染模式：标准模式和怪异模式。

他们表现在盒模型中差异：

- 标准盒模型：`width` 和 `height` 的计算值都不包含 `border` 和 `padding`，而只会应用到这个元素的 `content`。

![标准盒模型](/assets/image/frontend/basic/css/003/normal-box.png =50%x50%)

- 怪异盒模型：`width` 和 `height` 属性包括 `content`、`padding` 和 `border`，不算 `margin`。

![怪异盒模型](/assets/image/frontend/basic/css/003/abnormal-box.png =50%x50%)

## box-sizing

在 CSS 中，可以设置 `box-sizing` 属性来设置盒子模型。语法如下：

```css
box-sizing: content-box|border-box|inherit;
```

- `content-box`：标准盒模型；
- `border-box`：怪异盒模型；
- `inherit`：规定应从父元素继承 `box-sizing` 属性的值。

一般希望将 `box-sizing` 设置为 `border-box`，能使我们更容易地设定一个元素的宽高：

```css
* {
  box-sizing: border-box;
}
```

## 块级盒子和内联盒子

CSS 中的盒子有三种表现形式 —— 块级盒子（block box）、内联盒子（inline box）和行内块盒子（inline-block box）。这两种盒子在文档流中会表现出不一样的行为。

可以通过对盒子 `display` 属性的设置，比如 `inline`、 `block` 或 `inline-block`，来控制盒子的外部显示类型。

### 块级盒子

一个被定义成块级的（block）盒子会表现出以下行为：

- 盒子会在内联的方向上扩展并占据父容器在该方向上的所有可用空间，在绝大数情况下意味着盒子会和父容器一样宽。
- 每个盒子都会换行。
- `width` 和 `height` 属性可以发挥作用。
- 内边距（`padding`）, 外边距（`margin`）和 边框（`border`）会将其他元素从当前盒子周围「推开」。

除非特殊指定，诸如标题 (`<h1>`等) 和段落 (`<p>`) 默认情况下都是块级的盒子。

::: normal-demo block

```html
<h3>块级盒子一</h3>
<p>块级盒子二</p>
```

```css
h3, p {
  border: 1px solid black;
}
```

:::

### 内联盒子

如果一个盒子对外显示为 `inline`，那么他的行为如下：

- 盒子不会产生换行。
- `width` 和 `height` 属性将不起作用。
- 垂直方向的内边距、外边距以及边框会被应用但是不会把其他处于 `inline` 状态的盒子「推开」。
- 水平方向的内边距、外边距以及边框会被应用且会把其他处于 `inline` 状态的盒子「推开」。

用做链接的 `<a>` 元素、`<span>`、`<em>` 以及 `<strong>` 都是默认处于 `inline` 状态的。

::: normal-demo inline

```html
<a>内联盒子一</a>
<em>内联盒子二</em>
```

```css
a, em {
  border: 1px solid black;
  width: 10px;
  height: 10px;
}
```

:::

### 行内块盒子

`display` 有一个特殊的值，它在内联和块之间提供了一个中间状态。这对于以下情况非常有用：您不希望一个项切换到新行，但希望它可以设定宽度和高度，并避免上面看到的重叠。

一个元素使用 `display: inline-block`，实现我们需要的块级的部分效果：

- 设置 `width` 和 `height` 属性会生效。
- `padding`, `margin`, 以及 `border` 会推开其他元素。

但是，它不会跳转到新行，如果显式添加 `width` 和 `height` 属性，它只会变得比其内容更大。

::: normal-demo inline-blocl

```html
<h3>行内块盒子一</h3>
<a>行内块盒子二</a>
```

```css
h3, a {
  border: 1px solid black;
  display: inline-block;
  width: 150px;
}
```

:::