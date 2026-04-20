---
title: 类
date: 2024-06-26
icon: object
category:
  - JavaScript
tag:
  - 面向对象
---

## 声明

与函数类型相似，定义类也有两种主要方式：类声明和类表达式。这两种方式都使用 `class` 关键字加大括号：

```js
// 类声明
class Person {}

// 类表达式
const Person = class {}
```

::: info

与函数声明不同：

1. 类声明不会被提升。
2. 函数受函数作用域限制，而类受块作用域限制。

```js
{
  function FunctionDeclaration() {}
  class ClassDeclaration {}
}
console.log(FunctionDeclaration) // FunctionDeclaration() {}
console.log(ClassDeclaration) // ReferenceError: ClassDeclaration is not defined
```

:::

## 类构造函数

类构造函数是类的一个特殊方法，通过 `new` 关键字创建类的实例时，会自动调用构造函数。构造函数的名称必须是 `constructor`，如果没有定义构造函数，会默认添加一个空的构造函数。

```js
class Person {
  constructor(name) {
    this.name = name
  }
}
```

使用 `new` 调用类的构造函数会执行如下操作。

1. 在内存中创建一个新对象。
2. 这个新对象内部的 `[[Prototype]]` 指针被赋值为构造函数的 `prototype` 属性。
3. 构造函数内部的 `this` 被赋值为这个新对象（即 `this` 指向新对象）。
4. 执行构造函数内部的代码（给新对象添加属性）。
5. 如果构造函数返回非空对象，则返回该对象；否则，返回刚创建的新对象。

## 实例、原型和类成员

### 实例成员

每次通过 `new` 调用类标识符时，都会执行类构造函数。在这个函数内部，可以为新创建的实例（this）添加「自有」属性。

### 原型方法与访问器

为了在实例间共享方法，类定义语法把在类块中定义的方法作为原型方法。

```js
class Person {
  constructor(name) {
    this.name = name
  }

  sayName() {
    console.log(this.name)
  }
}
```

可以把方法定义在类构造函数中或者类块中，但不能在类块中给原型添加原始值或对象作为成员数据：

```js
class Person {
  name: 'Jake'
}
// Uncaught SyntaxError: Unexpected token
```

类方法等同于对象属性，因此可以使用字符串、符号或计算的值作为键：

```js
const symbolKey = Symbol('symbolKey')

class Person {
  stringKey() {
    console.log('invoked stringKey')
  }
  [symbolKey]() {
    console.log('invoked symbolKey')
  }
  ['computed' + 'Key']() {
    console.log('invoked computedKey')
  }
}

let p = new Person()
p.stringKey() // invoked stringKey
p[symbolKey]() // invoked symbolKey
p.computedKey() // invoked computedKey
```

类定义也支持获取和设置访问器。语法与行为跟普通对象一样：

```js
class Person {
  set name(newName) {
    this.name_ = newName
  }
  get name() {
    return this.name_
  }
}

let p = new Person()
p.name = 'Jake'
console.log(p.name) // Jake
```

### 静态成员

类定义支持静态成员，这些成员是类本身的属性，而不是实例的属性。

静态成员非常适合作为工具函数或者工厂函数。静态成员可以通过类名直接访问，而不需要实例化类。

```js
class Person {
  static create(name) {
    return new Person(name)
  }
}
```

::: tip

单例模式就使用了静态成员。

:::

## 继承

### 基础

类继承是通过 `extends` 关键字实现的。子类可以继承父类的所有实例成员、原型方法和静态成员。不仅可以继承一个类，也可以继承普通的构造函数（保持向后兼容）：

```js
class Vehicle {}

// 继承类
class Bus extends Vehicle {}

let b = new Bus()
console.log(b instanceof Bus) // true
console.log(b instanceof Vehicle) // true

function Person() {}

// 继承普通构造函数
class Engineer extends Person {}

let e = new Engineer()
console.log(e instanceof Engineer) // true
console.log(e instanceof Person) // true
```

### 构造函数、`HomeObject` 和 `super()`

子类构造函数必须调用 `super()`，这个函数会调用父类构造函数。`super()` 必须在使用 `this` 之前调用。

