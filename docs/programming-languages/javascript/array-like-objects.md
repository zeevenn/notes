---
title: 类数组对象
date: 2022-08-24
icon: array
category:
  - JavaScript
tag:
  - language advanced
---

## 概念

在 Javascript 里，有一个特殊的对象，它拥有 `length` 属性和若干索引属性，被称为类数组对象。常见的类数组对象有 `arguments` 和 DOM 方法返回的结果。

```js
const arrLike = {
  0: 'name',
  1: 'age',
  length: 2
}

// arguments 对象
function foo() {
  return arguments
}
foo(1, 2, 3) // Arguments(3) [1, 2, 3, callee: ƒ, Symbol(Symbol.iterator): ƒ]

// DOM 方法返回的结果
document.getElementsByTagName('img') // HTMLCollection(3) [img, img, img]
```

类数组对象和数组类似之处在于：访问、赋值、获取长度的操作与数组一致，因此叫做类数组对象。

```js
console.log(arrLike[0]) // name
arrLike[0] = 'wang'
console.log(arrLike.length) // 2
```

## 使用数组方法

类数组对象不能 **直接调用** 数组的方法，如果想使用数组方法，需要使用 `call()` 或 `apply` 间接调用。

```js
arrLike.push('hobby') // Uncaught TypeError: arrLike.push is not a function

Array.prototype.push.call(arrLike, 'hobby') // { '0': 'name', '1': 'age', '2':  'hobby', length: 3 }
```

实际开发中，为了使操作方便，通常先将类数组对象转换为数组对象，通常使用 `Array.from()` 进行转换。

```js
// call 调用 slice
Array.prototype.slice.call(arrLike)

// call 调用 splice
Array.prototype.splice.call(arrLike, 0)

// apply 调用 concat
Array.prototype.concat.apply([], arrLike)

// Array.from
Array.from(arrLike)

// 展开运算符
[...arrLike]
```
