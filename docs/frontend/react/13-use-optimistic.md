---
title: useOptimistic
tag:
  - react
  - hooks
---

乐观更新是一种在用户操作后，立即更新 UI 的策略，即使操作可能失败。

## `useOptimistic`

Transitions ([`useTransition`](11-useTransition.md)) 可以防止 UI 在组件挂起时发生变化（本质是调度策略）。但有时候可能希望在组件挂起时显示不同的 UI（甚至在组件挂起时多次改变该 UI）。

`useOptimistic` 可以实现这一点，它就像一个 `useState` 钩子，它会在组件挂起时改变 UI（而不是展示 fallback UI）。它经常用于实现乐观更新，这就是为什么它被称为 `useOptimistic`。可能叫它 [`useTransitionState`](https://twitter.com/ryanflorence/status/1788364906900959481) 更合适。

表单 `action` 会自动被 `startTransition` 包裹，所以如果你有一个表单 `action`，你希望实现乐观更新（需要更新状态），那么你需要使用 `useOptimistic` 来绕过 `transition` 的挂起状态。

```tsx lines=2,7,14
function Todo({ todo }: { todo: TodoItem }) {
	const [isComplete, setIsComplete] = useOptimistic(todo.isComplete)

	return (
		<form
			action={async () => {
				setIsComplete(!isComplete)
				await updateTodo(todo.id, !isComplete)
			}}
		>
			<label>
				<input
					type="checkbox"
					checked={isComplete}
					className="todos-checkbox"
				/>
				{todo.text}
			</label>
		</form>
	)
}
```

`isComplete` 是基于 `todo.isComplete` 的，但在 `transition` 期间，我们可以将其改变为 `!isComplete`。一旦 `transition` 完成（无论成功还是失败），它将回退到 `todo.isComplete` 的值。

我们可以在 `transition` 期间多次更新乐观状态，这意味着如果你有一个多步骤操作，你可以更新消息以让用户知道你在运行过程中的哪一步。

### 参数

`useOptimistic` 的参数如下：

- `optimisticState`：乐观状态，即在 `transition` 期间的状态
- `addOptimistic`：添加乐观状态，本地先「伪造」一个状态，立刻渲染到 UI 上
- `actualState`：实际状态，来自真实数据
- `updateFn`：更新函数，一个 reducer 函数，用于合并乐观状态和实际状态

```tsx
const [optimisticState, addOptimistic] = useOptimistic(
  actualState,
  // updateFn
  (prev, newInput) => {
    // merge and return new state
    // with optimistic value
  }
)
```

### 对比 `useTransition`

如果你发请求，依赖的 `use(fetchPromise)` 还没 resolve → `Suspense` 就会触发 `fallback`。但 `useOptimistic` 的设计目标是：让 UI 可以立即显示一个「乐观结果」，避免 `fallback` 抢走 UI。

`useOptimistic` 的效果和原理有点类似 `startTransition`，核心思路：

- 给你一个「临时状态」（乐观 UI），立刻同步渲染出来
- 真实数据到达后，再更新为最终状态
- 这期间不会触发 `Suspense` `fallback`，因为 UI 已经有数据可渲染（虽然是乐观的）

两者像是反向操作：

- `useTransition` 解决的是 延迟更新，旧 UI 保留
- `useOptimistic` 解决的是 提前更新，新 UI 假装完成

## `useFormStatus`

`useFormStatus` 是 `react-dom` 提供的一个 hook。它用于获取表单的提交状态。

> [!TIP]
> 将 `form` 元素视为 `context provider`，而 `useFormStatus` 钩子视为 `context consumer`。

你可以创建一个提交按钮，它可以访问其父表单的当前状态，并在表单操作进行时显示一个 pending 状态：

```tsx
function SubmitButton() {
	const formStatus = useFormStatus()
	return (
		<button type="submit">
			{formStatus.pending ? 'Creating...' : 'Create'}
		</button>
	)
}
```

`formStatus` 还有其他一些有用的属性，可以用于实现乐观 UI（比如正在提交的数据）。

- `formStatus.pending`：一个布尔值，如果为 `true`，则表示父 `<form>` 正在提交。否则为 `false`。
- `formStatus.data`：一个实现了 `FormData` 接口的对象，包含了父 `<form>` 正在提交的数据。如果没有活动提交或没有父 `<form>`，则为 `null`。
- `formStatus.action`：正在提交的 action
- `formStatus.method`：一个字符串值，表示父 `<form>` 正在提交时使用的是 GET 还是 POST HTTP 方法。默认情况下，一个 `<form>` 会使用 GET 方法，可以通过 `method` 属性指定。
