---
title: useRef
date: 2025-06-26
icon: ref
category:
  - react
tag:
  - react core
  - hooks
---

使用 React 时，通常需要直接与 DOM 交互。你可能需要使用一个需要直接与 DOM 交互的非框架特定的库。通常为了使 UI 可访问，你需要考虑焦点管理，这需要你调用输入框的 `.focus()` 方法。

记住，当你这样做时：`<div>hi</div>`，实际上是 `React.createElement` 的语法糖，所以你实际上无法在渲染方法中访问 DOM 节点。事实上，DOM 节点在 `ReactDOM.createRoot().render()` 方法被调用之前根本不存在。你的组件的渲染方法实际上只是负责创建和返回 React 元素，与 DOM 本身无关。

因此，为了访问 DOM，你需要让 React 在渲染组件时给你提供对特定 DOM 节点的访问。这通过一个特殊的属性 `ref` 来实现。

有两种使用 `ref` 属性的方法：回调和 `useRef` 钩子。

**ref callback:**

最简单的方法是使用 `ref` 属性并传递一个回调：

```tsx
function MyDiv() {
	return (
		<div
			ref={myDiv => {
				console.log(`here's my div!`, myDiv)
				return function cleanup() {
					console.log(`my div is getting removed from the page!`, myDiv)
				}
			}}
		>
			Hey, this is my div!
		</div>
	)
}
```

::: warning

出于向后兼容的原因，TypeScript 会告诉你 `myDiv` 可以是 `HTMLDivElement` 或 `null`。因此，你可能需要处理 `null` 的情况（通常，只需提前返回）。在未来，它将永远不会是 `null`。

:::

**ref object:**

对于更复杂的使用场景（例如，需要在初始渲染后与 DOM 交互），可以使用 `useRef` 钩子。

这是一个使用 `ref` 属性和 `useRef` 的简单示例：

```tsx
function MyDiv() {
	const myDivRef = useRef<HTMLDivElement>(null)
	useEffect(() => {
		const myDiv = myDivRef.current
		// myDiv is the div DOM node!
		console.log(myDiv)
	}, [])
	return <div ref={myDivRef}>hi</div>
}
```

使用 `ref` 对象的优点是你可以将 ref 对象存储在变量中，并在 `useEffect` 回调或事件处理程序中安全地访问它。

组件渲染后，它被认为是“已挂载”。这就是 `useEffect` 回调被调用的时候，所以到那时，ref 应该有它的 `current` 属性设置为 DOM 节点。因此，你通常会在 `useEffect` 回调中进行直接 DOM 交互/操作。

每个元素都有一个特殊的 `ref` 属性（如上所示）。你将 ref 传递给该属性，React 将为你提供对该元素创建的元素的引用。

你还可以将 `ref` 传递给函数组件，该组件可以将 `ref` 转发到另一个元素，或者它可以使用 `useImperativeHandle` 在上面添加一些方便的方法。

::: warning

直接将 `ref` 传递作为 `props` 给函数组件，在 React 18 中需要使用 `forwardRef` 来转发 `ref`。

React19 中，`forwardRef` 已经废弃，直接将 `ref` 传递作为 `props` 给函数组件即可。

:::
