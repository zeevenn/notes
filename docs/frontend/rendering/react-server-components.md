---
title: React Server Component
date: 2024-01-03
icon: STARTUP
category:
  - 工程化
tag:
  - frontend
  - SSR
  - next.js
---

React Server Component 是一种新的组件类型，它允许 React 应用在后端服务器上运行部分组件逻辑。传统的客户端渲染将渲染和处理放在前端。服务器组件的引入，旨在优化应用性能，减小传输给客户端的数据量，提高加载速度，提升用户体验。

服务器和客户端组件允许开发人员构建跨越服务器和客户端的应用程序，将客户端应用程序的丰富交互性与传统服务器渲染的更高性能结合起来。

## Why Server Components

注意看下面的例子：

```jsx
const App = () => {
  return (
    <Wrapper>
      <ComponentA />
      <ComponentB />
    </Wrapper>
  )
}
```

组件 A 和组件 B 以 `children` prop 传入 `wrapper`。每个组件都负责获取自己的数据，任何组件都不会处理自身操作不需要的数据。

```jsx
const Wrapper = ({ children }) => {
  const [wrapperData, setWrapperData] = useState({})

  useEffect(() => {
    // API call to get data for Wrapper component to function
    getWrapperData().then((res) => {
      setWrapperData(res.data)
    })
  }, [])

  // Only after API response is received, we start rendering
  // ComponentA and ComponentB (children props)
  return (
    <>
      <h1>{wrapperData.name}</h1>
      <>{wrapperData.name && children}</>
    </>
  )
}

/*-------------------------------------------------- */

const ComponentA = () => {
  const [componentAData, setComponentAData] = useState({})

  useEffect(() => {
    getComponentAData().then((res) => {
      setComponentAData(res.data)
    })
  }, [])

  return (
    <>
      <h1>{componentAData.name}</h1>
    </>
  )
}

/*-------------------------------------------------- */

const ComponentB = () => {
  const [componentBData, setComponentBData] = useState({})

  useEffect(() => {
    getComponentBData().then((res) => {
      setComponentBData(res.data)
    })
  }, [])

  return (
    <>
      <h1>{componentBData.name}</h1>
    </>
  )
}
```

假设从每个组件发出的 API 调用获得响应所需的时间如下：

- `<Wrapper />` 获取响应所需时间为 1 秒

- `<ComponentB />` 获取响应的时间为 2 秒
- `<ComponentA />` 获取响应需要 3 秒钟

那么就会出现下述情况：

- 1 秒后，用户可以看到 `Wrapper`。
- 2 秒后，组件 B 出现。
- 3 秒后，组件 A 出现。但是组件 A 是通过将组件 B 向下推挤而进入视图的。就好像组件 A 是突然冒出来的一样。这样的用户体验并不好。

另一个问题是，子组件要等到 `Wrapper` 组件从其所做的 API 调用中获得响应后才会渲染，导致产生瀑布现象。

> 「瀑布式」通常是指按顺序执行多个提取请求。这意味着，只有在前一个提取请求得到解决或完成后，才会启动后续的提取请求。

在示例中，只有在 `Wrapper` 组件中获得对 API 调用的响应后，才会渲染其他两个组件。

如何解决这个问题呢？可以在 App 组件中获取所有数据，然后将必要的数据传递给每个组件。类似这样：

```jsx
const App = () => {
  const data = fetchAllStuffs()

  return (
    <Wrapper data={data.wrapperData}>
      <ComponentA data={data.componentAData} />
      <ComponentB data={data.componentBData} />
    </Wrapper>
  )
}
```

这种方法没有任何问题。但是，应用程序接口的响应与组件非常耦合。

例如，如果我们将来移除 ComponentA，我们也希望从 API 响应中移除 componentAData，因为我们不想处理组件不使用的数据。

## The Solution is Server Components

由于组件从客户端向服务器调用 API，然后等待响应返回，以渲染其他组件，当客户端顺序获取数据时，就会产生瀑布现象。

假设这些组件都在服务器上，数据获取的速度会比组件在客户端时要快得多。并且由于组件是在服务器上渲染的，可以访问服务器基础设施，这意味着服务器组件不需要获取数据，而是可以直接查询数据库。

但还存在一个问题：由于在服务器上渲染组件，并不能像普通的 React 组件那样使用钩子（例如 `useState`、`useEffect` 等）、`Web API`（如 `localstorage`）或事件处理程序（如 `onClick`）。因此服务器端组件非常适合实时更新或用户交互并不重要的情况。

```jsx
// Note.js - Server Component

import NoteEditor from 'NoteEditor'

async function Note(props) {
  const { note } = props

  return (
    <div>
      <h1>{note.title}</h1>
      <section>{note.body}</section>
    </div>
  )
}
```

> 客户端组件和服务器组件的区别在于其呈现环境和它们都具有的能力。

