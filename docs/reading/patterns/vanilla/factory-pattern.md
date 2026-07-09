---
title: 工厂模式
date: 2024-02-04
icon: Factory
author: patterns
category:
  - reading
tag:
  - design pattern
  - vanilla
  - factory-pattern
---

通过工厂模式，我们可以使用工厂函数来创建新对象。当一个函数在不使用 `new` 关键字的情况下返回一个新对象时，它就是一个工厂函数！

假设我们的应用程序需要许多用户。我们可以创建带有名、姓和电子邮件属性的新用户。工厂函数还会为新创建的对象添加一个 `fullName` 属性，并返回 `name` 和 `lastName`。

```js
const createUser = ({ firstName, lastName, email }) => ({
  firstName,
  lastName,
  email,
  fullName() {
    return `${this.firstName} ${this.lastName}`
  }
})
```

完美！现在，我们可以通过调用 `createUser` 函数轻松创建多个用户。

::: normal-demo

```html
<p>打开调试控制台查看输出</p>
```

```js
const createUser = ({ firstName, lastName, email }) => ({
  firstName,
  lastName,
  email,
  fullName() {
    return `${this.firstName} ${this.lastName}`
  }
})

const user1 = createUser({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@doe.com'
})

const user2 = createUser({
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane@doe.com'
})

console.log(user1)
console.log(user2)
```

:::

如果我们要创建相对复杂且可配置的对象，工厂模式就会非常有用。可能发生的情况是，键和值的值取决于特定的环境或配置。使用工厂模式，我们可以轻松创建包含自定义键和值的新对象！

```js
const createObjectFromArray = ([key, value]) => ({
  [key]: value
})

createObjectFromArray(['name', 'John']) // { name: "John" }
```

## 优点

当我们需要创建多个共享相同属性的较小对象时，工厂模式非常有用。工厂函数可以根据当前环境或用户特定配置轻松返回自定义对象。

## 缺点

在 JavaScript 中，工厂模式不过是一个不使用 `new` 关键字就能返回对象的函数。**ES6 箭头函数** 允许我们创建小型工厂函数，每次都隐式返回一个对象。

```js
const createDog = (name, breed) => ({ name, breed })
```

不过，在许多情况下，创建新实例比每次创建新对象更节省内存。

```js
class User {
  constructor(firstName, lastName, email) {
    this.firstName = firstName
    this.lastName = lastName
    this.email = email
  }

  fullName() {
    return `${this.firstName} ${this.lastName}`
  }
}

const user1 = new User({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@doe.com'
})

const user2 = new User({
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane@doe.com'
})
```

## 参考

- [JavaScript Factory Functions with ES6+](https://medium.com/javascript-scene/javascript-factory-functions-with-es6-4d224591a8b1) - Eric Elliott
