---
title: 集合引用类型
date: 2024-04-19
icon: reference
category:
  - JavaScript
tag:
  - language advanced
---

## `Object`

创建方式：

- 构造函数；
- 对象字面量。

```js
let person1 = new Object()
person.name = 'Nicholas'
person.age = 29

let person2 = {
  name: 'Nicholas',
  age: 29
}
```

在对象字面量表示法中，属性名可以是字符串或数值，比如：

```js
let person = {
  name: 'Nicholas',
  age: 29,
  5: true
}
```

::: warning

数值属性会自动转换为字符串。

:::

## `Array`

ECMAScript 数组的两个特点：

- 每个槽位可以存储任意类型的数据。
- 数组长度是动态大小的，会随着数据添加而自动增长。

### 创建方式

创建方式共有四种：

- 构造函数；
- 字面量；
- `Array.from()`；
- `Array.of()`。

`from()` 用于将 [类数组对象](./009-array-like-object.md) 转换为数组实例，而 `of()` 用于将一组参数转换为数组实例。

::: tabs

@tab `from()`

```js
// 字符串会被拆分为单字符数组
console.log(Array.from('Matt')) // ["M", "a", "t", "t"]

// 可以使用 from() 将集合和映射转换为一个新数组
const m = new Map().set(1, 2).set(3, 4)
const s = new Set().add(1).add(2).add(3).add(4)
console.log(Array.from(m)) // [[1, 2], [3, 4]]
console.log(Array.from(s)) // [1, 2, 3, 4]

// Array.from() 对现有数组执行浅复制
const a1 = [1, 2, 3, 4]
const a2 = Array.from(a1)
console.log(a1) // [1, 2, 3, 4]
alert(a1 === a2) // false

// 可以使用任何可迭代对象
const iter = {
  *[Symbol.iterator]() {
    yield 1
    yield 2
    yield 3
    yield 4
  }
}
console.log(Array.from(iter)) // [1, 2, 3, 4]

// arguments 对象可以被轻松地转换为数组
function getArgsArray() {
  return Array.from(arguments)
}
console.log(getArgsArray(1, 2, 3, 4)) // [1, 2, 3, 4]

// from() 也能转换带有必要属性的自定义对象
const arrayLikeObject = {
  0: 1,
  1: 2,
  2: 3,
  3: 4,
  length: 4
}
console.log(Array.from(arrayLikeObject)) // [1, 2, 3, 4]
```

@tab `of()`

```js
console.log(Array.of(1, 2, 3, 4)) // [1, 2, 3, 4]
console.log(Array.of(undefined)) // [undefined]
```

:::

### 数组空位

使用数组字面量初始化数组时，可以使用一串逗号来创建空位。

ES6 新增的方法和迭代器与早期 ECMAScript 版本中存在的方法行为不同。ES6 新增方法普遍将这些空位当成存在的元素，只不过值为 `undefined`：

```js
const options = [1, , , , 5]
for (const option of options) {
  console.log(option === undefined)
}
// false
// true
// true
// true
// false
```

ES6 之前的方法则会忽略这个空位，但具体的行为也会因方法而异：

```js
const options = [1, , , , 5]
// map() 会跳过空位置
console.log(options.map(() => 6)) // [6, undefined, undefined, undefined, 6]
// join() 视空位置为空字符串
console.log(options.join('-')) // "1----5"
```

::: warning

由于行为的不一致，因此需要显示地使用 `undefined` 代替数组空位。

:::

### 数组索引

如果把一个值设置给超过数组最大索引的索引，则数组长度会自动扩展到该索引值加 1。

```js
let colors = ['red', 'blue', 'green'] // 定义一个字符串数组
alert(colors[0]) // 显示第一项
colors[2] = 'black' // 修改第三项
colors[3] = 'brown' // 添加第四项
```

数组 `length` 属性不是只读的。通过修改 `length` 属性，可以从数组末尾删除或添加元素。

```js
let colors = ['red', 'blue', 'green'] // 创建一个包含 3 个字符串的数组
colors.length = 2
alert(colors[2]) // undefined
```

### 检测数组

一个经典的 ECMAScript 问题是判断一个对象是不是数组。在只有一个网页（因而只有一个全局作用域）的情况下，使用 `instanceof` 操作符就足矣：

```js
if (value instanceof Array) {
  // 操作数组
}
```

