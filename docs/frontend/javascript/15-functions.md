---
title: 函数
date: 2024-07-08
icon: function
category:
  - JavaScript
tag:
  - 函数
---

## 箭头函数

ES6 中新增了 `=>`，它可以将函数定义成箭头函数。

```js
const add = (a, b) => a + b
```

::: warning

箭头函数不能使用 `arguments`、`super` 和 `new.target`，也不能用作构造函数。此外，箭头函数也没有 `prototype` 属性。

:::

## 函数名

在 JavaScript 中，函数名可以是任何标识符。

ECMAScript 6 的所有函数对象都会暴露一个只读的 `name` 属性，其中包含关于函数的信息。

多数情况下，这个属性中保存的就是一个函数标识符，或者说是一个字符串化的变量名。即使函数没有名称，也会如实显示成空字符串。如果它是使用 `Function` 构造函数创建的，则会标识成 `anonymous`：

```js
function foo() {}
let bar = function () {}
let baz = () => {}

console.log(foo.name) // foo
console.log(bar.name) // bar
console.log(baz.name) // baz
console.log((() => {}).name) //（空字符串）
console.log(new Function().name) // anonymous
```

如果函数是一个获取函数、设置函数，或者使用 `bind()` 实例化，那么标识符前面会加上一个前缀：

```js
function foo() {}
console.log(foo.bind(null).name) // bound foo

let dog = {
  years: 1,
  get age() {
    return this.years
  },
  set age(newAge) {
    this.years = newAge
  }
}

let propertyDescriptor = Object.getOwnPropertyDescriptor(dog, 'age')
console.log(propertyDescriptor.get.name) // get age
console.log(propertyDescriptor.set.name) // set age
```

## 参数

函数既不关心传入的参数个数，也不关心这些参数的数据类型。定义函数时要接收两个参数，并不意味着调用时就传两个参数。你可以传一个、三个，甚至一个也不传，解释器都不会报错。

::: tip

之所以会这样，主要是因为 ECMAScript 函数的参数在内部表现为一个数组。但函数并不关心这个数组中包含什么。如果数组中什么也没有，那没问题；如果数组的元素超出了要求，那也没问题。

事实上，在使用 `function` 关键字定义（非箭头）函数时，可以在函数内部访问 `arguments` 对象（参见 [类数组对象](./009-array-like-object.md)），从中取得传进来的每个参数值。

:::

::: warning

ECMAScript 中的所有参数都按值传递的。不可能按引用传递参数。如果把对象作为参数传递，那么传递的值就是这个对象的引用，详见 [原始值和引用值](./004-primitive-value-reference-value.md)。

:::

## 无重载

ECMAScript 中，函数的重载是不允许的，只能有一个函数签名。

而在 TypeScript 中，可以有函数重载。一个函数可以有多个不同的签名，但只有一个具体的实现。这种机制允许一个函数根据不同的参数类型或数量来执行不同的逻辑。

重载函数在定义时，先列出多个函数签名，然后提供一个具体的实现函数，该实现函数根据传入的参数执行相应的操作。

```ts
function getUserInfo(value: number): User | undefined
function getUserInfo(value: string): User[]
function getUserInfo(value: number | string): User | User[] | undefined {
  if (typeof value === 'number') {
    return userList.find((item) => item.id === value)
  } else {
    return userList.filter((item) => item.grades === value)
  }
}
```

## 默认参数

在函数定义中的参数后面用 `=` 就可以为参数赋一个默认值：

```js
function makeKing(name = 'Henry') {
  return `King ${name} VIII`
}
console.log(makeKing('Louis')) // 'King Louis VIII'
console.log(makeKing()) // 'King Henry VIII'
```

## 参数扩展和收集

### 扩展参数

对可迭代对象应用扩展操作符，并将其作为一个参数传入，可以将可迭代对象拆分，并将迭代返回的每个值单独传入。

