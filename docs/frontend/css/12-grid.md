---
title: Grid 布局
date: 2023-12-23
icon: web-grid
category:
  - CSS
tag:
  - 布局
  - grid
  - frontend
  - basic-knowledge
---

## 什么是 grid 布局

flex 布局是 **一维布局** 模型，当面对一些场景时无法满足要求，比如下面这种情况，会出现最后一行无法左侧对齐的场景。

::: normal-demo flex

```html
<div class="flex">
  <p>p1</p>
  <p>p2</p>
  <p>p3</p>
  <p>p4</p>
  <p>p5</p>
  <p>p6</p>
  <p>p7</p>
  <p>p8</p>
</div>
```

```css
.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;

  width: 400px;
  height: 100px;
  border: 1px solid #eee;
  padding: 10px;
}

p {
  box-sizing: border-box;
  width: 100px;
  border: 1px solid #d9d9d9;
  margin: 0 10px;
}
```

:::

此时就需要使用 grid 布局，先看具体效果。

::: normal-demo grid

```html
<div class="grid">
  <p>p1</p>
  <p>p2</p>
  <p>p3</p>
  <p>p4</p>
  <p>p5</p>
  <p>p6</p>
  <p>p7</p>
  <p>p8</p>
</div>
```

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  width: 400px;
  height: 100px;
  border: 1px solid #eee;
  padding: 10px;
}

p {
  box-sizing: border-box;
  width: 100px;
  border: 1px solid #d9d9d9;
  margin: 0 10px;
}
```

:::

## 基本概念

### 容器和项目

和 flex 一样，采用网格布局的区域，被称为容器，其中的子元素称为项目。

### 行、列、间距

一个网格通常具有许多的列（column）与行（row），以及行与行、列与列之间的间隙，这个间隙一般被称为间距（gutter）。

![grid](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20231224110006.png)

### 单元格

行和列的交叉区域就是单元格，正常情况下，n 行和 m 列会产生 n x m 个单元格。比如，3 行 3 列会产生 9 个单元格。

### 网格线

划分网格的线，称为"网格线"（grid line）。水平网格线划分出行，垂直网格线划分出列。

正常情况下，n 行有 n + 1 根水平网格线，m 列有 m + 1 根垂直网格线，比如三行就有四根水平网格线。

## 容器属性

### `display`

`display: grid` 指定一个容器采用网格布局。

::: normal-demo 容器默认是块级元素

```html
<span>foo</span>
<div id="container">
  <div class="item item-1">1</div>
  <div class="item item-2">2</div>
  <div class="item item-3">3</div>
  <div class="item item-4">4</div>
  <div class="item item-5">5</div>
  <div class="item item-6">6</div>
  <div class="item item-7">7</div>
  <div class="item item-8">8</div>
  <div class="item item-9">9</div>
</div>
<span>bar</span>
```

```css
span {
  font-size: 2em;
}

#container {
  display: grid;
  grid-template-columns: 50px 50px 50px;
  grid-template-rows: 50px 50px 50px;
}

.item {
  font-size: 2em;
  text-align: center;
  border: 1px solid #e5e4e9;
}

.item-1 {
  background-color: #ef342a;
}

.item-2 {
  background-color: #f68f26;
}

.item-3 {
  background-color: #4ba946;
}

.item-4 {
  background-color: #0376c2;
}

.item-5 {
  background-color: #c077af;
}

.item-6 {
  background-color: #f8d29d;
}

.item-7 {
  background-color: #b5a87f;
}

.item-8 {
  background-color: #d0e4a9;
}

.item-9 {
  background-color: #4dc7ec;
}
```

:::

默认情况下，容器元素都是块级元素，但是也可以设置为行内元素 `display: inline-grid`。

::: normal-demo 容器改为行内元素

```html
<span>foo</span>
<div id="container">
  <div class="item item-1">1</div>
  <div class="item item-2">2</div>
  <div class="item item-3">3</div>
  <div class="item item-4">4</div>
  <div class="item item-5">5</div>
  <div class="item item-6">6</div>
  <div class="item item-7">7</div>
  <div class="item item-8">8</div>
  <div class="item item-9">9</div>
</div>
<span>bar</span>
```

```css
span {
  font-size: 2em;
}

