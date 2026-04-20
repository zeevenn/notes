---
title: useId
date: 2025-06-26
icon: id
category:
  - react
tag:
  - react core
  - hooks
---

`useId` 钩子用于生成唯一且稳定的标识符（ID），可以用于 DOM 元素，传入给 `attribute`。

在可重用组件中，特别是在同一页面上多次使用时，这会变得具有挑战性。你不能硬编码一个 `id` 值，因为那样会有多个具有相同 `id` 的元素，这是无效的 HTML。你可以使用随机数或字符串，但那样你需要自己管理，并且它不会在渲染之间保持一致。如果你想要服务器渲染你的应用，你需要确保客户端生成的 ID 与服务器生成的 ID 匹配，以避免 bug，这很痛苦。

这就是 `useId` 钩子发挥作用的地方。

`useId` 钩子生成一个唯一且稳定的标识符（ID），你可以用于 DOM 元素。

这是一个如何在表单组件中使用 `useId` 钩子的示例：

```tsx
function FormField() {
	const id = useId()
	return (
		<div>
			<label htmlFor={id}>Name:</label>
			<input id={id} type="text" />
		</div>
	)
}
```

在这个示例中，`useId` 生成一个唯一 ID，将标签与输入关联起来，确保屏幕阅读器和其他辅助技术可以正确识别表单字段关系。

与 `useState` 或 `useEffect` 不同，`useId` 不接受任何参数并返回一个单个字符串值。没有 setter 或 updater 函数，因为提供的 ID 应该在整个组件的生命周期中保持不变且唯一。

它在服务器端渲染（SSR）上下文中特别有用，因为它确保服务器生成的 ID 与客户端生成的 ID 之间的一致性，避免 hydration 不匹配。

记住，`useId` 的主要用途是用于可访问性和管理不同 DOM 元素之间的关系，如标签和输入。它帮助保持你的 UI 可预测且可访问，而无需自己管理唯一 ID。

一个重要的事情是，你不应该使用 `useId` 为非 DOM 元素生成 ID，如列表中的键或 React 元素的唯一键。这些 ID 应该来自你的数据，而不是 `useId`。