## Do's and Dont's

可以做的事情：

- 对服务器数据源（如数据库、内部服务、文件系统等）使用 `async/await`。
- 渲染其他服务器组件、原生元素（如 `div`、`span` 等）或客户端组件（正常的 React 组件）。

不能做的事：

- 不能使用 React 提供的钩子，如 `useState`、`useReducer`、`useEffect` 等，因为服务器组件是在服务器上呈现的。
- 不能使用浏览器 API，如本地存储等（但可以在服务器上进行多填充）。
- 不能使用任何依赖于浏览器 API 的实用功能（例如：本地存储）或依赖于状态或效果的自定义钩子。

## Server Components vs Client Components

客户端组件其实就是 React 的常规编写方式，顾名思义，它们是在客户端（即浏览器）上渲染的。

> 在服务器组件出现之前，所有 React 代码都是在客户端（浏览器）呈现的。因此，为了与在服务器端呈现的服务器组件区分开来，把普通的 React 组件（使用状态、特效、浏览器专用 API 的组件）称为 "客户端组件"。

首先，来看一个服务器组件的示例：

```jsx
// Note.js - Server Component

import db from 'db'
// (A1) We import from NoteEditor.js - a Client Component.
import NoteEditor from 'NoteEditor'

async function Note(props) {
  const { id, isEditing } = props
  // (B) Can directly access server data sources during render, e.g. databases
  const note = await db.posts.get(id)

  return (
    <div>
      <h1>{note.title}</h1>
      <section>{note.body}</section>
      {/* (A2) Dynamically render the editor only if necessary */}
      {isEditing ? <NoteEditor note={note} /> : null}
    </div>
  )
}
```

服务器组件其实就是一个 React 组件，只是你可以在其中使用一些特殊的功能，比如**直接访问数据库**。

客户端组件代码如下所示，使用 `use client` 将组件声明为客户端组件。

```jsx
// NoteEditor.js - Client Component

'use client'

import { useState } from 'react'

export default function NoteEditor(props) {
  const note = props.note
  const [title, setTitle] = useState(note.title)
  const [body, setBody] = useState(note.body)
  const updateTitle = (event) => {
    setTitle(event.target.value)
  }
  const updateBody = (event) => {
    setBody(event.target.value)
  }
  const submit = () => {
    // ...save note...
  }
  return (
    <form action="..." method="..." onSubmit={submit}>
      <input name="title" onChange={updateTitle} value={title} />
      <textarea name="body" onChange={updateBody}>
        {body}
      </textarea>
    </form>
  )
}
```

任何在文件顶部声明 `'use client'` 的组件都被视为客户端组件，如果没有在文件顶部指定，文件中的组件就会被视为服务器组件。

客户端组件无法直接调用数据库，并且也不能在客户端组件中使用服务器组件。

但是，可以在一个服务器组件中导入一个客户端组件或服务器组件，服务器组件还能将另一个服务器组件作为子组件传递给客户端组件：

```jsx
const ServerComponentA = () => {
  return (
    <ClientComponent>
      <ServerComponentB />
    </ClientComponent>
  )
}
```

服务器组件为构建利用服务器和客户端的混合应用程序引入了一种新的思维模式。

React 不再在客户端呈现整个应用程序（例如单页面应用程序），而是可以根据组件的用途灵活选择在哪里呈现组件。

![Thinking in Server Components](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/thinking-in-server-components.avif)

大部分组件都是非交互式的，可以作为服务器组件在服务器上呈现。对于较小的交互式用户界面，可以使用客户端组件。

**总结：**

- 可以在服务器组件中导入客户端组件
- 不能在客户端组件中导入服务器组件
- 可以将服务器组件作为子组件传递给服务器组件内的客户端组件

## The Real Power of Server Components

服务器组件除了渲染静态数据，还有一些其他好处。

### Zero Bundle Size Components

使用库对开发人员很有帮助，但它会增加程序包的大小，并可能损害应用程序的性能。

应用程序的许多部分不是交互式的，不需要完全的数据一致性。例如，「详细信息」页面通常显示有关产品、用户或其他实体的信息，不需要根据用户交互进行更新。

服务器组件允许开发人员在服务器上呈现静态内容。您可以在服务器组件中自由使用第三方软件包，而**不会影响软件包的大小**。

```jsx
// NOTE: *before* Server Components

import marked from 'marked'; // 35.9K (11.2K gzipped)
import sanitizeHtml from 'sanitize-html'; // 206K (63.3K gzipped)

function NoteWithMarkdown({text}) {
  const html = sanitizeHtml(marked(text));
  return (/* render */);
}
```

如果使用服务器组件，就可以在功能中使用完全相同的代码，但避免将其发送到客户端——这样可以节省超过 240K 的代码（未压缩）。

