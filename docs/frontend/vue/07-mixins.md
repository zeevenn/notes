---
title: Mixin
date: 2022-05-26
category:
  - Vue
tag:
  - 组合式 API
---

## 基本使用

Mixin 可以分发 Vue 组件中的可复用功能。一个 mixin 对象可以包含任意组件选项，当组件使用 mixin 对象时，所有 mixin 对象的选项都会混入该组件本身的选项中。

```js
const myMixin = {
  data() {
    return {
      title: "myMixin"
    }
  },
  created() {
    console.log("hello mixin");
  },
  methods: {
    foo() {
      console.log("mixin foo");
    }
  }
}

const app = Vue.createApp({
  mixins: [myMixin],
})
```

## 选项合并

当组件和 mixin 对象包含相同选项时，这些选项会以一定的规则合并。

### `data` 函数

当 mixin 和组件中都有 `data` 函数时，每个 `data` 函数都会被调用，并将返回结果合并。**当对象属性发生冲突时，会以组件自身的数据优先**。

```js
const myMixin = {
  data() {
    return {
      title: "myMixin",
      bar: "abc"
    }
  }
}

const app = Vue.createApp({
  mixins: [myMixin],
  data() {
    title: "app",
    foo: "def"
  },
  created() {
    console.log(this.$data) // => { title: "app", bar: "abc", foo: "def" }
  }
})
```

现在 Vue@3.x 中合并是浅层次的：

```js
const Mixin = {
  data() {
    return {
      user: {
        name: 'Jack',
        id: 1
      }
    }
  }
}

const CompA = {
  mixins: [Mixin],
  data() {
    return {
      user: {
        id: 2
      }
    }
  }
}
```

在 Vue@2.x 中，合并后的 `$data` 是：

```json
{
  "user": {
    "id": 2,
    "name": "Jack"
  }
}
```

在 Vue@3.x 中，结果是：

```json
{
  "user": {
    "id": 2
  }
}
```

### 钩子函数

当 mixin 对象和组件实例上都存在生命周期函数时，会将二者合并为一个数组，**因此都会被调用，但是 mixin 对象中的钩子会被先调用**。

```js
const myMixin = {
  created() {
    console.log("mixin created")
  }
}

const app = Vue.createApp({
  mixins: [myMixin],
  created() {
    console.log("app created")
  }
})

// => mixin created
// => app created
```

### 值为对象的选项

当 mixin 和组件实例都有值为对象的选项时，比如 `methods`、`computed` 等，那么他们将会**合并为一个对象，键名冲突时，取组件对象的键值对**。

```js
const myMixin = {
  methods: {
    foo() {
      console.log('foo')
    },
    conflicting() {
      console.log('from mixin')
    }
  }
}

const app = Vue.createApp({
  mixins: [myMixin],
  methods: {
    bar() {
      console.log('bar')
    },
    conflicting() {
      console.log('from self')
    }
  }
})

const vm = app.mount('#app')

vm.foo() // => "foo"
vm.bar() // => "bar"
vm.conflicting() // => "from self"
```

## 全局 mixin

当有一些功能需要所有组件都应用时，可以使用全局 mixin。Vue 提供了 mixin 的方法，可以为应用全局应用 mixin：

```js
app.mixin({
  created() {
    console.log("全局 mixin")
  }
})

const app = Vue.createApp({
  created() {
    console.log("app")
  }
})

// => 全局 mixin
// => app
```