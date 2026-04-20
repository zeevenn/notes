---
title: 插槽
date: 2022-05-25
category:
  - Vue
tag:
  - 深入组件
---

在开发中，我们经常封装一个个可复用的组件，可以通过 `props` 给组件传递一些数据，让组件来进行展示。但是为了让这个组件具备更强的通用性，不能将组件中的内容限制为固定的 `div`、`span` 等这些元素。比如有时我们想要组件展示按钮，有时想要组件显示图片。这时就需要用到插槽。

## 基本使用

为了使组件的内容更加自定义，Vue 提供了 `<slot>` 插槽。

```html
<navigation-link url="/profile">
  Your Profile
</navigation-link>
```

```html
<!-- avigation-link 组件内 -->
<a
  v-bind:href="url"
  class="nav-link"
>
  <slot>default content</slot>
</a>
```

组件内的内容（在这里是 `Your Profile`）会自动替换插槽，而如果组件内没有提供任何内容，则会显示`<slot>` 内的默认内容。

## 具名插槽

具名插槽可以指定内容应该插入的位置。

```HTML
<div class="container">
  <header>
    <!-- 我们希望把页头放这里 -->
  </header>
  <main>
    <!-- 我们希望把主要内容放这里 -->
  </main>
  <footer>
    <!-- 我们希望把页脚放这里 -->
  </footer>
</div>
```

对于这样的情况，`<slot>` 元素有一个特殊的 attribute：`name`。这个 attribute 可以用来定义额外的插槽：

```HTML
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```

一个不带 `name` 的 `<slot>` 出口会带有隐含的名字“default”。

在向具名插槽提供内容的时候，应该在一个 `<template>` 元素上使用 `v-slot` 指令，并以 `v-slot` 的参数的形式提供其名称：

```HTML
<base-layout>
  <template v-slot:header>
    <h1>Here might be a page title</h1>
  </template>

  <p>A paragraph for the main content.</p>
  <p>And another one.</p>

  <template v-slot:footer>
    <p>Here's some contact info</p>
  </template>
</base-layout>
```

现在 `<template>` 元素中的所有内容都将会被传入相应的插槽。任何没有被包裹在带有 `v-slot` 的 `<template>` 中的内容都会被视为默认插槽的内容。

然而，如果你希望更明确一些，仍然可以在一个 `<template>` 中包裹默认插槽的内容：

```HTML
<base-layout>
  <template v-slot:header>
    <h1>Here might be a page title</h1>
  </template>

  <template v-slot:default>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </template>

  <template v-slot:footer>
    <p>Here's some contact info</p>
  </template>
</base-layout>
```

`v-slot` 也有缩写，即把参数之前的所有内容 (`v-slot:`) 替换为字符 `#`。例如 `v-slot:header` 可以被重写为 `#header`：

```html
<base-layout>
  <template #header>
    <h1>Here might be a page title</h1>
  </template>

  <p>A paragraph for the main content.</p>
  <p>And another one.</p>

  <template #footer>
    <p>Here's some contact info</p>
  </template>
</base-layout>
```

任何一种写法都会渲染出：

```HTML
<div class="container">
  <header>
    <h1>Here might be a page title</h1>
  </header>
  <main>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </main>
  <footer>
    <p>Here's some contact info</p>
  </footer>
</div>
```

