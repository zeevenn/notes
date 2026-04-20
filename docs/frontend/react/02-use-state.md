---
title: useState
date: 2024-02-27
icon: state
category:
  - react
tag:
  - react core
  - hooks
  - state hooks
---

React 组件生命周期：

```mermaid
graph LR
    A[Initial Render] --> B[Create the DOM]
    B --> C[User Interaction]
    C --> D[State Changes]
    D --> E[re-render]
    E --> F[Update the DOM]
    F --> C
```

## 基本用法

一般在组件 **最顶层** 调用 `useState` 给组件添加状态变量，返回一个数组，使用数组解构接收，如 `[something, setSomething]`。

- 当前状态。在第一次渲染时，它将与传递的初始状态 `initialState` 相匹配。
- `set` 函数，用于 **状态更新** 并 **触发重新渲染**。

```js
import { useState } from 'react'

function MyComponent() {
  const [age, setAge] = useState(28)
  const [name, setName] = useState('Taylor')
  const [todos, setTodos] = useState(() => createTodos())
}
```

## useState(initialState)

**参数：**

`initialState`：初始状态，可以是任何类型的值，初始渲染后，该参数将被忽略。

如果传递一个函数作为 `initialState`，它将被视为「初始化函数」。React 将在初始化组件时调用初始化函数，并将其返回值存储为初始状态。

:::tabs

@tab 直接传入值

:::react-demo 直接传入值

这个例子 **没有** 传递初始化函数，因此 `createInitialTodos` 函数会在每次渲染时运行，比如当你在输入框中输入时，此时打开控制台，可以看到每次输入都会调用该函数。

```js
const { useState, useRef, useEffect } = React

function createInitialTodos() {
  const initialTodos = []
  for (let i = 0; i < 10; i++) {
    initialTodos.push({
      id: i,
      text: 'Item ' + (i + 1)
    })
  }
  console.log('render')

  return initialTodos
}

export default function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos())
  const [text, setText] = useState('')

  return (
    <>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button
        onClick={() => {
          setText('')
          setTodos([
            {
              id: todos.length,
              text: text
            },
            ...todos
          ])
        }}
      >
        Add
      </button>
      <ul>
        {todos.map((item) => (
          <li key={item.id}>{item.text}</li>
        ))}
      </ul>
    </>
  )
}
```

@tab 传入初始化函数

:::react-demo 传入初始化函数

这个例子传递了初始化函数，因此 `createInitialTodos` 函数仅在初始化期间运行。当组件重新渲染，例如你在输入框中键入内容时，它不会再次运行。

```js
const { useState, useRef, useEffect } = React

function createInitialTodos() {
  const initialTodos = []
  for (let i = 0; i < 10; i++) {
    initialTodos.push({
      id: i,
      text: 'Item ' + (i + 1)
    })
  }
  console.log('render')

  return initialTodos
}

export default function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos)
  const [text, setText] = useState('')

  return (
    <>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button
        onClick={() => {
          setText('')
          setTodos([
            {
              id: todos.length,
              text: text
            },
            ...todos
          ])
        }}
      >
        Add
      </button>
      <ul>
        {todos.map((item) => (
          <li key={item.id}>{item.text}</li>
        ))}
      </ul>
    </>
  )
}
```

:::

::: warning

- 尽管 `createInitialTodos()` 的结果仅用于初始渲染，但你仍然在每次渲染时调用此函数。如果它创建大数组或执行昂贵的计算，这可能会浪费资源,所以应该保证传入初始化函数。
- `useState` 是一个钩子，所以 **只能** 在组件的顶层或者你自己的钩子中调用它，**不能** 在循环或条件中调用它。
- 在严格模式下，React 会 **调用两次初始化函数**，其中一次调用的结果将被忽略，以帮助你找到意外的杂质。这是开发专用行为，不会影响生产环境。如果初始化函数是纯函数，就不会影响应用实际行为（因此初始化函数必须是纯函数）。

## setSomething(nextState)

`set` 函数会 **更新状态并触发重新渲染**，可以直接传入 `next state`，或者传入一个纯函数。`set` 函数没有返回值。

`setSomething()` 是一个异步函数，如下所示，`handleClick1` 点击一次后，年龄将变为 `43` 岁，而不是 `45` 岁。

这是因为调用 `set` 函数 **不会同步** 更新已运行代码中的年龄状态变量。

因此，每次调用 `setAge(age + 1)` 都会变成 `setAge(43)`。

```js
function handleClick1() {
  setAge(age + 1) // setAge(42 + 1)
  setAge(age + 1) // setAge(42 + 1)
  setAge(age + 1) // setAge(42 + 1)
}
```

::: tip

[RFClarification: why is setState asynchronous?](https://github.com/facebook/react/issues/11527)

:::

如果传递一个函数作为 `nextState`，它将被视为一个更新函数。它必须是「纯函数」，应将待处理状态作为唯一参数，并返回下一个状态。

React 会将更新函数 **放入队列**，然后重新渲染组件。

在下一次渲染中，React 将通过将所有队列中的更新器 **应用上一个状态来计算下一个状态(`previous state` to `next state`)**。

```js
function handleClick2() {
  setAge((a) => a + 1) // setAge(42 => 43)
  setAge((a) => a + 1) // setAge(43 => 44)
  setAge((a) => a + 1) // setAge(44 => 45)
}
```

上述代码的处理过程如下：

1. `a => a + 1` 将接收 `42` 作为待处理状态，并返回 `43` 作为下一状态。
2. `a => a + 1` 将接收 `43` 作为待处理状态，并返回 `44` 作为下一个状态。
3. `a => a + 1` 将接收 `44` 作为待处理状态，并返回 `45` 作为下一个状态。

没有其他队列更新，所以 React 会将 `45` 作为当前状态保存。

::: tip

按照惯例，通常以状态变量名称的首字母来命名待处理状态参数，如年龄的 `a`，也可以使用更加清晰的名称 `prevAge`。

:::

## 总结

- `set` 函数只更新 **下一次渲染** 的状态变量。如果在调用 `set` 函数后读取状态变量，您仍然会得到调用前屏幕上的旧值。
- 如果提供的新值与当前状态相同（由 `Object.is` 比较确定），React 将 **跳过重新渲染组件及其子代**。
- React 会批量更新状态。它会 **在所有事件处理程序运行并调用其设置函数后更新屏幕**。这可以防止在单个事件中多次重新渲染。在极少数情况下，需要强制 React 提前更新屏幕，例如访问 DOM，可以使用 `flushSync`。
- 与初始化函数类似，在严格模式下，React 会调用更新器函数 **两次**，以验证它们是否纯粹。

:::

## 参考

- [Adding state to a component](https://react.dev/reference/react/useState#adding-state-to-a-component)
- [Updating state based on the previous state](https://react.dev/reference/react/useState#updating-state-based-on-the-previous-state)
- [Updating objects and arrays in state](https://react.dev/reference/react/useState#updating-objects-and-arrays-in-state)
- [Avoiding recreating the initial state](https://react.dev/reference/react/useState#avoiding-recreating-the-initial-state)
- [Resetting state with a key](https://react.dev/reference/react/useState#resetting-state-with-a-key)
- [Storing information from previous renders](https://react.dev/reference/react/useState#storing-information-from-previous-renders)
