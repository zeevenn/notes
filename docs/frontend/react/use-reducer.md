---
title: "useReducer"
description: "A hook for managing state with a reducer function"
date: 2025-07-03
tags: ["react", "hooks"]
---

`useState` 可以满足大部分状态管理的需求，有时你希望将状态逻辑与进行状态更改的组件分开。此外，如果你有多个状态元素通常会一起改变，那么有一个包含所有状态元素的对象可能很有帮助。这时使用 `useReducer` 是一个更好的选择。

```tsx
import { useReducer } from 'react';

function reducer(state, action) {
  // ...
}

function MyComponent() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });
  // ...
}
```


`useReducer` 接收一个 `reducer` 函数和一个初始状态，返回一个包含当前状态和 `dispatch` 函数的数组。

- `reducer`：指定数据如何更新，`reducer` 函数必须为纯函数，接收当前状态和 action 作为参数，并返回下一个状态。状态和 action 可以是任何类型。
  - `state`：当前状态
  - `action`：触发状态改变的 action
- `initialArg`：初始状态的值，可以是任何类型。初始状态的计算取决于下一个 `init` 参数。
- `optional init`：初始化函数，返回初始状态。如果未指定，则初始状态设置为 `initialArg`。否则，初始状态设置为 `init(initialArg)` 的结果。

```tsx
import { useReducer } from 'react';

function reducer(state, action) {
  if (action.type === 'incremented_age') {
    return {
      age: state.age + 1
    };
  }
  throw Error('Unknown action.');
}

export default function Counter() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });

  return (
    <>
      <button onClick={() => {
        dispatch({ type: 'incremented_age' })
      }}>
        Increment age
      </button>
      <p>Hello! You are {state.age}.</p>
    </>
  );
}
```

`useReducer` 类似 `useState`，但他可以将逻辑与组件分离，并且可以处理多个状态元素。