```js
let values = [1, 2, 3, 4]

function getSum() {
  let sum = 0
  for (let i = 0; i < arguments.length; ++i) {
    sum += arguments[i]
  }
  return sum
}

console.log(getSum(...values))
```

### 收集参数

在构思函数定义时，可以使用扩展操作符把不同长度的独立参数组合为一个数组。这有点类似 `arguments` 对象的构造机制，只不过收集参数的结果会得到一个 Array 实例。

且收集参数只能放在最后一个参数位置：

```js
function ignoreFirst(firstValue, ...values) {
  console.log(values)
}
ignoreFirst() // []
ignoreFirst(1) // []
ignoreFirst(1, 2) // [2]
ignoreFirst(1, 2, 3) // [2, 3]
```

## 函数声明和函数表达式

函数声明会在任何代码执行之前先被读取并添加到执行上下文，函数表达式不会。

```js
console.log(sum1(10, 10))
function sum1(a, b) {
  return a + b
}

console.log(sum2(10, 10)) // 报错
let sum2 = function (num1, num2) {
  return num1 + num2
}
```

## 函数作为值

因为函数名在 ECMAScript 中就是变量，所以函数可以用在任何可以使用变量的地方。这意味着不仅可以把函数作为参数传给另一个函数，而且还可以在一个函数中返回另一个函数。

## 函数内部

在 ECMAScript 5 中，函数内部存在两个特殊的对象：`arguments` 和 `this`。ECMAScript 6 又新增了 `new.target` 属性。

### arguments

`arguments` 对象还有一个 `callee` 属性，是一个指向 `arguments` 对象所在函数的指针。

```js
function factorial(num) {
  if (num <= 1) {
    return 1
  } else {
    return num * factorial(num - 1)
  }
}
```

这个函数要正确执行就必须保证函数名是 `factorial`，从而导致了紧密耦合。使用 `arguments.callee` 就可以让函数逻辑与函数名解耦：

```js
function factorial(num) {
  if (num <= 1) {
    return 1
  } else {
    return num * arguments.callee(num - 1)
  }
}
```

### this

详见 [this 指向](./016-this.md)。

### new.target

ECMAScript 中的函数始终可以作为构造函数实例化一个新对象，也可以作为普通函数被调用。ECMAScript 6 新增了检测函数是否使用 `new` 关键字调用的 `new.target` 属性。

如果函数是正常调用的，`new.target` 将返回 `undefined`，如果函数被 `new` 关键字调用，则 `new.target` 将返回这个函数。

```js
function King() {
  if (!new.target) {
    throw 'King must be instantiated using "new"'
  }
  console.log('King instantiated using "new"')
}
new King() // King instantiated using "new"
King() // Error: King must be instantiated using "new"
```

## 函数属性和方法

ECMAScript 中的函数是对象，因此有属性和方法。每个函数都有两个属性：`length` 和 `prototype`。其中，`length` 属性保存函数定义的命名参数的个数，`prototype` 属性保存函数的原型对象。

函数还有两个方法：`apply()` 和 `call()`。这两个方法都会以指定的 `this` 值来调用函数，即会设置调用函数时函数体内 `this` 对象的值。

## 尾调用优化

ECMAScript 6 规范新增了一项内存管理优化机制，让 JavaScript 引擎在满足条件时可以重用栈帧。

具体来说，这项优化非常适合「尾调用」，即外部函数的返回值是一个内部函数的返回值。比如：

```js
function outerFunction() {
  return innerFunction() // 尾调用
}
```

在 ES6 优化之前，执行这个例子会在内存中发生如下操作。

1. 执行到 `outerFunction` 函数体，第一个栈帧被推到栈上。
2. 执行 `outerFunction` 函数体，到 `return` 语句。计算返回值必须先计算 `innerFunction`。
3. 执行到 `innerFunction` 函数体，第二个栈帧被推到栈上。
4. 执行 `innerFunction` 函数体，计算其返回值。
5. 将返回值传回 `outerFunction`，然后 `outerFunction` 再返回值。
6. 将栈帧弹出栈外。