```jsx
// Server Component === zero bundle size

import marked from 'marked' // zero bundle size
import sanitizeHtml from 'sanitize-html' // zero bundle size

function NoteWithMarkdown({ text }) {
  // same as before
}
```

如果在服务器组件中使用第三方库，这些库并不会发送给客户端，会**大大减少 JavaScript 包的大小**，只有通过客户端组件在应用程序中使用客户端交互时，才会添加额外的 JavaScript。由于此，**服务器组件会增加初始页面的加载速度**。

相比之下，客户端组件会把所有库打包，浏览器会将其全部下载并进行解析和执行。

### Complete access to the backend

服务器组件还可以直接访问后台，使用数据库、内部（微）服务和其他后台资源。

```jsx
import db from 'db'

async function Note({ id }) {
  const note = await db.notes.get(id)
  return <NoteWithMarkdown note={note} />
}
```

如上所示，可以直接在服务器组件中读取数据库数据，而不需要通过任何 `fetch` API 获取资源。

服务器组件还能直接访问文件系统，直接使用 `fs` 模块读取服务器上的文件。

```jsx
import fs from 'fs'

async function Note({ id }) {
  const note = JSON.parse(await fs.readFile(`${id}.json`))
  return <NoteWithMarkdown note={note} />
}
```

### Automatic Code Splitting

服务器组件会将所有客户端组件的导入视为潜在的代码分割点。

```jsx
// PhotoRenderer.js - Server Component

// one of these will start loading *once rendered and streamed to the client*:
import OldPhotoRenderer from './OldPhotoRenderer.js'
import NewPhotoRenderer from './NewPhotoRenderer.js'

function Photo(props) {
  // Switch on feature flags, logged in/out, type of content, etc:
  if (FeatureFlags.useNewPhotoRenderer) {
    return <NewPhotoRenderer {...props} />
  } else {
    return <OldPhotoRenderer {...props} />
  }
}
```

在上面的示例中，有两个客户端组件 `NewPhotoRenderer` 和 `OldPhotoRenderer`，它们都是根据条件渲染。

假设条件为 `true`，那么用户将看到的组件就是 `NewPhotoRenderer`。只有该组件会被发送到客户端，而 `OldPhotoRenderer` 不会立即发送到客户端。因此，只有与用户可见组件相关的 JavaScript 代码会被需要。

### No more waterfalls

顺序数据获取会带来瀑布现象，必须等待一个请求完成，避免客户端到服务器的顺序往返延迟。

```jsx
// Note.js - Server Component

async function Note(props) {
  // NOTE: loads *during* render, w low-latency data access on the server
  const note = await db.notes.get(props.id);
  if (note == null) {
    // handle missing note
  }
  return (/* render note here... */);
}
```

服务器组件不再需要客户端到服务器的获取调用，而是将这一逻辑迁移至服务器。并且，还可以将数据获取转移到服务器上（直接访问后台资源）。这些操作可以减少请求延迟并提高性能。

## The Disadvantages of Server Components

服务器组件可以大大提升应用程序的性能，但是还有一些弊端：

- 服务器压力增加：将一部分渲染操作放在服务器上进行，需要服务器具有足够的资源和性能。

- 增加应用开发复杂度：将渲染逻辑分散在服务器和客户端，可能会增加代码维护的复杂度。

- 分布式渲染：由于渲染工作在客户端和服务器端同时进行，应用整体架构更加复杂，可能需要更高的开发经验和水平。

## Server Components vs SSR

服务器组件并不是传统意义上的服务端渲染，虽然它们都在服务器端进行组件渲染，但是它们之间有一些关键区别。

服务器端渲染将整个页面的组件在服务器端生成并渲染，生成完整的 HTML，然后将这些 HTML 发送到客户端。客户端再对这些内容进行加载、展示和处理。SSR 可以提高首屏渲染的速度，对 SEO 有很好的支持。但是，SSR 生成的页面仍然需要在浏览器端执行与数据解析和交互相关的 JavaScript 代码。

> 虽然首屏展示的速度快了，但是不可交互，所以他的 `tti`（页面可交互时间）并没有太大的优化。

而 React Server Component 是在服务器端只渲染部分组件，将不涉及到交互操作的组件在服务器端生成，从而减轻客户端的计算负担。它提供一种更细粒度的控制方式，可以同时利用客户端渲染和服务器渲染的优势。同时，React Server Component 的数据获取和处理也发生在服务器端，进一步降低加载时间。

综合来说，React Server Component 是一种新的服务器端组件渲染策略，与传统的 SSR 有一定差别，更加注重细粒度的性能优化和资源利用。

## 参考资料

1. [How to Use React Server Components – A Beginner's Guide](https://www.freecodecamp.org/news/react-server-components-for-beginners/)
2. [Server Components](https://nextjs.org/docs/getting-started/react-essentials#server-components)
