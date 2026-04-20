---
title: useMemo & useCallback & memo
tag:
  - react
  - hooks
---

## useMemo

`useMemo` 可以缓存一个函数的结果，避免重复计算。

```tsx
const memoizedValue = useMemo(() => {
  return expensiveCalculation(a, b)
}, [a, b])
```

`useMemo` 接收两个参数：

- `callback`：一个函数，返回一个值。
- `dependencies`：一个数组，包含所有依赖项。当依赖项发生变化时，`callback` 函数会重新执行。

`useMemo` 会返回一个 memoized 值，当依赖项发生变化时，`callback` 函数会重新执行，并返回新的值。

大部分情况下，React Compiler 会自动优化性能，只有在计算过程耗时较长导致交互明显卡顿的情况下，才有可能需要使用 `useMemo`。

当你需要缓存一个函数时，可以这样使用：

```tsx
const memoizedFunction = useMemo(() => {
  return () => {
    console.log('memoized function')
  }
}, [])
```

缓存函数的情况非常常见，因此 react 提供了 `useCallback` 钩子来避免嵌套。

## useCallback

`useCallback` 可以缓存一个函数，避免重复创建。`useCallback` 接收两个参数：

- `callback`：一个函数，返回一个值。
- `dependencies`：一个数组，包含所有依赖项。当依赖项发生变化时，`callback` 函数会重新执行。

```tsx
const memoizedFunction = useCallback(() => {
  console.log('memoized function')
}, [])
```

## memo

`memo` 可以缓存一个组件，避免重复渲染。`memo` 接收两个参数：

- `component`：一个组件，返回一个值。
- `arePropsEqual`：可选值，一个函数，接收两个参数，`prevProps` 和 `nextProps`，当 `prevProps` 和 `nextProps` 相等时，组件不会重新渲染，通常情况下，你不需要手动进行比较，默认情况下，`memo` 会使用 `Object.is` 进行比较。

```tsx
const MemoizedComponent = memo(SomeComponent, arePropsEqual?)
```

> [!TIP]
> React 通常在不进行优化的情况下也足够快，但有时你需要手动 memorize 组件和值，以保持应用程序的响应速度。手动记忆化容易出错，还会增加额外的代码维护工作。
> [React Compiler](https://react.dev/learn/react-compiler) 会在构建时自动优化 React 应用程序，但目前处于实验阶段，且在 React 19 才得到更好支持。
