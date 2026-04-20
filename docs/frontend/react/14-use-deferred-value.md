---
title: useDeferredValue
tag:
  - react
  - hooks
---

`useTransition` 可以让你给你一个 `pending` 的布尔值，让你可以展示 `pending` 状态。但这个问题的难点在于，如果你想展示触发 transition 的值。例如，如果你使用 state 控制一个搜索框，你希望 `<input />` 的 `value` 与用户输入的值保持一致，而不是与之前的值保持一致，因为 React 正在等待 transition 完成。

```tsx
import { Suspense, useState, useTransition } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();
  
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => {
            startTransition(() => {
              setQuery(e.target.value)
            })
          }}
        />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={query} />
      </Suspense>
    </>
  );
}
```

此时，input 的 value 不会实时更新，因为 React 正在等待 transition 完成。

`useDeferredValue` 可以让你把一个值「延迟处理」。

- 组件里仍然会立刻拿到最新的输入值，所以 `<input />` 不会卡顿。
- 但你把这个值传给 `useDeferredValue`，得到一个「延迟版的值」，再用它去触发昂贵的渲染（比如搜索结果）。


```tsx
import { Suspense, useState, useDeferredValue } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <div style={{
          opacity: isStale ? 0.5 : 1,
          transition: isStale ? 'opacity 0.2s 0.2s linear' : 'opacity 0s 0s linear'
        }}>
          <SearchResults query={deferredQuery} />
        </div>
      </Suspense>
    </>
  );
}
```

`useDeferredValue` 会让 React 渲染两次。第一次把 `deferredValue` 设置为之前的 `value`，第二次把 `deferredValue` 设置为当前的 `value`。这允许 React 处理挂起的组件，并且你可以根据 `deferredValue` 和 `value` 的差异来决定是否显示 stale UI。

这可能感觉与 `useTransition` 非常相似。两者都允许你处理挂起的组件的 pending UI。`useDeferredValue` 通常用于典型的用户交互，而 `useTransition` 通常用于用户导航或刷新整个 UI。

| 特性    | `useTransition`                                 | `useDeferredValue`                                    |
| ----- | ----------------------------------------------- | ----------------------------------------------------- |
| 主要作用  | 将状态更新标记为「非紧急」，允许 React 延迟渲染耗时组件                 | 将一个值延迟处理，让依赖这个值的组件慢一点更新                               |
| 返回值   | `[startTransition, isPending]`                  | `deferredValue`                                       |
| 触发方式  | 手动包裹状态更新：`startTransition(() => setState(...))` | 直接传入值：`const deferredValue = useDeferredValue(value)` |
| UI 表现 | 旧状态会被保留，提供 `isPending` 显示加载状态                   | 当前值立即可用（input 仍实时更新），延迟值用于耗时渲染                        |
| 使用场景  | 当一次状态更新会触发大量耗时渲染，想让 UI 先响应紧急操作                  | 当某个值可能导致昂贵渲染，但你希望主 UI 保持流畅                            |
