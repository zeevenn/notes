---
title: 创建对象
date: 2022-08-25
icon: object
category:
  - JavaScript
tag:
  - language advanced
  - Object
---

在 JavaScript 中使用 `class` 时，可以很方便地创建类和继承，然而在 ES6 之前的规范中，是使用构造函数和基于原型的继承模式，而 `class` 仅仅是它们的语法糖。因此在了解 ES6 `class` 之前，有必要了解以前模拟类和继承的方法。

首先来看看在 JavaScript 中是如何创建一个对象的。

## 工厂模式

工厂模式是一种常见的设计模式，通过工厂方法返回想要的对象。

```js
function createPerson(name, age) {
  let o = new Object()
  o.name = name
  o.age = age
  o.sayName = function () {
    console.log(this.name)
  }

  return o
}

let person = createPerson('wang', 18)

console.log(person) // { name: 'wang', age: 18, sayName: [Function (anonymous)] }
```

工厂模式虽然可以解决创建多个类似对象的问题，但是它创建的对象没有标识。

## 构造函数模式

只有具备构造能力的函数才能通过 `new` 调用；普通函数声明可以用作构造函数，箭头函数和简写方法则不能。

构造函数也称构造器（`constructor`），是创建对象时会调用的函数。

::: warning

箭头函数不能使用 `new` 调用。

:::

```js
function Person(name, age) {
  this.name = name
  this.age = age
  this.sayName = function () {
    console.log(this.name)
  }
}

let person1 = new Person('wang', 18)
let person2 = new Person('hou', 18)

console.log(person1) // Person { name: 'wang', age: 18, sayName: [Function (anonymous)] }
console.log(person2) // Person { name: 'hou', age: 18, sayName: [Function (anonymous)] }
```

使用构造函数创建对象时，它 **打印出了对象标识**，也就是说它解决了工厂模式没有对象标识的问题。

**构造函数存在的问题：**

首先让我们来看看 `new` 操作的过程：

1. 首先创建一个空对象；
2. 将空对象的原型（`[[Prototype]]` 内部链接）赋值为构造函数的 `prototype` 对象；
3. 让构造函数的 `this` 指向这个空对象，执行构造函数的代码；
4. 判断构造函数返回值的类型，如果是基本类型，则返回创建的对象，如果是引用类型，则返回这个引用类型。

注意到第三步，构造函数的问题在于定义的方法会在每个实例上都创建一次。

要解决这个问题，可以把函数定义转移到构造函数外部：

```js
function Person(name, age) {
  this.name = name
  this.age = age
  this.sayName = sayName
}

function sayName() {
  console.log(this.name)
}

let person1 = new Person('wang', 18)
let person2 = new Person('hou', 18)
```

但是如果这个对象需要多个方法，就要在全局作用域上定义多个函数，这会污染全局作用域。这个问题可以通过原型模型来解决。

## 原型模式

原型模式把共享方法或属性放在构造函数的 `prototype` 对象上，实例通过原型链访问它们。`[[Prototype]]`、`prototype`、`constructor` 的区别及属性查找规则见 [原型与原型链](./prototype-chain.md)。

### 原型模式具体实现过程

对下面的普通构造函数，`new Person()` 创建的实例以 `Person.prototype` 为直接原型，因此可以访问其中的 `sayName` 方法。

```js
function Person() {}

Person.prototype.name = 'wang'
Person.prototype.age = 18
Person.prototype.sayName = function () {
  console.log(this.name)
}

let person1 = new Person()
person1.sayName() // wang
```

上面定义原型时语法有点冗余，因此常用对象字面量直接重写函数原型。

```js
function Person() {}

Person.prototype = {
  name: 'wang',
  age: 18,
  sayName() {
    console.log(this.name)
  }
}

// 使 constructor 属性不可枚举
Object.defineProperty(Person.prototype, 'constructor', {
  enumerable: false,
  value: Person
})
```

### 原型模式存在的问题

原型模式是实现所有原生引用类型的模式，所有原生引用类型的构造函数（包括 `Object`、`Array`、`String` 等）都在原型上定义了实例方法，因此我们才能调用那些方法。

但原型模式也有它的问题：

- 弱化了向构造函数传递初始化参数的能力，会导致所有实例默认都取得相同的属性值；
- 原型上的引用属性是在实例间共享的，因此修改一个会影响其他实例。

来看一个例子：

```js{20-21,26-28}
function Person() {}

Person.prototype = {
  constructor: Person,
  name: 'wang',
  age: 18,
  friends: ['neymar'],
  sayName() {
    console.log(this.name)
  }
}

// 使 constructor 属性不可枚举
Object.defineProperty(Person.prototype, 'constructor', {
  enumerable: false,
  value: Person
})

// 1. 无法向构造函数传参
let person1 = new Person()
let person2 = new Person()

person1.friends.push('messi')

// 2. 原型上的引用属性在实例间共享
console.log(person1.friends) // [ 'neymar', 'messi' ]
console.log(person2.friends) // [ 'neymar', 'messi' ]
console.log(person1.friends === person2.friends) // true
```

此时在 1 处无法向构造函数传参，而且在 2 处修改 `person1.friends` 也会影响到 `person2` 实例，因为他们指向的原型中的同一个地址。

为了解决这个问题，可以 **组合使用构造函数和原型模式**。

## 组合使用构造函数和原型模式

首先来回忆一下构造函数和原型模式各自的问题：

- 构造函数模式：如果这个对象需要多个方法，就要在全局作用域上定义多个函数，会污染全局作用域；
- 原型模式：弱化了向构造函数传递初始化参数的能力，引用属性会存在共享问题。

既然他们分开使用都会存在一些问题，因此可以组合使用这两种模式：**通过构造函数初始化对象的属性，通过原型对象实现方法的复用**。

```js
function Person(name, age, friends) {
  this.name = name
  this.age = age
  this.friends = friends
}

Person.prototype = {
  constructor: Person,
  sayName() {
    console.log(this.name)
  }
}

// 使 constructor 属性不可枚举
Object.defineProperty(Person.prototype, 'constructor', {
  enumerable: false,
  value: Person
})

let person1 = new Person('wang', 18, ['neymar'])
let person2 = new Person('hou', 18, ['messi'])

person1.friends.push('hou')
person2.friends.push('wang')

console.log(person1.friends) // [ 'neymar', 'hou' ]
console.log(person2.friends) // [ 'messi', 'wang' ]
```

此时不仅可以传递初始化参数，而且修改各自的 `friends` 属性都互不影响。

## 总结

以上就是 JavaScript 中创建对象的四种主要方式，包括工厂模式、构造函数模式、原型模式及组合使用构造函数和原型模式。让我们来回忆一下前面三种各自的缺点：

- 工厂模式：无法解决对象标识问题；
- 构造函数模式：对象需要多个方法，就要在全局作用域上定义多个函数，这会污染全局作用域；
- 原型模式：弱化了向构造函数传递初始化参数的能力，引用属性会存在共享问题。
