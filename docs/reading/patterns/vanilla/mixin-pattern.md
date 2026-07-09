---
title: 混入模式
date: 2024-09-19
icon: mixin
author: patterns
category:
  - reading
tag:
  - design pattern
  - vanilla
  - mixin-pattern
---

## 混入模式

`mixin` 是一种对象，我们可以使用它为另一个对象或类添加可重复使用的功能，而无需使用继承。我们不能单独使用 mixins：mixins 的唯一目的是在不使用继承的情况下为对象或类添加功能。

假设我们的应用程序需要创建多条狗。然而，我们创建的基本狗没有任何属性，只有一个名称属性。

```js
class Dog {
  constructor(name) {
    this.name = name
  }
}
```

狗不应该只有名字。它应该会 `bark`、`wagTail` 和 `play`！ 我们可以创建一个 mixin，而不是直接将其添加到 `Dog` 中。

```js
const dogFunctionality = {
  bark: () => console.log('Woof!'),
  wagTail: () => console.log('Wagging my tail!'),
  play: () => console.log('Playing!')
}
```

我们可以使用 `Object.assign` 方法将 `dogFunctionality` 混合元素添加到 `Dog` 原型中。通过该方法，我们可以向目标对象添加属性：本例中为 `Dog.prototype`。`Dog` 的每个新实例都可以访问 `dogFunctionality` 的属性，因为它们都被添加到了 `Dog` 的原型中！

```js
class Dog {
  constructor(name) {
    this.name = name
  }
}

const dogFunctionality = {
  bark: () => console.log('Woof!'),
  wagTail: () => console.log('Wagging my tail!'),
  play: () => console.log('Playing!')
}

Object.assign(Dog.prototype, dogFunctionality)

const pet1 = new Dog('Daisy')

pet1.name // Daisy
pet1.bark() // Woof!
pet1.play() // Playing!
```

虽然我们可以在不使用继承的情况下使用 mixin 添加功能，但 mixin 本身也可以使用继承！大多数哺乳动物（除了海豚，也许还有其他动物）都会走路和睡觉。狗是哺乳动物，应该会走路和睡觉！

```js
const animalFunctionality = {
  walk: () => console.log('Walking!'),
  sleep: () => console.log('Sleeping!')
}
```

我们可以使用 `Object.assign` 将这些属性添加到 `dogFunctionality` 原型中。在本例中，目标对象是 `dogFunctionality`。

```js
const animalFunctionality = {
  walk: () => console.log('Walking!'),
  sleep: () => console.log('Sleeping!')
}

const dogFunctionality = {
  bark: () => console.log('Woof!'),
  wagTail: () => console.log('Wagging my tail!'),
  play: () => console.log('Playing!'),
  walk() {
    super.walk()
  },
  sleep() {
    super.sleep()
  }
}

Object.assign(dogFunctionality, animalFunctionality)
Object.assign(Dog.prototype, dogFunctionality)
```

在现实世界中，浏览器环境中的 `Window` 就是一个 mixin 的例子。 `Window` 对象从 `WindowOrWorkerGlobalScope` 和 `WindowEventHandlers` mixins 中实现了许多属性，这使我们可以访问 `setTimeout` 和 `setInterval`、`indexedDB` 和 `isSecureContext` 等属性。

由于它是一个 mixin，因此只能用于为对象添加功能，您将无法创建 `WindowOrWorkerGlobalScope` 类型的对象。

::: normal-demo indexedDB

```js
window.indexedDB.open('toDoList')

window.addEventListener('beforeunload', (event) => {
  event.preventDefault()
  event.returnValue = ''
})

window.onbeforeunload = function () {
  console.log('Unloading!')
}

console.log('From WindowEventHandlers mixin: onbeforeunload', window.onbeforeunload)

console.log('From WindowOrWorkerGlobalScope mixin: isSecureContext', window.isSecureContext)

console.log('WindowEventHandlers itself is undefined', window.WindowEventHandlers)

console.log('WindowOrWorkerGlobalScope itself is undefined', window.WindowOrWorkerGlobalScope)
```

:::

## 总结

在引入 ES6 类之前，mixins 通常用于为 React 组件添加功能。 React 团队不鼓励使用 mixins，因为它很容易给组件增加不必要的复杂性，使其难以维护和重用。React 团队鼓励使用高阶组件，现在这些组件通常可以被 Hooks 代替。

混入模式看起来和继承非常类似，但是有一点区别：

- 继承：继承通常是在类定义时确定的，子类会继承父类的所有方法和属性，并且可以覆盖或扩展它们。
- 混入：混入是动态的、灵活的，你可以在对象或类实例创建后将某些行为混入，而不必在定义时就确定继承关系。混入只是通过组合而不是创建严格的继承链。

因此上面的实现仍然是混入模式。

::: tip

虽然你修改了原型，但混入模式的本质是将多个功能组合到一个类或对象中，而不强制遵循严格的继承层次结构。因此，它依然可以被认为是混入模式。

:::

如果不想直接修改原型，可以选择实例级别的混入：

```js
class Dog {
  constructor(name) {
    this.name = name
  }
}

const dogFunctionality = {
  bark: () => console.log('Woof!'),
  wagTail: () => console.log('Wagging my tail!'),
  play: () => console.log('Playing!')
}

const pet1 = new Dog('Daisy')

// 仅将功能混入特定实例，而不是修改原型
Object.assign(pet1, dogFunctionality)

pet1.bark() // Woof!
```

::: tip

通过向对象的原型注入功能，mixins 可以让我们在没有继承的情况下为对象轻松添加功能。修改对象的原型被认为是一种不好的做法，因为这会导致原型污染和函数来源的不确定性。

:::
