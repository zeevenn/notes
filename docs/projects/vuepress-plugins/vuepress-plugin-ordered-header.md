---
title: Vuepress Plugin Ordered Header
date: 2024-02-19
icon: vuepress
category:
  - Project
tag:
  - openai
  - langchain
---

::: tip

该插件已经发布至：[GitHub](https://github.com/dribble-njr/vuepress-plugin-ordered-header) | [npm](https://www.npmjs.com/package/vuepress-plugin-ordered-heade)。

如有帮助可以点个 star 支持一下~。

:::

[VuePress](https://v2.vuepress.vuejs.org/zh/) 默认不支持生成有序目录，比如想要下面这种效果：

```markdown
# 标题 1

## 标题 1-1

### 标题 1-1-1

## 标题 1-2

# 标题 2
```

目录将显示为：

```
1 header 1

1.1 header 1-1

1.1.1 header 1-1-1

1.2 header 1-2

2 header 2
```

于是花了一点时间研究了 VuePress 的插件系统。

## VuePress 架构

::: tip

以下内容来自 [VuePress - 架构](https://v2.vuepress.vuejs.org/zh/advanced/architecture.html)

:::

### 概览

VuePress 的简要架构：

- Node App 会生成临时文件，包括页面、路由等。
- Bundler 会将 Client App 和临时文件一起进行打包，就像处理一个普通的 Vue App 一样。

VuePress 分为两个主要部分： Node App 和 Client App：

- 插件或者主题的入口文件会在 Node App 中被加载。
- 客户端文件会在 Client App 中被加载，也就是会被 Bundler 处理。比如组件、客户端配置文件等。

![架构](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20240229181754.png)

### 核心流程和 Hooks

VuePress 的核心流程以及 插件 API 的 Hooks ：

- 在 `init` 阶段：
  - 主题和插件会被加载。这意味着插件需要在初始化之前使用。
  - 由于我们要使用 `markdown-it` 来解析 Markdown 文件，因此需要在加载页面文件之前创建 `markdown-it` 实例：
    - `extendsMarkdownOptions` Hook 会被调用，用以创建 `markdown-it` 实例。
    - `extendsMarkdown` Hook 会被调用，用以扩展 `markdown-it` 实例。
  - 页面文件会被加载：
    - `extendsPageOptions` Hook 会被调用，用以创建页面。
    - `extendsPage` Hook 会被调用，用以扩展页面对象。
- 在 `prepare` 阶段：
  - 临时文件会被生成，因此所有和客户端文件相关的 Hooks 会在此处调用。
- 在 `dev / build` 阶段：
  - Bundler 会被加载：
  - `extendsBundlerOptions` Hook 会被调用，用以生成 Bundler 的配置。
  - `alias` Hook 和 `define` Hook 会被用在 Bundler 的配置中，所以它们会在此处调用。

![核心流程和 Hooks](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20240229181843.png)

## 开发插件

开发插件只需要导出一个插件对象，并在对应 Hooks 中实现自己想要的逻辑。

比如要实现有序标题，那么可以在 [`extendsPage`](https://v2.vuepress.vuejs.org/zh/reference/plugin-api.html#extendspage) Hooks 中扩展 [`Page`](https://v2.vuepress.vuejs.org/zh/reference/node-api.html#page-%E5%B1%9E%E6%80%A7) 实例的 [`headers`](https://v2.vuepress.vuejs.org/zh/reference/node-api.html#headers) 属性。

::: tip

`extendsPage`：

- 类型： `(page: Page, app: App) => void | Promise<void>`
- 详情：
  页面扩展。
  该 Hook 接收一个函数，在参数中会收到一个 Page 实例。
  该 Hook 可以用来在 `Page` 对象上添加额外的属性，或修改现有的属性等。
  值得一提的是，针对 `page.data` 和 `page.routeMeta` 的改动可以在客户端代码中使用。

:::

```js
module.exports = () => {
  return {
    name: 'vuepress-plugin-ordered-header',
    extendsPage: (page) => {
      // 实现扩展逻辑
    }
  }
}
```

## 实现功能

`headers: PageHeader[]` 数据结构如下：

```ts
interface PageHeader {
  level: number
  title: string
  slug: string
  children: PageHeader[]
}
```

每个标题下的子标题会被放入 `children` 数组，因此需要利用递归实现。

1. 首先初始化一个计数数组 `counter`，代表 `h1` ~ `h6` 6 个标题层级。
2. 在每个标题层级上，首先将对应的层级计数器加一（即 `counter[level] = (counter[level] || 0) + 1`）。
3. 然后对于比当前层级更深的计数器（即该标题的子标题）进行重置（即 counter[i] = undefined）。
4. 再利用 `counter` 数组给标题增加序号。
5. 最后返回处理好的 `page` 对象。

```js
module.exports = () => {
  return {
    name: 'vuepress-plugin-ordered-header',
    extendsPage: (page) => {
      const counter = Array(6).fill(undefined)

      const reorderHeaders = (headers) => {
        headers.forEach((header) => {
          const level = header.level - 1

          counter[level] = (counter[level] || 0) + 1

          // reset level
          for (let i = level + 1; i < counter.length; i++) {
            counter[i] = undefined
          }

          header.title = `${counter.filter(Number).join('.')} ${header.title}`

          if (header.children) reorderHeaders(header.children)
        })
      }

      reorderHeaders(page.headers)

      return page
    }
  }
}
```
