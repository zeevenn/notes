---
title: 现代 CSS 新特性
date: 2026-05-09
icon: sparkles
category:
  - CSS
tag:
  - 布局
  - 选择器
---

2022—2024 年间，多个重要 CSS 特性全面落地，改变了响应式设计、样式组织和选择器的写法。

## Container Queries（容器查询）

### 与媒体查询的区别

`@media` 查询的是**视口宽度**，导致组件的样式依赖外部环境，复用时容易出问题。

`@container` 查询的是**父容器宽度**，组件样式自包含，放在任何地方都能正确响应。

```css
/* 定义容器 */
.card-wrapper {
  container-type: inline-size;
  container-name: card;
}

/* 当容器宽度 >= 400px 时改变布局 */
@container card (min-width: 400px) {
  .card {
    display: flex;
    flex-direction: row;
  }
}
```

### 容器单位

配套引入了相对于容器尺寸的新单位：

| 单位 | 含义 |
| --- | --- |
| `cqw` | 容器宽度的 1% |
| `cqh` | 容器高度的 1% |
| `cqi` | 容器 inline 轴的 1% |
| `cqb` | 容器 block 轴的 1% |

```css
.card-title {
  font-size: clamp(1rem, 5cqw, 2rem); /* 随容器宽度缩放 */
}
```

> 浏览器支持：Chrome 105+、Safari 16+、Firefox 110+

## CSS Nesting（原生嵌套）

不再需要 Sass，原生 CSS 支持嵌套写法：

```css
.card {
  background: white;
  padding: 1rem;

  /* 嵌套子元素 */
  .title {
    font-size: 1.2rem;
  }

  /* 嵌套伪类 */
  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  /* 嵌套媒体查询 */
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
}
```

> 浏览器支持：Chrome 112+、Safari 16.5+、Firefox 117+

## @layer（层叠层）

`@layer` 允许显式声明样式的优先级层次，解决多来源样式（第三方库、基础样式、组件样式、业务样式）互相覆盖的问题。

```css
/* 声明层的顺序即优先级（后声明的优先级更高） */
@layer base, components, utilities;

@layer base {
  button { background: grey; }
}

@layer components {
  .btn-primary { background: blue; }
}

@layer utilities {
  .bg-red { background: red; }
}
```

**关键规则**：同一 `@layer` 内遵循正常层叠规则；有 `@layer` 的样式整体低于无 `@layer` 的样式（便于业务样式覆盖第三方库）。

典型场景：引入 UI 库（Ant Design、Bootstrap）时，把库的样式放入低优先级 layer，业务样式直接覆盖而不需要 `!important`。

> 浏览器支持：Chrome 99+、Safari 15.4+、Firefox 97+

## :has()（父选择器）

CSS 史上第一个能"向上选择"的选择器，选中**包含特定子孙**的祖先元素。

```css
/* 表单项含有 .error 时，给边框加红色 */
.form-item:has(.error) {
  border-color: red;
}

/* 图片后面紧跟文字时，给图片加 margin */
img:has(+ p) {
  margin-bottom: 0.5rem;
}

/* 导航栏包含打开的下拉菜单时，加遮罩 */
nav:has(.dropdown.open) ~ .overlay {
  display: block;
}
```

很多以前必须用 JS 动态加 class 的场景，现在纯 CSS 就能实现。

> 浏览器支持：Chrome 105+、Safari 15.4+、Firefox 121+

## 参考

- [MDN - CSS Container Queries](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_containment/Container_queries)
- [MDN - CSS Nesting](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_nesting)
- [MDN - @layer](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@layer)
- [MDN - :has()](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:has)
