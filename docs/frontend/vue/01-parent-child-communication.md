---
title: 父子组件通信
date: 2022-05-23
category:
  - Vue
tag:
  - 组件通信
  - 深入组件
---

## 父传子 `props`

父组件向子组件传值，通过 `props` 属性。这个属性可以在**子组件**上注册一些自定义的 `attribute`。父组件给这些 `attribute` 赋值，子组件通过 `attribute` 的名称获取到对应的值。

`props` 有两种用法：

* 字符串数组：字符即为 `attribute` 的名称
* 对象类型：指定 `attribute` 名称的同时，指定传递的类型、是否必须、默认值、校验等等。

```js
// 字符串数组
props: ['title', 'content']
```

```js
// 对象类型
props: {
  // 基础的类型检查，null 和 undefined 会通过任何类型的检查
  propsA: Number,
  // 多个可能的类型
  propsB: [String, Number],
  // 必填的字符串
  propsC: {
    type: String,
    required: true
  },
  // 带有默认值的数字
  propsD: {
    type: Number,
    default: 100
  },
  // 带有默认值的对象
  propsE: {
    type: Object,
    default() {
      // 对象或数组默认值必须从一个工厂函数获取
      return { message: "hello" }
    }
  },
  // 自定义验证函数
  propsF: {
    validator(value) {
      // 这个值必须匹配下列字符串的一个
      return ['success', 'waring', 'danger'].includes(value)
    }
  },
  propsG: {
    type: Function,
    // 与对象或数组的默认值不同，这不是一个工厂函数，而是一个用作默认值的函数
    default() {
      return 'Default Function'
    }
  }
}
```

### 传值

当在父组件用 `prop` 给子组件传值时，除了字符串类型可以静态传值，其他类型都需要使用 `v-bind` 动态绑定告诉 Vue 这不是一个字符串。

当需要传递一个对象的所有 property 的时候，可以丢弃 `v-bind` 参数：

```JS
post: {
  id: 1,
  title: 'My Journey with Vue'
}
```

```HTML
<blog-post v-bind="post"></blog-post>

<!-- 等价于 -->

<blog-post
  v-bind:id="post.id"
  v-bind:title="post.title"
></blog-post>
```

### 单向数据流

所有的 `prop` 都使得其父子 `prop` 之间形成了一个**单向下行绑定**：父级 `prop` 的更新会向下流动到子组件中，但是反过来则不行。这样会防止从子组件意外变更父级组件的状态，从而导致应用的数据流向难以理解。

而且，每次父级组件发生变更时，子组件中所有的 `prop` 都将会刷新为最新的值。这意味着**不**应该在一个子组件内部改变 `prop`。

这里有两种常见的试图变更一个 prop 的情形：

1. **这个 `prop` 用来传递一个初始值；这个子组件接下来希望将其作为一个本地的 prop 数据来使用**。在这种情况下，最好定义一个本地的 data property 并将这个 `prop` 用作其初始值：

   ```js
   props: ['initialCounter'],
   data: function () {
     return {
       counter: this.initialCounter
     }
   }
   ```

2. **这个 prop 以一种原始的值传入且需要进行转换**。在这种情况下，最好使用这个 prop 的值来定义一个计算属性：

   ```js
   props: ['size'],
   computed: {
     normalizedSize: function () {
       return this.size.trim().toLowerCase()
     }
   }
   ```

> 注意在 JavaScript 中对象和数组是引用类型，所以对于一个数组或对象类型的 prop 来说，在子组件中改变变更这个对象或数组本身**将会**影响到父组件的状态。

如果确实需要实现父子组件中某一个 `prop` 的双向绑定，应该通过**自定义事件**（子向父通信）实现。

### 命名

HTML 中对 `attribute` 的大小写是不敏感的，浏览器会把所有大写字符解释为小写字符，这意味着当在使用在 DOM 中的模板时，驼峰命名的 `props` 需要使用等价的短横线命名。

```html
<child-comp messageInfo="camelCase"></child-comp>
<!-- 等价于 -->
<child-comp message-info="kebab-case"></child-comp>
```

因此推荐使用短横线命名，在 .vue 文件中驼峰命名生效的原因在于 Vue 给我们做了转换。

## 子传父 `$emit`

子组件自定义事件，通过 `$emit` 触发。大致用法如下：

```js
this.$emit('myEvent')
```

```html
<my-component @my-event="doSomething"></my-component>
```

不同于 Vue@2.x 的是，自定义事件现在和 `props` 一样，需要先定义 `emits`，然后由子组件发出，最后再父组件接受。

```js
Vue.component('child-comp1', {
  template: `
    <button @click="increment">+1</button>
    <button @click="decrement">-1</button>
  `,
  emits: ['add', 'sub'],
  methods: {
    increment() {
      console.log("+1");
      this.$emit("add");
    },
    decrement() {
      console.log("-1");
      this.$emit("sub");
    },
  }
})
```

同样 `emits` 也能使用对象类型定义，能够添加对指定事件的验证。

```js
Vue.component('child-comp2', {
  template: `
    <input type="text" v-model.number="num">
    <button @click="incrementN">+1</button>
  `,
  emits: {
    // 当参数大于 10 时，才触发
    addN: (num) => {
      if (num > 10) {
        return true;
      }
      return false;
    }
  },
  data() {
    return {
      num: 0
    }
  },
  methods: {
    incrementN() {
      console.log("+N");
      this.$emit("addN", this.num);
    }
  }
})
```