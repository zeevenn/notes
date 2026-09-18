---
title: 执行上下文
date: 2022-04-21
icon: context
category:
  - JavaScript
tag:
  - language advanced
---

## 执行上下文

执行上下文（Execution Context）是规范用来记录代码执行状态的机制，包括当前执行位置、变量查找所用的环境等。它不是可以直接访问的 JavaScript 对象。

脚本、函数调用、`eval` 执行字符串代码和 ES 模块求值都会涉及执行上下文。通常所说的全局执行上下文（Global Execution Context，GEC）对应脚本执行，函数执行上下文（Function Execution Context，FEC）对应一次函数调用。

全局执行上下文与全局对象不是同一个东西。同一页面中的多个普通脚本可以共享全局环境，但各自的执行上下文会分别建立。

下面是一个简单的例子：

```js
/* global execution context */
function baz() {
  // FEC of baz
  var foo = 3
  console.log(foo) // 3
}

function bar() {
  // FEC of bar
  var foo = 2
  console.log(foo) //2
  baz()
}

var foo = 1 // GEC
console.log(foo) // 1
bar()
console.log(foo) // 1
/* global execution context */
```

这个脚本先输出全局变量 `foo` 的值 `1`，调用 `bar()` 输出 `2`，再调用 `baz()` 输出 `3`，最后回到脚本输出 `1`。两个函数分别声明了局部变量 `foo`，没有修改全局的同名变量。

![example](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/example1.png)

## 执行上下文栈

执行上下文栈（Execution Context Stack）也叫调用栈。

普通同步调用中，进入函数时将其执行上下文压入栈顶，调用者暂停；函数返回后弹出，调用者继续执行。下面的调用顺序是脚本 → `baz()` → `bar()` → `foo()`。

```js
console.log('global execution context')

function foo() {
  console.log('foo 正在执行')
  console.log('foo 结束执行')
}

function bar() {
  console.log('bar 正在执行')
  foo()
  console.log('bar 结束执行')
}

function baz() {
  console.log('baz 正在执行')
  bar()
  console.log('baz 结束执行')
}

baz()
console.log('program successfully executed')

// global execution context
// baz 正在执行
// bar 正在执行
// foo 正在执行
// foo 结束执行
// bar 结束执行
// baz 结束执行
// program successfully executed
```

示意图如下：

![执行上下文栈](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/example2.png)

## 作用域链（scope chain）

变量从当前作用域逐级向外查找，找到同名绑定就停止。外层关系由函数定义的位置决定，不由谁调用这个函数决定。

以浏览器普通脚本中的嵌套函数为例：

```js
var color = 'blue'

function changeColor() {
  var anotherColor = 'red'

  function swapColors() {
    var tempColor = anotherColor
    anotherColor = color
    color = tempColor
  }

  swapColors()
}

changeColor()
```

作用域的嵌套关系：

```text
window
┌─────────────────────────────────────────┐
│ color                                   │
│                                         │
│ changeColor()                           │
│ ┌─────────────────────────────────────┐ │
│ │ anotherColor                        │ │
│ │                                     │ │
│ │ swapColors()                        │ │
│ │ ┌─────────────────────────────────┐ │ │
│ │ │ tempColor                       │ │ │
│ │ └─────────────────────────────────┘ │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘

变量查找方向：swapColors() → changeColor() → window
```

`swapColors()` 在自身作用域找到 `tempColor`，向外一层找到 `anotherColor`，再向外找到全局变量 `color`。外层作用域不能反过来访问内层的局部变量。

## this 绑定

`this` 是执行时关联的绑定值，不能理解成“当前函数的调用者”。对普通函数，它取决于调用方式：

```js
function readThis() {
  'use strict'
  return this
}

const obj = { readThis }

console.log(obj.readThis() === obj) // true
console.log(readThis()) // undefined
```