注意：**`v-slot` 只能添加在 `<template>` 上**，除了[独占默认插槽](#独占默认插槽)。

## 编译作用域

当你想在一个插槽中使用数据时，例如：

```html
<todo-button>
  {{ item }}
</todo-button>
```

该插槽可以访问与模板其余部分相同的实例 property (即相同的“作用域”)。

![编译作用域](./img/0003/scope.png)

插槽**不能**访问 `<todo-button>` 的作用域。例如 `url` 是访问不到的：

**TodoButton.vue**

```vue
<template>
  <button>
    <slot>Default</slot>
  </button>
</template>

<script>
export default {
  data() {
    return {
      title: "TodoButton"
    }
  }
}
</script>
```

**Parent Component**

```html
<todo-button>
  {{ title }}
  <!--
  `title` 将会是 undefined，因为这个内容
  而不是在 <todo-button> 中定义的。
  -->
</todo-button>
```

> 父级模板里的所有内容都是在父级作用域中编译的；子模板里的所有内容都是在子作用域中编译的。

## 作用域插槽

有时让插槽内容能够访问子组件中才有的数据是很有用的。当一个组件被用来渲染一个数组时，我们希望能够自定义每个 `item` 的渲染方式。

比如有一个 `TodoList` 组件：

```js
app.component('todo-list', {
  data() {
    return {
      items: ['Feed a cat', 'Buy milk']
    }
  },
  template: `
    <ul>
      <li v-for="(item, index) in items">
        {{ item }}
      </li>
    </ul>
  `
})
```

我们可能会想把 `{{ item }}` 替换为 `<slot>`，以便在父组件上对其自定义。

```html
<todo-list>
  <span class="green">{{ item }}</span>
</todo-list>
```

但这是行不通的，因为由于编译作用域，只有在 `<todo-list>` 内部才能访问到 `item`，但插槽内容是在它的父组件上提供的。

要使 `item` 在父级提供的插槽内容上可用，我们可以在 `<todo-list>` 中添加一个 `<slot>` 元素并将其作为一个 attribute 绑定：

```diff
  <ul>
    <li v-for="(item, index) in items">
-     {{ item }}
+     <slot :item="item"></slot>
    </li>
  </ul>
```

现在就可以根据自己的需要自定义插槽的内容了。在父级作用域中，可以使用**带值的 `v-slot`** 来定义提供的插槽 prop 名字：

```html
<todo-list>
  <template v-slot:default="slotProps">
    <span class="green">{{ slotProps.item }}</span>
  </template>
</todo-list>
```

![作用域插槽](./img/0003/scoped-slot.png)

> 插槽 prop 的对象可以任意命名，比如 `v-slot:default="any"`。

### 独占默认插槽

在上述情况下，当被提供的内容**只有**默认插槽时，组件的标签才可以被当作插槽的 `<template>` 来使用。这样我们就可以把 `v-slot` 直接用在组件上：

```HTML
<todo-list v-slot:default="slotProps">
  <span class="green">{{ slotProps.item }}</span>
</todo-list>
```

这种写法还可以更简单。就像假定未指明的内容对应默认插槽一样，不带参数的 `v-slot` 被假定对应默认插槽：

```HTML
<todo-list v-slot="slotProps">
  <span class="green">{{ slotProps.item }}</span>
</todo-list>
```

但是只要出现多个插槽，就**必须**使用完整的基于 `<template>` 的语法：

```HTML
<todo-list>
  <template v-slot:default="slotProps">
    <span class="green">{{ slotProps.item }}</span>
  </template>

  <template v-slot:other="otherSlotProps">
    ...
  </template>
</todo-list>
```

### 解构插槽 Prop

作用域插槽的内部工作原理是将你的插槽内容包裹在一个拥有单个参数的函数里：

```js
function (slotProps) {
  // 插槽内容
}
```

这意味着 `v-slot` 的值实际上可以是任何能够作为函数定义中的参数的 JavaScript 表达式。所以可以使用 ES2015 解构来传入具体的插槽 prop，如下：

```HTML
<todo-list v-slot="{ item }">
  <span class="green">{{ item }}</span>
</todo-list>
```

这样可以使模板更简洁，尤其是在该插槽提供了多个 prop 的时候。它同样开启了 prop 重命名等其它可能，例如将 `item` 重命名为 `todo`：

```HTML
<todo-list v-slot="{ item: todo }">
  <span class="green">{{ todo }}</span>
</todo-list>
```

你甚至可以定义后备内容，用于插槽 prop 是 undefined 的情形：

```HTML
<todo-list v-slot="{ item = 'Placeholder' }">
  <span class="green">{{ item }}</span>
</todo-list>
```