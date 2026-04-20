---
title: 判断数据类型
date: 2022-05-02
icon: judge
category:
  - JavaScript
tag:
  - language basic
---

`ECMAScript` 有 8 种基本的数据类型（ 7 种原始类型和 1 种引用类型）。

- 原始类型：`Undefined`、`Null`、`Boolean`、`Number`、`String`、`Symbol`、`BigInt`；
- 引用类型：`Object`。

下面介绍几种判断变量数据类型的几种方法。

## `typeof`

用来返回操作数类型的字符串。语法：

```js
typeof operand
```

但是由于 JavaScript 设计的缺陷，`typeof` 基本上不能得到想要的结果。它只有一个实际应用场景：**检测一个对象是否已经定义或者是否已经赋值**。

特点：

- 对于基本类型，除 `null` 外，均可以返回正确结果；
- 对于引用类型，除 `function` 外，一律返回 `"object"`；
- 对于 `null`，返回 `"object"` 类型；
- 对于 `function`，返回 `"function"`；
- 对于 `array`, 返回 `"object"`。

```js
const fn = function () {}

typeof null // "object"，得不到想要的值
typeof fn // "function"
```

总之，数组、对象、`null` 都会返回 `object`，其他都能判断正确。

::: tip 为什么 `typeof null` 返回 `object`

由于 JavaScript 第一个版本中，所有值都存在 32 位单元中，每个单元包含一个小的类型标签以及存储的真实值，`object` 的类型标签是 `000`，而 `null` 的类型标签也是 `000`，因此使用 `typeof` 判断 `null` 会被判定为 `object`。

- `000`：对象；
- `001`: 整数；
- `010`：浮点数；
- `100`：字符串；
- `110`：布尔。

:::

## `instanceof`

用来检测构造函数的 `prototype` 属性是否出现在某个实例对象的原型链上，返回布尔值。语法：

```js
object instanceof constructor
```

特点：

- 对于 **字面量声明** 的 `Number`、`BigInt`、`String`、`Boolean`、`Symbol` 都会返回 `false`；
- **只能正确判断引用数据类型**；
- 只要在当前实例的原型链上，检测结果均为 `true`；

原理：遍历实例对象的原型链 `__proto__`，直到找到构造函数的 `prototype` 属性。

::: tip

不同环境对 `__proto__` 的实现不同，而且 Web 标准已经删除该特性，这里只是为了表示方便，开发中需要使用 `Object.getPrototypeOf()` 获取原型对象。

:::

```js
function myInstanceOf(left, right) {
  // 在 ES5 中，如果 Object.getPrototypeOf 参数不是一个对象类型
  // 将抛出一个TypeError异常。在 ES2015 中，参数会被强制转换为一个 Object。
  // 因此需提前判断是否为引用类型
  if (typeof left !== 'object' || left === null) return false

  // right 必须是函数，函数才有 prototype
  if (typeof constructor !== 'function') {
    throw new Error('The "constructor" parameter must be a function.')
  }

  // 获取实例对象的原型
  let proto = Object.getPrototypeOf(left)

  while (true) {
    if (proto === null) return false
    if (proto === right.prototype) return true
    proto = Object.getPrototypeOf(proto)
  }
}
```

## 简单实现

如果只需要准确判断六种基本数据类型，同时又能够准确区分数据类型是 `null`、`array`、还是 `object` 就足够的话，那么我们可以这样实现：

```js
const superTypeof = (val) => {
  let res = typeof val

  if (res === 'object') {
    if (val === null) {
      res = 'null'
    } else if (Array.isArray(val)) {
      res = 'array'
    }
  }

  return res
}
```

## `Object.prototype.toString.call(obj)`

当 `Array.isArray()` 不可用时，有如下的补丁，因此更推荐使用 `Object.prototype.toString.call(obj)` 检测数据类型。

```js
if (!Array.isArray) {
  Array.isArray = function (arg) {
    return Object.prototype.toString.call(arg) === '[Object Array]'
  }
}
```

如果需要判断所有类型，那么可以调用对象原型中的 `toString()` 方法，`Object.prototype.toString.call(obj)`：

```js
function _getClass(obj) {
  if (obj === null) return 'null'
  return Object.prototype.toString.call(obj).slice(8, -1)
}
```
