---
title: 手写 call、apply、bind
date: 2022-04-27
icon: code
category:
  - JavaScript
tag:
  - this
  - 手写代码
---

`call()`、`apply()` 和 `bind()` 三者都可以改变 JavaScript 中的 this 指向，关于三者的区别在 [this 指向](./016-this.md)中有详细记录。

这三个函数实际上是由 C++ 实现的，这里只考虑功能上的实现，不会考虑太多边界情况。

## `call()`

`call()` 接受一个 `this` 指向，其后跟参数列表。

```js
Function.prototype.myCall = function (thisArg, ...args) {
  // 将 thisArg 转成对象类型（防止传入非对象类型）
  // 传入 null 或 undefined 则为全局对象
  thisArg = thisArg !== null && thisArg !== undefined ? Object(thisArg) : window

  // foo.myCall();
  // foo 是函数，本质上也是一个对象，即隐式绑定：对象（foo）调用函数（myCall）
  // 那么函数 myCall 中的 this 指向 foo 对象（函数）
  const fn = this // foo

  // 需要将 fn 的指向改为 thisArg
  // 那么可以继续利用 this 的隐式绑定规则
  thisArg.fn = fn
  const res = thisArg.fn(...args)
  delete thisArg.fn

  return res
}
```

## `apply()`

`apply()` 与 `call()` 的区别在于传入的是参数数组，参照上面流程，可以很容易的写出：

```js
Function.prototype.myApply = function (thisArg, args) {
  // 处理 thisArg
  thisArg = thisArg !== null && thisArg !== undefined ? Object(thisArg) : window

  // 获取待执行函数
  const fn = this

  // 执行
  thisArg.fn = fn
  const res = thisArg.fn(...args)
  delete thisArg.fn

  return res
}
```

## `bind()`

`bind()` 函数稍有不同，它返回一个改变了 `this` 的函数：

```js
Function.prototype.myBind = function (thisArg, ...args) {
  // 处理 thisArg
  thisArg = thisArg !== null && thisArg !== undefined ? Object(thisArg) : window

  // 获取待执行函数
  const fn = this

  return function _bind(...newArgs) {
    // 收集参数
    const finalArgs = [...args, ...newArgs]

    // 执行
    thisArg.fn = fn
    const res = thisArg.fn(...finalArgs)
    delete thisArg.fn

    return res
  }
}
```

## 总结

手写 `call`、`apply`、`bind` 的步骤大致相同，只是 `bind` 多了一个收集参数的过程：

1. 处理 thisArg;
2. 获取待执行函数；
3. 执行函数（`bind()` 还有一个收集参数的过程）。

无论是在获取函数还是执行函数（改变 `this`）的过程中，都是利用了隐式绑定改变 `this` 指向的规则。
