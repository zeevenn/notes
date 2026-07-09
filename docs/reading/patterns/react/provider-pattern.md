---
title: Provider 模式
date: 2024-10-15
icon: provider
author: patterns
category:
  - reading
tag:
  - design pattern
  - react
  - prototype-pattern
---

Provider 解决了多层嵌套组件中 `props` 传递的问题。

## 基础使用

react 提供了 `createContext` 方法来创建上下文，可以方便的在多层嵌套组件中共享数据。

`Provider` 需要传递一个 `value` 参数，代表需要共享的数据。

```jsx
const DataContext = React.createContext()

function App() {
  const data = { ... }

  return (
    <div>
      <DataContext.Provider value={data}>
        <SideBar />
        <Content />
      </DataContext.Provider>
    </div>
  )
}
```

在嵌套组件中，可以使用 `useContext` 获取 `value` 参数。

```jsx
const DataContext = React.createContext();

function App() {
  const data = { ... }

  return (
    <div>
      <SideBar />
      <Content />
    </div>
  )
}

const SideBar = () => <List />
const List = () => <ListItem />
const Content = () => <div><Header /><Block /></div>


function ListItem() {
  const { data } = React.useContext(DataContext);
  return <span>{data.listItem}</span>;
}

function Text() {
  const { data } = React.useContext(DataContext);
  return <h1>{data.text}</h1>;
}

function Header() {
  const { data } = React.useContext(DataContext);
  return <div>{data.title}</div>;
}
```

## hooks

一般来说，并不直接在嵌套组件使用 `useContext`，而是将其封装成一个 hooks。

```js
function useDataContext() {
  const data = useContext(DataContext)

  // 安全起见，可以在这里做一些检查
  if (!data) {
    throw new Error('useDataContext must be used within a DataContextProvider')
  }

  return data
}
```

接下来在组件中，可以使用 `useDataContext` 获取 `value` 参数。

```jsx
function App() {
  const data = useDataContext()
  return <div>{data.text}</div>
}
```
