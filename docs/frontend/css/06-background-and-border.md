---
title: 背景和边框
date: 2023-04-26
icon: border-outer
category:
  - CSS
tag:
  - frontend
  - css
  - basic-knowledge
---

在网页开发中，背景和边框是常用的 CSS 属性，可以帮助我们美化网页的外观和布局。

## 背景属性

CSS 中的 `background` 属性可以为元素设置背景颜色、图片、渐变色、重复模式等。下面是一些常见的 CSS 背景属性。

### `background-color`

`background-color` 属性用于设置元素的背景颜色。它可以接受各种颜色值，例如颜色名称、十六进制颜色码、RGB 颜色等。例如，我们可以使用以下代码为一个段落元素设置背景颜色：

```css
p {
  background-color: #f0f0f0;
}
```

### `background-image`

`background-image` 属性用于设置元素的背景图片。它可以接受一个图片的 URL 地址作为值。例如，我们可以使用以下代码为一个 `div` 元素设置背景图片：

```css
div {
  background-image: url('background.jpg');
}
```

### `background-repeat`

`background-repeat` 属性用于设置背景图片的重复方式。

默认情况下，背景图片会在水平和垂直方向上重复。

但是我们可以使用 `background-repeat` 属性来指定只在水平方向上或垂直方向上重复，或者不重复。有以下取值：

- `no-repeat` — 不重复。
- `repeat-x` — 水平重复。
- `repeat-y` — 垂直重复。
- `repeat` — 在两个方向重复。

例如，以下代码可以使背景图片只在水平方向上重复：

```css
div {
  background-image: url('background.jpg');
  background-repeat: repeat-x;
}
```

### `background-size`

`background-size` 属性用于设置背景图片的大小。它可以接受像素值和百分比值调整图片的大小。

```css
div {
  background-image: url('background.jpg');
  background-size: 10px 20px;
}
```

也可以通过 `cover` 和 `contain` 关键字：

- `cover` — 浏览器将使图像足够大，使它完全覆盖了盒子区，同时仍然保持其高宽比。在这种情况下，有些图像可能会跳出盒子外。
- `contain` — 浏览器将使图像的大小适合盒子内。在这种情况下，如果图像的长宽比与盒子的长宽比不同，则可能在图像的任何一边或顶部和底部出现间隙。

例如，以下代码可以将背景图片缩放到与元素相同的大小：

```css
div {
  background-image: url('background.jpg');
  background-size: cover;
}
```

### `background-position`

`background-position` 属性允许您选择背景图像显示在其应用到的盒子中的位置。它使用的坐标系中，框的左上角是 `(0,0)`，框沿着水平 (`x`) 和垂直 (`y`) 轴定位。

::: tip

默认的背景位置值是 `(0,0)`。

:::

最常见的背景位置值有两个单独的值——一个水平值后面跟着一个垂直值。

你可以使用像 `top` 和 `right` 这样的关键字:

```css
.box {
  background-image: url(star.png);
  background-repeat: no-repeat;
  background-position: top center;
}
```

或者使用长度值和百分比：

```css
.box {
  background-image: url(star.png);
  background-repeat: no-repeat;
  background-position: 20px 10%;
}
```

你也可以混合使用关键字，长度值以及百分比，例如：

```css
.box {
  background-image: url(star.png);
  background-repeat: no-repeat;
  background-position: top 20px;
}
```

最后，您还可以使用 4-value 语法来指示到盒子的某些边的距离——在本例中，长度单位是与其前面的值的偏移量。所以在下面的 CSS 中，我们将背景从顶部调整 `20px`，从右侧调整 `10px`:

```css
.box {
  background-image: url(star.png);
  background-repeat: no-repeat;
  background-position: top 20px right 10px;
}
```

### `background`

简写属性，通常使用语法如下：

```
background =
  <'background-color'>            ||
  <bg-image>                      ||
  <bg-position> [ / <bg-size> ]?  ||
  <repeat-style>                  ||
```

