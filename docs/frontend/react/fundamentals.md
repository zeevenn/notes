---
title: react fundamentals
date: 2025-06-10
icon: state
category:
  - react
tag:
  - react fundamentals
---

## Hello Word

### In JS

在使用 react 之前，我们通常会使用原生 js 来写一些简单的页面。

```html
<div id="root"></div>
```

```js
const rootElement = document.getElementById('root')
const element = document.createElement('div')

element.className = 'container'
element.textContent = 'Hello Word'

rootElement.appendChild(element)
```

### In React

React 按照原生 DOM 的操作逻辑，使用 `createElement` 方法来创建元素，并使用 `render` 方法来渲染元素。

```js
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'

const rootElement = document.getElementById('root')
const element = createElement('div', { className: 'container' }, 'Hello Word')

createRoot(rootElement).render(element)
```

> [!TIP]
>
> React 是一个跨平台的框架，用于描述 UI 结构和状态逻辑。而 React DOM 是 React 的 DOM 渲染器，用于在浏览器中渲染 React 组件。类似的还有 React Native，用于在移动端渲染 React 组件。

`createElement` 方法的第一个参数是标签名，第二个参数是属性 `props`，第三个参数（以及后续参数）会被收集起来，作为子元素 `children`。

### 嵌套

若要实现一个深度嵌套的组件，需要一层一层的嵌套，这样代码会变得非常臃肿，类似下面这样：

```js
// <div class="container">
// 	<p>Nested list</p>
// 	<ul class="content">
// 		<li>This is a nested list item</li>
// 		<li>This is a nested list item</li>
// 	</ul>
// </div>

import { createElement } from 'react'
import { createRoot } from 'react-dom/client'

const rootElement = document.getElementById('root')

const element = createElement(
  'div',
  { className: 'container' },
  createElement('p', null, 'Nested list'),
  createElement(
    'ul',
    { className: 'content' },
    createElement('li', null, 'This is a nested list item'),
    createElement('li', null, 'This is a nested list item')
  )
)

createRoot(rootElement).render(element)
```

因此 React 提供了 JSX 语法，让我们可以更方便地编写组件。

> [!TIP]
>
> 在 JSX 中，`className` 表示类名，而不是 HTML 中的 `class`，因为在 JavaScript 中，`class` 是保留字，且 DOM 的类名属性是 `className`。

## JSX

JSX 是 React 的语法扩展，允许我们在 JavaScript 中使用类似于 HTML 的语法来描述 UI 结构。在生产环境中，打包工具（如 [Webpack](https://webpack.js.org/)、[Vite](https://vite.dev/)）会使用 [babel](https://babeljs.io/) 自动将 JSX 转换为 `createElement` 方法调用。

![babel](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20250610120118.png)

上面复杂嵌套结构在 JSX 中可以简化为：

```jsx
const element = (
  <div className="container">
    <p>Nested list</p>
    <ul className="content">
      <li>This is a nested list item</li>
      <li>This is a nested list item</li>
    </ul>
  </div>
)

createRoot(rootElement).render(element)
```
### 插值

类似模板字符串，JSX 中也可以使用插值。你可以在里面写 JavaScript 表达式。

```jsx
const world = 'World'
const element = <h1>Hello, {world}</h1>
```

### Spread

Spread 允许你将一个对象的所有属性复制到另一个对象。因此，如果有一个对象 `props`，你可以将它展开，然后传递给 `createElement` 方法。

```js
const children = 'Hello World'
const className = 'container'
const props = { children, className }
const element = React.createElement('div', { ...props })
```

在 JSX 中，也可以使用该特性，将 `props` 展开。

```jsx
const children = 'Hello World'
const className = 'container'
const props = { children, className }
const element = <div {...props} />
```

### Fragment

React Fragments 允许你将多个元素组合在一起，而不会添加额外的 DOM 节点。这让你可以在组件中返回多个元素，而无需使用额外的 `div` 包装。这在避免不必要的标记影响样式或布局时非常有用。

```jsx
const element = (
  <Fragment>
    <h1>Hello, World</h1>
    <p>This is a paragraph.</p>
  </Fragment>
)
```

也可以使用空标签 `<></>` 来代替 `Fragment`。

```jsx
const element = (
  <>
    <h1>Hello, World</h1>
    <p>This is a paragraph.</p>
  </>
)
```

## 组件

如果我们需要生成以下的 DOM 结构：

```html
<div class="container">
	<div class="message">Hello World</div>
	<div class="message">Goodbye World</div>
</div>
```

我们可以使用组件来生成这个结构。到目前为止，`createElement` 的第一个参数都只传入了一个字符串，表示标签名。但是，它还可以接受一个函数，这个函数会返回需要渲染的结构。

```js
createElement(
	someFunction,
	{ prop1: 'value1', prop2: 'value2' },
	'child1',
	'child2',
)
```

`someFunction` 会以 `props` 对象作为第一个参数，而 `children` 会作为 `props` 对象的 `children` 属性。

```ts
function someFunction(props) {
	props.children // ['child1', 'child2']
	props.prop1 // 'value1'
	props.prop2 // 'value2'
	return // some jsx
}
```

这样即可实现组件的复用。

```js
function message({ children }) {
  return <div className="message">{children}</div>
}

const element = (
  <div className="container">
    {React.createElement(message, { children: 'Hello World' })}
    {React.createElement(message, { children: 'Goodbye World' })}
  </div>
)
```

我们想在 JSX 中像 `div` 一样使用这个组件：

```jsx
const element = <message>Hello World</message>
```

`Babel` 负责将 JSX 组件编译成 `createElement` 调用。如果我们尝试 `<message>Hello World</message>`，`Babel` 会这样做：

```jsx
const element = <message>Hello World</message>

// the desired output
const element = createElement(message, { children: 'Hello World' })

// the actual output
const element = createElement('message', { children: 'Hello World' })
```

因此，我们只需要告诉 `Babel` 如何编译我们的 JSX，让它通过函数名而不是字符串来传递函数。下面是一些 `Babel` 输出的 JSX 示例：

```jsx
element = <Capitalized /> // createElement(Capitalized)
element = <property.access /> // createElement(property.access)
element = <Property.Access /> // createElement(Property.Access)
element = <Property['Access'] /> // SyntaxError
element = <lowercase /> // createElement('lowercase')
element = <kebab-case /> // createElement('kebab-case')
element = <Upper-Kebab-Case /> // createElement('Upper-Kebab-Case')
element = <Upper_Snake_Case /> // createElement(Upper_Snake_Case)
element = <lower_snake_case /> // createElement('lower_snake_case')
```

因此，最终需要将组件名首字母大写，这样 `Babel` 才会将它编译成 `createElement` 调用。

```jsx
function Message({ children }) {
  return <div className="message">{children}</div>
}

const element = (
  <div className="container">
    <Message>Hello World</Message>
    <Message>Goodbye World</Message>
  </div>
)
```

> [!TIP]
>
> Components are functions which accept an object called `props` and return something that is renderable.
>
> --- from [Kent C. Dodds](https://x.com/kentcdodds/status/1763606427028136131)
