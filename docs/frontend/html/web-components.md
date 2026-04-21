---
title: Web Components
date: 2026-04-21
icon: component
category:
  - Frontend
  - HTML
tag:
  - html
  - web-components
  - shadow-dom
---

## 三大核心技术

- **Custom Elements**：自定义 HTML 元素
- **Shadow DOM**：封装的独立 DOM 子树，样式隔离
- **HTML Templates**：`<template>` 和 `<slot>` 定义可复用结构

## Custom Elements

```js
class MyButton extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<button>${this.getAttribute('label')}</button>`
  }
}
customElements.define('my-button', MyButton)
```

```html
<my-button label="Click me"></my-button>
```

## Shadow DOM

```js
const shadow = this.attachShadow({ mode: 'open' })
shadow.innerHTML = `
  <style>button { color: red; }</style>
  <button><slot></slot></button>
`
```

`mode: 'open'` 允许外部 JS 访问 shadow root；`closed` 则不允许。

## 与框架的关系

Web Components 是浏览器原生能力，React/Vue 组件只是框架层面的抽象。两者可以共存：框架内可以使用 Web Components，反之亦然。

## 参考

- [MDN - Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)
