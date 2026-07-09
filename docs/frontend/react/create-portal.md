---
title: Portals
date: 2025-07-16
tags: ["react"]
---

有一些场景下，需要将组件渲染在正常的文档流外部，比如一个模态框，需要渲染在 `body` 元素的顶部。

你可以通过 `useEffect` 来创建一个 DOM 节点，并将其添加到文档中，然后在组件卸载时将其删除。但是，这个模式非常常见，React 提供了一个内置的方法来实现这个功能，那就是 `ReactDOM.createPortal`。

```tsx lines=1,12-18
import { createPortal } from 'react-dom'

function Modal({
	title,
	content,
	handleClose,
}: {
	title: string
	content: string
	handleClose: () => void
}) {
	return createPortal(
		<div className="modal">
			<h1>{title}</h1>
			<p>{content}</p>
		</div>,
		document.body,
	)
}

function App() {
	const [showModal, setShowModal] = React.useState(false)

	return (
		<div>
			<button onClick={() => setShowModal(true)}>Show Modal</button>
			{showModal && (
				<Modal
					title="My Modal"
					content="This is the content of the modal"
					handleClose={() => setShowModal(false)}
				/>
			)}
		</div>
	)
}
```

`createPortal` 接收两个参数：

- 第一个参数是你要渲染的 UI，它有访问 props、state 等的能力。
- 第二个参数是你要渲染到的 DOM 节点。

在这个例子中，我们把模态框渲染到了 `body` 元素。

- [the `createPortal` docs](https://react.dev/reference/react-dom/createPortal)
