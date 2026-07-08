---
title: useEffect
date: 2024-02-27
icon: effect
category:
  - react
tag:
  - react core
  - hooks
  - effect hooks
---

`useEffect` 可以将组件与外部系统同步。

::: info

外部系统，包括网络、浏览器 API (`setTimeout`...）、第三方库或浏览器 DOM。

:::

## 使用边界

`useEffect` 不是通用的数据流工具。它适合把 React 渲染出的状态同步到外部系统；如果只是根据已有 `props` 或 `state` 计算显示内容，直接在渲染期间计算即可。

常见不需要 Effect 的情况：

- 根据 `props` 或 `state` 派生另一个值；
- 在用户点击、输入、提交时执行动作；
- 因为某个 state 变化而重置另一个 state，但这个关系可以通过 `key`、受控状态或计算值表达。

这些逻辑放进 Effect 往往会多一次渲染，也更容易产生陈旧闭包和依赖项问题。

## useEffect(setup, dependencies?)

`useEffect` 是一个内置的钩子，允许你在 React 将组件渲染（和重新渲染）到 DOM 后运行一些自定义代码。它接受一个回调函数，React 将在 DOM 更新后调用该函数：

```tsx
useEffect(() => {
	// 在这里编写你的副作用代码。
	// 这里可以与浏览器 API 交互，例如
	doSomeThing()
	return function cleanup() {
		// 如果需要清理副作用（如取消订阅事件），可以在这里进行
		doSomeCleanup()
	}
}, [
	// 这里放置你的 useEffect 回调函数的依赖项
	dep1,
	dep2,
])
```

### `setup`

包含 Effect 逻辑的函数。该 **设置函数** 可以返回一个 **清理函数**。大致运行逻辑如下：

1. 当组件添加到 DOM 时，React 将运行「设置函数」。
2. 在每次重新渲染依赖关系发生变化后：
   - React 将首先使用 **旧值** 运行「清理函数」；
   - 然后使用 **新值** 运行「设置函数」。
3. 从 DOM 中移除组件后，React 将最后一次运行「清理函数」。

![hook flow](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20250616153336.png)

::: warning Strict Mode

开发环境启用 Strict Mode 时，React 会在第一次真实设置前额外执行一次 setup -> cleanup。这个检查只发生在开发环境，用来确认清理逻辑能撤销 setup 做过的事情。

请求、订阅、计时器在开发环境看起来“执行两次”时，优先检查清理函数是否完整，而不是移除 Strict Mode。

:::

::: TIP

`useLayoutEffect` 和 `useEffect` 的执行时机不同。通常情况下，`useEffect` 会在浏览器完成绘制之后执行；`useLayoutEffect` 会在浏览器重新绘制前执行。

`useLayoutEffect` 的执行时机更早，所以它可以在浏览器绘制前测量布局或操作 DOM，从而避免可见闪烁。除此之外，优先使用 `useEffect`，避免阻塞绘制。

:::

::: TIP

所以，当存在一些副作用（定时器等），你需要确保有清理函数，否则可能会导致内存泄漏。

:::

### `dependencies`

`setup` 代码中依赖的所有响应式值的列表。

响应式值包括 `props`、`state` 以及直接在组件主体中声明的所有变量和函数。

::: tip

如果为 React 配置了 [linter](https://react.dev/learn/editor-setup#linting)，它就会验证是否将每个反应值都正确指定为依赖项。

:::

依赖项列表必须具有恒定的项数，并以 `[dep1、dep2、dep3]` 这样的内联方式书写。

React 会使用 [`Object.is`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 比较法将每个依赖项与其前一个值进行比较。

如果省略此参数，每次重新渲染组件后，Effect 都会重新运行。

依赖数组描述 Effect 读取了哪些响应式值，而不是手动选择执行次数的开关。为了让 Effect 和最新 `props` / `state` 保持同步，应让 linter 指导依赖项；如果加入某个依赖后导致循环，通常说明这段逻辑需要拆分、移动到事件处理函数，或改成渲染期间的计算。

:::tabs

@tab 传入一个依赖数组

如果指定了依赖关系，「Effect」就会在初始渲染后运行，并在更改依赖关系后重新渲染。

```js
useEffect(() => {
  // ...
}, [a, b]) // Runs again if a or b are different
```

在下面的示例中，`serverUrl` 和 `roomId` 都是响应值，所以必须将它们指定为依赖关系。

因此，在下拉菜单中选择不同的房间或编辑服务器 URL 输入会导致聊天重新连接。

但是，由于「Effect」中没有使用 `message`（因此它不是依赖项），所以编辑 `message` 不会重新连接到聊天。

:::react-demo 传入一个依赖数组

```js
const { useState, useEffect } = React

function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log(
        '✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...'
      )
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl)
    }
  }
}

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId)
    connection.connect()
    return () => {
      connection.disconnect()
    }
  }, [serverUrl, roomId])

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={(e) => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
      <label>
        Your message:{' '}
        <input value={message} onChange={(e) => setMessage(e.target.value)} />
      </label>
    </>
  )
}

export default function App() {
  const [show, setShow] = useState(false)
  const [roomId, setRoomId] = useState('general')
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select value={roomId} onChange={(e) => setRoomId(e.target.value)}>
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
        <button onClick={() => setShow(!show)}>{show ? 'Close chat' : 'Open chat'}</button>
      </label>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  )
}
```

@tab 传入一个空数组

如果没有传入任何依赖值，那么它只会在初始渲染后运行。

```js
useEffect(() => {
  // ...
}, []) // Does not run again (except once in development)
```

即使依赖关系为空，设置和清理也会在开发过程中额外运行一次，以帮助查找错误。

在本例中，`serverUrl` 和 `roomId` 都是硬编码。由于它们是在组件外部声明的，因此不是反应值，也就不是依赖项。

依赖列表是空的，因此 Effect 不会在重新呈现时重新运行。

:::react-demo 传入一个空数组

```js
const { useState, useEffect } = React

const serverUrl = 'https://localhost:1234'
const roomId = 'music'

function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log(
        '✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...'
      )
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl)
    }
  }
}

function ChatRoom() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId)
    connection.connect()
    return () => connection.disconnect()
  }, [])

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <label>
        Your message:{' '}
        <input value={message} onChange={(e) => setMessage(e.target.value)} />
      </label>
    </>
  )
}

export default function App() {
  const [show, setShow] = useState(false)
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom />}
    </>
  )
}
```

@tab 完全不传递依赖关系数组

如果完全不传递依赖关系数组，那么在组件的每次渲染（和重新渲染）后都会运行 Effect。

```js
useEffect(() => {
  // ...
}) // Always runs again
```

在本例中，当更改 `serverUrl` 和 `roomId` 时，Effect 会重新运行，这是合理的。

然而，当您更改信息时，它也会重新运行，这可能是不可取的。这就是通常要指定依赖关系数组的原因。

::: react-demo 完全不传递依赖关系数组

```js
const { useState, useEffect } = React

function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log(
        '✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...'
      )
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl)
    }
  }
}

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId)
    connection.connect()
    return () => {
      connection.disconnect()
    }
  }) // No dependency array at all

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={(e) => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
      <label>
        Your message:{' '}
        <input value={message} onChange={(e) => setMessage(e.target.value)} />
      </label>
    </>
  )
}

export default function App() {
  const [show, setShow] = useState(false)
  const [roomId, setRoomId] = useState('general')
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select value={roomId} onChange={(e) => setRoomId(e.target.value)}>
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
        <button onClick={() => setShow(!show)}>{show ? 'Close chat' : 'Open chat'}</button>
      </label>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  )
}
```

:::

## 异步请求的清理

Effect 中发起请求时，依赖变化或组件卸载后，旧请求可能晚于新请求返回。清理函数需要让旧请求失效，避免旧结果回写 state。

```tsx
useEffect(() => {
  const controller = new AbortController()

  async function loadUser() {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        signal: controller.signal,
      })
      const data = await response.json()
      setUser(data)
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return
      }
      setError(error)
    }
  }

  loadUser()

  return () => {
    controller.abort()
  }
}, [userId])
```

如果使用的 API 不支持取消，也可以在清理函数里将 `ignore` 标记为 `true`，在写入 state 前检查它。关键是让每次 Effect 的 setup 和 cleanup 成对出现。

## 参考

- [useEffect](https://react.dev/reference/react/useEffect)
- [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [Removing Effect Dependencies](https://react.dev/learn/removing-effect-dependencies)
- [useEffect 完整指南](https://overreacted.io/a-complete-guide-to-useeffect/)
