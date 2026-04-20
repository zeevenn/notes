---
title: Flex 布局
date: 2021-11-18
icon: a-Displayflex
category:
  - CSS
tag:
  - 布局
  - 弹性盒
  - frontend
  - basic-knowledge
---

## 一、基本概念

### 1.1 flexbox 是什么

CSS3 的新布局模式，是一种当页面需要适应不同屏幕大小以及设备类型时确保元素拥有恰当的行为的布局方式。

flex 弹性盒是一个 **一维布局** 模型，可以在界面中的项目之间提供空间分布和强大对齐功能的布局方式。

所谓一维布局模型是指：flex 在同一时刻只控制行或列。这和 **二维布局模型** Grid Layout （同时控制行和列）相反。

### 1.2 flexbox 的两个轴

flexbox 有两个轴——主轴和交叉轴。主轴由 `flex-direction` 属性定义，而交叉轴和主轴垂直。对 flexbox 做的一切操作都涉及到这两个轴，flexbox 的特点是可以将内容沿着主轴或交叉轴对齐和调整。

### 1.3 起始线和终止线

flexbox 不会对文档的书写模式提供假设。过去，CSS 的书写模式主要被认为是水平的，从左到右的。现代的布局方式涵盖了书写模式的范围，所以不再假设一行文字是从文档的左上角开始向右书写, 新的行也不是必须出现在另一行的下面。

### 1.4 flex 容器和项目

文档中采用了 flexbox 的区域就叫做 **flex 容器（简称”容器“）**。为了创建容器， 我们把一个容器的 `display` 属性值改为 `flex` （块级）或者 `inline-flex`（行级） 。完成这一步之后，容器中的直系子元素就会变为 **flex 项目（简称“项目”）**。

## 二、容器属性

以下都是父元素的属性。

- `flex-direction`：决定主轴方向（即项目的排列方向）
- `flex-wrap`：决定项目是否换行
- `flex-flow`： `flex-direction` 和 `flex-wrap` 的简写
- `justify-content`：项目在主轴上的对齐方式
- `align-items`：项目在交叉轴上的对齐方式
- `align-content`：控制多行项目的对齐方式

### 2.1 flex-direction

`flex-direction` 决定主轴方向、起始线和终止线位置。

它有四个**取值**：

- `row` （默认）：主轴方向为水平方向，主轴的起始线是左边，终止线是右边
- `row-reverse`：主轴方向为水平方向，主轴的起始线和终止线位置交换
- `column`：主轴方向为垂直方向，主轴的起始线是上边，终止线是下边
- `column-reverse`：主轴方向为垂直方向，主轴的起始线和终止线交换

使用场景：网页整体布局、导航栏等等

### 2.2 flex-wrap

`flex-wrap` 决定 flex 项目是否换行，可实现多行 flex 容器，这样做时，应把每行都看作一个新的 flex 容器。

默认情况下子元素是不换行的，如果一条轴线排不下，就可以设置它来换行。

**属性值**：

- `nowrap`（默认）：不换行
- `wrap`：换行，第一行在上方
- `wrap-reverse`：换行，第一行在下方

### 2.3 flex-flow

`flex-flow` 是 `flex-direction` 和 `flex-wrap` 的简写，表示 `flex` 布局的流动特性。第一个指定的值为 `flex-direction` ，第二个指定的值为 `flex-wrap`。默认值当然是 `row nowrap`。

### 2.4 justify-content

`justify-content` 决定项目在**主轴**上的排列（对齐）方式（属性决定了水平方向子项的对齐和分布方式）。

有以下**取值**：

- `flex-start` （默认值）：起始线对齐（项目从容器的起始线开始排列）
- `flex-end`：终止线对齐（项目从容器的终止线开始排列）
- `center`：居中对齐
- `space-around`：每个项目两侧的间隔相等。所以，项目之间的间隔比项目与边框的间隔大一倍。around 是环绕的意思，意思是每个 flex 子项两侧都环绕互不干扰的等宽的空白间距，最终视觉上边缘两侧的空白只有中间空白宽度一半
- `space-between`：两端对齐，项目之间的间隔都相等，between 是中间的意思，意思是多余的空白间距只在元素中间区域分配
- `space-evenly`：均匀分布每个项目，每个 flex 子项两侧空白间距完全相等，项目之间的间隔和项目与边框之间的间隔相等