使用 `instanceof` 的问题是假定只有一个全局执行上下文。如果网页里有多个框架，则可能涉及两个不同的全局执行上下文，因此就会有两个不同版本的 `Array` 构造函数。如果要把数组从一个框架传给另一个框架，则这个数组的构造函数将有别于在第二个框架内本地创建的数组。

为此，可以使用 `Array.isArray()` 方法判断是不是数组。

```js
if (Array.isArray(value)) {
  // 操作数组
}
```

### 迭代器方法

在 ES6 中，`Array` 的原型上暴露了 3 个用于检索数组内容的方法：`keys()`、`values()` 和 `entries()`。`keys()` 返回数组索引的迭代器，`values()` 返回数组元素的迭代器，而 `entries()` 返回索引/值对的迭代器：

```js
const a = ['foo', 'bar', 'baz', 'qux']

// 因为这些方法都返回迭代器，所以可以将它们的内容通过 Array.from() 直接转换为数组实例
const aKeys = Array.from(a.keys())
const aValues = Array.from(a.values())
const aEntries = Array.from(a.entries())

console.log(aKeys) // [0, 1, 2, 3]
console.log(aValues) // ["foo", "bar", "baz", "qux"]
console.log(aEntries) // [[0, "foo"], [1, "bar"], [2, "baz"], [3, "qux"]]
```

使用 ES6 的解构可以非常容易地在循环中拆分键/值对：

```js
const a = ['foo', 'bar', 'baz', 'qux']
for (const [idx, element] of a.entries()) {
  alert(idx)
  alert(element)
}

// 0
// foo
// 1
// bar
// 2
// baz
// 3
// qux
```

### 转换方法

所有对象都有 `toLocaleString()`、`toString()` 和 `valueOf()` 方法。

其中，`valueOf()` 返回的还是数组本身。而 `toString()` 返回由数组中每个值的等效字符串拼接而成的一个逗号分隔的字符串。也就是说，对数组的每个值都会调用其 `toString()` 方法，以得到最终的字符串。

```js
let colors = ['red', 'blue', 'green'] // 创建一个包含3 个字符串的数组
alert(colors.toString()) // red,blue,green
alert(colors.valueOf()) // [ 'red', 'blue', 'green' ]
alert(colors) // [ 'red', 'blue', 'green' ]
```

::: warning

如果数组中某一项是 `null` 或 `undefined`，则在 `join()`、`toLocaleString()`、`toString()` 返回的结果中会以空字符串表示。

:::

### 排序方法

数组有两个方法可以用来对元素重新排序：`reverse()` 和 `sort()`。

`reverse()` 方法就是将数组元素反向排列。比如：

```js
let values = [1, 2, 3, 4, 5]
values.reverse()
alert(values) // 5,4,3,2,1
```

`sort()` 方法更加灵活，默认情况，会按升序重新排列数组。即最小的值在前面，最大的值在后面。为此，`sort()` 会在每一项上调用 `String()` 转型函数，然后比较字符串来决定顺序。即使数组的元素都是数值，也会先把数组转换为字符串再比较、排序。比如：

```js
let values = [0, 1, 5, 10, 15]
values.sort()
alert(values) // 0,1,10,15,5
```

::: warning

默认情况的规则并不符合预期，因此 `sort()` 可以接受一个比较函数，用于判断哪个值应该排在前面。

:::

比较函数接收两个参数，如果第一个参数应该排在第二个参数前面，就返回负值；如果两个参数相等，就返回 0；如果第一个参数应该排在第二个参数后面，就返回正值。

```js {3,5,7,12}
function compare(value1, value2) {
  if (value1 < value2) {
    return -1
  } else if (value1 > value2) {
    return 1
  } else {
    return 0
  }
}

let values = [0, 1, 5, 10, 15]
values.sort(compare)
alert(values) // 0,1,5,10,15
```

降序比较函数可以简写为一个箭头函数（升序即为 `(a, b) => a - b`）：

```js {2}
let values = [0, 1, 5, 10, 15]
values.sort((a, b) => b - a)
alert(values) // 15,10,5,1,0
```

## `Map`

`Map` 是一种新的集合类型，提供键/值存储机制。

```js
const m = new Map()
```

### 基本 API

初始化之后，可以使用 `set()` 方法再添加键/值对。另外，可以使用 `get()` 和 `has()` 进行查询，可以通过 `size` 属性获取映射中的键/值对的数量，还可以使用 `delete()` 和 `clear()` 删除值。

