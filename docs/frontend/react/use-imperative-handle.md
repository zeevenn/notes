---
title: useImperativeHandle
date: 2025-07-16
tags: ["react"]
---

有时你需要暴露一个方法给父组件，让父组件可以主动与子组件交互。这可以通过 `ref` 来实现，`useRef` 钩子可以让你拥有一个与组件实例关联的对象，并且不会改变时触发组件重新渲染。

父组件可以传递一个 `ref` 给子组件，然后子组件可以在这个 `ref` 上挂载方法，父组件可以调用这些方法。

```tsx
type InputAPI = { focusInput: () => void }

function MyInput({
	ref,
	...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
	ref: React.RefObject<InputAPI>
}) {
	const inputRef = useRef()
	ref.current = {
		focusInput: () => inputRef.current.focus(),
	}
	return <input ref={inputRef} {...props} />
}

function App() {
	const myInputRef = useRef<InputAPI>(null)
	return (
		<div>
			<MyInput ref={myInputRef} placeholder="Enter your name" />
			<button onClick={() => myInputRef.current.focusInput()}>
				Focus the input
			</button>
		</div>
	)
}
```

这实际上是可行的，但是当在 React 的 concurrent/suspense 特性中使用时，会出现一些边缘情况的问题（它也不支持回调 ref）。所以，我们使用 `useImperativeHandle` 钩子来实现这个功能：

```tsx
type InputAPI = { focusInput: () => void }

function MyInput({
	ref,
	...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
	ref: React.RefObject<InputAPI>
}) {
	const inputRef = useRef()
	useImperativeHandle(
		ref,
		() => ({ focusInput: () => inputRef.current.focus() }),
		[],
	)
	return <input ref={inputRef} {...props} />
}
```

`useImperativeHandle` 接收三个参数：

- `ref`：与组件实例关联的 `ref` 对象。
- `createHandle`：一个函数，返回一个对象，这个对象就是暴露给父组件的 API。
- `dependencies`：依赖数组，当依赖数组中的值发生变化时，`createHandle` 函数会重新执行。

[Why you shouldn't put refs in a dependency array](https://epicreact.dev/why-you-shouldnt-put-refs-in-a-dependency-array).

`useImperativeHandle` 允许我们暴露一些方法给父组件，这些方法可以被父组件调用。这在某些场景下非常有用，比如你有一个需要手动操作的组件，但是你又不想让父组件直接操作这个组件的内部状态。

::: TIP

大多数情况下，你不需要 `useImperativeHandle`。在决定使用它之前，问问自己是否还有其他方式可以实现你的目标。

[Imperative vs Declarative Programming](https://tylermcginnis.com/imperative-vs-declarative-programming/)

:::


