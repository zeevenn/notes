---
title: monaco-editor/react
date: 2024-08-09
icon: code
category:
  - practice
tag:
  - code editor
---

[Monaco Editor](https://github.com/microsoft/monaco-editor) 是由微软开发的开源代码编辑器，使用于 VS Code。然而他本身是用 JavaScript/TypeScript 编写的一个独立库，提供了丰富的 API 来实现代码编辑器的功能。因此无法直接在 React 中使用。

[@monaco-editor/react](https://github.com/suren-atoyan/monaco-react) 这个库是对 monaco-editor 的 React 封装，使得你在 React 项目中更方便地使用 Monaco Editor。

## 工作原理

Monaco Editor (`monaco-editor`)：提供了编辑器的核心功能，包括代码高亮、自动补全、语法检查等。它是独立于框架的，可以在任何 JavaScript 环境中使用。它提供了一个全局的 monaco 对象，通过这个对象，你可以调用各种 API 来配置和操作编辑器。

React 封装 (`@monaco-editor/react`)： 为了更好地在 React 环境中使用 Monaco Editor，`@monaco-editor/react` 通过封装组件的方式，将 `monaco-editor` 的 API 暴露给 React 用户。这个库管理了编辑器的生命周期和状态，使得 Monaco Editor 能够很好地与 React 的组件生命周期和状态管理系统配合使用。

具体来说，`@monaco-editor/react` 主要做了以下几件事情：

- 组件化封装：提供了一个 `Editor` 组件，供 React 开发者使用。你可以通过 JSX 的方式直接在 React 组件中嵌入 Monaco Editor。
- API 接口简化：提供了一些简单的 props 来配置编辑器，而不需要直接调用 `monaco` 对象。
- 生命周期管理：处理了编辑器的创建、更新和销毁，使得它与 React 的生命周期方法（如 `componentDidMount`、`componentWillUnmount`）配合良好。

## 示例

在 React 中使用 `@monaco-editor/react` 时，你不需要手动管理 monaco 对象的创建和销毁，只需要通过 `Editor` 组件来设置语言、主题、默认代码等配置项。比如：

```tsx
import React from 'react'
import Editor from '@monaco-editor/react'

function MyEditor() {
  return <Editor height="90vh" language="javascript" theme="vs-dark" value="// Start coding here" />
}

export default MyEditor
```

如果你需要进行更复杂的定制化操作，比如加载自定义语言或主题，`@monaco-editor/react` 也提供了 `beforeMount` 和 `onMount` 回调函数，让你可以直接访问 `monaco` 对象来进行高级配置：

```tsx
<Editor
  height="90vh"
  language="javascript"
  theme="vs-dark"
  beforeMount={(monaco) => {
    // 这里可以对 monaco 进行配置，例如定义自定义的语言或主题
  }}
  onMount={(editor, monaco) => {
    // 这里可以操作 editor 和 monaco 对象，例如注册快捷键等
  }}
/>
```

## loader-config

`@monaco-editor/react` 的 loader 会默认从 cdn 中加载，这会影响中国用户的访问速度，因此需要修改 loader 的默认配置。

### 使用 monaco-editor 包

如果项目使用 `webpack` 进行打包，可以通过 [monaco-editor-webpack-plugin](https://www.npmjs.com/package/monaco-editor-webpack-plugin) 来进行配置。该插件自动处理编辑器了相关的文件。

```js
import * as monaco from 'monaco-editor'
import { loader } from '@monaco-editor/react'

loader.config({ monaco })
```

对于其他打包工具，官方提供了 Vite 示例：

```js
import { loader } from '@monaco-editor/react'

import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') {
      return new jsonWorker()
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker()
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new htmlWorker()
    }
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker()
    }
    return new editorWorker()
  }
}

loader.config({ monaco })

loader.init().then(/* ... */)
```

我使用了 Rspack 来打包，官方说明对 `monaco-editor-webpack-plugin` 插件进行了兼容，但是不知道是由于我 Rspack 版本问题，导致报错，因此实验了一种更加稳定的方式如下。

Rspack 配置与 Vite 一致，详细见 [Rspack demo monaco-editor-react](https://github.com/rspack-contrib/rspack-examples/blob/main/rspack/monaco-editor-ts-react/src/components/Editor.tsx)。

::: warning

需要注意的是 `publicPath` 需要设置为 `'auto'`，否则 web worker 内引用的文件会添加重复路径。

See [Rspack output.publicPath](https://rspack.dev/config/output#outputpublicpath)。

:::

### ~~本地路径~~

::: tip

该方式会在 public 中引入大量文件，不太优雅。

:::

`monaco-editor` 中提供了一些打包后的文件，路径是 `monaco-editor/min/vs`，因此可以通过下载 npm 包并将文件移动至 `public` 文件夹，并自定义路径。

```shell
mv node_modules/monaco-editor/min/vs public
```

```js
import { loader } from '@monaco-editor/react'

// you can change the source of the monaco files
loader.config({ paths: { vs: './vs' } })

// you can configure the locales
loader.config({ 'vs/nls': { availableLanguages: { '*': 'de' } } })

// or
loader.config({
  paths: {
    vs: './vs'
  },
  'vs/nls': {
    availableLanguages: {
      '*': 'de'
    }
  }
})
```
