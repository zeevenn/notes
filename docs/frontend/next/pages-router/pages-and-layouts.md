---
title: 页面和布局
date: 2024-03-05
icon: page
category:
  - next
tag:
  - pages router
---

`pages router` 是基于文件系统的路由器，以页面概念为基础。

当一个文件被添加到 `pages` 目录时，它就会自动成为一个路由。

在 Next.js 中，页面是从页面目录中的 `.js`、`.jsx`、`.ts` 或 `.tsx` 文件导出的 React 组件。每个页面都根据其文件名与路由相关联。

例如如果创建的 `pages/about.js` 导出了一个 React 组件（如下所示），则可通过 `/about` 访问该组件。

```js
export default function About() {
  return <div>About</div>
}
```

## 根路由

路由器会自动将名为 `index` 的文件路由到目录根目录。

- `pages/index.js` → `/`
- `pages/blog/index.js` → `/blog`

## 嵌套路由

路由器支持嵌套文件。如果创建了嵌套文件夹结构，文件仍会自动以相同方式路由。

- `pages/blog/first-post.js` → `/blog/first-post`
- `pages/dashboard/settings/username.js` → `/dashboard/settings/username`

## 带有动态路由的页面

Next.js 支持带有动态路由的页面。例如，如果你创建了一个名为 `pages/posts/[id].js` 的文件，那么就可以通过 `posts/1`、`posts/2` 等路径访问该文件。

## 布局模式

React 模型允许我们将页面解构为一系列组件。其中许多组件通常会在页面之间重复使用。例如，您可能会在每个页面上使用相同的导航栏和页脚。

**`components/layout.js`**

```js
import Navbar from './navbar'
import Footer from './footer'

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}
```

## 例子

### 使用自定义应用程序的单一共享布局

如果您的整个应用程序只有一个布局，您可以创建一个自定义应用程序，并用该布局包装您的应用程序。

由于 `<Layout />` 组件在更改页面时会被重复使用，因此其组件状态（如输入值）会被保留。

**`pages/_app.js`**

```js
import Layout from '../components/layout'

export default function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
```

### 按页面布局

如果需要多种布局，可以在页面中添加 `getLayout` 属性，这样就可以返回布局的 React 组件，可以实现按页面定义布局。

由于我们返回的是一个函数，因此如果需要，我们可以使用复杂的嵌套布局。

**`pages/index.js`**

```js
import Layout from '../components/layout'
import NestedLayout from '../components/nested-layout'

export default function Page() {
  return (
    /** Your content */
  )
}

Page.getLayout = function getLayout(page) {
  return (
    <Layout>
      <NestedLayout>{page}</NestedLayout>
    </Layout>
  )
}
```

**`pages/_app.js`**

```js
export default function MyApp({ Component, pageProps }) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page)

  return getLayout(<Component {...pageProps} />)
}
```

在页面之间导航时，我们希望持久保存页面状态（输入值、滚动位置等），以获得单页面应用程序 (SPA) 体验。

这种布局模式可以实现状态持久化，因为 React 组件树会在页面转换之间保持不变。通过组件树，React 可以了解哪些元素发生了变化，从而保持状态。

### 使用 TypeScript

使用 TypeScript 时，首先必须为页面创建一个包含 `getLayout` 函数的新类型。然后，您必须为您的 `AppProps` 创建一个新类型，重载 `Component` 属性以使用之前创建的类型。

**`pages/index.tsx`**

```ts
import type { ReactElement } from 'react'
import Layout from '../components/layout'
import NestedLayout from '../components/nested-layout'
import type { NextPageWithLayout } from './_app'

const Page: NextPageWithLayout = () => {
  return <p>hello world</p>
}

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <NestedLayout>{page}</NestedLayout>
    </Layout>
  )
}

export default Page
```

**`pages/_app.tsx`**

```ts
import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page)

  return getLayout(<Component {...pageProps} />)
}
```

### 获取数据

在布局中，您可以使用 `useEffect` 或类似 [SWR](https://swr.vercel.app/zh-CN) 的库在客户端获取数据。由于该文件不是页面，因此目前无法使用 `getStaticProps` 或 `getServerSideProps`。

```js
import useSWR from 'swr'
import Navbar from './navbar'
import Footer from './footer'

export default function Layout({ children }) {
  const { data, error } = useSWR('/api/navigation', fetcher)

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  return (
    <>
      <Navbar links={data.links} />
      <main>{children}</main>
      <Footer />
    </>
  )
}
```
