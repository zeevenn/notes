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

在 JavaScript 中，对象是一组属性的「无序集合」，由键值对组成。创建对象共有两种方式：字面量和 `new`。一般开发中为了方便通常使用字面量来创建对象。

对象中的属性有一些内部特性，这些内部特性的名称会用两个中括号括起来，如 `[[Enumerable]]`，根据内部特性的不同，可以将属性分为 **数据属性** 和 **访问器属性**。

## 数据属性

数据属性，顾名思义，它是包含一个值的属性，数据属性一共以下四个特性：

- `[[Configurable]]`：属性是否可配置：是否可以 `delete` 删除，是否可以修改特性，以及是否可以改成访问器属性。默认为 `true`。
- `[[Enumerable]]`：属性是否可以枚举（使用 `for-in`）。默认为 `true`。
- `[[Writable]]`：属性的值是否可以被修改。默认为 `true`。
- `[[Value]]`：属性的值。默认为 `undefined`。

使用字面量或 `new` 操作符定义对象时，默认就是一个数据属性。前三个特性都默认为 `true`，而 `[[value]]` 则为指定的值。

可以使用 `Object.getOwnPropertyDescriptor()` 查看属性的描述符，他接收两个参数，第一个参数为对象，第二个参数为需要查看描述符的属性。

```js
const o = { name: 'wang' }

console.log(Object.getOwnPropertyDescriptor(o, 'name'))
// {
//   value: 'wang',
//   writable: true,
//   enumerable: true,
//   configurable: true
// }
```

另外除了使用字面量声明属性，还可以通过 `Object.defineProperty()` 定义属性，同时定义多个属性则可以使用 `Object.defineProperties()`，

::: warning

在调用 `Object.defineProperty()` 时，`configurable`、`enumerable` 和 `writable` 的值如果不指定，则都默认为 `false`。

在严格模式下，尝试删除不可配置属性会抛出错误，尝试修改只读属性也会抛出错误。

:::

```js
const o = {}

Object.defineProperty(o, 'name', {
  value: 'wang'
})

console.log(Object.getOwnPropertyDescriptor(o, 'name'))
// {
//   value: 'wang',
//   writable: false,
//   enumerable: false,
//   configurable: false
// }
```

## 访问器属性

访问器属性不包含值，而是有一个 `getter()` 函数和一个 `setter()` 函数。在写入访问器属性时，会调用设置（`setter()`）函数，在读取时，会调用获取（`getter()`）函数。它一共包括四种特性：

- `[[Configurable]]`：属性是否可配置：是否可以 `delete`，是否可以修改特性，以及是否可以改成数据属性。默认为 `true`。
- `[[Enumerable]]`：属性是否可以枚举。默认为 `true`。
- `[[Get]]`：获取函数，读取属性时调用。默认为 `undefined`。
- `[[Set]]`：设置函数，写入属性时调用。默认为 `undefined`。

访问器属性 **只能** 通过 `Object.defineProperty()` 或 `Object.defineProperties()` 定义：

::: warning

在调用 `Object.defineProperty()` 时，`configurable` 和 `enumerable` 的值如果不指定，则都默认为 `false`。

:::

```js
// 定义一个对象，包含伪私有成员 year_ 和公共成员 edition
let book = {
  year_: 2017,
  edition: 1
}

Object.defineProperty(book, 'year', {
  get() {
    return this.year_
  },
  set(newValue) {
    if (newValue > 2017) {
      this.year_ = newValue
      this.edition += newValue - 2017
    }
  }
})

// 设置时，会调用 setter 函数
book.year = 2018
console.log(book.edition) // 2

// 读取时，会调用 getter 函数
console.log(book.year_) // 2018

// configurable 和 enumerable 的值如果不指定，则都默认为 false
console.log(Object.getOwnPropertyDescriptor(book, 'year'))
// {
//   get: [Function: get],
//   set: [Function: set],
//   enumerable: false,
//   configurable: false
// }
```

::: tip

Vue 中的计算属性就是访问器属性中的 `getter()` 和 `setter`。

:::
