---
title: 文本和字体
date: 2023-03-28
icon: font
category:
  - CSS
tag:
  - frontend
  - css
  - basic-knowledge
---

::: tip

仅介绍一些常用属性，详见 [CSS 参考](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference)。

:::

## 文本布局

文本布局可以作用于文本的间距以及其他布局功能的属性，比如，允许操纵行与字之间的空间，以及在内容框中，文本如何对齐。

### `text-align`

`text-align` 用来定义行内内容（例如文字）如何相对它的块父元素对齐，比如左对齐、居中、右对齐等等。

- `left`：左对齐
- `right`：右对齐；
- `center`：居中对齐
- `justify`：两端对齐。

:::warning

`text-align` 并不控制块元素自己的对齐，只控制它的行内内容的对齐。

常用于做行内元素的居中效果。

:::

::: normal-demo 左对齐

```html
<p>左对齐</p>
```

```css
p {
  text-align: left;
}
```

:::

::: normal-demo 居中对齐

```html
<p>居中对齐</p>
```

```css
p {
  text-align: center;
}
```

:::

::: normal-demo 右对齐

```html
<p>右对齐</p>
```

```css
p {
  text-align: right;
}
```

:::

::: normal-demo 两端对齐

```html
<p>文字向两侧对齐，对最后一行无效。</p>
<p>
  Integer elementum massa at nulla placerat varius. Suspendisse in libero risus,
  in interdum massa. Vestibulum ac leo vitae metus faucibus gravida ac in neque.
  Nullam est eros, suscipit sed dictum quis, accumsan a ligula.
</p>
```

```css
p {
  text-align: justify;
}
```

:::

### `line-height`

`line-height` 设置文本每行之间的高。

通常无单位是比较好的做法。行高由此值乘以 `font-size` 生成。

```css
selector {
  line-height: 1.5;
}
```

由于文字总是会在行框的中间，因此如果设置 `line-height` 与 `height` 值相等可以做到内联元素垂直居中，若在加上 `text-align`，则可以做到**内联元素**水平垂直居中。

::: normal-demo 内联元素水平垂直居中

```html
<p>常用来做水平垂直居中。</p>
```

```css
p {
  line-height: 50px;
  height: 50px;
  border: 1px solid black;
  text-align: center;
}
```

:::

## 字体样式

字体样式作用于字体的属性，会直接应用到文本中，比如使用哪种字体，字体的大小是怎样的，字体是粗体还是斜体，等等。

### `color`

`color` 属性用来设置选中元素的前景色，通常指文本颜色。

::: normal-demo color

```html
<p>改变字体颜色</p>
```

```css
p {
  color: red;
}
```

:::

### font-size

`font-size` 决定文字的大小。

::: normal-demo font-size

```html
<p>改变字体大小</p>
```

```css
p {
  font-size: 30px;
}
```

:::

### `font-family`

`font-family` 用于设置文字的字体名称，可以设置一个或多个字体，浏览器会选择列表中第一个该计算机有安装的字体。

标准的 Web fonts 包括一些基本字体，如 Arial，Georgia，Times New Roman 等。但是很多时候，为了提供更独特和富有吸引力的用户界面，会使用特别的字体，需要载入外部的 Web fonts。

使用 Web fonts 的步骤：

1. `@font-face` 加载一个自定义的字体;
2. `font-family` 使用字体。

```css
@font-face {
  font-family: 'MyFont';
  src: url('myfont.woff2') format('woff2'), url('myfont.woff') format('woff');
}

body {
  font-family: 'MyFont', Fallback, sans-serif;
}
```

::: tip

`src` 用于指定字体资源：

- `url` 指定资源的路径
- `format` 用于帮助浏览器快速识别字体的格式;

:::

字体可以设计成各式各样的形状，那么能不能把字体直接设计成图标的样子呢？

当然可以，这个就叫做字体图标。

字体图标的好处：

- 放大不会失真
- 可以任意切换颜色
- 用到很多个图标时，文件相对图片较小

字体图标的使用：

- 登录 [阿里 icons](https://www.iconfont.cn/)
- 下载代码，并且拷贝到项目中

::: normal-demo 字体图标

```html
<i class="iconfont">&#xe626;</i>
```

```css
@font-face {
  font-family: 'iconfont';
  src: url('//at.alicdn.com/t/c/font_3926422_ow6xq98wxi.woff2?t=1682664437328') format('woff2'),
       url('//at.alicdn.com/t/c/font_3926422_ow6xq98wxi.woff?t=1682664437328') format('woff'),
       url('//at.alicdn.com/t/c/font_3926422_ow6xq98wxi.ttf?t=1682664437328') format('truetype');
}

.iconfont{
  font-family:"iconfont" !important;
  font-size:16px;font-style:normal;
  -webkit-font-smoothing: antialiased;
  -webkit-text-stroke-width: 0.2px;
  -moz-osx-font-smoothing: grayscale;
}
```

:::

::: tip

其他更多使用方式：[iconfonts 代码应用](https://www.iconfont.cn/help/detail?spm=a313x.help_detail.i1.d8d11a391.7bb83a81XO2rxN&helptype=code)。

:::

### `font-weight`

`font-weight` 用于设置文字的粗细，常见的取值有 `100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900`，也可以用关键字，`normal` 等于 `400`，`bold` 等于 `700`。

::: normal-demo font-weight

```html
<p class="bold">粗</p>
<p class="normal">正常</p>
```

```css
.bold {
  font-weight: bold;
}
.normal {
  font-weight: normal;
}
```

:::

### `font`

`font` 是一个缩写属性，用来作为 [`font-sytle`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/font-style)、[`font-variant`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/font-variant)、`font-weight`、`font-size`、`line-height` 和 `font-family` 的简写。

::: tip

书写规则：`font-style font-variant font-weight font-size/line-height font-family`

- `font-sytle`、`font-variant` 和 `font-weight` 可以随意调换顺序，也可以省略；
- `/line-height` 可以省略，如果不省略，必须跟在 `font-size` 后面；
- `font-size` 和 `font-family` 不可以调换顺序，也不可省略。

:::

::: normal-demo font

```html
<p>font 是一个缩写属性</p>
```

```css
p {
  font: bold 20px/1.5 '楷体';
}
```

:::
