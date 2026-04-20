---
title: 组件的 v-model
date: 2022-05-26
category:
  - Vue
tag:
  - 深入组件
---

> Vue@3.x 移除了 `.sync` 修饰符，取而代之的是使用 `v-model` 进行组件双向绑定。

Vue 默认可以使用 `v-model` 使表单元素双向绑定，例如 `<input>` 输入框，实际上 `v-model` 帮我们完成了两件事：

```html
<input v-model="message" />
<!-- 等价于 -->
<input :modelValue="message" @input:modelValue="message = $event" />
```

但是 HTML 原生的输入元素类型并不总能满足需求。Vue 的组件系统允许你创建具有完全自定义行为且可复用的输入组件。这些输入组件可以和 `v-model` 一起使用实现双向绑定功能。

## `v-model` 参数

默认情况下，组件上的 `v-model` 使用 `modelValue` 作为 prop 和 `update:modelValue` 作为事件。

```html
<my-component v-model="title"></my-component>
<!-- 等价于 -->
<my-component :modelValue="title" @update:modelValue="title = $event"></my-component>
```

组件内需要有一个 `modelValue` prop 并发出 `update:modelValue` 事件：

```js
app.component("my-component", {
  props: {
    modelValue: String
  },
  emits: ["update:modelValue"],
  template: `
    <input
      type="text"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  `
})
```

如果想修改默认 `modelValue` 这个名称，可以通过向 `v-model` 传递参数：

```html
<my-component v-model:name="title"></my-component>
```

现在组件中的 prop 会变成 `name` 并且发出 `update:name` 事件。

## 绑定多个 `v-model`

每个 `v-model` 将同步到不同的 prop，而不需要在组件中添加额外的选项：

```html
<user-name
  v-model:first-name="firstName"
  v-model:last-name="lastName"
></user-name>
```

```js
app.component('user-name', {
  props: {
    firstName: String,
    lastName: String
  },
  emits: ['update:firstName', 'update:lastName'],
  template: `
    <input 
      type="text"
      :value="firstName"
      @input="$emit('update:firstName', $event.target.value)"
    />

    <input
      type="text"
      :value="lastName"
      @input="$emit('update:lastName', $event.target.value)"
    />
  `
})
```