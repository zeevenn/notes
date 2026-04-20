---
title: useTransition
date: 2025-08-25
tags:
  - react
  - hooks
---

## 缓存 promise

下述代码获取存在一个性能问题，每次点击按钮，都会重新调用 `fetchUser` 函数，触发一个新的 fetch 请求，这不仅效率低下，还会导致 `NumberInfo` 组件挂起，渲染 `suspense` 边界。

```tsx
async function fetchUser() {
	const response = await fetch('/api/user')
	const user = await response.json()
	return user
}

function NumberInfo() {
	const [count, setCount] = useState(0)
	const userInfo = use(fetchUser())
	const increment = () => setCount((c) => c + 1)
	return (
		<div>
			Hi {userInfo.name}! You have clicked {count} times.
			<button onClick={increment}>Increment again!</button>
		</div>
	)
}
```

解决方法是添加缓存到我们的 `fetchUser` 函数中。这样，如果 `fetchUser` 函数再次被调用，我们可以返回之前返回的相同 promise：

```tsx
let userPromise
function fetchUser() {
	userPromise = userPromise ?? fetchUserImpl()
	return userPromise
}

// "impl" is short for "implementation"
async function fetchUserImpl() {
	const response = await fetch('/api/user')
	const user = await response.json()
	return user
}
```

通过返回相同的 promise，React 会跟踪该特定 promise，并知道它是否已经 resolved 并需要挂起。

当然，这是一个简单的例子。缓存通常需要更多的思考。例如，如果我们能按 ID 获取用户呢？我们不能只拥有 `userPromise`，现在我们必须拥有一个从用户 ID 到获取该用户的 promise 的映射：

```tsx lines=1,3,4
const userPromiseCache = new Map<string, Promise<User>>()
function fetchUser(id: string) {
	const userPromise = userPromiseCache.get(id) ?? fetchUserImpl(id)
	userPromiseCache.set(id, userPromise)
	return userPromise
}

async function fetchUserImpl(id) {
	const response = await fetch(`/api/user/${id}`)
	const user = await response.json()
	return user
}
```

这会变得更加复杂，当你开始考虑用户数据可能会改变，现在你必须担心缓存失效。但重点是，你需要缓存你的 promise 以避免不必要的重新获取。

> [!TIP]
> 可以使用 `useMemo` 来缓存 promise，这样会在 id 改变时，重新获取 promise，无需考虑缓存失效等复杂问题。

## Transitions

每当触发导致挂起组件的状态更新时，最近的 `suspense` 边界会被找到，并渲染其 `fallback` 属性，直到 promise 被 resolve。如果 `suspense` 边界离触发状态更新的组件很远，或者加载状态与 resolved 状态非常不同，这会给用户带来非常糟糕的体验。

```tsx
function App() {
  return (
    <div>
      <Header />
      <Sidebar />
      
      {/* Suspense 边界在这里 - 很远！ */}
      <Suspense fallback={<div>整个页面加载中...</div>}>
        <MainContent />
      </Suspense>
    </div>
  )
}

function MainContent() {
  return (
    <div>
      <ProductList />
      <UserStats />
    </div>
  )
}

function ProductList() {
  const [filter, setFilter] = useState('all')
  
  const productsPromise = useMemo(() => 
    fetch(`/api/products?filter=${filter}`)
      .then(res => res.json()),
    [filter]
  )
  
  const products = use(productsPromise)
  
  return (
    <div>
      <button onClick={() => setFilter('popular')}>
        热门商品  {/* 👈 用户点击这里 */}
      </button>
      <div>{products.map(p => <div key={p.id}>{p.name}</div>)}</div>
    </div>
  )
}
```

用户点击「热门商品」按钮后：

- 触发状态更新 setFilter('popular')
- 组件挂起 ProductList 因为新的 use(productsPromise) 而挂起
- 找到边界 React 向上查找，找到 App 中的 Suspense
- 突兀体验 整个页面内容消失，显示"整个页面加载中..."

```text
用户看到的变化：
[Header] [Sidebar] [产品列表] [用户统计]
                    ↓ 点击按钮
[Header] [Sidebar] [整个页面加载中...]  ⚠️ 突兀！
```

### 局部 Suspense

```tsx
function ProductList() {
  const [filter, setFilter] = useState('all')
  
  const productsPromise = useMemo(() => 
    fetch(`/api/products?filter=${filter}`)
      .then(res => res.json()),
    [filter]
  )
  
  return (
    <div>
      <button onClick={() => setFilter('popular')}>
        热门商品
      </button>
      
      {/* ✅ 局部 Suspense，只影响产品列表 */}
      <Suspense fallback={<ProductListSkeleton />}>
        <ProductGrid productsPromise={productsPromise} />
      </Suspense>
    </div>
  )
}

function ProductGrid({ productsPromise }) {
  const products = use(productsPromise)
  return <div>{products.map(p => <div key={p.id}>{p.name}</div>)}</div>
}
```

### useTransition

为了使从加载到 resolved 状态的过渡更平滑，可以使用 `useTransition` hook。这个 hook 返回一个包含两个值的元组：一个布尔值和一个 `startTransition` 函数。

- 当 promise 仍处于 pending 状态时，布尔值为 `true`，当 promise 已 resolved 时，布尔值为 `false`。这允许你显示一个加载状态，而不是使用 `suspense` 边界 fallback UI。这通常会带来更平滑的用户体验。
- `startTransition` 函数是一个回调，可以使用它来保证旧 UI 的展示，避免用户看到突兀的 UI 变化。

```tsx lines=3,6-8
function ProductList() {
  const [filter, setFilter] = useState('all')
  const [isPending, startTransition] = useTransition()
  
  const handleFilterChange = (newFilter) => {
    startTransition(() => {
      setFilter(newFilter)  // 非紧急更新，避免挂起
    })
  }
  
  // 显示当前数据 + 加载指示器，而不是完全挂起
  return (
    <div>
      <button 
        onClick={() => handleFilterChange('popular')}
        disabled={isPending}
      >
        热门商品 {isPending && '(加载中...)'}
      </button>
      {/* 其他内容 */}
    </div>
  )
}
```

`startTransition` 的核心是 **调度更新优先级**，而「旧 UI 保留」只是它带来的副作用体验，不是它本质。

React 内部把更新分成紧急和非紧急：

- 紧急更新：输入框、点击 → 立即响应
- 非紧急更新：列表渲染、大量 DOM 更新 → 可以延迟

`startTransition` 就是告诉 React：这次更新不重要，先保证用户交互流畅，再慢慢渲染。

当你把 `Suspense` 放进 `Transition` 时，会带来一个副作用：旧 UI 保留。新数据还没准备好 → React 会先保留旧 UI，不会立刻切到 fallback。

这个行为是 **调度策略带来的体验效果**，而不是 `Transition` 本身的目标。

换句话说：

- `Transition` 目标（调度策略） = 降低更新优先级，让交互不卡顿
- `UI` 保留效果 = 因为更新被降级了，所以旧 UI 还能显示

> [!TIP]
> React 单独提供了 `useTransition` 返回的 `startTransition` 函数，当你不需要 `isPending` 时，可以直接使用 `startTransition` 函数。
