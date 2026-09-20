---
title: 手写 new 操作符
date: 2022-08-23
icon: code
category:
  - JavaScript
tag:
  - new
  - 手写代码
---

`new` 调用普通函数构造器时，主要完成以下操作：

1. 创建一个新对象。
2. 把新对象的原型连接到构造函数的 `prototype` 对象。
3. 以新对象为 `this`，执行构造函数并传入参数。
4. 如果构造函数返回了对象，就使用该返回值；否则使用刚创建的新对象。

原型连接的含义见 [原型与原型链](./prototype-chain.md)。

## 简化实现

下面演示普通函数构造器的核心流程，假定它的 `prototype` 是一个对象：

```js
function newOperator(constructor, ...args) {
  if (typeof constructor !== 'function') {
    throw new TypeError('constructor must be a function')
  }

  // 创建实例，并连接构造函数的原型对象
  const instance = Object.create(constructor.prototype)

  // 以 instance 为 this，执行构造函数
  const res = constructor.apply(instance, args)

  // 构造函数返回对象时，使用它替代 instance
  const isObject =
    res !== null &&
    (typeof res === 'object' || typeof res === 'function')

  return isObject ? res : instance
}

function Person(name, age) {
  this.name = name
  this.age = age
}

const person = newOperator(Person, 'wang', 18)
console.log(person) // Person { name: 'wang', age: 18 }
```

这里有两个不同的值：`instance` 是手动创建的实例，`res` 是构造函数执行后的返回值。`Person` 没有写 `return`，所以 `res` 是 `undefined`，最终返回的是已设置好 `name` 和 `age` 的 `instance`。

## 返回值为什么要判断类型

构造函数可以显式返回另一个对象。此时，`new` 的结果就是这个对象：

```js
function ReturnObject(name) {
  this.name = name
  return { name: '小李' }
}

console.log(newOperator(ReturnObject, '小王')) // { name: '小李' }
```

虽然新建实例的 `name` 已经被设为“小王”，但构造函数随后返回了另一个对象，因此最终结果取自 `res`。

如果返回的是原始值，这个返回值会被忽略：

```js
function ReturnPrimitive(name) {
  this.name = name
  return '小李'
}

console.log(newOperator(ReturnPrimitive, '小王').name) // '小王'
```

字符串 `'小李'` 不会替代实例，最终得到的仍是保存着 `name: '小王'` 的 `instance`。

| 构造函数的返回值 | 最终使用哪个值 |
| --- | --- |
| 没有显式返回值，即 `undefined` | `instance` |
| `null`、字符串、数字、布尔值等原始值 | `instance` |
| 对象、数组或函数 | `res` |

因此，`isObject` 中的条件分别处理两件事：

- `res !== null`：排除 `null`，因为 `typeof null` 的结果也是 `'object'`。
- `typeof res === 'object' || typeof res === 'function'`：接受对象返回值；函数也属于对象，因此需要包含 `'function'`。

`isObject` 得到布尔值，最后的三元表达式根据它选择 `res` 或 `instance`。

## 实现范围

这份代码通过普通函数调用模拟构造过程。`class` 不能通过 `apply()` 调用，`new.target` 等构造调用语义也不会被复现；需要真正执行构造调用时，可以使用 `Reflect.construct(constructor, args)`。

原生 `new` 还会在构造函数的 `prototype` 不是对象时，使用相应的默认原型。上面的简化实现保留了“`prototype` 是对象”的前提。

## 参考

- [MDN：new 操作符](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new)
- [ECMAScript：普通函数的构造调用](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ecmascript-function-objects-construct-argumentslist-newtarget)
