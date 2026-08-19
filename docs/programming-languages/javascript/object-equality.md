---
title: 判断对象值相等
date: 2022-05-03
category:
  - JavaScript
tag:
  - 数据类型
  - 手写代码
---

ES6 中有一个方法可以判断两个对象是否相等：`Object.is(obj1, obj2)`，但是它和 `===` 一样，都是判断两个对象内存地址是否相同。

```js
const obj1 = {
  a: 1,
}

const obj2 = {
  a: 1,
}

console.log(Object.is(obj1, obj2)); // false
console.log(obj1 === obj2);         // false 
```

当需要比较两个对象内容一致，这两种方法就行不通了。

想要比较两个对象内容是否一致，大致思路是遍历对象键名和键值是否一致：

```js
function isObjectValEqual(a, b) {
  if (a === b) return true;

  // a b 键长度不等
  if (Object.keys(a).length != Object.keys(a).length) return false;

  for (let key in a) {
    if (!b.hasOwnProperty(key)) return false;
    
    // 都为对象则递归判断
    if (superTypeOf(a[key]) === "Object" && superTypeOf(b[key]) === "Object") {
      return isObjectValEqual(a[key], b[key]);
    }
    // 否则之间判断是否相等
    else if (a[key] !== b[key]) {
      return false;
    }
  }

  return true;
}

const superTypeOf = function(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1);
}
```

检查对象的“值相等”最好还是依靠完善的工具库，涵盖了各种边界情况。比如 Underscore 和 Lodash。