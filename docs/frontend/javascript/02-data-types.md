---
title: 数据类型
date: 2024-04-14
icon: type
category:
  - JavaScript
tag:
  - language basic
---

ECMAScript 有 7 种简单数据类型（也称为原始类型）：`Undefined`、`Null`、`Boolean`、`Number`、`String`、`Symbol` 和 `BigInt`。

`Symbol`（符号）是 ES6 新增的，`BigInt` 是 ES10 新增。

还有一种复杂数据类型叫 `Object`（对象）。`Object` 是一种 **无序** 键值对的集合。

不同的数据存放在不同的空间中：

- 栈空间：JavaScript 对于 **基本数据类型** 内存的分配会在执行时直接在栈空间进行分配；
- 堆空间：JavaScript 对于 **复杂数据类型** 内存的分配会在堆内存中开辟一块空间，并且将这块空间的指针（地址）返回给变量引用（存放在栈空间）。

这么做的原因是 [JS 引擎](../../browser/02-V8.md) 需要用栈来维护程序执行期间上下文的状态，如果栈空间分配的内存过大，那么会影响到上下文切换的效率，从而导致代码执行速度过慢。

因此，栈空间不会设置太大，主要用来存放基本数据类型（占用空间小），而像复杂数据类型，因为他们的占用空间一般较大，因此会被存放在堆空间中。

## `Undefined`

该类型只有一个值，即 `undefined`，当时用 `var`、`let` 没有初始化时，就相当于给变量赋值为了 `undefined`。

## `Null`

该类型同样只有一个值 `null`，表示一个空对象指针，因此使用 `typeof` 操作符判断会返回 `object`。

```js
let car = null
console.log(car) // 'object'
```

在定义将来要保存对象值的变量时，建议使用 `null` 来初始化，不要使用其他值（如 `undefined`）。

这样，只要检查这个变量的值是不是 `null` 就可以知道这个变量是否在后来被重新赋予了一个对象的引用，比如：

```js
if (car !== null) {
  // car 是一个对象的引用
}
```

## `Boolean`

布尔类型有两个字面值：`true` 和 `false`。

虽然布尔值只有两个，但所有其他 ECMAScript 类型的值都有相应布尔值的等价形式。要将一个其他类型的值转换为布尔值，可以调用特定的 `Boolean()` 转型函数：

```js
let message = 'Hello world!'
let messageAsBoolean = Boolean(message)
```

转换规则如下：

| 数据类型  | 转换为 `true` 的值     | 转换为 `false` 的值 |
| --------- | ---------------------- | ------------------- |
| Boolean   | `true`                 | `false`             |
| String    | 非空字符串             | `""`（空字符串）    |
| Number    | 非零数值（包括无穷值） | `0`、`NaN`          |
| Object    | 任意对象               | `null`              |
| Undefined | -                      | `undefined`         |

## `Number`

`Number` 类型使用 IEEE 754 格式表示整数和浮点值（在某些语言中也叫双精度值）。

可以用字面量表示十进制、八进制、十六进制，对于八进制字面量，第一个数字必须是零（0），十六进制数值前缀为 `0x`：

```js
let intNum = 55 // 整数

let octalNum1 = 070 // 八进制的56
let octalNum2 = 079 // 无效的八进制值，当成 79 处理
let octalNum3 = 08 // 无效的八进制值，当成 8 处理

let hexNum1 = 0xa // 十六进制10
let hexNum2 = 0x1f // 十六进制31
```

::: tip

使用八进制和十六进制格式创建的数值在所有数学操作中都被视为十进制数值。

:::

### 浮点数

要定义浮点值，数值中必须包含小数点，而且小数点后面必须至少有一个数字。虽然小数点前面不
是必须有整数，但推荐加上。下面是几个例子：

```js
let floatNum1 = 1.1
let floatNum2 = 0.1
let floatNum3 = .1 // 有效，但不推荐
```

因为存储浮点值使用的内存空间是存储整数值的两倍，所以 ECMAScript 总是想方设法把值转换为整数。在小数点后面没有数字的情况下，数值就会变成整数。

类似地，如果数值本身就是整数，只是小数点后面跟着 0（如1.0），那它也会被转换为整数，如下例所示：

```js
let floatNum1 = 1.; // 小数点后面没有数字，当成整数 1 处理
let floatNum2 = 10.0; // 小数点后面是零，当成整数 10 处理
```

科学计数法：

```js
let floatNum = 3.125e7; // 等于31250000
```

::: warning

