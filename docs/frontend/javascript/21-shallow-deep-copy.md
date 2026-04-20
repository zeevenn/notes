---
title: 浅拷贝与深拷贝
date: 2022-08-23
category:
  - JavaScript
tag:
  - 浅拷贝
  - 深拷贝
  - 手写代码
---

简单的赋值操作：

* 基本数据类型：直接在栈中开辟一块新的内存，存储赋值的数据；
* 引用数据类型：会在栈中开辟一块空间，存储赋值的数据对应的堆中的存储地址，源数据和拷贝的新数据对应的是同一块堆空间中的数据。

## 浅拷贝与深拷贝的定义

浅拷贝是指：堆栈各开辟一块新空间，栈中存储堆中新开辟的空间的地址。堆中赋值了源对象的数据。如果属性是基本类型，拷贝的就是基本类型的值；如果属性是引用类型，那么拷贝的就是它的存储地址。修改其中一个对象会影响另一个对象。

深拷贝是值：堆栈各开辟一块新空间，栈中存储堆中新开辟的空间的地址。堆中存储的数据和源数据一样，但是二者没有任何联系，修改一个对象不会影响其他对象。

## 实现浅拷贝

### `Object.assign()`

`Object.assign()` 方法可以把任意多个的源对象自身的可枚举属性拷贝给目标对象，然后返回目标对象。如果目标中有同名对象，则会覆盖前面的属性。

```js
let obj1 = { person: { name: "kobe", age: 41 }, sports:'basketball' };
let obj2 = Object.assign({}, obj1);
obj2.person.name = "wade";
obj2.sports = 'football'
console.log(obj1); // { person: { name: 'wade', age: 41 }, sports: 'basketball' }
```

### 展开运算符

展开运算符 `...` 也可以去除对象的可枚举属性，拷贝到当前对象中。

```js
let obj1 = { person: { name: "kobe", age: 41 }, sports:'basketball' };
let obj2 = { ...obj1 };
obj2.person.name = "wade";
obj2.sports = 'football'
console.log(obj1); // { person: { name: 'wade', age: 41 }, sports: 'basketball' }
```

### 数组浅拷贝

#### `Array.prototype.slice()`

可一个从已有数组中返回选定的元素，不会更改现有数组，接收两个参数，如果都不选，则可以实现一个数组的浅拷贝。

```js
const arr1 = [1, 2, { name: "wang" }]
const arr2 = arr1.slice()
arr2[2].name = "hou"
console.log(arr1) // [ 1, 2, { name: 'hou' } ]
```

#### `Array.prototype.concat()`

用于合并两个或多个数组，不会更改现有数组，而是返回一个新数组，接受两个参数，如果两个参数都不写，则可以实现一个数组的浅拷贝。

```js
const arr1 = [1, 2, { name: "wang" }]
const arr2 = arr1.concat()
arr2[2].name = "hou"
console.log(arr1) // [ 1, 2, { name: 'hou' } ]
```

### 手写浅拷贝

要实现一个浅拷贝，只需创建一个新对象，遍历需要克隆的对象，将其属性赋值到新对象上即可。

```js
function shallowClone(object) {
  // 只拷贝对象
  if (!object || typeof object !== 'object') return
  
  // 根据 object 类型判断新建一个数组还是对象
  let newObject = Array.isArray(object) ? [] : {}

  // 遍历 object，将并且判断是 object 的属性才拷贝
  for (const key in object) {
    if (object.hasOwnProperty(key)) newObject[key] = object[key]
  }

  return newObject
}
```

## 实现深拷贝

### `JSON.parse(JSON.stringify())`

原理是利用 `JSON.stringify()` 将对象序列化成 JSON 字符串，然后使用 `JSON.parse()` 反序列化。但是他会将对象中的函数、undefined 和 symbol 都变为 null，而将正则变为空对象。

```js
let arr = [1, Symbol(), undefined, /./g, function () {}]
let arr1 = JSON.parse(JSON.stringify(arr))
console.log(arr, arr1)
// [ 1, Symbol(), undefined, /./g, [Function (anonymous)] ] [ 1, null, null, {}, null ]
```

### 手写深拷贝

#### 乞丐版

在浅拷贝的基础上，判断如果是引用类型，则递归直到属性为原始类型。

```js
function deepClone(object) {
  // 只拷贝对象
  if (!object || typeof object !== 'object') return
  
  // 根据 object 类型判断新建一个数组还是对象
  let newObject = Array.isArray(object) ? [] : {}

  // 遍历 object，将并且判断是 object 的属性才拷贝
  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      // 如果值为引用类型，则继续递归
      newObject[key] = typeof object[key] === 'object' ? deepClone(object[key]) : object[key]
    }
  }

  return newObject
}
```

```js
const obj1 = {
  field1: 1,
  field2: undefined,
  field3: {
    child: "child",
  },
  field4: [2, 4, 8],
}

const obj2 = deepClone(obj1)
target.field3.child = "parent"
console.log(obj2)
// {
//   field1: 1,
//   field2: undefined,
//   field3: { child: 'child' },
//   field4: [ 2, 4, 8 ]
// }
```

可以看到，已经实现了一个简单的深拷贝。

#### 循环引用

但是如果有

```shell
function deepClone(object) {
                   ^
RangeError: Maximum call stack size exceeded
```