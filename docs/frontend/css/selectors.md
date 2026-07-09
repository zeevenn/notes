---
title: 选择器
date: 2022-08-03
icon: selector
category:
  - CSS
tag:
  - frontend
  - selector
  - basic-knowledge
---

CSS 中可以通过选择器来选中 HTML 文档中的元素。

## 种类

CSS 的选择器一共分为四种，分别是：

1. 基本选择器
2. 选择符
3. 伪类
4. 伪元素

### 基本选择器

基本选择器共五个，是指平时使用的通配符选择器、标签选择器、ID 选择器、类选择器、属性选择器。

```css
/* 通配符选择器，效率较低 */
* {
}

/* 标签选择器 */
body {
}

/* ID 选择器 */
#id {
}

/* 类选择器 */
.class {
}

/* 属性选择器 */
[attr='val'] {
} /* 属性等于某个值 */
[attr] {
} /* 拥有某一个属性 */
```

### 选择符

选择符一共有五个，分别如下：

```css
/* 后代关系 */
.container img {
}

/* 父子关系 */
ol > li {
}

/* 相邻兄弟关系 */
button + button {
}

/* 普通兄弟关系 */
button ~ button {
}

/* 列（不常见） */
.col||td {
}
```

::: normal-demo 后代关系，以空格分开，会选择所有的后代

```html
<div class="box">
  <div>
    <span>我会被选中</span>
  </div>
</div>

<div class="box">
  <span>我也会被选中</span>
</div>
```

```css
.box span {
  color: red;
}
```

:::

::: normal-demo 父子关系，以 > 分开，选择直接相邻子代

```html
<div class="box">
  <div>
    <span>我不会被选中</span>
  </div>
</div>

<div class="box">
  <span>我会被选中</span>
</div>
```

```css
.box > span {
  color: red;
}
```

:::

::: normal-demo 相邻兄弟关系，以 + 分开，选择后续直接相邻兄弟

```html
<div>one</div>
<div class="box">two</div>
<div>three</div>
<div>four</div>
```

```css
.box + div {
  color: red;
}
```

:::

::: normal-demo 普通兄弟关系，以 ~ 分开，选择后续所有兄弟

```html
<div>one</div>
<div class="box">two</div>
<div>three</div>
<div>four</div>
```

```css
.box ~ div {
  color: red;
}
```

:::

### 伪类

伪类的特征是前面会有一个冒号 `:`，通常与浏览器行为和用户行为相关联，代表元素的某种状态，不会产生新的元素。

以动态伪类为例：

- `a:link` 未访问的链接；
- `a:visited` 已访问的链接
- `a:hover` 鼠标移动到链接上
- `a:active` 激活的链接（鼠标在链接上长按未松开）

::: normal-demo 动态伪类

```html
<a href="#伪类">尝试点击、悬停、长按</a>
```

```css
a:link {
  color: red;
}

a:visited {
  color: yellowgreen;
}

a:hover {
  color: blue;
  cursor: pointer;
}

a:active {
  color: purple;
}
```

:::

> [!TIP] 使用注意
>
> - `:hover` 必须放在 `:link` 和 `:visited` 后面才能生效；
> - `:active` 必须放在 `:hover` 后面才能生效；
>
> 因此建议的编写顺序为：`:link`、`:visited`、`:hover`、`:active`。
>
> 除了 `<a>` 元素外，`:hover`、`:active` 也能用在其他元素上。
>
> 直接给 `<a>` 元素设置样式，相当于给 `<a>` 元素所有状态伪类都设置了相同的样式。

### 伪元素

伪元素的特征是前面会有两个冒号 `::`，允许你对被选择元素的特定部分修改样式，但是这些元素实际上不会在文档中生产，只会在外部显示可见。

一些常见的伪元素：

- `::before` 用来创建一个伪元素，作为已选中元素的第一个子元素，通常会配合 `content` 属性来为该元素添加装饰内容，默认是行内元素；
- `::after` 用来创建一个伪元素，作为已选中元素的最后一个子元素，通常会配合 `content` 属性来为该元素添加装饰内容，默认是行内元素；
- `::first-letter` 会选中某块级元素第一行的第一个字母，并且文字所处的行之前没有其他内容（如图片和内联的表格）；
- `::first-line` 会选中某块级元素的第一行。

::: normal-demo ::before

```html
<p>代办列表，尝试点击</p>
<ul>
  <li>Buy milk</li>
  <li>Take the dog for a walk</li>
  <li>Exercise</li>
  <li>Write code</li>
  <li>Play music</li>
  <li>Relax</li>
</ul>
```