#container {
  display: inline-grid;
  grid-template-columns: 50px 50px 50px;
  grid-template-rows: 50px 50px 50px;
}

.item {
  font-size: 2em;
  text-align: center;
  border: 1px solid #e5e4e9;
}

.item-1 {
  background-color: #ef342a;
}

.item-2 {
  background-color: #f68f26;
}

.item-3 {
  background-color: #4ba946;
}

.item-4 {
  background-color: #0376c2;
}

.item-5 {
  background-color: #c077af;
}

.item-6 {
  background-color: #f8d29d;
}

.item-7 {
  background-color: #b5a87f;
}

.item-8 {
  background-color: #d0e4a9;
}

.item-9 {
  background-color: #4dc7ec;
}
```

:::

::: warning

注意，设为网格布局以后，容器子元素（项目）的 `float`、`display: inline-block`、`display: table-cell`、`vertical-align` 和 `column-\*` 等设置都将失效。

:::

### `grid-template-columns` 和 `grid-template-rows`

容器指定了网格布局后，需要设置行和列信息。`grid-template-columns` 属性定义每一列的列宽，`grid-template-rows` 属性定义每一行的行高。

```css
#container {
  display: grid;
  grid-template-columns: 50px 50px 50px;
  grid-template-rows: 50px 50px 50px;
}
```

上述代码指定了一个 3 x 3 的网格，行高列高都是 50px。

#### `repeat()`

一般情况下，可以使用 `repeat()` 函数避免重复书写同样的值。

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 50px);
  grid-template-rows: repeat(3, 50px);
}
```

`repeat()` 接受两个参数，第一个参数是重复的次数（上例是 3），第二个参数是所要重复的值。

`repeat()` 重复某种模式也是可以的，下面代码表示定义了 6 列，第一列和第四列的宽度为 `100px`，第二列和第五列为 `20px`，第三列和第六列为 `80px`。

```css
grid-template-columns: repeat(2, 100px 20px 80px);
```

::: normal-demo `repeat()` 重复某种模式

```html
<div id="container">
  <div class="item item-1">1</div>
  <div class="item item-2">2</div>
  <div class="item item-3">3</div>
  <div class="item item-4">4</div>
  <div class="item item-5">5</div>
  <div class="item item-6">6</div>
  <div class="item item-7">7</div>
  <div class="item item-8">8</div>
  <div class="item item-9">9</div>
</div>
```

```css
#container {
  display: grid;
  grid-template-columns: repeat(2, 100px 20px 80px);
  grid-template-rows: repeat(2, 100px);
}

.item {
  font-size: 4em;
  text-align: center;
  border: 1px solid #e5e4e9;
}

.item-1 {
  background-color: #ef342a;
}

.item-2 {
  background-color: #f68f26;
}

.item-3 {
  background-color: #4ba946;
}

.item-4 {
  background-color: #0376c2;
}

.item-5 {
  background-color: #c077af;
}

.item-6 {
  background-color: #f8d29d;
}

.item-7 {
  background-color: #b5a87f;
}

.item-8 {
  background-color: #d0e4a9;
}

.item-9 {
  background-color: #4dc7ec;
}
```

:::

#### `auto-fill`

有时，单元格的大小是固定的，但是容器的大小不确定。如果希望每一行（或每一列）容纳尽可能多的单元格，这时可以使用 `auto-fill` 关键字表示自动填充。

::: info 注意

非常有用，开发中经常出现这种情况。

:::

::: normal-demo `auto-fill`

```html
<div id="container">
  <div class="item item-1">1</div>
  <div class="item item-2">2</div>
  <div class="item item-3">3</div>
  <div class="item item-4">4</div>
  <div class="item item-5">5</div>
  <div class="item item-6">6</div>
  <div class="item item-7">7</div>
  <div class="item item-8">8</div>
  <div class="item item-9">9</div>
</div>
```

```css
#container {
  display: grid;
  grid-template-columns: repeat(auto-fill, 100px);
}

.item {
  font-size: 4em;
  text-align: center;
  border: 1px solid #e5e4e9;
}

.item-1 {
  background-color: #ef342a;
}

.item-2 {
  background-color: #f68f26;
}

.item-3 {
  background-color: #4ba946;
}

.item-4 {
  background-color: #0376c2;
}

.item-5 {
  background-color: #c077af;
}

.item-6 {
  background-color: #f8d29d;
}

.item-7 {
  background-color: #b5a87f;
}

.item-8 {
  background-color: #d0e4a9;
}

.item-9 {
  background-color: #4dc7ec;
}
```

