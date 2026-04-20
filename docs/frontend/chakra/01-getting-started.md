---
title: 快速开始
date: 2024-03-07
icon: STARTUP
category:
  - chakra
tag:
  - frontend
  - atomic css
  - chakra
---

[Chakra UI](https://chakra-ui.com/) 是一个简单、模块化和可访问的组件库，可提供构建 React 应用程序所需的组件。

::: tip 总结

非常灵活自由，但有一定上手门槛。

:::

## 设计原则

Chakra UI 建立在保持组件一致性的原则之上。了解这些概念将有助于您更好地为 Chakra UI 做出贡献。

我们的目标是设计简单、可组合的组件，以解决现实生活中的用户界面设计问题。为此，我们制定了一系列原则，帮助我们始终沿着这条道路前进。

- Style Props：所有组件的样式都可以通过 `style props` 覆盖或扩展，以减少 `css prop` 或 `styled()` 的使用。从 Box 中组合新组件。
- 简单：努力保持组件应用程序接口（API）相当简单，并展示组件在现实世界中的使用场景。
- 组合：将组件分解成具有最小道具的较小部分，以降低复杂性，并将它们组合在一起。这将确保样式和功能的灵活性和可扩展性。
- 可访问性：创建组件时，应将可访问性放在首位。这包括键盘导航、焦点管理、色彩对比、语音播报以及正确的 `aria-*` 属性。
- 暗色模式：使组件兼容暗色模式。使用 `useColorMode` 钩子处理样式。了解有关 [暗色模式](https://chakra-ui.com/docs/styled-system/color-mode) 的更多信息。
- `Naming Props`：命名是最难的事情。一般来说，要确保 `prop name` 能说明其作用。`Boolean prop` 应使用助动词命名，如 `does`、`has`、`is` 和 `should`。例如，按钮使用 `isDisabled`、`isLoading` 等。

## 对比

### Tailwind CSS

#### 总览

[Tailwind CSS](https://tailwindcss.com/)：CSS 框架，提供原子 CSS 类，帮助你为组件设计样式、可访问性、组件组成、键盘导航、样式重写等。

Chakra UI：一个由精心创建的 React 组件组成的库，具有 Tailwind 的所有样式优势，并能处理所有细节。

#### 学习曲线

Tailwind CSS：如果你有过 Bootstrap 或 Bulma CSS 背景，你可能会发现学习 Tailwind 非常容易。但是，如果你是 `styled-components` 或 `emotion` 背景，学习曲线可能会相当陡峭。

Chakra UI：Chakra UI 采用非常直观、类似 CSS 和基于 `prop` 的组件样式模型，因此很容易上手。组件名称和 `prop` 名称也非常容易理解。

#### 响应式

Tailwind CSS：在 Tailwind 中创建响应式样式需要结合伪类。随着项目的增长，这可能会变得相当冗长。

```html
<img class="w-16 md:w-32 lg:w-48" src="..." />
```

Chakra UI：以非常简单直观的方式创建响应式样式。可以使用数组或对象符号：

```jsx
<Img w={[16, 32, 48]} src="...">
<Img w={{ base：16, md：32, lg：48 }} src="..." />
```

#### 样式覆盖

在大多数应用中，为满足设计要求而覆盖特定上下文的样式是一项常见的挑战。

Tailwind CSS：鉴于 Tailwind 是一个 CSS 实用框架，你可能需要找出覆盖特定 classNames 或编写自定义 CSS 的最佳方法。

Chakra UI：Chakra UI 的样式是基于 `prop` 的，因此覆盖就像传递 `prop` 一样简单。

#### 可访问性

如前所述，Tailwind CSS 只是一个 CSS 框架，类似于 Bootstrap 或 Bulma CSS。这样，用户就可以处理语义 html 结构、满足 WAI-ARIA 要求、键盘导航等。

Chakra 不仅提供了 Tailwind 的便利性，还具有其他所有优点。

#### 暗色模式

Tailwind CSS：所有组件均与暗色模式兼容。

Chakra UI：所有组件均兼容明暗模式。还可以在整个应用程序中创建自己的明暗模式体验。

### Theme UI

Chakra UI 深受 Theme UI 的启发，并遵循系统 UI 规范。

与 Theme UI 相比，Chakra UI 提供了更多组件、改进的样式 API、可访问性和直观的组件 API。

可以将 Chakra 视为更强大的 Theme UI 版本，它充分利用了 `styled-system` 的全部功能，提供更好的组件样式和主题。

### Material UI

Material UI React 库为用户提供了大量 UI 布局工具，但其最著名的地方在于它提供了大量预设样式的 UI 组件，开发人员可以在这些组件上应用自定义样式来覆盖开箱即用的基础样式。

Chakra UI 是一个更强大、更注重布局的库，它也为开发人员提供了与 Material UI 类似的 UI 组件，但更注重创建灵活、可组合和可扩展的代码。

在比较这两个框架时，需要考虑的一个核心概念是 "易于修改"。

相比之下，Material UI 为与导出组件和布局相关的单个 HTML 标签添加了更多的类，这迫使开发人员在定制界面时不得不与基本样式作斗争。

Chakra 为开发人员提供了更大的自由度来操作导出组件和布局的 CSS 类，而且通常只需较少的代码即可完成。

例如，Material UI 需要单独的代码来控制基于视口变化的响应式样式，而 Chakra 提供了内置的响应式样式支持，无需创建 CSS 类或媒体查询。

如果自定义样式并不是项目的主要关注点，Material UI 则是有益的，因为您可以避免创建该库所提供的自定义组件。

如果可扩展的自定义设计对您的项目很重要（很多时候确实如此），Chakra 对开发人员的便利性比 Material UI 更为突出，尤其是在项目随时间扩展的情况下。

### Ant Design

Ant Design React 库是 ant.design 设计语言的实现。这意味着组件遵循现有的设计规则和值，只允许在有限的范围内自定义某些变量。

Chakra 不受任何设计系统的束缚，可以更自由地定制组件，实现自己的设计。

#### 样式组件

Ant Design 组件是为开箱即用而构建的，因此它们的特定样式 `prop` 和自定义功能非常有限。

另一方面，Chakra 组件的主要风格化方式是将样式作为 `prop`。

以按钮组件为例。Chakra Button 的 `colorScheme`（色彩主题）道具在默认情况下有许多不同的值，您可以对其进行自定义和/或扩展，以应用自己的设计。

相比之下，您需要记住，Antd Design 按钮只有在拥有 `primary prop` 和 `danger prop` 的情况下才能着色，而不能因为 Ant Design 的现有设计值而着色。

同样的模式也可以在布局、表单和排版等其他组件中看到。

#### 设置和自定义

Ant Design 有一长串可修改的默认变量，包括颜色、页边距、边距、动画、阴影、边框、屏幕尺寸、尺寸等，有些是通用变量，有些则是用户界面组件的特定变量。为了尊重底层设计规范，除修改这些现有变量外，不建议进行其他自定义操作。

Chakra 的特点是所有全局和组件样式默认值都可以轻松定制/扩展。可以为每个组件定义新的尺寸或变体。此外，您还可以使用 Chakra Factory 从现有组件甚至非 Chakra 组件中组合出新的组件。
