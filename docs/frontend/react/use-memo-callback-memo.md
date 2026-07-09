---
title: useMemo & useCallback & memo
tag:
  - react
  - hooks
---

`useMemo`、`useCallback` 和 `memo` 都服务于渲染性能优化。它们不会改变组件语义，只是在依赖或 props 没有变化时，让 React 复用上一次的计算结果、函数引用，或跳过一次子组件渲染。

> [!NOTE]
> 只应把这些 API 当作性能优化。如果去掉 memoization 后逻辑就不正确，应该先修复状态建模、副作用或渲染逻辑，而不是依赖缓存维持正确性。

## 使用边界

手动 memoization 有维护成本：依赖数组要准确，props 引用要稳定，比较函数也可能比重新渲染更贵。通常先写普通代码，只有在交互卡顿、Profiler 指向某个计算或组件渲染成本较高时，再引入这些 API。

常见适用场景：

- 计算本身较慢，且依赖项不常变化；
- 需要把对象、数组或函数传给 `memo` 包裹的子组件；
- 某个值会作为其他 Hook 的依赖项，需要保持引用稳定；
- 自定义 Hook 返回函数，希望调用方拿到稳定引用。

不适合使用的场景：

- 用来修复渲染期间的副作用或不纯计算；
- 对所有函数、对象、组件都机械地包一层；
- 依赖项频繁变化，导致缓存几乎每次都失效；
- 没有测量过性能问题，只是为了“看起来更优化”。

