---
title: React
article: false
star: true
publish: false
---

## React

### Hooks

#### State Hooks

状态可以让组件「记住」用户输入等信息，以下钩子可以为组件添加状态：

- [useState](./01-useState.md)：声明一个可以直接更新的状态变量。
- `useReducer`：声明一个状态变量，其更新逻辑在一个 `reducer` 函数中。

#### Effect Hooks

Effects 允许组件连接到外部系统并与之同步，包括处理网络、浏览器 DOM、动画、使用不同 UI 库编写的部件以及其他非 React 代码。

Effects 是 React 范式的 「逃生舱门」。不要使用 Effects 来协调应用程序的数据流。如果不需要与外部系统交互，**可能不需要 Effect**。

`useEffect` 有两种很少使用的变体，它们在时间上有所不同：

- `useLayoutEffect` 在浏览器重绘屏幕之前触发。您可以在此处测量布局。
- `useInsertionEffect` 在 React 更改 DOM 之前触发。库可以在此处插入动态 CSS。

- [useEffect](./02-useEffect.md)

## React Dom
