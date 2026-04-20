---
title: 实现 loading spinner
date: 2024-09-14
icon: loading
category:
  - CSS
tag:
  - trick
---

实现一个 loading spinner 可以使用 CSS 动画和边框。

::: normal-demo loading-spinner

```html
<span class="loading-spinner" />
```

```css
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #ccc;
  border-radius: 50%;
  border-top-color: #007bff;
  animation: spin 1s linear infinite;
}
```

:::
