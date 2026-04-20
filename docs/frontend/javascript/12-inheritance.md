---
title: 继承
date: 2022-08-25
icon: extends
category:
  - JavaScript
tag:
  - 面向对象
---

继承是面向对象编程中讨论最多的话题。很多面向对象语言都支持两种继承：接口继承和实现继承。

前者只继承方法签名，后者继承实际的方法。接口继承在 ECMAScript 中是不可能的，因为函数没有签名。实现继承是 ECMAScript 唯一支持的继承方式，而这主要是通过原型链实现的。

## 原型链

原型链是 ECMAScript 中的主要继承方式，当原型是另一个对象的实例时，那么这个原型的实例就指向了另一个原型，这样实例和原型就组成了一条原型链。

```js
// 父类: 公共属性和方法
function Person() {
  this.name = 'wang'
  this.friends = []
}

Person.prototype.eating = function () {
  console.log(this.name + ' eating~')
}

// 子类: 特有属性和方法
function Student() {
  this.sno = 111
}

Student.prototype = new Person()

Student.prototype.studying = function () {
  console.log(this.name + ' studying~')
}

const stu = new Student()

console.log(stu.name) // 'wang'
stu.eating() // wang eating~
stu.studying() // wang studying~
```

使用原型链实现继承可以继承父类的属性和方法，然而它还有自己的弊端。

```js
// 原型链实现继承的弊端:
// 1.第一个弊端: 打印 stu 对象, 继承的属性是看不到的，并且对象标识也有问题
console.log(stu) // Person { sno: 111 }

// 2.第二个弊端: 修改引用值时会互相影响
const stu1 = new Student()
const stu2 = new Student()

stu1.friends.push('kobe')

console.log(stu1.friends) // ['kobe']
console.log(stu2.friends) // ['kobe']

// 3.第三个弊端: 在前面实现类的过程中都没有传递参数
const stu3 = new Student('lilei', 112)
console.log(stu3) // Person { sno: 111 }
```

::: note

默认情况下，所有引用类型都继承自 `Object`，任何函数的默认原型都是一个 `Object` 的实例。

:::

## 盗用构造函数

为了解决原型链继承问题，可以使用「盗用构造函数」。基本思路很简单：在子类构造函数中调用父类构造函数。可以使用 `apply()` 和 `call()` 方法以新创建的对象为上下文执行构造函数。

```js{10,11}
// 父类: 公共属性和方法
function Person(name, age, friends) {
  this.name = name
  this.age = age
  this.friends = friends
}

// 子类: 特有属性和方法
function Student(name, age, friends, sno) {
  // 继承属性
  Person.call(this, name, age, friends)
  this.sno = 111
}

const stu = new Student('wang', 18, ['kobe'], 111)

// 解决原型链实现继承的弊端
// 1. 第一个弊端: 打印stu对象, 继承的属性是看不到的，并且对象标识也有问题
console.log(stu) // Student { name: 'wang', age: 18, friends: [ 'kobe' ], sno: 111 }

// 2.第二个弊端: 修改引用值时会互相影响
const stu1 = new Student('wang', 18, ['li lei'], 111)
const stu2 = new Student('kobe', 30, ['james'], 112)

stu1.friends.push('lucy')

console.log(stu1.friends) // ['li lei', 'lucy']
console.log(stu2.friends) // ['james']

// // 3.第三个弊端: 在前面实现类的过程中都没有传递参数
const stu3 = new Student('li lei', 22, [], 113)
```

然而，借用构造函数也是有弊端：

- 必须在构造函数中定义方法，函数不能重用；
- 而且，子类也不能访问父类原型上的方法，因为他没有像原型链继承一样建立了实例与父类原型对象的连接，因此所有类型都只能使用构造函数模式。

## 组合继承

既然原型链继承可以实现继承方法，而盗用构造函数可以解决引用值、对象标识和传递参数的问题，因此可以组合原型链继承和盗用构造函数继承。基本的思路是使用原型链继承父类原型上的属性和方法，而通过盗用构造函数继承实例属性。

```js{14,15,19,20}
// 父类: 公共属性和方法
function Person(name, age, friends) {
  this.name = name
  this.age = age
  this.friends = friends
}

Person.prototype.eating = function () {
  console.log(this.name + ' eating~')
}

// 子类: 特有属性和方法
function Student(name, age, friends, sno) {
  // 盗用构造函数继承属性
  Person.call(this, name, age, friends)
  this.sno = 111
}

// 原型链继承方法
Student.prototype = new Person()
```

组合继承弥补了原型链和盗用构造函数的不足，是 JavaScript 中使用最多的继承模式。而且组合继承也保留了 `instanceof` 操作符和 `isPrototypeOf()` 方法识别合成对象的能力。

## 寄生式组合继承

组合继承弥补了原型链和盗用构造函数的不足，它使用盗用构造函数继承属性，使用原型链继承方法。但是它存在效率问题，即父类构造函数会调用两次：一次是在创建子类原型时调用，一次是在子类构造函数中调用。