在 ES6 优化之后，执行这个例子会在内存中发生如下操作。

1. 执行到 outerFunction 函数体，第一个栈帧被推到栈上。
2. 执行 outerFunction 函数体，到达 return 语句。为求值返回语句，必须先求值 innerFunction。
3. 引擎发现把第一个栈帧弹出栈外也没问题，因为 innerFunction 的返回值也是 outerFunction
   的返回值。
4. 弹出 outerFunction 的栈帧。
5. 执行到 innerFunction 函数体，栈帧被推到栈上。
6. 执行 innerFunction 函数体，计算其返回值。
7. 将 innerFunction 的栈帧弹出栈外。

很明显，第一种情况下每多调用一次嵌套函数，就会多增加一个栈帧。而第二种情况下无论调用多少次嵌套函数，都只有一个栈帧。这就是 ES6 尾调用优化的关键：如果函数的逻辑允许基于尾调用将其
销毁，则引擎就会那么做。

::: tip

现在还没有办法测试尾调用优化是否起作用。不过，因为这是 ES6 规范所规定的，兼容的浏览器实现都能保证在代码满足条件的情况下应用这个优化。

:::

### 条件

尾调用优化的条件就是确定外部栈帧真的没有必要存在了。涉及的条件如下：

- 严格模式；
- 外部函数的返回值是对尾调用函数的调用；
- 尾调用函数返回后不需要执行额外的逻辑；
- 尾调用函数不是引用外部函数作用域中自由变量的闭包。

下面展示了几个违反上述条件的函数，因此都不符号尾调用优化的要求：

```js
'use strict'
// 无优化：尾调用没有返回
function outerFunction() {
  innerFunction()
}
// 无优化：尾调用没有直接返回
function outerFunction() {
  let innerFunctionResult = innerFunction()
  return innerFunctionResult
}
// 无优化：尾调用返回后必须转型为字符串
function outerFunction() {
  return innerFunction().toString()
}
// 无优化：尾调用是一个闭包
function outerFunction() {
  let foo = 'bar'
  function innerFunction() {
    return foo
  }
  return innerFunction()
}
```

下面是几个符合尾调用优化条件的例子：

```js
'use strict'
// 有优化：栈帧销毁前执行参数计算
function outerFunction(a, b) {
  return innerFunction(a + b)
}
// 有优化：初始返回值不涉及栈帧
function outerFunction(a, b) {
  if (a < b) {
    return a
  }
  return innerFunction(a + b)
}
// 有优化：两个内部函数都在尾部
function outerFunction(condition) {
  return condition ? innerFunctionA() : innerFunctionB()
}
```

### 尾调用优化

下面是一个通过递归计算斐波纳契数列的函数：

```js
function fib(n) {
  if (n < 2) {
    return n
  }
  return fib(n - 1) + fib(n - 2)
}
console.log(fib(0)) // 0
console.log(fib(1)) // 1
console.log(fib(2)) // 1
console.log(fib(3)) // 2
console.log(fib(4)) // 3
console.log(fib(5)) // 5
console.log(fib(6)) // 8
```

显然这个函数不符合尾调用优化的条件，因为返回语句中有一个相加的操作。结果，`fib(n)` 的栈帧数的内存复杂度是 `O(2n)`。

利用尾调用优化：

```js
'use strict'
// 基础框架
function fib(n) {
  return fibImpl(0, 1, n)
}
// 执行递归
function fibImpl(a, b, n) {
  if (n === 0) {
    return a
  }
  return fibImpl(b, a + b, n - 1)
}
```

## 闭包

简而言之是指内部函数引用外部函数的变量，这个内部函数就是闭包。

虽然外部函数已经运行完毕，但由于闭包的存在，内部函数依然可以访问外部函数的变量，该变量不会被销毁。

