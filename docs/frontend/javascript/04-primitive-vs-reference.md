---
title: 原始值和引用值
date: 2024-04-16
icon: reference
category:
  - JavaScript
tag:
  - language advanced
---

## 按值访问和按引用访问

ECMAScript 变量可以包含两种不同类型的数据：原始值和引用值。原始值（primitive value）就是最简单的数据，引用值（reference value）则是由多个值构成的对象。

在把一个值赋给变量时，JavaScript 引擎必须确定这个值是原始值还是引用值。

保存原始值的变量是 **按值**（by value）访问的，因为我们操作的就是存储在变量中的实际值。引用值是保存在内存中的对象。

与其他语言不同，JavaScript 不允许直接访问内存位置，因此也就不能直接操作对象所在的内存空间。在操作对象时，实际上操作的是对该对象的 **引用**（reference）而非实际的对象本身。为此，保存引用值的变量是 **按引用**（by reference）访问的。

![按值访问和按引用访问](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/V8-stack-heap.png)

## 传递参数

ECMAScript 中所有函数的参数都是按值传递的。这意味着函数外的值会被复制到函数内部的参数中，就像从一个变量复制到另一个变量一样。

如果是原始值，那么就跟原始值变量的复制一样，如果是引用值，那么就跟引用值变量的复制一样。

::: warning

变量有按值和按引用访问，而传参则只有按值传递。

:::

在按值传递参数时，值会被复制到一个局部变量（即一个命名参数，`arguments` 对象中的一个槽位）。来看几个例子。

**参数为基本类型**

```js
let a = 1
function foo(value) {
  value = 2
  console.log(value) // 输出: 2
}

foo(a)
console.log(a) //输出: 1
```

```text
a: 1
foo:
  - value: 1
```

在这个例子中，声明了一个变量 `a`，把它传入 `foo` 函数，函数中我们改变了 `value` 的值，但在函数外 `a` 的值没有改变。

因为基本类型是按值传递，改变的只是 `value` 这个拷贝副本的值，对原值没有影响。

**参数为引用类型**

```js
let obj = { a: 1 }
function foo(o) {
  o.a = 2
  console.log(o.a) // 输出: 2
}

foo(obj)
console.log(obj.a) // 输出: 2
```

```text
obj: 0x01 -> { a: 1 }
foo:          |
  - 0: 0x01 ->
```

在这里，声明了一个对象 `obj`，把它传入 `foo` 函数赋值为 `o`，此时 `o` 与外部定义的 `obj` 的值为同一个内存地址，指向同一个对象。

函数中改变了 `o` 的 `a` 属性的值（按引用访问），然后可以看到在函数外 `obj.a` 的值也被改变了。

再来看一个例子：

```js
let obj = { value: 1 }
function foo(o) {
  o = 2
  console.log(o) // 输出：2
}
foo(obj) 
console.log(obj.value) // 输出：1
```

```text
obj: 0x01 -> { value: 1 }
foo:          |
  - o: 0x01 ->
```

这里也声明了一个对象，不同的是，`foo` 函数直接修改了 `o` 的值，将内存地址变为一个普通原始值 `2`，但是这里并没有对外部的 `obj` 地址进行修改，因此 `console.log(obj.value)` 仍然打印 `1`。