```js{15,20}
// 父类: 公共属性和方法
function Person(name, age, friends) {
  this.name = name
  this.age = age
  this.friends = friends
}

Person.prototype.eating = function () {
  console.log(this.name + ' eating~')
}

// 子类: 特有属性和方法
function Student(name, age, friends, sno) {
  // 盗用构造函数继承属性
  Person.call(this, name, age, friends) // 第二次调用 Person()
  this.sno = 111
}

// 原型链继承方法
Student.prototype = new Person() // 第一次调用 Person()
Student.prototype.constructor = Student
```

在第一次调用 Person() 后，Student.prototype 上会有 `name`, `age`, `friends` 这三个属性，它们本来是 Person 父类的实例属性，然而现在却挂载到了 Student 子类的原型属性。

```js
console.log(Student.prototype)
// Person {
//   name: undefined,
//   age: undefined,
//   friends: undefined,
//   constructor: [Function: Student]
// }
```

而如果创建一个实例，此时会调用第二次 Person()，这一次会在对象上创建实例属性 `name`, `age`, `friends`, `sno`，前面三个属性会遮蔽原型上的同名属性。

```js
const stu = new Student('wang', 18, [], 1) // Student { name: 'wang', age: 18, friends: [], sno: 111 }
```

也就是说，现在有两组 `name`, `age`, `friends` 属性，一组在实例上，而另一组在 `Student` 的原型上。

这个问题出在调用了父类构造函数给子类原型赋值，那么有没有一种方法可以不直接调用父类构造函数呢？

有的，那就是原型式继承和寄生式继承。

### 原型式继承

2006 年，Douglas Crockford 写了一篇文章：《JavaScript 中的原型式继承》（“Prototypal Inheritance in JavaScript”）。这篇文章介绍了一种不涉及严格意义上构造函数的继承方法。他的出发点是即使不自定义类型也可以通过原型实现对象之间的信息共享。文章最终给出了一个函数：

```js
function object(o) {
  function F() {}
  F.prototype = o
  return new F()
}
```

这个 `object()` 函数会创建一个临时构造函数，将传入的对象赋值给这个构造函数的原型，然后返回这个临时类型的一个实例，ES5 增加 `Object.create()` 方法，接收两个参数：作为新对象原型的对象，以及给新对象定义额外属性的对象（第二个可选）。以这种方式添加的属性会遮蔽原型对象上的同名属性。

```js
let person = {
  name: 'Nicholas',
  friends: ['Shelby', 'Court', 'Van']
}
let anotherPerson = Object.create(person, {
  name: {
    value: 'Greg'
  }
})

console.log(anotherPerson.name) // "Greg"
```

属性中包含的引用值始终会在相关对象中共享。

```js
let person = {
  name: 'Nicholas',
  friends: ['Shelby', 'Court', 'Van']
}
let anotherPerson = Object.create(person, {
  name: {
    value: 'Greg'
  }
})
anotherPerson.friends.push('kobe')

let yetAnotherPerson = Object.create(person, {
  name: {
    value: 'wang'
  }
})

console.log(yetAnotherPerson.friends) // ["Shelby", "Court", "Van", "kobe"]
```

### 寄生式继承

与原型式继承比较接近的一种继承方式是寄生式继承，也是 Crockford 首倡的一种模式。寄生式继承背后的思路类似于寄生构造函数和工厂模式：创建一个实现继承的函数，以某种方式增强对象，然后返回这个对象。

```js
function createAnother(original) {
  let clone = Object.create(original) // 创建一个新对象，他的原型为 original
  clone.sayHi = function () {
    // 以某种方式增强对象
    console.log('hi')
  }
  return clone // 返回这个对象
}
```

寄生式继承同样适合主要关注对象，不在乎类型和构造函数的场景。然而和构造函数创建对象模式一样，它会导致函数难以重用。

### 寄生式组合继承

前面已经提到，组合继承的缺陷在于调用了两次父类构造函数，会导致子类实例和子类原型上存在两组同名属性。

那么可以通过寄生式继承来继承父类原型，然后讲返回的新对象赋值给子类原型，基本模式如下：

```js
function inheritPrototype(subType, superType) {
  let prototype = Object.create(superType.prototype) // 创建对象
  prototype.constructor = subType // 增强对象
  subType.prototype = prototype // 赋值对象
}
```

在这个函数内部，第一步是创建一个继承父类原型的对象。然后，给返回的 `prototype` 对象设置 `constructor` 属性，解决由于重写原型导致默认 `constructor` 丢失的问题。最后将新创建的对象赋值给子类型的原型。

接下来调用这个核心继承函数，即可解决组合继承的问题。

```js{14,15,19,20}
// 父类
function Person(name, age, friends) {
  this.name = name
  this.age = age
  this.friends = friends
}

Person.prototype.eating = function () {
  console.log(this.name + ' eating~')
}

// 子类
function Student(name, age, friends, sno) {
  // 盗用构造函数
  Person.call(this, name, age, friends)
  this.sno = 111
}

// 寄生式继承
inheritPrototype(Student, Person)

Student.prototype.studying = function () {
  console.log(this.name, ' studying~')
}
```

寄生式组合继承即使用盗用构造函数继承属性，使用寄生式继承避免调用父类构造函数，效率更高。
