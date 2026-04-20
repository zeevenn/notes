---
title: addEventListener
date: 2025-08-25
tags: ["javascript", "event"]
---

`addEventListener` 的第三个参数可以是一个布尔值 `useCapture`，也可以是一个包含多个配置项的 `options` 对象。两者的作用有所不同：

1. `useCapture` 参数 (布尔值)

这个是较早的写法，主要用于指定事件监听器的触发阶段：

- `true`：表示监听器会在捕获阶段（capture phase）触发。
- `false`：表示监听器会在冒泡阶段（bubble phase）触发（默认值）。

事件的传播分为三个阶段：

- 捕获阶段：事件从根节点向目标节点传播。
- 目标阶段：事件到达目标节点。
- 冒泡阶段：事件从目标节点向根节点反向传播。

举例：

```js
element.addEventListener('click', eventHandler, true);  // 在捕获阶段触发
element.addEventListener('click', eventHandler, false); // 在冒泡阶段触发（默认）
```

2. `options` 对象

ES6 引入了 `options` 对象，取代了仅使用 `useCapture` 布尔值的单一功能，提供了更丰富的配置选项。`options` 可以包含以下属性：

- `capture`：等价于以前的 `useCapture` 参数。`true` 表示在捕获阶段触发，`false` 表示在冒泡阶段触发。
- `once`：如果设为 `true`，监听器只会触发一次，然后自动移除。
- `passive`：如果设为 `true`，表示监听器不会调用 `preventDefault()`。这可以提高滚动性能，尤其是在移动设备上。
- `signal`：允许通过 `AbortSignal` 来移除事件监听器，通常配合 `AbortController` 使用。

举例说明：

```js
element.addEventListener('click', eventHandler, {
  capture: true,   // 捕获阶段触发
  once: true,      // 监听器只会执行一次
  passive: true    // 不能调用 preventDefault()
});
```

- `capture: true`：在捕获阶段触发。
- `once: true`：只会触发一次，触发后自动移除事件监听器。
- `passive: true`：禁止调用 `event.preventDefault()`，这样可以提升性能，尤其是在处理滚动事件时。

总结：

- `useCapture` 是布尔值，简单控制事件在捕获还是冒泡阶段触发。
- `options` 是扩展的配置对象，提供了更多的功能（例如 `once`、`passive` 等），可以更灵活地控制事件监听行为。
