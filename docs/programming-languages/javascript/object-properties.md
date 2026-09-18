---
title: 对象属性
date: 2022-08-25
icon: property
category:
  - JavaScript
tag:
  - language advanced
  - Object
---

读取对象属性时，通常是取出对象保存的一个值；但也可以让这次读取执行一段函数，再返回计算结果。这两种工作方式分别对应 **数据属性** 和 **访问器属性**。

## 数据属性：直接保存值

对象字面量中常见的 `name: '小王'` 就是数据属性：

```js
const user = {
  name: '小王'
}

console.log(user.name) // '小王'
user.name = '小李'
console.log(user.name) // '小李'
```

`name` 保存字符串，读取时返回这个值，赋值时替换这个值。数据属性也可以保存对象、数组或函数，不限于原始值。

## 访问器属性：读写时执行函数

### 用 getter 提供计算结果

订单总价取决于单价和数量。如果把总价单独存成一个值，每次修改数量后，还需要同步修改总价。可以把 `total` 定义成访问器属性，在读取时计算：

```js
const order = {
  price: 10,
  quantity: 2,

  get total() {
    return this.price * this.quantity
  }
}

console.log(order.total) // 20
order.quantity = 3
console.log(order.total) // 30
```

`get total()` 定义的函数叫 **getter（读取函数）**。访问 `order.total` 就会执行它，不需要写成 `order.total()`。

这里 `price`、`quantity` 是数据属性，`total` 是访问器属性。`total` 没有单独保存一个总价值，每次读取都重新计算。

### 用 setter 处理赋值

如果希望写入姓名时去掉两端空格，可以定义 **setter（写入函数）**，它接收赋值时传入的值：

```js
const user = {
  _name: '小王',

  get name() {
    return this._name
  },

  set name(value) {
    this._name = value.trim()
  }
}

user.name = '  小李  '
console.log(user.name) // '小李'
console.log(user._name) // '小李'
```

`_name` 是实际保存姓名的数据属性，`name` 是负责读写逻辑的访问器属性。下划线只是命名约定，不会让 `_name` 变成私有属性。

setter 中不能再写 `this.name = value`，否则会再次调用同一个 setter，形成无限递归。

getter 和 setter 可以只定义一个：只有 getter 时，不能通过赋值修改该属性；只有 setter 时，读取该属性得到 `undefined`。在严格模式下，给没有 setter 的访问器属性赋值会抛出 `TypeError`，非严格模式下赋值被忽略。

### 同一属性只能属于一种类型

**同一个对象上的同一个属性，在同一时刻只能是数据属性或访问器属性。** 一个对象可以同时拥有这两类属性，如上例的 `_name` 和 `name`。

同名的 `get name()` 和 `set name(value)` 共同定义一个访问器属性，并不是两个属性，也没有让 `name` 同时变成数据属性。两种类型的区别在于保存的内容：数据属性保存值，访问器属性保存读取或写入函数。

## 属性描述符：查看和配置属性规则

除了保存值或读写函数，属性还有一些规则：能否赋值、能否出现在遍历结果中、能否删除或重新定义。**属性描述符**就是用于描述这些信息的对象。

### 查看已有属性

`Object.getOwnPropertyDescriptor(obj, key)` 返回对象自身某个属性的描述符：

```js
const user = { name: '小王' }
const descriptor = Object.getOwnPropertyDescriptor(user, 'name')

console.log(descriptor)
// {
//   value: '小王',
//   writable: true,
//   enumerable: true,
//   configurable: true
// }
```

这里 `value` 是保存的值，另外三个字段分别控制赋值、枚举和重新配置。规范中常用 `[[Value]]`、`[[Writable]]` 等双中括号记号描述内部特性，代码中通过描述符的 `value`、`writable` 等字段配置它们。

| 描述符字段     | 用于哪类属性 | 含义                                            |
| -------------- | ------------ | ----------------------------------------------- |
| `value`        | 数据属性     | 属性保存的值                                    |
| `writable`     | 数据属性     | 是否允许通过赋值修改值                          |
| `get`          | 访问器属性   | 读取时调用的函数，缺省为 `undefined`            |
| `set`          | 访问器属性   | 赋值时调用的函数，缺省为 `undefined`            |
| `enumerable`   | 两者都有     | 是否参与 `Object.keys()`、`for...in` 等枚举操作 |
| `configurable` | 两者都有     | 是否允许删除属性、切换类型或修改受限制的特性    |