ES5 把 `ThisBinding` 直接列为执行上下文的组成部分。现行规范通过当前上下文的环境记录解析 `this`；普通函数的函数环境记录保存 `[[ThisValue]]`。箭头函数没有自己的 `this` 绑定，会沿外层环境查找。见 [ES5.1 §10.3](https://262.ecma-international.org/5.1/#sec-10.3) 与 [ResolveThisBinding](https://tc39.es/ecma262/2025/multipage/executable-code-and-execution-contexts.html#sec-resolvethisbinding)。

顶层 `this` 也要区分代码类型：浏览器普通脚本中是 `window`，ES 模块中是 `undefined`，Node.js CommonJS 文件中是模块包装函数接收到的 `module.exports`。具体调用规则见 [this 指向](./this-binding.md)。

## ES3 中的执行上下文

ES3 用变量对象、作用域链和 `this` 值描述执行上下文。

### 变量对象（Variable Object，VO）

变量对象保存声明的变量和函数；在函数代码中还保存形参。进入函数、执行函数体之前，会进行变量实例化：

1. 建立形参绑定，使用传入的实参初始化；没有对应实参时为 `undefined`。
2. 处理函数声明，将函数对象绑定到函数名。
3. 为尚不存在的 `var` 名称建立绑定，初始值为 `undefined`；同名的已有参数或函数绑定不会被这一步覆盖。

赋值表达式要等执行到那条语句时才运行：

```js
function baz(a, b) {
  console.log(v1, v2) // undefined undefined

  function foo() {
    return 'foo'
  }

  var v1
  var v2 = 'v2'
  console.log(v2) // v2
}

baz(1, 2)
```

函数体开始执行前，绑定可以示意为：

```text
a         → 1
b         → 2
arguments → 对应本次调用的 arguments 对象
foo       → 函数对象
v1        → undefined
v2        → undefined
```

`v2` 在执行到 `var v2 = 'v2'` 时才变为字符串 `'v2'`。

### 活动对象（Activation Object，AO）

进入函数上下文时创建活动对象，并把它用作该次调用的变量对象。它会先获得 `arguments` 属性，再参与变量实例化。AO 是函数上下文中的 VO，不是 VO 在执行阶段变成的另一种对象。见 [ES3 §10.1.3、§10.1.6](https://ecma-international.org/wp-content/uploads/ECMA-262_3rd_edition_december_1999.pdf#page=49)。

### 函数的 `[[Scope]]`

ES3 中，函数创建时通过内部属性 `[[Scope]]` 保存当时的作用域链；调用时，将本次调用的 AO 放到这条链的最前面：

```text
函数调用的作用域链 = 当前调用的 AO + 函数创建时保存的 [[Scope]]
```

## ES5 中的执行上下文

ES5 改用词法环境（Lexical Environment）描述名称绑定及其外层关系。词法环境由环境记录（保存绑定）和外层词法环境引用组成；这些外层引用连接起来，仍然构成作用域链。

执行上下文包含三个相关部分：

- `LexicalEnvironment`：解析变量名时从哪个环境开始查找。
- `VariableEnvironment`：`var` 和函数声明的绑定放在哪个环境中。
- `ThisBinding`：当前上下文关联的 `this` 值。

`LexicalEnvironment` 和 `VariableEnvironment` 都引用词法环境，初始时通常指向同一个环境。执行 `catch` 等代码时，变量查找的起点可以临时改变，但 `var` 声明所在的环境不会因此改变。它们不是两种分别只存某类变量的容器。见 [ES5.1 §10.2–10.3](https://262.ecma-international.org/5.1/#sec-10.2)。

## ES2015 之后的块级作用域

`let`、`const` 是 ES2015 引入的，ES5 尚未包含它们。块级作用域会影响变量查找的起点：

```js
function demo() {
  'use strict'
  var a = 1

  {
    let b = 2
    const c = 3
    console.log(a, b, c) // 1 2 3
  }

  console.log(a) // 1
}

demo()
```

执行块内的 `console.log` 时，环境关系如下：

```text
LexicalEnvironment
        │
        ▼
块环境记录 { b: 2, c: 3 }
        │ [[OuterEnv]]
        ▼
函数环境记录 { a: 1 } ◀── VariableEnvironment
        │ [[OuterEnv]]
        ▼
      外层环境
```

`let b` 和 `const c` 的绑定保存在块环境记录里，`var a` 的绑定保存在函数环境记录里。查找三个变量都从 `LexicalEnvironment` 开始：`b`、`c` 在当前块中找到，`a` 则沿外层环境找到。不会因为 `a` 用 `var` 声明，就改从 `VariableEnvironment` 开始查找。

离开块后，查找起点恢复到函数环境，`b`、`c` 不再能从外部访问。`VariableEnvironment` 始终指向本次函数调用的变量环境。

现行规范中，`LexicalEnvironment` 和 `VariableEnvironment` 引用的是环境记录，记录之间通过 `[[OuterEnv]]` 连接。函数创建时的外层环境保存在 `[[Environment]]` 中。见 [Environment Records](https://tc39.es/ecma262/2025/multipage/executable-code-and-execution-contexts.html#sec-environment-records)。

## 面试题

### 面试题一

```js
var n = 100

function foo() {
  n = 200
}

foo()

console.log(n) // 200
```

`foo()` 内的 `n` 会通过作用域链访问到全局执行上下文中的变量 `n`，因此会打印 `200`。

### 面试题二

```js
function foo() {
  console.log(n) // undefined
  var n = 200
  console.log(n) // 200
}

var n = 100
foo()
```

由于变量提升，首先输出 `undefined`，然后输出 `200`。

### 面试题三

```js
var a = 100

function foo() {
  console.log(a) // undefined
  return
  var a = 200
}

foo()
```

`var a` 的绑定会提前建立并初始化为 `undefined`；`return` 后的赋值 `a = 200` 不会执行。

### 面试题四

在非严格模式、且外层没有声明 `b` 时：

```js
function foo() {
  var a = (b = 10)
}

foo()

console.log(b) // 10
console.log(a) // ReferenceError: a is not defined
```

`a` 是局部变量，`b = 10` 则会在全局对象上创建属性。把 `console.log(a)` 放在前面，异常会中断执行，后面的日志不会输出。严格模式下，给未声明的 `b` 赋值时就会抛出 `ReferenceError`。

### 面试题五

```js
var foo = 1

function bar(foo) {
  console.log(foo) // 123
  foo = 234
}

bar(123)
console.log(foo) // 1
```

运行 `bar` 函数的时候将 `123` 数字作为实参传入，所以操作的还是本地作用域的 `foo`。

## 参考链接

- [ECMA-262 第 3 版：Execution Contexts](https://ecma-international.org/wp-content/uploads/ECMA-262_3rd_edition_december_1999.pdf#page=48)
- [ES5.1：Execution Contexts](https://262.ecma-international.org/5.1/#sec-10.3)
- [ES2015：let and const Declarations](https://262.ecma-international.org/6.0/#sec-let-and-const-declarations)
- [ECMAScript 2025：Execution Contexts](https://tc39.es/ecma262/2025/multipage/executable-code-and-execution-contexts.html#sec-execution-contexts)
- [MDN：JavaScript execution model](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model)
- [MDN：this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)
- [MDN：Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures)
- [Node.js：The module wrapper](https://nodejs.org/api/modules.html#the-module-wrapper)

- [What is the Execution Context, Execution Stack & Scope Chain in JS - DEV Community](https://dev.to/ahmedtahir/what-is-the-execution-context-execution-stack-scope-chain-in-js-26nc)
- [面试官：说说执行上下文吧 - 掘金 (juejin.cn)](https://juejin.cn/post/6844904158957404167)
