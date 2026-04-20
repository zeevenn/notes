---
title: 居中
date: 2022-07-01
icon: console-line
category:
  - CSS
tag:
  - 布局
  - frontend
  - basic-knowledge
---

元素居中是比较常见的一个需求，有几种常见方法。

## 行内元素水平垂直居中

设置父级标签。

- 水平居中： `text-align: center`
- 垂直居中： `line-height：盒子高度`

## 块级元素水平垂直居中

### flex

只需给父元素设置 `flex` 即可。

::: normal-demo flex

```html
<div class="parent">
  <div class="children"><div></div></div>
</div>
```

```css
.parent {
  width: 200px;
  height: 200px;
  background-color: #eee;

  display: flex;
  justify-content: center;
  align-items: center;
}

.children {
  background-color: #333;
  width: 100px;
  height: 100px;
}
```

:::

### 定位

有两种方案，先给父元素设置 `relative`，再给子元素设置 `absolute`，最后给子元素设置：

- `transform`：不会触发重排，推荐使用；
- `margin` 负值：需要知道子元素宽高。

原理是 **通过定位改变文档流，再通过 `top` 等属性改变子元素位置，最后调整到居中位置**。

::: normal-demo 方案一：transform

```html
<div class="parent">
  <div class="children"><div></div></div>
</div>
```

````css
.parent {
  width: 200px;
  height: 200px;
  background-color: #eee;

  position: relative;
}

/* transform */
.children {
  position: absolute;
  top: 50%;
  left: 50%;

  transform: translate(-50%, -50%);

  background-color: #333;
  width: 100px;
  height: 100px;
}

:::

::: normal-demo 方案二：margin 负值

```html
<div class="parent">
  <div class="children"><div>
</div>
````

```css
.parent {
  width: 200px;
  height: 200px;
  background-color: #eee;

  position: relative;
}

/* margin 负值 */
.children {
  position: absolute;
  top: 50%;
  left: 50%;

  /* 子元素宽高的一半 */
  margin-left: -50px;
  margin-top: -50px;

  background-color: #333;
  width: 100px;
  height: 100px;
}
```

:::
