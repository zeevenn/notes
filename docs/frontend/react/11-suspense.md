---
title: Suspense
date: 2025-08-20
tags: ["react", "components"]
---

大多数应用程序都需要从服务器获取一些数据。例如一个 `fetch` 请求：

```tsx
const response = await fetch('https://api.example.com/data')
const data = await response.json()
```

虽然代码很简单，但无论你的服务器有多快，你都需要考虑用户在等待时看到的内容。你无法控制用户的网络连接。同样，你还需要考虑如果请求失败会发生什么。你也无法控制用户的连接可靠性。

## 传统实现

下述代码是一个传统的实现方式，它通过 `useState` 和 `useEffect` 来管理异步状态，在数据加载完成之前，会展示 `Loading...` 状态，在数据加载失败时，会展示 `Error: {error.message}` 状态。

```tsx
function DataLoader() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  const fetchData = async () => {
    try {
      const response = await fetch('https://api.example.com/data')
      const data = await response.json()
      setData(data)
    } catch (error) {
      setError(error)
    } finally {
      setIsLoading(false)
    }
	}

  useEffect(() => {
    fetchData()
  }, [])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  return <div>{data}</div>
}
```

## 使用 Suspense

React 提供了一套优雅的解决方案来处理这些场景：`Suspense` 和 `ErrorBoundary` 组件。`Suspense` 组件可以让你在等待数据加载时展示一个 fallback UI，而 `ErrorBoundary` 组件可以让你在数据加载失败时展示一个错误 UI。

关键问题在于：如何在渲染 UI 时恰当地处理异步状态？这时候 `use` 钩子就派上用场了：

```tsx
function DataLoader() {
	const data = use(fetchDataPromise)
	return <div>{data}</div>
}
```

为了完成声明式循环，当 promise 被抛出时，React 会「暂停」组件，这意味着它会向上查找父组件的树，寻找 `Suspense` 组件并渲染其边界：

```tsx
import { Suspense } from 'react'

function App() {
	return (
		<Suspense fallback={<div>loading phone details</div>}>
			<DataLoader />
		</Suspense>
	)
}
```

这类似于错误边界，因为 `Suspense` 边界可以处理其子组件或孙组件中抛出的任何 promise。它们也可以嵌套，因此你可以在应用程序的加载状态上拥有很大的控制权。

如果 promise 被拒绝，那么你的 `ErrorBoundary` 将被触发，你可以渲染一个错误消息给用户：

```tsx
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

function App() {
	return (
		<ErrorBoundary fallback={<div>Oh no, something bad happened</div>}>
			<Suspense fallback={<div>loading phone details</div>}>
				<DataLoader />
			</Suspense>
		</ErrorBoundary>
	)
}
```

一个简单的 `use` 钩子实现如下：

```js
type UsePromise<Value> = Promise<Value> & {
	status: 'pending' | 'fulfilled' | 'rejected'
	value: Value
	reason: unknown
}

function use<Value>(promise: Promise<Value>): Value {
	const usePromise = promise as UsePromise<Value>
	if (usePromise.status === 'fulfilled') {
		return usePromise.value
	} else if (usePromise.status === 'rejected') {
		throw usePromise.reason
	} else if (usePromise.status === 'pending') {
		throw usePromise
	} else {
		usePromise.status = 'pending'
		usePromise.then(
			(result) => {
				usePromise.status = 'fulfilled'
				usePromise.value = result
			},
			(reason) => {
				usePromise.status = 'rejected'
				usePromise.reason = reason
			},
		)
		throw usePromise
	}
}
```

## 总结

使用 `Suspense` 和 `use` 钩子，可以让我们更方便地管理异步状态，而不需要手动管理 `isLoading` 和 `error` 状态。