:::

除了 `auto-fill`，还有一个关键字 `auto-fit`，两者的行为基本是相同的。只有当容器足够宽，可以在一行容纳所有单元格，并且单元格宽度不固定的时候，才会有 [行为差异](https://css-tricks.com/auto-sizing-columns-css-grid-auto-fill-vs-auto-fit/)：`auto-fill` 会用空格子填满剩余宽度，`auto-fit` 则会尽量扩大单元格的宽度。

#### `fr`

为了方便表示比例关系，网格布局提供了 `fr` 关键字（fraction 的缩写，意为"片段"）。如果两列的宽度分别为 `1fr` 和 `2fr`，就表示后者是前者的两倍。

::: normal-demo fr

```html
<div class="container">
  <div class="item item-1">1</div>
  <div class="item item-2">2</div>
  <div class="item item-3">3</div>
  <div class="item item-4">4</div>
  <div class="item item-5">5</div>
  <div class="item item-6">6</div>
  <div class="item item-7">7</div>
  <div class="item item-8">8</div>
  <div class="item item-9">9</div>
</div>
```

```css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.item {
  font-size: 4em;
  text-align: center;
  border: 1px solid #e5e4e9;
}

.item-1 {
  background-color: #ef342a;
}

.item-2 {
  background-color: #f68f26;
}

.item-3 {
  background-color: #4ba946;
}

.item-4 {
  background-color: #0376c2;
}

.item-5 {
  background-color: #c077af;
}

.item-6 {
  background-color: #f8d29d;
}

.item-7 {
  background-color: #b5a87f;
}

.item-8 {
  background-color: #d0e4a9;
}

.item-9 {
  background-color: #4dc7ec;
}
```

:::

`fr` 可以与绝对长度的单位结合使用，这时会非常方便，`grid-template-columns: 150px 1fr 2fr;` 表示第一列的宽度为 150 像素，第二列的宽度是第三列的一半。

::: normal-demo fr 与绝对长度单位结合

```html
<div class="container">
  <div class="item item-1">1</div>
  <div class="item item-2">2</div>
  <div class="item item-3">3</div>
  <div class="item item-4">4</div>
  <div class="item item-5">5</div>
  <div class="item item-6">6</div>
  <div class="item item-7">7</div>
  <div class="item item-8">8</div>
  <div class="item item-9">9</div>
</div>
```

```css
.container {
  display: grid;
  grid-template-columns: 150px 1fr 2fr;
}

.item {
  font-size: 4em;
  text-align: center;
  border: 1px solid #e5e4e9;
}

.item-1 {
  background-color: #ef342a;
}

.item-2 {
  background-color: #f68f26;
}

.item-3 {
  background-color: #4ba946;
}

.item-4 {
  background-color: #0376c2;
}

.item-5 {
  background-color: #c077af;
}

.item-6 {
  background-color: #f8d29d;
}

.item-7 {
  background-color: #b5a87f;
}

.item-8 {
  background-color: #d0e4a9;
}

.item-9 {
  background-color: #4dc7ec;
}
```

:::

#### `minmax()`

`minmax()` 函数产生一个长度范围，表示长度就在这个范围之中。它接受两个参数，分别为最小值和最大值。

```css
grid-template-columns: 1fr 1fr minmax(100px, 1fr);
```

上面代码中，`minmax(100px, 1fr)` 表示列宽不小于 `100px`，不大于 `1fr`。

#### 布局实例

`grid-template-columns` 属性对于网页布局非常有用。两栏式布局只需要一行代码。

```css
.wrapper {
  display: grid;
  grid-template-columns: 70% 30%;
}
```

上面代码将左边栏设为 70%，右边栏设为 30%。

传统的十二网格布局，写起来也很容易。

```css
grid-template-columns: repeat(12, 1fr);
```

### `grid-row-gap` `grid-column-gap` `grid-gap`

控制了行和列，接下来还有行列之间的间距需要控制。

`grid-row-gap` 属性设置行与行的间隔（行间距），`grid-column-gap` 属性设置列与列的间隔（列间距）。

```css
.container {
  grid-row-gap: 20px;
  grid-column-gap: 20px;
}
```

`grid-gap` 属性是 `grid-column-gap` 和 `grid-row-gap` 的合并简写形式，语法如下。

```css
grid-gap: <grid-row-gap> <grid-column-gap>;
```

因此，上面一段 CSS 代码等同于下面的代码。

```css
.container {
  grid-gap: 20px 20px;
}
```

如果 `grid-gap` 省略了第二个值，浏览器认为第二个值等于第一个值。

::: info 注意

根据最新标准，上面三个属性名的 `grid-` 前缀已经删除，`grid-column-gap` 和 `grid-row-gap` 写成 `column-gap` 和 `row-gap`，`grid-gap` 写成 `gap`。

间隙距离可以用任何长度单位包括百分比来表示，但不能使用 `fr` 单位。

:::

### `grid-template-areas`

定义好网格后（行、列、间距），需要设定网格中放置元素的规则。

::: info 注意

可以使用 [网格线](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/CSS_layout/Grids#%E5%9F%BA%E4%BA%8E%E7%BA%BF%E7%9A%84%E5%85%83%E7%B4%A0%E6%94%BE%E7%BD%AE) 放置元素内容，但是该方式不太直观，因此推荐使用网格区域放置元素。

:::

```css
.container {
  display: grid;
  grid-template-columns: 100px 100px 100px;
  grid-template-rows: 100px 100px 100px;
  grid-template-areas:
    'a b c'
    'd e f'
    'g h i';
}
```

上面代码先划分出 9 个单元格，然后将其定名为 `a` 到 `i` 的九个区域，分别对应这九个单元格。

如果某些区域不需要利用，则使用"点" `.` 表示。

```css
grid-template-areas:
  'a . c'
  'd . f'
  'g . i';
```

上面代码中，中间一列为点，表示没有用到该单元格，或者该单元格不属于任何区域。

下面看一个实例，太强大了有没有。

::: normal-demo 基于网格区域放置元素 - 1

```html
<div class="container">
  <header>This is my lovely blog</header>
  <article>
    <h1>My article</h1>
    <p>
      Duis felis orci, pulvinar id metus ut, rutrum luctus orci. Cras porttitor
      imperdiet nunc, at ultricies tellus laoreet sit amet. Sed auctor cursus
      massa at porta. Integer ligula ipsum, tristique sit amet orci vel, viverra
      egestas ligula. Curabitur vehicula tellus neque, ac ornare ex malesuada
      et. In vitae convallis lacus. Aliquam erat volutpat. Suspendisse ac
      imperdiet turpis. Aenean finibus sollicitudin eros pharetra congue. Duis
      ornare egestas augue ut luctus. Proin blandit quam nec lacus varius
      commodo et a urna. Ut id ornare felis, eget fermentum sapien.
    </p>

    <p>
      Nam vulputate diam nec tempor bibendum. Donec luctus augue eget malesuada
      ultrices. Phasellus turpis est, posuere sit amet dapibus ut, facilisis sed
      est. Nam id risus quis ante semper consectetur eget aliquam lorem. Vivamus
      tristique elit dolor, sed pretium metus suscipit vel. Mauris ultricies
      lectus sed lobortis finibus. Vivamus eu urna eget velit cursus viverra
      quis vestibulum sem. Aliquam tincidunt eget purus in interdum. Cum sociis
      natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
    </p>
  </article>
  <aside>
    <h2>Other things</h2>
    <p>
      Nam vulputate diam nec tempor bibendum. Donec luctus augue eget malesuada
      ultrices. Phasellus turpis est, posuere sit amet dapibus ut, facilisis sed
      est.
    </p>
  </aside>
  <footer>Contact me@mysite.com</footer>
</div>
```

```css
.container {
  display: grid;
  grid-template-columns: 1fr 3fr;
  /* 定义网格区域 */
  grid-template-areas:
    'header header'
    'sidebar content'
    'footer footer';
  gap: 20px;
}

header,
footer {
  border-radius: 5px;
  padding: 10px;
  background-color: rgb(207, 232, 220);
  border: 2px solid rgb(79, 185, 227);
}

aside {
  border-right: 1px solid #999;
}

/* 基于网格区域放置元素 */
header {
  grid-area: header;
}

article {
  grid-area: content;
}

aside {
  grid-area: sidebar;
}

footer {
  grid-area: footer;
}
/* 基于网格区域放置元素 */
```

:::

再来看一个更复杂的例子。

::: normal-demo 基于网格区域放置元素 - 2

```html
<div class="grid">
  <div class="item1">One</div>
  <div class="item2">Two</div>
</div>
```

```css
.grid > * {
  border-radius: 0.5em;
  color: #fff;
  padding: 0.5em;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 100px 100px 100px;
  grid-template-areas:
    'a . . .'
    '. b c .'
    '. . . d';
  gap: 10px;
}

.item1 {
  grid-area: a / a / c / c;
  background-color: rgb(74 102 112 / 70%);
  border: 5px solid rgb(74 102 112 / 100%);
}

.item2 {
  grid-area: b / b / d / d;
  background-color: rgb(214 162 173 / 70%);
  border: 5px solid rgb(214 162 173 / 100%);
}
```

:::

### `justify-items` `align-items` `place-items`

`justify-items` 设置单元格内容水平位置，`align-items` 设置单元格垂直方向位置。

```css
.container {
  justify-items: start | end | center | stretch;
  align-items: start | end | center | stretch;
}
```

这两个属性的写法完全相同，都可以取下面这些值。

- `start`：对齐单元格的起始边缘。
- `end`：对齐单元格的结束边缘。
- `center`：单元格内部居中。
- `stretch`：拉伸，占满单元格的整个宽度（默认值）。

::: normal-demo 设置元素在单元格中的位置

```html
<div id="container">
  <div class="item item-1">1</div>
  <div class="item item-2">2</div>
  <div class="item item-3">3</div>
  <div class="item item-4">4</div>
  <div class="item item-5">5</div>
  <div class="item item-6">6</div>
  <div class="item item-7">7</div>
  <div class="item item-8">8</div>
  <div class="item item-9">9</div>
</div>
```

```css
#container {
  display: grid;
  grid-template-columns: 100px 100px 100px;
  grid-template-rows: 100px 100px 100px;
  justify-items: center;
  align-items: center;
}

.item {
  /* width: 50px;
  height: 50px; */
  font-size: 2em;
  text-align: center;
  border: 1px solid black;
}

.item-1 {
  background-color: #ef342a;
}

.item-2 {
  background-color: #f68f26;
}

.item-3 {
  background-color: #4ba946;
}

.item-4 {
  background-color: #0376c2;
}

.item-5 {
  background-color: #c077af;
}

.item-6 {
  background-color: #f8d29d;
}

.item-7 {
  background-color: #b5a87f;
}

.item-8 {
  background-color: #d0e4a9;
}

.item-9 {
  background-color: #4dc7ec;
}
```

:::

可以使用检查器查看排列状态。

![grid inspection](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20231224134438.png)

`place-items` 属性是 `align-items` 属性和 `justify-items` 属性的合并简写形式。

```css
place-items: <align-items> <justify-items>;
```

下面是一个例子。

```css
place-items: start end;
```

如果省略第二个值，则浏览器认为与第一个值相等。

## 项目属性

### `grid-column-start` `grid-column-end` `grid-row-start` `grid-row-end`

项目的位置是可以指定的，具体方法就是指定项目的四个边框，分别定位在哪根网格线。

- `grid-column-start` 属性：左边框所在的垂直网格线
- `grid-column-end` 属性：右边框所在的垂直网格线
- `grid-row-start` 属性：上边框所在的水平网格线
- `grid-row-end` 属性：下边框所在的水平网格线

`grid-column` 属性是 `grid-column-start` 和 `grid-column-end` 的合并简写形式，`grid-row` 属性是 `grid-row-start` 属性和 `grid-row-end` 的合并简写形式。

```css
.item {
  grid-column: <start-line> / <end-line>;
  grid-row: <start-line> / <end-line>;
}
```

::: normal-demo 基于网格线指定项目位置

```html
<div class="grid">
  <div class="item1">One</div>
  <div class="item2">Two</div>
</div>
```

```css
.grid > * {
  border-radius: 0.5em;
  color: #fff;
  padding: 0.5em;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 100px 100px 100px;
  gap: 10px;
}

.item1 {
  grid-column: 1 / 4;
  grid-row: 1 / 3;
  background-color: rgb(74 102 112 / 70%);
  border: 5px solid rgb(74 102 112 / 100%);
}

.item2 {
  grid-column: 2 / 5;
  grid-row: 2 / 4;
  background-color: rgb(214 162 173 / 70%);
  border: 5px solid rgb(214 162 173 / 100%);
}
```

:::

::: tip

项目重叠可以使用 `z-index` 调整顺序。

:::

### `grid-area`

`grid-area` 属性指定项目放在哪一个区域。如上面的 [基于网格区域放置元素 - 2](#grid-template-areas)。

`grid-area` 属性还可用作 `grid-row-start`、`grid-column-start`、`grid-row-end`、`grid-column-end` 的合并简写形式，直接指定项目的位置。

```css
.item {
  grid-area: <row-start> / <column-start> / <row-end> / <column-end>;
}
```

下面是一个例子。

::: normal-demo 基于网格线指定项目位置

```html
<div class="grid">
  <div class="item1">One</div>
  <div class="item2">Two</div>
</div>
```

```css
.grid > * {
  border-radius: 0.5em;
  color: #fff;
  padding: 0.5em;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 100px 100px 100px;
  gap: 10px;
}

.item1 {
  grid-area: 1 / 1 / 3 / 4;
  background-color: rgb(74 102 112 / 70%);
  border: 5px solid rgb(74 102 112 / 100%);
}

.item2 {
  grid-area: 2 / 2 / 4 / 5;
  background-color: rgb(214 162 173 / 70%);
  border: 5px solid rgb(214 162 173 / 100%);
}
```

:::

### `justify-self` `align-self` `place-self`

`justify-self` 属性设置单元格内容的水平位置（左中右），跟`justify-items` `属性的用法完全一致，但只作用于单个项目。

`align-self` 属性设置单元格内容的垂直位置（上中下），跟 `align-items` 属性的用法完全一致，也是只作用于单个项目。

```css
.item {
  justify-self: start | end | center | stretch;
  align-self: start | end | center | stretch;
}
```

这两个属性都可以取下面四个值。

- `start`：对齐单元格的起始边缘。
- `end`：对齐单元格的结束边缘。
- `center`：单元格内部居中。
- `stretch`：拉伸，占满单元格的整个宽度（默认值）。

::: normal-demo 设置第五个元素在单元格中的位置为 start

```html
<div id="container">
  <div class="item item-1">1</div>
  <div class="item item-2">2</div>
  <div class="item item-3">3</div>
  <div class="item item-4">4</div>
  <div class="item item-5">5</div>
  <div class="item item-6">6</div>
  <div class="item item-7">7</div>
  <div class="item item-8">8</div>
  <div class="item item-9">9</div>
</div>
```

```css
#container {
  display: grid;
  grid-template-columns: 100px 100px 100px;
  grid-template-rows: 100px 100px 100px;
  justify-items: center;
  align-items: center;
}

.item {
  width: 50px;
  height: 50px;
  font-size: 2em;
  text-align: center;
  border: 1px solid black;
}

.item-1 {
  background-color: #ef342a;
}

.item-2 {
  background-color: #f68f26;
}

.item-3 {
  background-color: #4ba946;
}

.item-4 {
  background-color: #0376c2;
}

.item-5 {
  background-color: #c077af;
  justify-self: start;
  align-self: start;
}

.item-6 {
  background-color: #f8d29d;
}

.item-7 {
  background-color: #b5a87f;
}

.item-8 {
  background-color: #d0e4a9;
}

.item-9 {
  background-color: #4dc7ec;
}
```

:::

`place-self` 属性是 `align-self` 属性和 `justify-self` 属性的合并简写形式。

```css
place-self: <align-self> <justify-self>;
```

如果省略第二个值，`place-self` 属性会认为这两个值相等。

## 参考指南

::: tip

可以尝试 [技能测试：网格布局](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/CSS_layout/Grid_skills) 查看掌握程度。

:::

- [MDN 网格布局](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_grid_layout)
- [CSS Grid 网格布局教程](https://www.ruanyifeng.com/blog/2019/03/grid-layout-tutorial.html)