0.1 加 0.2 得到的不是 0.3，而是 0.300 000 000 000 000 04。

之所以存在这种舍入错误，是因为使用了 IEEE 754 数值，这种错误并非 ECMAScript 所独有，其他使用相同格式的语言也有这个问题。

:::

### 值的范围

ECMAScript 可以表示的最小数值保存在 `Number.MIN_VALUE` 中；可以表示的最大数值保存在 `Number.MAX_VALUE` 中。

如果某个计算得到的数值结果超出了 JavaScript 可以表示的范围，那么这个数值会被自动转换为一个 **无穷值**。

任何无法表示的负数以 `-Infinity`（负无穷大）表示，任何无法表示的正数以 `Infinity`（正无穷大）表示。

`isFinite()` 函数可以确定一个值是否有限大：

```js
let result = Number.MAX_VALUE + Number.MAX_VALUE;
console.log(isFinite(result)); // false
```

### 特殊值 `NaN`

表示不是数值（Not a Number），用于表示本来要返回数值的操作失败了。

在 ECMAScript 中，`0`、`+0` 或 `-0` 相除会返回 `NaN`：

```js
console.log(0/0); // NaN
console.log(-0/+0); // NaN
```

如果分子是非 `0` 值，分母是有符号 `0` 或无符号 `0`，则会返回 `Infinity` 或 `-Infinity`：

```js
console.log(5/0); // Infinity
console.log(5/-0); // -Infinity
```

`isNaN()` 函数可以判断一个数值是否为 `NaN`。

```js
console.log(isNaN(NaN)); // true
console.log(isNaN(10)); // false，10 是数值
console.log(isNaN("10")); // false，可以转换为数值10
console.log(isNaN("blue")); // true，不可以转换为数值
console.log(isNaN(true)); // false，可以转换为数值1
```

::: warning 内置函数和操作符的工作方式

`isNaN()` 可以用于测试对象。此时，首先会调用对象的 `valueOf()` 方法，然后再确定返回的值是否可以转换为数值。如果不能，再调用 `toString()` 方法，并测试其返回值。

:::

## `String`

`String`（字符串）数据类型表示零或多个 16 位 Unicode 字符序列。字符串可以使用双引号（"）、单引号（'）或反引号（`）表示。

反引号可以使用字符串插值 `${}`：

```js
let value = 5;
let exponent = 'second';

// 以前，字符串插值是这样实现的：
let interpolatedString = value + ' to the ' + exponent + ' power is ' + (value * value);
// 现在，可以用模板字面量这样实现：
let interpolatedTemplateLiteral = `${ value } to the ${ exponent } power is ${ value * value }`;

console.log(interpolatedString); // 5 to the second power is 25
console.log(interpolatedTemplateLiteral); // 5 to the second power is 25
```

## `Symbol` 类型

`Symbol` 是 ES6 新增，表示 **唯一、不可变** 的符号，确保对象属性使用唯一标识符，不会发生属性冲突的危险。

### 基本使用

可以使用 `Symbol()` 函数初始化，调用这个函数时，可以传入一个字符串参数作为对符号的描述，但是传入相同的字符串描述返回的仍然是不同的符号。

```js
let symbol1 = Symbol()
let symbol2 = Symbol()
console.log(symbol1 === symbol2) // false

let symbol3 = Symbol('foo')
let symbol4 = Symbol('foo')
console.log(symbol3 === symbol4) // false
```

`Symbol()` 函数不是构造函数，因此不能进行 new 操作，这是为了避免创建符号包装对象，如果确实想使用符号包装对象，可以用 `Object()` 函数。

```js
let symbol = new Symbol() // TypeError: Symbol is not a constructor
let mySymbol = Symbol()
let wrappedSymbol = Object(mySymbol)
console.log(typeof wrappedSymbol) // object
```

### 全局符号注册表

如果需要创建两个相同的符号，以便在运行时的不同文件共用符号实例，可以使用 `Symbol.for()` 方法。

这个方法在第一次使用字符串调用时，会检查全局运行时注册表，发现不存在对应的符号，则会生成一个新符号实例并添加到注册表中；后续调用相同的字符串时同样会检查注册表，发现存在则返回该字符串对应的符号实例。

```js
let fooSymbol = Symbol.for('foo') // 全局注册新符号
let otherFooSymbol = Symbol.for('foo') // 重用已有符号

console.log(fooSymbol === otherFooSymbol) // true
```

传递给 `Symbol.for()` 方法的任意值都会被转化为字符串：