访问器属性的描述符没有 `value`、`writable`，而是 `get`、`set`。getter 的计算结果也不会变成描述符中的 `value`。

`Object.getOwnPropertyDescriptor()` 不沿原型链查找；对象自身没有该属性时返回 `undefined`。继承属性的查找规则见 [原型与原型链](./prototype-chain.md)。

### 使用 `Object.defineProperty()` 定义属性

对象字面量适合直接写出属性；需要控制上述规则，或给已有对象添加访问器时，可以使用 `Object.defineProperty(obj, key, descriptor)`。

```js
const user = { name: '小王' }

Object.defineProperty(user, 'id', {
  value: 1001
})

console.log(user.id) // 1001
console.log(Object.keys(user)) // ['name']
console.log(Object.getOwnPropertyDescriptor(user, 'id'))
// {
//   value: 1001,
//   writable: false,
//   enumerable: false,
//   configurable: false
// }
```

`id` 可以读取，但不能通过赋值修改，也不会出现在 `Object.keys()` 中，且不能删除。**默认规则取决于属性的定义方式**：

| 定义方式                                         | `writable`         | `enumerable` | `configurable` |
| ------------------------------------------------ | ------------------ | ------------ | -------------- |
| 字面量数据属性，如 `{ name: '小王' }`            | `true`             | `true`       | `true`         |
| 字面量访问器，如 `{ get name() { ... } }`        | 不适用             | `true`       | `true`         |
| `Object.defineProperty()` 新增属性时省略对应字段 | 数据属性为 `false` | `false`      | `false`        |

新增属性时，省略 `value`、`get` 或 `set` 的相应默认值为 `undefined`。修改已有属性且不切换类型时，省略的字段保留原配置，不会重置成默认值。批量定义属性可以使用 `Object.defineProperties()`。

### 两组配置不能混用，但类型可以切换

描述符不能同时包含 `value` / `writable` 与 `get` / `set`，否则定义失败：

```js
const user = {}

try {
  Object.defineProperty(user, 'name', {
    value: '小王',
    get() {
      return '小李'
    }
  })
} catch (error) {
  console.log(error.name) // 'TypeError'
}
```

如果现有属性的 `configurable` 为 `true`，可以重新定义它，切换属性类型。例如把保存总价的数据属性改成计算总价的访问器属性：

```js
const order = { price: 10, quantity: 2, total: 20 }

Object.defineProperty(order, 'total', {
  get() {
    return this.price * this.quantity
  }
})

order.quantity = 3
console.log(order.total) // 30
console.log(Object.getOwnPropertyDescriptor(order, 'total').value) // undefined
```

原来的 `total` 来自对象字面量，允许重新配置。切换后不再保存原有的 `value`，也不再有 `writable`；未指定的 `enumerable`、`configurable` 保持原值。反过来，把可配置的访问器属性重新定义为带 `value` 的数据属性也成立。

## 配置规则的边界

`writable` 和 `configurable` 控制的事情不同：**不能重新配置，不代表不能赋值。**

```js
const counter = {}
Object.defineProperty(counter, 'count', {
  value: 0,
  writable: true,
  configurable: false
})

counter.count = 1
console.log(counter.count) // 1
console.log(Reflect.deleteProperty(counter, 'count')) // false
```

`count` 的值仍可修改，但属性不能删除。对不可配置属性，不能再把 `configurable` 改回 `true`、改变 `enumerable`、切换属性类型或替换访问器函数。数据属性若仍可写，可以继续修改值，也可以把 `writable` 从 `true` 改为 `false`，之后便不能恢复可写。

`enumerable: false` 只影响枚举，不会隐藏属性或阻止读取。`Object.keys()` 只列出自有的可枚举字符串键；`for...in` 还会包含继承来的可枚举字符串键。

严格模式下，给不可写的数据属性赋值、给没有 setter 的访问器属性赋值、用 `delete` 删除不可配置属性，都会抛出 `TypeError`；非严格模式下前两种赋值被忽略，删除返回 `false`。`Object.defineProperty()` 违反重新定义规则时，无论是否严格模式都会抛出 `TypeError`。

## 参考

- [ECMAScript：对象属性及其特性](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-property-attributes)
- [MDN：定义 getter 和 setter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects#defining_getters_and_setters)
- [MDN：Object.defineProperty()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
