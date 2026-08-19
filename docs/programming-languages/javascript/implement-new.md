---
title: 手写 new 操作符
date: 2022-08-23
icon: code
category:
  - JavaScript
tag:
  - new
  - 手写代码
---

`new` 操作符的实现过程：

1. 首先创建一个空对象；
2. 将空对象的隐式原型 `[[prototype]]` 赋值为构造函数的 `prototype` 对象；
3. 让构造函数的 `this` 指向这个空对象，执行构造函数的代码；
4. 判断构造函数返回值的类型，如果是基本类型，则返回创建的对象，如果是引用类型，则返回这个引用类型。

那么具体实现可以这么做：

```js
function newOperator(constructor, ...args) {
  if (typeof constructor !== 'function') {
    console.error('type error');
  }

  // 创建一个新对象，并将构造函数的 prototype 对象作为它的原型
  const instance = Object.create(constructor.prototype)
  // 执行构造函数的代码
  const res = constructor.apply(instance, args)
  // 判断返回值的类型
  let flag = res && (typeof res === 'object' || typeof res === 'function')

  return flag ? res : instance
}

function Person(name, age) {
  this.name = name
  this.age = age
}

const person = newOperator(Person, 'wang', 18)
console.log(person) // Person { name: 'wang', age: 18 }
```