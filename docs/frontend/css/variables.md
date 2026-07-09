---
title: CSS 自定义属性
date: 2024-04-23
icon: variable
category:
  - CSS
tag:
  - 自定义属性
  - frontend
---

CSS 自定义属性（CSS Variables）允许在整个文档中复用值，是现代 CSS 主题化和可维护性的核心工具。

## 声明与使用

```css
/* 声明：以 -- 开头 */
:root {
  --primary-color: #007bff;
  --spacing-base: 8px;
}

/* 使用：var() 函数 */
button {
  background-color: var(--primary-color);
  padding: var(--spacing-base);
}
```

`var()` 支持回退值，第二个参数在变量未定义时生效：

```css
color: var(--accent-color, #333);
```

## 作用域

CSS 变量遵循层叠规则，**声明在哪个选择器上，就在该元素及其后代中生效**。

```css
:root {
  --color: blue; /* 全局变量 */
}

.card {
  --color: green; /* 组件级变量，覆盖全局 */
}

.card p {
  color: var(--color); /* 取 green */
}
```

## JS 动态修改

```js
/* 读取 */
getComputedStyle(document.documentElement).getPropertyValue('--primary-color')

/* 写入 */
document.documentElement.style.setProperty('--primary-color', '#ff0000')
```

## 主题切换

```css
:root {
  --bg: #ffffff;
  --text: #111111;
}

[data-theme='dark'] {
  --bg: #111111;
  --text: #ffffff;
}

body {
  background: var(--bg);
  color: var(--text);
}
```

```js
document.documentElement.dataset.theme = 'dark'
```