启用 [React Compiler](https://react.dev/learn/react-compiler) 的项目中，编译器可以自动 memoize 值、函数和组件，手动使用 `useMemo`、`useCallback`、`memo` 的需求会减少。[`"use memo"` directive](https://react.dev/reference/react-compiler/directives/use-memo) 主要用于需要显式标注编译边界的配置模式，不是日常替代 `useMemo` 的 Hook。

## useMemo

`useMemo` 用来在两次渲染之间缓存一次计算结果：

```tsx
const visibleTodos = useMemo(() => {
  return filterTodos(todos, tab)
}, [todos, tab])
```

它接收两个参数：

- `calculateValue`：纯函数，不接收参数，返回需要缓存的值；
- `dependencies`：计算中读取的所有响应式值，包括 `props`、`state` 和组件体内声明的变量或函数。

初始渲染时，React 会调用 `calculateValue` 并保存返回值。后续渲染时，如果依赖项与上一次相比没有变化，React 会返回上一次缓存的值；如果依赖项变化，React 会重新执行计算并保存新结果。依赖项使用 `Object.is` 比较。

> [!WARNING]
> `useMemo` 缓存不是语义保证。开发环境热更新、初次挂载时发生 Suspense 等情况都可能让 React 丢弃缓存。需要稳定保存数据时，使用 `state` 或 `ref`，不要依赖 `useMemo`。

### 跳过昂贵计算

```tsx
function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => {
    return filterTodos(todos, tab)
  }, [todos, tab])

  return (
    <div className={theme}>
      <List items={visibleTodos} />
    </div>
  )
}
```

这里 `theme` 改变时组件会重新渲染，但 `todos` 和 `tab` 没变，`filterTodos` 不会再次执行。

### 稳定子组件 props

`useMemo` 也常用来稳定传给 `memo` 子组件的对象或数组引用：

```tsx
function TodoPage({ todos, tab }) {
  const visibleTodos = useMemo(() => {
    return filterTodos(todos, tab)
  }, [todos, tab])

  return <TodoList items={visibleTodos} />
}

const TodoList = memo(function TodoList({ items }) {
  return items.map((item) => <TodoItem key={item.id} item={item} />)
})
```

如果直接写 `const visibleTodos = filterTodos(todos, tab)`，每次渲染都会得到新的数组引用，`TodoList` 的 `memo` 可能无法生效。

## useCallback

`useCallback` 用来在两次渲染之间缓存一个函数引用：

```tsx
const handleSubmit = useCallback((orderDetails) => {
  post(`/product/${productId}/buy`, {
    referrer,
    orderDetails,
  })
}, [productId, referrer])
```

它接收两个参数：

- `fn`：希望缓存引用的函数；
- `dependencies`：函数体中读取的所有响应式值。

初始渲染时，React 返回你传入的函数。后续渲染时，如果依赖项没有变化，React 返回上一次缓存的同一个函数引用；如果依赖项变化，React 返回本次渲染传入的新函数。

> [!NOTE]
> `useCallback` 不会阻止你在渲染期间创建函数。组件每次渲染时，传给 `useCallback` 的函数表达式仍会被创建；`useCallback` 的作用是让 React 在依赖没变时返回之前缓存的函数引用。

### 和 memo 配合

`useCallback` 最常见的用途是把函数传给 `memo` 包裹的子组件：

```tsx
function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post(`/product/${productId}/buy`, {
      referrer,
      orderDetails,
    })
  }, [productId, referrer])

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  )
}

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  // ...
})
```

如果不使用 `useCallback`，`handleSubmit` 每次渲染都是新的函数引用。即使 `ShippingForm` 使用了 `memo`，它也会因为 `onSubmit` prop 改变而重新渲染。

### 减少更新函数依赖

如果回调只是基于上一个 state 计算下一个 state，可以使用 state updater 函数减少依赖项：

```tsx
const handleAddTodo = useCallback((text) => {
  setTodos((todos) => [
    ...todos,
    {
      id: crypto.randomUUID(),
      text,
    },
  ])
}, [])
```

这里不需要把 `todos` 放进依赖数组，因为更新逻辑交给了 `setTodos` 的 updater。

## memo

`memo` 用来让组件在 props 没有变化时跳过重新渲染：

```tsx
const MemoizedComponent = memo(SomeComponent)
```

它接收两个参数：

- `Component`：要 memoize 的组件；
- `arePropsEqual`：可选比较函数，接收 `prevProps` 和 `nextProps`。返回 `true` 表示新旧 props 渲染结果等价，可以跳过渲染；返回 `false` 表示需要重新渲染。

默认情况下，`memo` 会对每个 prop 使用 `Object.is` 做浅比较。`Object.is(3, 3)` 是 `true`，但 `Object.is({}, {})` 是 `false`，所以对象、数组和函数 props 的引用稳定性会影响 `memo` 是否生效。

> [!WARNING]
> `memo` 只比较 props。组件自己的 state 变化、使用的 context 变化，或父组件重新渲染时传入了新引用，仍然会导致它重新渲染。

### 减少 props 变化

不要把整个对象传给子组件，除非子组件确实需要完整对象。拆成更稳定、更小的 props，通常比写自定义比较函数更可靠：

```tsx
const Profile = memo(function Profile({ name, age }) {
  return (
    <p>
      {name}: {age}
    </p>
  )
})

function Page({ person }) {
  return <Profile name={person.name} age={person.age} />
}
```

### 自定义比较函数

只有在 props 结构稳定且重新渲染确实昂贵时，才考虑自定义比较函数：

```tsx
const Chart = memo(
  function Chart({ points }) {
    return <ExpensiveChart points={points} />
  },
  (prevProps, nextProps) => {
    return (
      prevProps.points.length === nextProps.points.length &&
      prevProps.points.every((point, index) => {
        const nextPoint = nextProps.points[index]
        return point.x === nextPoint.x && point.y === nextPoint.y
      })
    )
  }
)
```

自定义比较函数必须比较所有会影响渲染结果和行为的 props，包括函数。忽略函数 props 很容易引入陈旧闭包问题。

## 三者关系

| API | 缓存对象 | 主要用途 |
| --- | --- | --- |
| `useMemo` | 计算结果 | 跳过昂贵计算，稳定对象或数组引用 |
| `useCallback` | 函数引用 | 稳定传给子组件或 Hook 依赖的函数 |
| `memo` | 组件渲染机会 | props 没变时跳过子组件重新渲染 |

`useCallback(fn, deps)` 可以理解为 `useMemo(() => fn, deps)` 的专门写法。它们本身不会让子组件跳过渲染；只有当缓存后的值或函数被传给 `memo` 子组件，或作为其他 Hook 依赖时，引用稳定性才有实际收益。

## 检查清单

- 先确认存在可感知的性能问题，再加 memoization。
- 用 React DevTools Profiler 或生产构建测量，不要只看开发环境。
- 保持依赖数组完整，让 linter 帮助检查响应式值。
- 优先让 props 更小、更稳定，再考虑自定义比较函数。
- 不要把 `useMemo` 当作存储数据的机制。
- 启用 React Compiler 后，优先依赖编译器自动优化，再保留确有必要的手动 memoization。

## 参考

- [useMemo](https://react.dev/reference/react/useMemo)
- [useCallback](https://react.dev/reference/react/useCallback)
- [memo](https://react.dev/reference/react/memo)
- [React Compiler](https://react.dev/learn/react-compiler)
- [`"use memo"` directive](https://react.dev/reference/react-compiler/directives/use-memo)
