---
title: this 指向
icon: this
date: 2022-04-22
category:
  - JavaScript
tag:
  - this
---

在常见的编程语言中，几乎都有 `this` 关键字，但是 JavaScript 中的 `this` 和常见的面向对象语言中的 `this` 不太一样：

- 常见的面向对象的编程语言中，如 Java、C++、Swift 等，`this` 通常只会出现在类的方法中，`this` 代表的是当前调用对象；
- 但是 JavaScript 中的 `this` 更加灵活，无论是它出现的位置还是代表的含义。

在 [执行上下文](./005-execution-context.md) 中提到过：上下文中会包含 `this` 指向，那么不同的上下文的 `this` 指向肯定会不同。下面就来具体看看。

## 全局上下文

无论是否处于严格模式，全局上下文中的 `this` 都指向全局对象。

```js
console.log(this === window) // true
```

## 函数上下文

在函数上下文中，`this` 指向取决于函数的调用方式，一共分为四种。

- 默认绑定
- 隐式绑定
- 显式绑定
- new 绑定

### 默认绑定

默认绑定即为独立函数调用，可以理解为没有绑定到某个对象上进行调用。

严格模式和非严格模式下 `this` 的指向会有所不同。

非严格模式下，独立调用函数的 `this` 指向为全局对象，在浏览器中为 `window`，node 中为 `global`。

```js
function f1() {
  return this
}

f1() === window // true
```

而严格模式下，独立调用函数的 `this` 指向为 `undefined`。

```js
function f2() {
  'use strict' // 这里是严格模式
  return this
}

f2() === undefined // true
```

### 隐式绑定（对象函数调用）

通过对象发起的函数调用，`this` 会指向调用者本身。

```js
function foo() {
  console.log(this)
}

// 案例一
var obj = {
  name: 'why',
  foo: foo
}

obj.foo() // obj 对象发起的函数调用，因此 this 指向 obj 对象

// 案例二
var obj = {
  name: 'wang',
  eating: function () {
    console.log(this.name + '在吃东西')
  }
}

obj.eating() // wang在吃东西

var fn = obj.eating
fn() // undefined在吃东西 -> 没有对象调用，还是默认绑定

// 案例三
var obj1 = {
  name: 'obj1',
  foo: function () {
    console.log(this)
  }
}

var obj2 = {
  name: 'obj2',
  bar: obj1.foo
}

obj2.bar() // obj2
```

### 显示绑定

前面的隐式绑定存在一个缺点：对象内部必须有一个函数的引用，否则会报错。

如果我们不希望在 **对象内部** 包含这个函数的引用，同时又希望在这个对象上强制调用，那么应该怎么办？

JavaScript 提供了三个改变 this 指向的函数：`call()`、`apply()` 和 `bind()`。它们都能改变 this 指向，但是都有一些细微的区别。

#### `Function.prototype.call()`

语法：第一个参数为 this 值（可选，若省略或指定为 `null` 或 `undefined` 则为全局对象），后面为参数列表。`call()` 会立即调用该函数，因此返回值为该函数的返回值。

```js
function.call(thisArg[, arg1[, arg2[, ...]]])
```

例子：

```js
function foo() {
  console.log('函数被调用了', this)
}

var obj = {
  name: 'obj'
}

foo.call(obj) // 函数被调用了 { name: 'obj' }

function sum(num1, num2, num3) {
  console.log(num1 + num2 + num3, this)
}

sum.call('call', 20, 30, 40) // 90 [String: 'call']
```

#### `Function.prototype.apply()`

语法：第一个参数为 this 值（可选，若省略或指定为 `null` 或 `undefined` 则为全局对象），后面为参数列表。和 `call()` 一样，`apply()`会立即调用该函数，因此返回值为该函数的返回值。

```js
function.aplly(thisArg, [argsArray])
```

例子：

```js
function foo() {
  console.log('函数被调用了', this)
}

var obj = {
  name: 'obj'
}

foo.apply(obj) // 函数被调用了 { name: 'obj' }

function sum(num1, num2, num3) {
  console.log(num1 + num2 + num3, this)
}

sum.apply('call', [20, 30, 40]) // 90 [String: 'call']
```

