---
title: 动态组件和异步组件
date: 2022-05-25
category:
  - Vue
tag:
  - 深入组件
---

## 动态组件

有时需要点击标签切换不同组件，这时可以使用 Vue-Router 实现，但其实还有另外两个不同的实现思路：

* 通过 `v-if` 判断显示不同的组件；
* 动态组件

### `v-if`

当组件返回单个根节点时，非 prop 的 attribute 会自动添加到根节点的 attribute 中。例如在 date-picker 组件实例中：

```html
<template v-if="currentTab === 'home'">
  <home></home>
</template>

<template v-else-if="currentTab === 'about'">
  <about></about>
</template>

<template v-else>
  <category></category>
</template>
```

但当标签变多时，这种方法就显得非常繁琐。下面使用动态组件实现。

### 动态组件

动态组件使用 `component` 组件，并通过 attribute `is` 控制显示哪个组件。

```html
<component :is="currentTab"></component>
```

在上述示例中，currentTab 可以包括：

* 已注册组件的名字；
* 一个组件选项对象。

### `keep-alive`

当在这些组件之间切换的时候，有时候会想保持某些组件的状态，以免重复渲染造成的性能问题。这时可以使用 `keep-alvie` 内置组件将其包裹起来：

```html
<!-- 失活的组件将会被缓存！-->
<keep-alive>
  <component :is="currentTab"></component>
</keep-alive>
```

#### `keep-alive` 属性

`keep-alive` 有一些属性：

* `include` - String | RegExp | Array：只有名称匹配的组件会被缓存；
* `exlcude` - String | RegExp | Array：任何匹配的组件都不会被缓存；
* `max` - number | string：最多可以缓存都少组件实例，一旦超过最大值，那么缓存组件最远没有访问的实例将会被销毁。

> `include`、`exclude` 首先检查组件自身的 `name` 选项。

#### 缓存组件的生命周期

对于缓存组件来说，再次进入时，不会执行 `create` 或 `mounted` 等生命周期函数。

但是有时候确实希望监听到何时重新进入到了组件，何时离开了组件，此时可以使用 `activated` 和 `deactivated` 监听。

```js
activated() {
  console.log('activated')
},
deactivated() {
  console.log('deactivated')
}
```

## 异步组件

默认情况下，在构建整个组件树的过程中，因为组件和组件之间是通过模块化直接依赖的，那么 webpack 在打包过程中会将组件模块打包到一个文件中（比如 app.js）。

但是当项目不断扩大，app.js 文件的内容过大，会造成首屏渲染速度过慢。

因此我们希望在打包的过程中，对一些不需要立即使用的组件，可以单独对他们进行拆分，拆分成一个个小的代码块 chunk.js。这些 chunk.js 代码会在需要时从服务器下载下来使用。

为了实现这个效果，Vue 有一个 `defineAsyncComponent` 方法：

```js
import { createApp, defineAsyncComponent } from 'vue';

const AsyncComp = defineAsyncComponent(() => 
  import("./AsyncComp.vue")
)

createApp({
  // ...
  components: {
    AsyncComponent
  }
})
```