```js
let emptySymbol = Symbol.for()
console.log(emptySymbol) // Symbol(undefined)
```

还可以使用 `Symbol.keyFor()` 来查询全局注册表，这个方法接受符号，返回对应的字符串键，如果查询的不是全局符号，则会返回 `undefined`。

```js
// 创建全局符号
let s = Symbol.for('foo')
console.log(Symbol.keyFor(s)) // foo

// 创建普通符号
let s2 = Symbol('bar')
console.log(Symbol.keyFor(s2)) // undefined

// 如果传给 Symbol.keyFor() 的不是符号，则该方法抛出 TypeError：
Symbol.keyFor(123) // TypeError: 123 is not a symbol
```

### 应用场景——使用符号作为属性

一般用来作为对象的唯一属性名，这就包括了对象字面量属性和 `Object.defineProperty()` / `Object.defineProperties()` 定义的属性，对象字面量只能在计算属性语法中使用符号作为属性。

```js
let s1 = Symbol('foo'),
  s2 = Symbol('bar'),
  s3 = Symbol('baz'),
  s4 = Symbol('qux')

// 1. 对象字面量
let o = {
  [s1]: 'foo val'
}
// 这样也可以：o[s1] = 'foo val';

console.log(o) // {Symbol(foo): foo val}

// 2. Object.defineProperty()
Object.defineProperty(o, s2, { value: 'bar val' })

console.log(o) // {Symbol(foo): foo val, Symbol(bar): bar val}

// 3. Object.defineProperties()
Object.defineProperties(o, {
  [s3]: { value: 'baz val' },
  [s4]: { value: 'qux val' }
})

console.log(o)
// {Symbol(foo): foo val, Symbol(bar): bar val,
// Symbol(baz): baz val, Symbol(qux): qux val}
```

ES6 引入了一些内置符号，比如 `Symbol.iterator` 属性，用以定义在 `for-of` 循环中的迭代行为。

`Symbol.hasInstance` 属性会由 `instanceof` 操作符使用，确定一个实例的原型链上是否有当前构造函数。这个属性定义在 Function 的原型上，因此默认在所有函数和类上都可以调用。

## BigInt

`BigInt` ES10 新增，是一种数字类型的数据，可以表示任意精度格式的 **整数**，使用 `BigInt` 可以安全地存储和操作大整数。

`BigInt` 可以表示大于 `2^53 - 1` 的整数（可以用 `Number` 表示的最大数字），`BigInt` 类型的数据必须添加后缀 `n`，或者直接使用 `BigInt()` 函数，它和 `Symbol()` 一样，不是构造函数，因此也不能和 `new` 操作符一起使用。

```js
const theBiggestInt = 9007199254740991n

const alsoHuge = BigInt(9007199254740991)
// ↪ 9007199254740991n
```

因为 `BigInt` 和 `Number` 是两种不同的类型，因此：

- 不能用于 `Math` 对象中的方法；
- 不能和任何 `Number` 实例混合运算，两者必须转换成同一种类型。在两种类型来回转换时要小心，因为 `BigInt` 变量在转换成 `Number` 变量时可能会丢失精度。

## `Object`

可以通过创建 `Object` 类型的实例来创建自己的对象，然后再给对象添加属性和方法：

```js
let o = new Object();
```

每个 `Object` 实例都有如下属性和方法：

- `constructor`：用于创建当前对象的函数。在前面的例子中，这个属性的值就是 `Object()` 函数。
- `hasOwnProperty(propertyName)`：用于判断当前对象实例（不是原型）上是否存在给定的属性。要检查的属性名必须是字符串（如 `o.hasOwnProperty("name")`）或符号。
- `isPrototypeOf(object)`：用于判断当前对象是否为另一个对象的原型。
- `propertyIsEnumerable(propertyName)`：用于判断给定的属性是否可以使用 `for-in` 语句枚举。与 `hasOwnProperty()` 一样，属性名必须是字符串。
- `toLocaleString()`：返回对象的字符串表示，该字符串反映对象所在的本地化执行环境。
- `toString()`：返回对象的字符串表示。
- `valueOf()`：返回对象对应的字符串、数值或布尔值表示。通常与 `toString()` 的返回值相同。

::: warning

严格来讲，ECMA-262 中对象的行为不一定适合 JavaScript 中的其他对象。

比如浏览器环境中的 BOM 和 DOM 对象，都是由宿主环境定义和提供的宿主对象。

而宿主对象不受 ECMA-262 约束，所以它们可能会也可能不会继承 `Object`。

:::