```js
function outerFunction() {
  let foo = 'bar'
  return function innerFunction() {
    return foo
  }
}

const fn = outerFunction()
console.log(fn()) // 'bar'
```

::: tip

一些闭包场景：

- 节流防抖
- 函数柯里化
- 链式调用
- 迭代器
- 发布订阅

因为闭包会保留它们包含函数的作用域，所以比其他函数更占用内存。过度使用闭包可能导致内存过度占用，因此建议仅在十分必要时使用。

:::

## 立即执行函数（IIFE）

立即调用的匿名函数又被称作立即调用的函数表达式（IIFE，Immediately Invoked Function Expression）。它类似于函数声明，但由于被包含在括号中，所以会被解释为函数表达式。紧跟在第一组括号后面的第二组括号会立即调用前面的函数表达式。

```js
;(function () {
  // 块级作用域
})()
```

具体应用见 [早期模块化方案](../../engineering/basic/001-modularization.md#立即执行函数（IIFE）)。

## 私有变量

严格来讲，JavaScript 没有私有成员的概念，所有对象属性都公有的。不过，倒是有「私有变量」的概念。任何定义在函数或块中的变量，都可以认为是私有的，因为在这个函数或块的外部无法访问其中的变量。私有变量包括函数参数、局部变量，以及函数内部定义的其他函数。

```js
function add(num1, num2) {
  let sum = num1 + num2
  return sum
}
```

在这个函数中，函数 `add()` 有 3 个私有变量：`num1`、`num2` 和 `sum`。这几个变量只能在函数内部使用，不能在函数外部访问。如果这个函数中创建了一个闭包，则这个闭包能通过其作用域链访问其外部的这 3 个变量。基于这一点，就可以创建出能够访问私有变量的公有方法。

**特权方法（privileged method）** 是能够访问函数私有变量（及私有函数）的公有方法。在对象上有两种方式创建特权方法。第一种是在构造函数中实现，比如：

```js
function MyObject() {
  // 私有变量和私有函数
  let privateVariable = 10
  function privateFunction() {
    return false
  }
  // 特权方法
  this.publicMethod = function () {
    privateVariable++
    return privateFunction()
  }
}
```

这里实际上创建了一个闭包，在创建实例后，只能通过 `MyObject.prototype.publicMethod()` 调用 `privateVariable` 和 `privateFunction`。

### 静态私有变量

该模式不常用，简单看看例子：

```js
;(function () {
  // 私有变量和私有函数
  let privateVariable = 10
  function privateFunction() {
    return false
  }
  // 构造函数
  MyObject = function () {}
  // 公有和特权方法
  MyObject.prototype.publicMethod = function () {
    privateVariable++
    return privateFunction()
  }
})()
```

::: warning

使用闭包和私有变量会导致作用域链变长，作用域链越长，则查找变量所需的时间也越多。

:::

### 模块模式

模块模式，则在一个单例对象上实现了相同的隔离和封装。单例对象（singleton）就是只有一个实例的对象。按照惯例，JavaScript 是通过对象字面量来创建单例对象的：

```js
let singleton = (function () {
  // 私有变量和私有函数
  let privateVariable = 10
  function privateFunction() {
    return false
  }
  // 特权/公有方法和属性
  return {
    publicProperty: true,
    publicMethod() {
      privateVariable++
      return privateFunction()
    }
  }
})()
```

::: tip

类似一些 hooks 的封装。

:::

### 模块增强模式

另一个利用模块模式的做法是在返回对象之前先对其进行增强。这适合单例对象需要是某个特定类型的实例，但又必须给它添加额外属性或方法的场景。

```js
let singleton = (function () {
  // 私有变量和私有函数
  let privateVariable = 10
  function privateFunction() {
    return false
  }
  // 创建对象
  let object = new CustomType()
  // 添加特权/公有属性和方法
  object.publicProperty = true
  object.publicMethod = function () {
    privateVariable++
    return privateFunction()
  }
  // 返回对象
  return object
})()
```