详见 [MDN background](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background)。

## 边框属性

CSS 中的边框属性可以为元素设置边框样式、边框宽度、边框颜色等。

下面是一些常见的 CSS 边框属性。这些边框属性是设置元素四个边框颜色的快捷属性。

### `border-style`

`border-style` 属性用于设置元素的边框样式。它可以接受 `solid`、`dashed`、`dotted`、`double`、`groove`、`ridge`、`inset`、`outset` 和 `none` 等值。例如，以下代码可以为一个 `div` 元素设置虚线边框：

```css
div {
  border-style: dashed;
}
```

### `border-width`

`border-width` 属性用于设置元素的边框宽度。它可以接受像素值、百分比值等单位。例如，以下代码可以为一个 `div` 元素设置边框宽度为 2 个像素：

```css
div {
  border-width: 2px;
}
```

### `border-color`

`border-color` 属性用于设置元素四个边框颜色。

```css
div {
  border-color: red;
}
```

### `border`

上述三个属性的简写属性，基本语法如下：

```
border =
  <line-width>  ||
  <line-style>  ||
  <color>
```

::: normal-demo border

```html
<div>border简写属性</div>
```

```css
div {
  border: 1px solid black;
}
```

:::

### 使用边框画三角形

可以利用 `border` 属性特性画三角形。

每个 HTML 元素的盒模型由内容区域、内边距区域、边框区域和外边距区域构成。边框区域的宽度、样式和颜色由 `border` 属性控制。

当你设置一个元素的一个或几个边框，这个元素会产生视觉效果，就像它有一只或几只“箭头”指向特定方向。这是因为边框实际上是从中心点斜向外延伸的。比如，如果你设置了元素的顶边框，这个元素就会看起来有一只“箭头”指向上方。

所以，你可以通过使用透明边框和可见边框的组合，让元素看起来像一个三角形。

::: normal-demo 原理

```html
<div class="flex">
  <div class="box1"></div>
  <div class="box2"></div>
</div>
```

```css
.flex {
  display: flex;
  gap: 10px;
}

.box1 {
  width: 100px;
  height: 100px;
  background-color: #f00;

  box-sizing: border-box;

  border: 30px solid;
  border-color: orange blue green purple;
}

.box2 {
  width: 100px;
  height: 100px;
  background-color: #f00;

  box-sizing: border-box;

  border: 50px solid;
  border-color: orange blue green purple;
}
```

:::

::: normal-demo 三角形

```html
<div class="flex">
  <div class="up"></div>
  <div class="down"></div>
  <div class="left"></div>
  <div class="right"></div>
  <div class="topleft"></div>
  <div class="topright"></div>
  <div class="bottomleft"></div>
  <div class="bottomright"></div>
</div>
```

```css
.flex {
  display: flex;
  gap: 10px;
}

.up {
  width: 0;
  height: 0;
  border-left: 30px solid transparent;
  border-right: 30px solid transparent;
  border-bottom: 60px solid red;
}

.down {
  width: 0;
  height: 0;
  border-left: 30px solid transparent;
  border-right: 30px solid transparent;
  border-top: 60px solid red;
}

.left {
  width: 0;
  height: 0;
  border-top: 30px solid transparent;
  border-right: 60px solid red;
  border-bottom: 30px solid transparent;
}

.right {
  width: 0;
  height: 0;
  border-top: 30px solid transparent;
  border-left: 60px solid red;
  border-bottom: 30px solid transparent;
}

.topleft {
  width: 0;
  height: 0;
  border-top: 60px solid red;
  border-right: 60px solid transparent;
}

.topright {
  width: 0;
  height: 0;
  border-top: 60px solid red;
  border-left: 60px solid transparent;
}

.bottomleft {
  width: 0;
  height: 0;
  border-bottom: 60px solid red;
  border-right: 60px solid transparent;
}

.bottomright {
  width: 0;
  height: 0;
  border-bottom: 60px solid red;
  border-left: 60px solid transparent;
}
```

:::