```js
class Vehicle {
  constructor() {
    this.hasEngine = true
  }
}

class Bus extends Vehicle {
  constructor() {
    // 不要在调用 super() 之前引用 this，否则会抛出 ReferenceError
    super() // 相当于 super.constructor()
    console.log(this instanceof Vehicle) // true
    console.log(this) // Bus { hasEngine: true }
  }
}

new Bus()
```

在静态方法中可以通过 `super` 调用继承的类上定义的静态方法：

```js
class Vehicle {
  static identify() {
    console.log('vehicle')
  }
}

class Bus extends Vehicle {
  static identify() {
    super.identify()
  }
}

Bus.identify() // vehicle
```

### 抽象基类

有时候可能需要定义这样一个类，它可供其他类继承，但本身不会被实例化。虽然 ECMAScript 没有专门支持这种类的语法 ，但通过 `new.target` 也很容易实现。

::: tip

TypeScript 可以使用 `abstract` 关键字来定义抽象基类。

:::

`new.target` 保存通过 `new` 关键字调用的类或函数。通过在实例化时检测 `new.target` 是不是抽象基类，可以阻止对抽象基类的实例化：

```js
class Vehicle {
  constructor() {
    if (new.target === Vehicle) {
      throw new Error('Vehicle cannot be directly instantiated')
    }
  }
}

// 派生类
class Bus extends Vehicle {}
new Bus() // class Bus {}
new Vehicle() // class Vehicle {}
// Error: Vehicle cannot be directly instantiated
```

另外，通过在抽象基类构造函数中进行检查，可以要求派生类必须定义某个方法。因为原型方法在调用类构造函数之前就已经存在了，所以可以通过 `this` 关键字来检查相应的方法：

```js
class Vehicle {
  constructor() {
    if (this.drive === undefined) {
      throw new Error('drive method must be implemented')
    }
  }
}
```

### 类混入

类混入是一种将多个类的功能组合到一个类中的技术。通过将多个类的原型方法复制到一个类中，可以实现类似多重继承的效果。

混入模式可以通过在一个表达式中连缀多个混入元素来实现，这个表达式最终会解析为一个可以被继承的类。如果 Person 类需要组合 A、B、C，则需要某种机制实现 B 继承 A，C 继承 B，而 Person 再继承 C，从而把 A、B、C 组合到这个超类中。实现这种模式有不同的策略。

一个策略是定义一组「可嵌套」的函数，每个函数分别接收一个超类作为参数，而将混入类定义为这个参数的子类，并返回这个类。这些组合函数可以连缀调用，最终组合成超类表达式：

```js
class Vehicle {}

let FooMixin = (Superclass) =>
  class extends Superclass {
    foo() {
      console.log('foo')
    }
  }

let BarMixin = (Superclass) =>
  class extends Superclass {
    bar() {
      console.log('bar')
    }
  }

let BazMixin = (Superclass) =>
  class extends Superclass {
    baz() {
      console.log('baz')
    }
  }

class Bus extends FooMixin(BarMixin(BazMixin(Vehicle))) {}

let b = new Bus()
b.foo() // foo
b.bar() // bar
b.baz() // baz
```

通过写一个辅助函数，可以把嵌套调用展开：

```js
class Vehicle {}
let FooMixin = (Superclass) =>
  class extends Superclass {
    foo() {
      console.log('foo')
    }
  }

let BarMixin = (Superclass) =>
  class extends Superclass {
    bar() {
      console.log('bar')
    }
  }

let BazMixin = (Superclass) =>
  class extends Superclass {
    baz() {
      console.log('baz')
    }
  }

function mix(BaseClass, ...Mixins) {
  return Mixins.reduce(
    (accumulator, current) => current(accumulator),
    BaseClass
  )
}

class Bus extends mix(Vehicle, FooMixin, BarMixin, BazMixin) {}
let b = new Bus()
b.foo() // foo
b.bar() // bar
b.baz() // baz
```

::: warning

很多 JavaScript 框架（特别是 React）已经抛弃混入模式，转向了组合模式（把方法提取到独立的类和辅助对象中，然后把它们组合起来，但不使用继承）。

这反映了那个众所周知的软件设计原则：「组合胜过继承（composition over inheritance）。」这个设计原则被很多人遵循，在代码设计中能提供极大的灵活性。

:::