### 2.5 align-items

`align-items` 定义项目在**交叉轴**上的排列（对齐）方式。

**取值**：

- `stretch`（默认值）：如项目没有设置高度，或者高度为 auto，则占满整个容器
- `flex-start`：起始线对齐
- `flex-end`：终止线对齐
- `center`：居中对齐
- `baseline`： 项目的第一行文字的基线对齐

### 2.6 align-content

`align-content` 用于控制多行项目在交叉轴上的对齐方式，如果项目**只有一行则不会起作用**。

**取值**：

- `stretch`（默认值）：即在项目没设置高度，或高度为 auto 情况下让项目填满整个容器，与 align-items 类似
- `flex-start`：与交叉轴起始线对齐
- `flex-end`：与交叉轴的终点对齐
- `center`：与交叉轴的中点对齐
- `space-between`：同上
- `space-around`：同上
- `space-evenly`：同上

::: normal-demo

```html
<div>
  <p>p1</p>
  <p>p2</p>
  <p>p3</p>
  <p>p4</p>
  <p>p5</p>
</div>
```

```css
div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: space-between;
  flex-flow: row wrap;

  width: 300px;
  height: 100px;
  border: 1px solid #eee;
}

p {
  box-sizing: border-box;
  width: 100px;
  border: 1px solid #d9d9d9;
  margin: 0 10px;
}
```

:::

## 三、项目属性

项目属性针对子元素。

- `order`：定义项目的排列顺序
- `flex-grow`：定义项目放大比例
- `flex-shrink`：定义了项目的缩小比例
- `flex-basis`：设置项目宽度
- `flex`：简写属性
- `align-self`：控制单个项目在交叉轴上的排列对齐方式

### 3.1 order

`order` 属性定义项目的排列顺序，数值越小，排列越靠前。

**取值**：

- 默认为 0，取值为整数

### 3.2 flex-grow

`flex-grow` 定义项目放大比例，放大的前提是父元素有足够空间。实际上是定义子元素占容器空间的份数。若没定义此属性，则空间按自己本身内容撑开。

> grow 是扩展的意思，扩展的就是 flex 子项所占据的宽度，扩展所侵占的空间就是除去元素外的剩余的空白间隙。
>
> 注意：即使设置了固定宽度，若有剩余空间依旧会放大。

**取值**：

- 默认为 0，不放大，取值为数值

### 3.3 flex-shrink

`flex-shrink` 定义项目缩小比例，默认为 1，即如果空间不足，该项目将缩小。

> 注意：即使设置了固定宽度，也会缩小。
>
> 但如果某个项目的 flex-shrink 属性设置为 0 ，即使空间不足，自身也不缩小。

**取值**：

- 默认为 1，正数

### 3.4 flex-basis

用于设置项目宽度，定义了在分配剩余空间之前元素的默认大小。默认 auto 时，项目会保持默认宽度，或者以 width 为自身的宽度，但**如果设置了 flex-basis，权重会 width 属性高，因此会覆盖 width 属性。**

> 实际上不建议对 flex 子项使用`width`属性，因为不够弹性。

**取值**：

- 默认为 auto

### 3.5 flex

`flex` 属性是 `flex-grow` ，`flex-shrink` 与 `flex-basis` 三个属性的简写，用于定义项目放大，缩小与宽度。默认为 `flex: 0 1 auto`；后两个属性值可以简写。

常用：`flex: 1` 等分容器空间。

### 3.6 align-self

`align-self` 指控制单独某一个 flex 子项的垂直对齐方式，写在 flex 容器上的这个 `align-items` 属性，后面是 items，有个 s，表示子项们，是全体；这里是 self，单独一个个体。其他区别不大，语法几乎一样：

`align-self: auto | flex-start | flex-end | center | baseline | stretch;`

唯一区别就是`align-self`多了个`auto`（默认值），表示继承自 flex 容器的`align-items`属性值。其他属性值含义一模一样。