```js
const m = new Map()

alert(m.has('firstName')) // false
alert(m.get('firstName')) // undefined
alert(m.size) // 0

m.set('firstName', 'Matt').set('lastName', 'Mark')

alert(m.has('firstName')) // true
alert(m.get('firstName')) // Matt
alert(m.size) // 2

m.delete('firstName') // 只删除这一个键/值对

alert(m.has('firstName')) // false
alert(m.has('lastName')) // true
alert(m.size) // 1

m.clear() // 清除这个映射实例中的所有键/值对

alert(m.has('firstName')) // false
alert(m.has('lastName')) // false
alert(m.size) // 0
```

### `Map` VS `Object`

与 `Object` 只能使用「数值、字符串或符号」作为键不同，`Map` 可以使用任何 JavaScript 数据类型作为键。

与 `Object` 类型的一个主要差异是，`Map` 实例会 **维护** 键值对的插入顺序，因此可以根据插入顺序执行迭代操作。

1. 内存占用
   `Object` 和 `Map` 的工程级实现在不同浏览器间存在明显差异，但存储单个键/值对所占用的内存数量都会随键的数量线性增加。批量添加或删除键/值对则取决于各浏览器对该类型内存分配的工程实现。不同浏览器的情况不同，但给定固定大小的内存，`Map` 大约可以比 `Object` 多存储 50% 的键/值对。
2. 插入性能
   向 `Object` 和 `Map` 中插入新键/值对的消耗大致相当，不过插入 `Map` 在所有浏览器中一般会稍微快一点儿。对这两个类型来说，插入速度并不会随着键/值对数量而线性增加。如果代码涉及大量插入操作，那么显然 `Map` 的性能更佳。
3. 查找速度
   与插入不同，从大型 `Object` 和 `Map` 中查找键/值对的性能差异极小，但如果只包含少量键/值对，则 `Object` 有时候速度更快。在把 `Object` 当成数组使用的情况下（比如使用连续整数作为属性），浏览器引擎可以进行优化，在内存中使用更高效的布局。这对 `Map` 来说是不可能的。对这两个类型而言，查找速度不会随着键/值对数量增加而线性增加。如果代码涉及大量查找操作，那么某些情况下可能选择 `Object` 更好一些。
4. 删除性能
   使用 `delete` 删除 `Object` 属性的性能一直以来饱受诟病，目前在很多浏览器中仍然如此。为此，出现了一些伪删除对象属性的操作，包括把属性值设置为 undefined 或 null。但很多时候，这都是一种讨厌的或不适宜的折中。而对大多数浏览器引擎来说，`Map` 的 `delete()` 操作都比插入和查找更快。如果代码涉及大量删除操作，那么毫无疑问应该选择 `Map`。

## `WeakMap`

`WeakMap` API 是 `Map` API 的子集，差异在于 JavaScript 垃圾回收程序对待「弱映射」中键的方式。

`WeakMap` 中的键只能是 `Object` 或者继承自 `Object` 的类型，尝试使用非对象设置键会抛出 TypeError。值的类型没有限制。

### 弱键

WeakMap 中「weak」表示弱映射的键是「弱弱地拿着」的。意思就是，这些键不属于正式的引用，不会阻止垃圾回收。

但要注意的是，弱映射中 **值的引用** 可不是「弱弱地拿着」的。只要键存在，键/值对就会存在于映射中，并被当作对值的引用，因此就不会被当作垃圾回收。

```js
const wm = new WeakMap()
wm.set({}, 'val')
```

`set()` 方法初始化了一个新对象并将它用作一个字符串的键。因为没有指向这个对象的其他引用，所以当这行代码执行完成后，这个对象键就会被当作垃圾回收。然后，这个键/值对就从弱映射中消失了，使其成为一个空映射。在这个例子中，因为值也没有被引用，所以这对键/值被破坏以后，值本身也会成为垃圾回收的目标。

再看一个稍微不同的例子：

```js
const wm = new WeakMap()
const container = {
  key: {}
}
wm.set(container.key, 'val')
function removeReference() {
  container.key = null
}
```

这一次，`container` 对象维护着一个对弱映射键的引用，因此这个对象键不会成为垃圾回收的目标。不过，如果调用了 `removeReference()`，就会摧毁键对象的最后一个引用，垃圾回收程序就可以把这个键/值对清理掉。