#### `Function.prototype.bind()`

有时候我们不希望函数立即被执行，那么可以使用 `bind()`，它和 `call()`、`apply()` 不同，`bind()` **不会**立即调用该函数，返回值为改变 this 指向之后的函数。

`bind()` 方法创建一个新的函数，在 `bind()` 被调用时，这个新函数的 this 被指定为 `bind()` 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。

语法：第一个参数为 this 值（可选，若省略或指定为 `null` 或 `undefined` 则为全局对象），后面为参数列表。

```js
function.bind(thisArg[, arg1[, arg2[, ...]]])
```

例子：

```js
function sum(num1, num2, num3) {
  console.log(num1 + num2 + num3, this)
}

var _bind = sum.bind('bind', 20)
_bind(30, 40) // 90 [String: 'bind']
```

### new 绑定

使用 new 操作符调用构造函数生成对象时，会自动执行以下操作：

1. 创建一个全新的对象；
2. 这个对象的 `[[proto]]` 属性会被赋值为构造函数的 `prototype` 属性；
3. 构造函数内部的 this 被赋值为这个对象（**new 绑定**）;
4. 执行构造函数内部的代码；
5. 如果构造函数返回非空对象，则返回该对象；否则返回刚才创建的新对象。

在这个过程中就会执行 new 绑定。

```js
function Person(name) {
  this.name = name

  this.sayName = function () {
    console.log(this.name)
  }

  console.log(this) // Person { name: 'wang', sayName: [Function (anonymous)] }
}

let person = new Person('wang')
```

## 优先级

如果一个函数应用了多个规则，那么它们的优先级谁更高？

1. 默认绑定

   毫无疑问，优先级最低

2. 显式绑定高于隐式绑定

   ```js
   var obj = {
     name: 'obj',
     foo: function () {
       console.log(this)
     }
   }

   // 1.call/apply的显示绑定高于隐式绑定
   obj.foo.apply('abc') // [String: 'abc']
   obj.foo.call('abc') // [String: 'abc']

   // 2.bind的优先级高于隐式绑定
   var bar = obj.foo.bind('abc')
   bar() // [String: 'abc']
   ```

3. new 绑定高于显示绑定

   new 不能和 `call()`、`apply()` 一起使用。

   ```js
   function foo() {
     console.log(this)
   }

   var bar = foo.bind('aaa')

   var obj = new bar() // foo {}
   ```

因此优先级是 new 绑定 > 显示绑定(apply/call/bind) > 隐式绑定(obj.foo()) > 默认绑定(独立函数调用)。

## 箭头函数

上面所说的是普通函数的 this 指向，而在箭头函数中，this 根据外层作用域来决定。

那么它有什么应用场景呢？来看一个模拟网络请求的例子：

::: tip

`setTimeout()` 中的 this 关键字在非严格模式会指向 window (或全局)对象，严格模式下为 undefined。详见 [window.setTimeout - Web API 接口参考 | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/API/setTimeout#关于this的问题)

:::

```js
var obj = {
  data: [],
  getData: function () {
    // 发送网络请求, 将结果放到上面 data 属性中
    // 在箭头函数之前的解决方案
    var _this = this
    setTimeout(function () {
      console.log(this) // window
      var result = ['abc', 'cba', 'nba']
      _this.data = result
    }, 2000)
  }
}

obj.getData()

setTimeout(function () {
  console.log(obj.data) // ["abc", "cba", "nba"]
}, 3000)
```

有了箭头函数之后，就不必使用 `_this = this` 获取真正想要的 `this` 了：

```js
setTimeout(() => {
  console.log(this) // { data: [], getData: [Function: getData] }
  var result = ['abc', 'cba', 'nba']
  this.data = result
}, 2000)
```

## 参考链接

- [MDN (mozilla.org)](https://developer.mozilla.org/)
- [面试官问：JS 的 this 指向 - 掘金 (juejin.cn)](https://juejin.cn/post/6844903746984476686)