```css
ul {
  margin-left: -2em;
}

li {
  list-style-type: none;
  position: relative;
  margin: 2px;
  padding: 0.5em 0.5em 0.5em 2em;
  background: lightgrey;
  font-family: sans-serif;
}

li.done {
  background: #ccff99;
}

li.done::before {
  content: '';
  position: absolute;
  border-color: #009933;
  border-style: solid;
  border-width: 0 0.3em 0.25em 0;
  height: 1em;
  top: 1.3em;
  left: 0.6em;
  margin-top: -1em;
  transform: rotate(45deg);
  width: 0.5em;
}
```

```js
var list = document.querySelector('ul')
list.addEventListener(
  'click',
  function (ev) {
    if (ev.target.tagName === 'LI') {
      ev.target.classList.toggle('done')
    }
  },
  false
)
```

:::

::: normal-demo ::after

```html
<p>
  我们有一些 <span data-descr="文字">文字</span> 有一些 <span data-descr="提示">提示</span>。<br />
  把鼠标放上去<span data-descr="看看">看看</span>。
</p>
```

```css
span[data-descr] {
  position: relative;
  text-decoration: underline;
  color: #00f;
  cursor: help;
}

span[data-descr]:hover::after {
  content: attr(data-descr);
  position: absolute;
  left: 0;
  top: 24px;
  min-width: 200px;
  border: 1px #aaaaaa solid;
  border-radius: 10px;
  background-color: #ffffcc;
  padding: 5px;
  color: #000000;
  font-size: 14px;
  z-index: 1;
}
```

:::

::: normal-demo ::first-letter

```html
<p>使每段开头的第一个字母变红变大</p>
```

```css
p::first-letter {
  color: red;
  font-size: 130%;
}
```

:::

::: normal-demo ::first-line

```html
<p>
  使段落的第一行变大，比如我有一个多行文字，比如我有一个多行文字，比如我有一个多行文字，比如我有一个多行文字，比如我有一个多行文字。
</p>
```

```css
p::first-line {
  font-size: 130%;
}
```

:::

## 选择器列表

如果有多个使用相同样式的 CSS 选择器，那么这些单独的选择器可以被混编为一个「选择器列表」，这样，规则就可以应用到所有的单个选择器上了。

```css
h1,
.special {
  color: blue;
}
/* 等价于 */
h1 {
  color: blue;
}

.special {
  color: blue;
}
```

> [!WARNING]
>
> 当使用选择器列表时，如果任何一个选择器无效 (存在语法错误)，那么整条规则都会被忽略。

## 优先级

选择器的优先级（Specificity）由 `(A,B,C)` 三列数值决定，比较时从左到右逐列对比，列值大者优先：

- **A**：ID 选择器的数量
- **B**：类选择器、属性选择器、伪类的数量
- **C**：标签选择器、伪元素的数量

几个特殊规则：

- 通配符选择器、选择符不计入任何列，均为 `(0,0,0)`；
- `:is()`、`:not()`、`:has()` 自身不计入，以其参数中**最高优先级**的选择器替代；
- `:nth-child()`、`:nth-last-child()` 自身计为一个伪类（B+1），再加上参数中最高优先级的选择器；
- `:where()` 始终为 `(0,0,0)`，专为"零优先级"场景设计。

除选择器优先级外，还有两种更高层级的规则：

- **内联样式**（`style=""`）：直接写在元素上，优先级高于任何选择器；
- **`!important`**：属于级联（Cascade）层面，会强制覆盖所有优先级规则，包括内联样式。

```text
Examples:
*                     /* a=0 b=0 c=0 */
LI                    /* a=0 b=0 c=1 */
UL LI                 /* a=0 b=0 c=2 */
UL OL+LI              /* a=0 b=0 c=3 */
H1 + *[REL=up]        /* a=0 b=1 c=1 */
UL OL LI.red          /* a=0 b=1 c=3 */
LI.red.level          /* a=0 b=2 c=1 */
#x34y                 /* a=1 b=0 c=0 */
#s12:not(FOO)         /* a=1 b=0 c=1 */
.foo :is(.bar, #baz)  /* a=1 b=1 c=0 */
```

## 参考

- [MDN 伪类](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Pseudo-classes)
- [MDN 伪元素](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Pseudo-elements)
- [Selectors Level](https://drafts.csswg.org/selectors/#specificity-rules)