### 不可迭代键

因为 `WeakMap` 中的键/值对任何时候都可能被销毁，所以没必要提供迭代其键/值对的能力。当然，也用不着像 `clear()` 这样一次性销毁所有键/值的方法。

### 使用场景

#### 私有变量

私有变量会存储在弱映射中，以对象实例为键，以私有成员的字典为值。这里使用一个闭包把 `WeakMap` 包装起来，这样就可以把弱映射与外界完全隔离开了：

```js
const User = (() => {
  const wm = new WeakMap()

  class User {
    constructor(id) {
      this.idProperty = Symbol('id')
      this.setId(id)
    }

    setPrivate(property, value) {
      const privateMembers = wm.get(this) || {}
      privateMembers[property] = value
      wm.set(this, privateMembers)
    }

    getPrivate(property) {
      return wm.get(this)[property]
    }

    setId(id) {
      this.setPrivate(this.idProperty, id)
    }

    getId(id) {
      return this.getPrivate(this.idProperty)
    }
  }

  return User
})()

const user = new User(123)
alert(user.getId()) // 123
user.setId(456)
alert(user.getId()) // 456
```

#### DOM 节点元数据

因为 `WeakMap` 实例不会妨碍垃圾回收，所以非常适合保存关联元数据。来看下面这个例子，其中使用了常规的 `Map`：

```js
const m = new Map()
const loginButton = document.querySelector('#login')
// 给这个节点关联一些元数据
m.set(loginButton, { disabled: true })
```

假设在上面的代码执行后，页面被 JavaScript 改变了，原来的登录按钮从 DOM 树中被删掉了。但由于映射中还保存着按钮的引用，所以对应的 DOM 节点仍然会逗留在内存中，除非明确将其从映射中删除或者等到映射本身被销毁。

如果这里使用的是弱映射，如以下代码所示，那么当节点从 DOM 树中被删除后，垃圾回收程序就可以立即释放其内存（假设没有其他地方引用这个对象）：

```js
const wm = new WeakMap()
const loginButton = document.querySelector('#login')
// 给这个节点关联一些元数据
wm.set(loginButton, { disabled: true })
```

## `Set`

`Set` 与 `Map` 大多数 API 和行为都是一致的。`Set` 也会维护插入的顺序。

## `WeakSet`

`WeakMap` 是垃圾回收对键的处理行为，而 `Set` 描述地是垃圾回收对值对处理行为。

```js
const ws = new WeakSet()
ws.add({})
```

`add()` 方法初始化了一个新对象，并将它用作一个值。因为没有指向这个对象的其他引用，所以当这行代码执行完成后，这个对象值就会被当作垃圾回收。然后，这个值就从弱集合中消失了，使其成为一个空集合。

再看一个稍微不同的例子：

```js
const ws = new WeakSet()
const container = {
  val: {}
}
ws.add(container.val)
function removeReference() {
  container.val = null
}
```

这一次，`container` 对象维护着一个对弱集合值的引用，因此这个对象值不会成为垃圾回收的目标。不过，如果调用了 `removeReference()`，就会摧毁值对象的最后一个引用，垃圾回收程序就可以把这个值清理掉。

### 不可迭代值

行为和 `WeakMap` 一致。

### 使用场景

弱集合在给对象打标签时还是有价值的。来看下面的例子，这里使用了一个普通 `Set`：

```js
const disabledElements = new Set();
const loginButton = document.querySelector('#login');
// 通过加入对应集合，给这个节点打上“禁用”标签
disabledElements.add(loginButton);
```

这样，通过查询元素在不在 `disabledElements` 中，就可以知道它是不是被禁用了。不过，假如元素从 DOM 树中被删除了，它的引用却仍然保存在 `Set` 中，因此垃圾回收程序也不能回收它。

为了让垃圾回收程序回收元素的内存，可以在这里使用 `WeakSet`：

```js
const disabledElements = new WeakSet();
const loginButton = document.querySelector('#login');
// 通过加入对应集合，给这个节点打上“禁用”标签
disabledElements.add(loginButton);
```

这样，只要 `WeakSet` 中任何元素从 DOM 树中被删除，垃圾回收程序就可以忽略其存在，而立即释放其内存（假设没有其他地方引用这个对象）。
