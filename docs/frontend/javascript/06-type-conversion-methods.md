---
title: 对象转换方法
date: 2024-04-18
icon: string
category:
  - JavaScript
tag:
  - language advanced
---

Object 原型上有三个方法 `toString()`、`toLocalString`、`valueOf()` 可以将对象转换为原始值，然而对于不同的对象类型调用这几种方法会有不同的行为。

## `toString()`

`toString()` 方法用于将一个对象转换为字符串表示形式。对于基本数据类型（如数字、布尔值、字符串等），`toString()` 方法会返回对应的字符串表示。

```js
const num = 123
console.log(num.toString()) // 输出 "123"

const bool = true
console.log(bool.toString()) // 输出 "true"

const str = 'Hello'
console.log(str.toString()) // 输出 "Hello"
```

## `toLocaleString()`

`toLocaleString()` 方法与 `toString()` 类似，但它返回的是一个本地化（即与用户本地文化相关的）的字符串表示。

这意味着返回的字符串可能根据用户的地区设置而有所不同，比如使用不同的日期格式、数字格式等。

```js
const date = new Date()
console.log(date.toLocaleString()) // 输出本地化的日期时间字符串
```

## `valueOf()`

`valueOf()` 方法返回指定对象的原始值。对于大多数对象来说，`valueOf()` 方法返回的值与对象本身是相同的，但可以通过重写这个方法来改变返回的值。

```js
const obj = {
  valueOf() {
    return 123
  }
}

console.log(obj.valueOf()) // 输出 123
```

## 自动调用顺序

在 JavaScript 内部，当需要将对象转换为原始值时（比如在算术运算、逻辑运算、字符串拼接等情况下），会自动调用对象的 `valueOf()` 和 `toString()` 方法来获取原始值。它们的调用顺序如下：

1. 如果对象具有 `valueOf()` 方法且返回的是原始值（非对象），则直接使用该值。
2. 如果对象没有 `valueOf()` 方法，或者 `valueOf()` 返回的是对象，那么会调用对象的 `toString()` 方法。
3. 如果对象没有 `toString()` 方法，或者 `toString()` 返回的是对象，那么会抛出 TypeError 错误。

::: warning

`valueOf()` 和 `toString()` 方法在不同的上下文中可能会有不同的表现，具体取决于 JavaScript 引擎的实现和调用方式。

:::

## 总结

这三种方法用于获得对象的字符串或原始值，在一些情况下会被 JavaScript 引擎自动调用，区别如下：

- `toString()` 用于将对象转换为字符串表示形式。
- `toLocaleString()` 返回一个本地化的字符串表示。
- `valueOf()` 返回对象的原始值。
