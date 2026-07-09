---
title: flushSync
---

`flushSync` 是 React 中的一个函数，用于强制同步更新。

帮助用户将焦点保持在正确的位置是用户体验的关键部分。这对于依赖屏幕阅读器或键盘导航的用户尤其重要。但即使是能够使用键盘的用户也可以从精心设计的焦点管理体验中受益。

有时，您想要聚焦的元素在状态更新后才会变得可用。例如：

```tsx
function MyComponent() {
	const [show, setShow] = useState(false)

	return (
		<div>
			<button onClick={() => setShow(true)}>Show</button>
			{show ? <input /> : null}
		</div>
	)
}
```

假设用户点击「显示」后，他们想要在输入框中输入一些内容。良好的焦点管理会在元素变得可见后聚焦该元素。

React 中的状态更新是批量进行的。因此，状态更新不一定会在调用状态更新函数时立即发生。

因此，如果尝试在状态更新后立即聚焦元素，它可能无法按预期工作。这是因为您想要聚焦的元素可能还不可用。

```tsx remove=10
function MyComponent() {
	const inputRef = useRef<HTMLInputElement>(null)
	const [show, setShow] = useState(false)

	return (
		<div>
			<button
				onClick={() => {
					setShow(true)
					inputRef.current?.focus() // This probably won't work
				}}
			>
				Show
			</button>
			{show ? <input ref={inputRef} /> : null}
		</div>
	)
}
```

解决此问题的方法是强制 React 同步运行状态和 DOM 更新，以便在您尝试聚焦时，您想要聚焦的元素是可用的。

您可以通过使用 `react-dom` 包中的 `flushSync` 函数来实现这一点。

```tsx
import { flushSync } from 'react-dom'

function MyComponent() {
	const inputRef = useRef<HTMLInputElement>(null)
	const [show, setShow] = useState(false)

	return (
		<div>
			<button
				onClick={() => {
					flushSync(() => {
						setShow(true)
					})
					inputRef.current?.focus()
				}}
			>
				Show
			</button>
			{show ? <input ref={inputRef} /> : null}
		</div>
	)
}
```

`flushSync` 的作用是强制 React 同步运行状态和 DOM 更新。这样，在 `flushSync` 调用后，输入元素将变得可用，您可以尝试聚焦它。

通常，您应该避免这种优化，但在某些情况下（如焦点管理），它是完美的解决方案。

- [📜 the `flushSync` docs](https://react.dev/reference/react-dom/flushSync).
